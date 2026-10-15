import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendAndLog } from '@/lib/email-templates/log-send.server'

export const PACKAGES = ['supporter', 'station', 'presenting', 'in-kind', 'not-sure'] as const
export const BUDGETS = ['under-500', '500-1500', '1500-3500', '3500-plus', 'in-kind'] as const

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).optional().default(''),
  website: z.string().trim().max(200).optional().default(''),
  package: z.enum(PACKAGES),
  budget: z.enum(BUDGETS),
  goals: z.string().trim().max(1500).optional().default(''),
  hp: z.string().max(0).optional().default(''), // honeypot
})

const recent = new Map<string, number>()

export const Route = createFileRoute('/api/public/sponsor-inquiry')({
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
        const email = d.email.toLowerCase()
        const now = Date.now()
        if ((recent.get(email) ?? 0) > now - 20_000) return Response.json({ error: 'Already received — give it a moment.' }, { status: 429 })
        recent.set(email, now)

        const supabase = createClient(url, key)
        const { data: row, error } = await supabase.from('sponsor_inquiries').insert({
          name: d.name, email, company: d.company, role: d.role || null, website: d.website || null,
          package: d.package, budget: d.budget, goals: d.goals || null,
        }).select('id').single()
        if (error || !row) return Response.json({ error: 'Could not save. Try again shortly.' }, { status: 500 })

        try {
          await sendAndLog(supabase, 'owner-signup-alert', 'merichnick@gmail.com', {
            source: 'Run #02 · Sponsor inquiry',
            fields: { Name: d.name, Email: email, Company: d.company, Role: d.role, Website: d.website, Package: d.package, Budget: d.budget, Goals: d.goals },
          }, `sponsor-${row.id}`)
        } catch (e) { console.error('owner alert failed', e) }

        return Response.json({ success: true, id: row.id })
      },
    },
  },
})
