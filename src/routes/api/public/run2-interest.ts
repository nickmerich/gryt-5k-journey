import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendAndLog } from '@/lib/email-templates/log-send.server'

const TEMPLATE_NAME = 'run2-confirmation'

async function sendRunnerConfirmation(
  supabase: SupabaseClient,
  email: string,
  data: { name: string; pace: string; weekend: string },
): Promise<boolean> {
  const r = await sendAndLog(supabase, TEMPLATE_NAME, email, data, `run2-${crypto.randomUUID()}`)
  return r.sent
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

        // Owner alert (best effort)
        try {
          const fields: Record<string, string> =
            d.kind === 'runner'
              ? { Name: d.name, Email: d.email, Pace: d.pace, Weekend: d.weekend }
              : { Name: d.name, Email: d.email, Brand: d.brand, Role: d.role, Category: d.category, Message: d.message }
          await sendAndLog(supabase, 'owner-signup-alert', 'merichnick@gmail.com',
            { source: d.kind === 'runner' ? 'Run #02 · Runner' : 'Run #02 · Brand', fields },
            `owner-run2-${crypto.randomUUID()}`)
        } catch (e) { console.error('owner alert failed', e) }

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
