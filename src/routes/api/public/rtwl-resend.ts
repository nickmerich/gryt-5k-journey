import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'GRYT 5K Run'
const SENDER_DOMAIN = 'notify.grytrunclub.com'
const FROM_DOMAIN = 'notify.grytrunclub.com'
const TEMPLATE_NAME = 'rtwl-confirmation'

const schema = z.object({
  registrationId: z.string().uuid().optional(),
  email: z.string().trim().email().max(255).optional(),
}).refine((v) => v.registrationId || v.email, {
  message: 'registrationId or email required',
})

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const Route = createFileRoute('/api/public/rtwl-resend')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let body: unknown
        try { body = await request.json() } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        const parsed = schema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, serviceKey)

        // Look up the registration
        let query = supabase.from('rtwl_registrations').select('id, name, email, ticket, waiver_accepted').limit(1)
        if (parsed.data.registrationId) {
          query = query.eq('id', parsed.data.registrationId)
        } else {
          query = query.eq('email', parsed.data.email!).order('created_at', { ascending: false })
        }
        const { data: reg, error: regErr } = await query.maybeSingle()
        if (regErr || !reg) {
          return Response.json({ error: 'Registration not found' }, { status: 404 })
        }

        const recipient = reg.email as string
        const normalized = recipient.toLowerCase()

        // Rate limit: at most 1 resend per minute per recipient
        const oneMinAgo = new Date(Date.now() - 60_000).toISOString()
        const { count: recentCount } = await supabase
          .from('email_send_log')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_email', recipient)
          .eq('template_name', TEMPLATE_NAME)
          .gte('created_at', oneMinAgo)
        if ((recentCount ?? 0) >= 2) {
          return Response.json(
            { error: 'Please wait a moment before requesting another email.' },
            { status: 429 },
          )
        }

        // Suppression
        const { data: suppressed } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', normalized)
          .maybeSingle()
        if (suppressed) {
          return Response.json(
            { error: 'This address is not accepting mail from us. Try another inbox.' },
            { status: 409 },
          )
        }

        const template = TEMPLATES[TEMPLATE_NAME]
        if (!template) return Response.json({ error: 'Template missing' }, { status: 500 })

        // Unsubscribe token
        let unsubscribeToken: string
        const { data: existing } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token, used_at')
          .eq('email', normalized)
          .maybeSingle()
        if (existing && !existing.used_at) {
          unsubscribeToken = existing.token
        } else {
          unsubscribeToken = generateToken()
          await supabase
            .from('email_unsubscribe_tokens')
            .upsert({ token: unsubscribeToken, email: normalized }, { onConflict: 'email', ignoreDuplicates: true })
          const { data: stored } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', normalized)
            .maybeSingle()
          if (stored?.token) unsubscribeToken = stored.token
        }

        const templateData = {
          name: reg.name as string,
          ticket: reg.ticket as string,
          waiverAccepted: reg.waiver_accepted as boolean,
        }
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const plainText = await render(element, { plainText: true })
        const subject =
          typeof template.subject === 'function' ? template.subject(templateData) : template.subject

        const messageId = crypto.randomUUID()
        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: TEMPLATE_NAME,
          recipient_email: recipient,
          status: 'pending',
        })

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: recipient,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject,
            html,
            text: plainText,
            purpose: 'transactional',
            label: TEMPLATE_NAME,
            idempotency_key: `rtwl-resend-${messageId}`,
            unsubscribe_token: unsubscribeToken,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: TEMPLATE_NAME,
            recipient_email: recipient,
            status: 'failed',
            error_message: 'Failed to enqueue email',
          })
          return Response.json({ error: 'Could not send. Try again shortly.' }, { status: 500 })
        }

        return Response.json({ success: true })
      },
    },
  },
})
