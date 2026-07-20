import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'GRYT 5K Run'
const SENDER_DOMAIN = 'notify.grytrunclub.com'
const FROM_DOMAIN = 'notify.grytrunclub.com'
const TEMPLATE_NAME = 'contact-inquiry'

const NAME_RE = /^[\p{L}][\p{L}\p{M}\s'.-]{1,99}$/u
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

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
  subject: z
    .string()
    .trim()
    .min(2, { message: 'Add a short subject' })
    .max(150, { message: 'Subject must be under 150 characters' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(4000, { message: 'Message must be under 4000 characters' }),
  // Simple honeypot — real users leave it blank.
  website: z.string().max(0).optional(),
})

export const Route = createFileRoute('/api/public/contact')({
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
          const raw = await request.text()
          if (raw.length > 16_384) {
            return Response.json({ error: 'Payload too large' }, { status: 413 })
          }
          body = raw ? JSON.parse(raw) : {}
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
          return Response.json({ error: 'Invalid input' }, { status: 400 })
        }
        const parsed = schema.safeParse(body)
        if (!parsed.success) {
          const fieldErrors: Record<string, string> = {}
          for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? 'form')
            if (!fieldErrors[key]) fieldErrors[key] = issue.message
          }
          return Response.json(
            { error: 'Invalid input', fieldErrors },
            { status: 400 },
          )
        }

        const { name, email, subject, message, website } = parsed.data
        // Honeypot silently succeeds without sending.
        if (website && website.length > 0) {
          return Response.json({ success: true })
        }

        const template = TEMPLATES[TEMPLATE_NAME]
        if (!template) {
          return Response.json({ error: 'Template missing' }, { status: 500 })
        }
        const recipient = template.to
        if (!recipient) {
          return Response.json({ error: 'Recipient missing' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, serviceKey)
        const messageId = crypto.randomUUID()
        const submittedAt = new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          dateStyle: 'medium',
          timeStyle: 'short',
        }) + ' ET'
        const idempotencyKey = `contact-${messageId}`

        const templateData = { name, email, subject, message, submittedAt }
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const plainText = await render(element, { plainText: true })
        const subjectLine =
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
            reply_to: email,
            subject: subjectLine,
            html,
            text: plainText,
            purpose: 'transactional',
            label: TEMPLATE_NAME,
            idempotency_key: idempotencyKey,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          console.error('Enqueue failed', enqueueError)
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: TEMPLATE_NAME,
            recipient_email: recipient,
            status: 'failed',
            error_message: 'Failed to enqueue email',
          })
          return Response.json({ error: 'Could not send message' }, { status: 500 })
        }

        return Response.json({ success: true })
      },
    },
  },
})
