import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'
import { sendAndLog } from '@/lib/email-templates/log-send.server'

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
  tos: z.literal(true, { message: 'You must accept the Terms of Service to register' }),
})


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
          // Cap request size to guard against abusive payloads (~8KB is plenty).
          const raw = await request.text()
          if (raw.length > 8_192) {
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

        try {
          await sendAndLog(supabase, 'owner-signup-alert', 'merichnick@gmail.com',
            { source: 'Run Takoma 5K · Registration', fields: { Name: name, Email: recipient, Ticket: ticket } },
            `owner-rtwl-${crypto.randomUUID()}`)
        } catch (e) { console.error('owner alert failed', e) }

        const r = await sendAndLog(
          supabase,
          TEMPLATE_NAME,
          recipient,
          { name, ticket, waiverAccepted: waiver },
          idempotencyKey,
        )
        if (r.suppressed) {
          // Still succeed the registration for UX; the email just won't send.
          return Response.json({ success: true, emailed: false, reason: 'suppressed' })
        }
        if (!r.sent) {
          console.error('Confirmation send failed', { recipient: redact(recipient), messageId })
          return Response.json({ success: true, emailed: false, error: 'send_failed' }, { status: 200 })
        }

        return Response.json({ success: true, emailed: true, registrationId })
      },
    },
  },
})
