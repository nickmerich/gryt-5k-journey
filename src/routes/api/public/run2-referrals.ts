import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'

// Public: returns only a count of signups for a referral code (no personal data).
export const Route = createFileRoute('/api/public/run2-referrals')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const code = new URL(request.url).searchParams.get('code') ?? ''
        if (!/^[a-z0-9]{6,12}$/.test(code)) return Response.json({ error: 'Invalid code' }, { status: 400 })
        const url = process.env.SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!url || !key) return Response.json({ error: 'Server configuration error' }, { status: 500 })
        const supabase = createClient(url, key)
        const { count, error } = await supabase
          .from('run2_interest')
          .select('id', { count: 'exact', head: true })
          .eq('referred_by', code)
        if (error) return Response.json({ error: 'Could not load' }, { status: 500 })
        return Response.json({ count: count ?? 0 }, { headers: { 'Cache-Control': 'no-store' } })
      },
    },
  },
})
