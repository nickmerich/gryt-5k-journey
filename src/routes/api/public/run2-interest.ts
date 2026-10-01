import * as React from 'react'
import { render } from '@react-email/render'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const TEMPLATE_NAME = 'run2-confirmation'
const SENDER_DOMAIN = 'notify.grytrunclub.com'
const FROM_DOMAIN = 'notify.grytrunclub.com'

function token() {
  const b = new Uint8Array(32)
  crypto.getRandomValues(b)
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
}

async function sendRunnerConfirmation(
  supabase: SupabaseClient,
  email: string,
  data: { name: string; pace: string; weekend: string },
): Promise<boolean> {
  const template = TEMPLATES[TEMPLATE_NAME]
  const messageId = crypto.randomUUID()
  const { data: suppressed } = await supabase.from('suppressed_emails').select('id').eq('email', email).maybeSingle()
  if (suppressed) {
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: TEMPLATE_NAME, recipient_email: email, status: 'suppressed' })
    return false
  }
  let unsub: string | undefined
  const { data: existing } = await supabase.from('email_unsubscribe_tokens').select('token, used_at').eq('email', email).maybeSingle()
  if (existing && !existing.used_at) unsub = existing.token
  else {
    await supabase.from('email_unsubscribe_tokens').upsert({ token: token(), email }, { onConflict: 'email', ignoreDuplicates: true })
    const { data: stored } = await supabase.from('email_unsubscribe_tokens').select('token').eq('email', email).maybeSingle()
    unsub = stored?.token
  }
  if (!unsub) return false
  const el = React.createElement(template.component, data)
  const html = await render(el)
  const text = await render(el, { plainText: true })
  const subject = typeof template.subject === 'function' ? template.subject(data) : template.subject
  await supabase.from('email_send_log').insert({ message_id: messageId, template_name: TEMPLATE_NAME, recipient_email: email, status: 'pending' })
  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: email,
      from: `GRYT Run Club <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: TEMPLATE_NAME,
      idempotency_key: `run2-${messageId}`,
      unsubscribe_token: unsub,
      queued_at: new Date().toISOString(),
    },
  })
  if (error) {
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: TEMPLATE_NAME, recipient_email: email, status: 'failed', error_message: 'Failed to enqueue email' })
    return false
  }
  return true
}

const base = {
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
}
const schema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('runner'),
    ...base,
    pace: z.enum(['first-5k', 'casual', 'regular', 'fast']),
    weekend: z.enum(['dec-1', 'dec-2', 'dec-3', 'any']),
  }),
  z.object({
    kind: z.literal('brand'),
    ...base,
    brand: z.string().trim().min(2).max(120),
    role: z.string().trim().max(120).optional().default(''),
    category: z.enum(['apparel', 'hydration', 'recovery', 'audio', 'community']),
    message: z.string().trim().max(1000).optional().default(''),
  }),
])

export const Route = createFileRoute('/api/public/run2-interest')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env.SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!url || !key) return Response.json({ error: 'Server configuration error' }, { status: 500 })
        let body: unknown
        try { body = await request.json() } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }) }
        const parsed = schema.safeParse(body)
        if (!parsed.success) return Response.json({ error: 'Please check the highlighted fields.' }, { status: 400 })
        const d = parsed.data
        const supabase = createClient(url, key)
        const { error } = await supabase.from('run2_interest').insert({
          kind: d.kind,
          name: d.name,
          email: d.email.toLowerCase(),
          pace: d.kind === 'runner' ? d.pace : null,
          preferred_weekend: d.kind === 'runner' ? d.weekend : null,
          brand: d.kind === 'brand' ? d.brand : null,
          role: d.kind === 'brand' ? d.role : null,
          category: d.kind === 'brand' ? d.category : null,
          message: d.kind === 'brand' ? d.message : null,
        })
        if (error) return Response.json({ error: 'Could not save. Try again shortly.' }, { status: 500 })
        if (d.kind !== 'runner') return Response.json({ success: true })

        // Confirmation email (best effort — signup already saved)
        let emailed = false
        try {
          emailed = await sendRunnerConfirmation(supabase, d.email.toLowerCase(), { name: d.name, pace: d.pace, weekend: d.weekend })
        } catch (e) {
          console.error('run2 confirmation failed', e)
        }
        return Response.json({ success: true, emailed })
      },
    },
  },
})
