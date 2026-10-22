import { createFileRoute } from '@tanstack/react-router'
import { artistPitchSchema } from '@/lib/artist-pitch-schema'

export const Route = createFileRoute('/api/public/artist-pitch')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get('origin')
        if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: 'Please submit through the city pitch form.' }, { status: 403 })
        const text = await request.text()
        if (text.length > 8000) return Response.json({ error: 'Your pitch is too long.' }, { status: 413 })
        let body: unknown
        try { body = JSON.parse(text) } catch { return Response.json({ error: 'Invalid submission.' }, { status: 400 }) }
        const parsed = artistPitchSchema.safeParse(body)
        if (!parsed.success) return Response.json({ error: 'Check your contact details and proposed location.' }, { status: 400 })
        const { hp, ...pitch } = parsed.data
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
        const { data: row, error } = await supabaseAdmin.from('artist_city_pitches').insert({ ...pitch, email: pitch.email.toLowerCase() }).select('id').single()
        if (error || !row) return Response.json({ error: 'Could not save your pitch. Please try again.' }, { status: 500 })
        // A notification failure never discards a saved pitch.
        try {
          const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
          await sendTemplateEmail('owner-signup-alert', 'merichnick@gmail.com', {
            templateData: { source: 'Artist city pitch', fields: {
              Name: pitch.name, Email: pitch.email, 'Artist / project': pitch.artist_project,
              City: pitch.city, 'Neighborhood / park': pitch.neighborhood,
              Timing: pitch.timing, Links: pitch.links, Message: pitch.message,
            } }, idempotencyKey: `artist-pitch-${row.id}`, replyTo: pitch.email,
          })
        } catch { console.error('Artist pitch saved; owner email failed.') }
        return Response.json({ success: true, id: row.id })
      },
    },
  },
})