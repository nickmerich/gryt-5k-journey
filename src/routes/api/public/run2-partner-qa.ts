import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

// Grounding facts for the sponsorship assistant. Only state what is listed here.
const PARTNERSHIP_DETAILS = `
EVENT: Run #02 — the follow-up to "Run Takoma With Love", a free community 5K presented by GRYT Club (gryt run club) in Takoma Park, MD.
DATE: Early December 2026. Runners are voting between Dec 5–6, Dec 12–13 and Dec 19–20. Final date announced to the list.
FORMAT: Free to enter, community-first, about 100 bibs. Sunday-morning 5K through Takoma, then a finish-line hang.
RUN #01 RESULTS: 248 signups, 98 finishers, one community. Recap video, 55+ event photos, finisher medals, BIB packets.
RUN #01 PARTNERS: Glacéau smartwater (hydration partner) and Montgomery Parks / M-NCPPC (parks partner).
COMMUNITY CHANNELS: Instagram @grytrunclub, Strava club (strava.com/clubs/1708552), email list for Run #02.
PARTNERSHIP CATEGORIES WE ARE OPEN TO: Footwear & apparel, Hydration & nutrition, Recovery, Audio & entertainment, Community grant.
TYPICAL ACTIVATIONS: Product sampling at start/finish, a branded station or tent, items in the BIB packet, logo in the "In partnership with" section on the site, mention in recap content. Specifics are scoped per partner.
NOT YET DEFINED: Pricing, packages, exact attendance guarantees, exclusivity terms, insurance/permit specifics. For these, say the GRYT team will follow up directly.
HOW TO APPLY: Use the "Partner on Run #02" form on this page (brand, role, partnership type, message). The team replies by email.
MISSION: DO HARD THINGS TOGETHER.
`

const SYSTEM = `You are the GRYT Club partnerships assistant for Run #02. Answer questions from prospective sponsors using ONLY the partnership details below. Voice: short, direct, physical, community-first. Coach-voice, not marketing polish. No emoji. Keep answers under 120 words. If something is not in the details, say you don't have that yet and that the team will follow up after they submit the partner form. Never invent prices, numbers, dates or commitments. Plain text only, no markdown or asterisks. End with a nudge to submit the "Partner on Run #02" form when relevant.

PARTNERSHIP DETAILS:
${PARTNERSHIP_DETAILS}`

const schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(1500) }))
    .min(1)
    .max(20),
})

const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > 12
}

export const Route = createFileRoute('/api/public/run2-partner-qa')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return Response.json({ error: 'Assistant is not configured.' }, { status: 500 })
        const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'anon'
        if (limited(ip)) return Response.json({ error: 'Too many questions. Take a breath and try again in a minute.' }, { status: 429 })
        let body: unknown
        try { body = await request.json() } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }) }
        const parsed = schema.safeParse(body)
        if (!parsed.success) return Response.json({ error: 'Please ask a shorter question.' }, { status: 400 })

        const upstream = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
          method: 'POST',
          signal: request.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'Lovable-API-Key': apiKey,
            'X-Lovable-AIG-SDK': 'fetch',
          },
          body: JSON.stringify({
            model: 'openai/gpt-6-astra',
            instructions: SYSTEM,
            input: parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
            reasoning: { effort: 'low' },
            store: false,
            stream: true,
          }),
        })

        if (!upstream.ok || !upstream.body) {
          const status = upstream.status
          const msg =
            status === 429 ? 'The assistant is busy. Try again in a moment.'
            : status === 402 ? 'The assistant is temporarily unavailable.'
            : 'The assistant could not answer right now.'
          return Response.json({ error: msg }, { status: status >= 400 ? status : 502 })
        }

        // Relay only answer text deltas as plain text.
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        let buf = ''
        const out = upstream.body.pipeThrough(
          new TransformStream<Uint8Array, Uint8Array>({
            transform(chunk, controller) {
              buf += decoder.decode(chunk, { stream: true })
              const frames = buf.split('\n\n')
              buf = frames.pop() ?? ''
              for (const f of frames) {
                for (const line of f.split('\n')) {
                  if (!line.startsWith('data:')) continue
                  const data = line.slice(5).trim()
                  if (!data || data === '[DONE]') continue
                  try {
                    const ev = JSON.parse(data)
                    if (ev.type === 'response.output_text.delta' && typeof ev.delta === 'string') {
                      controller.enqueue(encoder.encode(ev.delta))
                    }
                  } catch {}
                }
              }
            },
          }),
        )
        return new Response(out, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' },
        })
      },
    },
  },
})
