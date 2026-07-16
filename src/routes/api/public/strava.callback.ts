import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'

export const Route = createFileRoute('/api/public/strava/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const origin = url.origin
        const rid = url.searchParams.get('state') ?? ''
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error')

        const back = (params: Record<string, string>) => {
          const dest = new URL('/', origin)
          for (const [k, v] of Object.entries(params)) dest.searchParams.set(k, v)
          dest.hash = 'register'
          return Response.redirect(dest.toString(), 302)
        }

        if (!/^[0-9a-f-]{36}$/i.test(rid)) return back({ strava: 'error', reason: 'bad_state' })
        if (error) return back({ strava: 'denied', rid })
        if (!code) return back({ strava: 'error', reason: 'no_code', rid })

        const clientId = process.env.STRAVA_CLIENT_ID
        const clientSecret = process.env.STRAVA_CLIENT_SECRET
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!clientId || !clientSecret || !supabaseUrl || !serviceKey) {
          return back({ strava: 'error', reason: 'config', rid })
        }

        let tokenJson: {
          athlete?: {
            id?: number
            firstname?: string
            lastname?: string
            username?: string
            profile?: string
          }
        }
        try {
          const tokenRes = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code,
              grant_type: 'authorization_code',
            }),
          })
          if (!tokenRes.ok) {
            const text = await tokenRes.text()
            console.error('Strava token exchange failed', tokenRes.status, text)
            return back({ strava: 'error', reason: 'exchange', rid })
          }
          tokenJson = await tokenRes.json()
        } catch (e) {
          console.error('Strava token fetch error', e)
          return back({ strava: 'error', reason: 'network', rid })
        }

        const athlete = tokenJson.athlete ?? {}
        if (!athlete.id) return back({ strava: 'error', reason: 'no_athlete', rid })

        const supabase = createClient(supabaseUrl, serviceKey)
        const { error: updateErr } = await supabase
          .from('rtwl_registrations')
          .update({
            strava_athlete_id: athlete.id,
            strava_athlete_firstname: athlete.firstname ?? null,
            strava_athlete_lastname: athlete.lastname ?? null,
            strava_athlete_username: athlete.username ?? null,
            strava_athlete_profile: athlete.profile ?? null,
            strava_connected_at: new Date().toISOString(),
          })
          .eq('id', rid)

        if (updateErr) {
          console.error('Failed to save Strava athlete', updateErr)
          return back({ strava: 'error', reason: 'save', rid })
        }

        return back({ strava: 'ok', rid })
      },
    },
  },
})
