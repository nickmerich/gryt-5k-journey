import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'
import { sendAndLog } from '@/lib/email-templates/log-send.server'

const TEMPLATE_NAME = 'rtwl-confirmation'

const schema = z.object({
  registrationId: z.string().uuid().optional(),
  email: z.string().trim().email().max(255).optional(),
}).refine((v) => v.registrationId || v.email, {
  message: 'registrationId or email required',
})

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

        const r = await sendAndLog(
          supabase,
          TEMPLATE_NAME,
          recipient,
          {
            name: reg.name as string,
            ticket: reg.ticket as string,
            waiverAccepted: reg.waiver_accepted as boolean,
          },
          `rtwl-resend-${crypto.randomUUID()}`,
        )
        if (r.suppressed) {
          return Response.json(
            { error: 'This address is not accepting mail from us. Try another inbox.' },
            { status: 409 },
          )
        }
        if (!r.sent) {
          return Response.json({ error: 'Could not send. Try again shortly.' }, { status: 500 })
        }

        return Response.json({ success: true })
      },
    },
  },
})
