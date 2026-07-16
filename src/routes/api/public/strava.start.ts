import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/strava/start')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const clientId = process.env.STRAVA_CLIENT_ID
        if (!clientId) return new Response('Strava not configured', { status: 500 })

        const url = new URL(request.url)
        const rid = url.searchParams.get('rid') ?? ''
        if (!/^[0-9a-f-]{36}$/i.test(rid)) {
          return new Response('Invalid rid', { status: 400 })
        }

        const redirectUri = `${url.origin}/api/public/strava/callback`
        const authorize = new URL('https://www.strava.com/oauth/authorize')
        authorize.searchParams.set('client_id', clientId)
        authorize.searchParams.set('redirect_uri', redirectUri)
        authorize.searchParams.set('response_type', 'code')
        authorize.searchParams.set('approval_prompt', 'auto')
        authorize.searchParams.set('scope', 'read')
        authorize.searchParams.set('state', rid)

        return Response.redirect(authorize.toString(), 302)
      },
    },
  },
})
