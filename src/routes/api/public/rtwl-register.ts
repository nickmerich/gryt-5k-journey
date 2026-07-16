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

// Strict server-side schema. Runs regardless of client-side checks.
// Name: letters (incl. common accents), spaces, hyphens, apostrophes, dots — 2..100 chars.
const NAME_RE = /^[\p{L}][\p{L}\p{M}\s'.-]{1,99}$/u
// Email: RFC-lite; also enforce a real dot in the domain and no spaces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TICKETS = ['5k', 'walker', 'supporter'] as const

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Full name is required' })
    .max(100, { message: 'Name must be under 100 characters' })
    .regex(NAME_RE, { message: 'Name contains invalid characters' }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, { message: 'Enter a valid email address' })
    .max(255, { message: 'Email must be under 255 characters' })
    .email({ message: 'Enter a valid email address' })
    .regex(EMAIL_RE, { message: 'Enter a valid email address' }),
  ticket: z.enum(TICKETS, { message: 'Choose a ticket type' }),
  waiver: z.literal(true, { message: 'You must accept the waiver to register' }),
})


function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function redact(email: string): string {
  const [l, d] = email.split('@')
  return l && d ? `${l[0]}***@${d}` : '***'
}

export const Route = createFileRoute('/api/public/rtwl-register')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        const parsed = schema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { error: 'Invalid input', issues: parsed.error.issues },
            { status: 400 },
          )
        }
        const { name, email, ticket, waiver } = parsed.data
        const recipient = email
        const normalized = recipient.toLowerCase()

        const template = TEMPLATES[TEMPLATE_NAME]
        if (!template) {
          return Response.json({ error: 'Template missing' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, serviceKey)
        const messageId = crypto.randomUUID()
        const idempotencyKey = `rtwl-${normalized}-${ticket}`

        // Persist the registration so we can attach a Strava athlete later.
        let registrationId: string | null = null
        {
          const { data: reg, error: regErr } = await supabase
            .from('rtwl_registrations')
            .insert({ name, email: recipient, ticket, waiver_accepted: waiver })
            .select('id')
            .single()
          if (regErr || !reg) {
            console.error('Failed to persist registration', regErr)
          } else {
            registrationId = reg.id
          }
        }

        // Suppression check
        const { data: suppressed, error: supErr } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', normalized)
          .maybeSingle()
        if (supErr) {
          return Response.json({ error: 'Suppression check failed' }, { status: 500 })
        }
        if (suppressed) {
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: TEMPLATE_NAME,
            recipient_email: recipient,
            status: 'suppressed',
          })
          // Still succeed the registration for UX; the email just won't send.
          return Response.json({ success: true, emailed: false, reason: 'suppressed' })
        }

        // Unsubscribe token (reuse existing unused)
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
            .upsert(
              { token: unsubscribeToken, email: normalized },
              { onConflict: 'email', ignoreDuplicates: true },
            )
          const { data: stored } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', normalized)
            .maybeSingle()
          if (stored?.token) unsubscribeToken = stored.token
        }

        // Render
        const templateData = { name, ticket, waiverAccepted: waiver }
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const plainText = await render(element, { plainText: true })
        const subject =
          typeof template.subject === 'function'
            ? template.subject(templateData)
            : template.subject

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
            idempotency_key: idempotencyKey,
            unsubscribe_token: unsubscribeToken,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          console.error('Enqueue failed', { error: enqueueError, recipient: redact(recipient) })
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: TEMPLATE_NAME,
            recipient_email: recipient,
            status: 'failed',
            error_message: 'Failed to enqueue email',
          })
          return Response.json(
            { success: true, emailed: false, error: 'enqueue_failed' },
            { status: 200 },
          )
        }

        return Response.json({ success: true, emailed: true, registrationId })
      },
    },
  },
})
