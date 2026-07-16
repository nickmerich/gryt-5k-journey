import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'

export const Route = createFileRoute('/api/public/strava/status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const rid = url.searchParams.get('rid') ?? ''
        if (!/^[0-9a-f-]{36}$/i.test(rid)) {
          return Response.json({ error: 'bad_rid' }, { status: 400 })
        }
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: 'config' }, { status: 500 })
        }
        const supabase = createClient(supabaseUrl, serviceKey)
        const { data, error } = await supabase
          .from('rtwl_registrations')
          .select(
            'name, ticket, strava_athlete_id, strava_athlete_firstname, strava_athlete_username, strava_athlete_profile',
          )
          .eq('id', rid)
          .maybeSingle()
        if (error || !data) return Response.json({ error: 'not_found' }, { status: 404 })
        return Response.json({
          name: data.name,
          ticket: data.ticket,
          strava: data.strava_athlete_id
            ? {
                id: String(data.strava_athlete_id),
                firstname: data.strava_athlete_firstname,
                username: data.strava_athlete_username,
                profile: data.strava_athlete_profile,
              }
            : null,
        })
      },
    },
  },
})
