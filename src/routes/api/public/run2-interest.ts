import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

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
        return Response.json({ success: true })
      },
    },
  },
})
