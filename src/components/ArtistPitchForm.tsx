import { useState } from 'react'
import { CheckCircle2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { artistPitchSchema, type ArtistPitch } from '@/lib/artist-pitch-schema'

const fieldClass = 'field-focus mt-2 w-full border-2 border-ink bg-paper-warm px-3 py-3 text-base font-sans normal-case tracking-normal'
const fields = [
  { name: 'name', label: 'Your name', limit: 100, autoComplete: 'name', required: true },
  { name: 'email', label: 'Contact email', limit: 255, autoComplete: 'email', required: true },
  { name: 'artist_project', label: 'Artist / project', limit: 150, required: true },
  { name: 'city', label: 'Proposed city', limit: 120, autoComplete: 'address-level2', required: true },
  { name: 'neighborhood', label: 'Neighborhood / park', limit: 200, required: true },
  { name: 'timing', label: 'Rough timing (optional)', limit: 200 },
] as const

export function ArtistPitchForm() {
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [failure, setFailure] = useState('')
  const [receipt, setReceipt] = useState<{ id: string; pitch: ArtistPitch } | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    setFailure('')
    const parsed = artistPitchSchema.safeParse(Object.fromEntries(new FormData(form)))
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message
      setErrors(next)
      const invalid = form.elements.namedItem(Object.keys(next)[0])
      if (invalid instanceof HTMLElement) invalid.focus()
      return
    }
    setErrors({})
    setBusy(true)
    try {
      const response = await fetch('/api/public/artist-pitch', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
      })
      const result = await response.json()
      if (!response.ok || !result.id) throw new Error(result.error || 'Could not save your pitch. Try again.')
      setReceipt({ id: result.id, pitch: parsed.data })
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'Could not save your pitch. Try again.')
    } finally { setBusy(false) }
  }

  return (
    <section id="pitch" className="mt-14 scroll-mt-24 border-t-2 border-ink pt-10">
      {receipt ? (
        <div role="status" className="rise-in">
          <CheckCircle2 className="h-10 w-10 text-forest" aria-hidden="true" />
          <p className="eyebrow mt-5 text-terracotta">Pitch received</p>
          <h2 className="display-tight mt-3 text-5xl text-forest">Thanks, {receipt.pitch.name.split(' ')[0]}.</h2>
          <p className="mt-4 text-ink-soft">Your city pitch is saved. We’ll review your idea and follow up at {receipt.pitch.email}.</p>
          <dl className="mt-8 grid gap-6 border-y border-hairline py-6 sm:grid-cols-2">
            {[
              ['Artist / project', receipt.pitch.artist_project],
              ['Proposed location', `${receipt.pitch.neighborhood}, ${receipt.pitch.city}`],
              ['Rough timing', receipt.pitch.timing || 'Not specified'],
              ['Reference', receipt.id.slice(0, 8).toUpperCase()],
            ].map(([label, value]) => <div key={label}><dt className="eyebrow text-ink-soft">{label}</dt><dd className="mt-2 break-words text-lg">{value}</dd></div>)}
          </dl>
          <Button asChild variant="outline" className="mt-6 min-h-12 rounded-none border-ink"><a href="/5k-series">Back to the 5K Series <ArrowUpRight aria-hidden="true" /></a></Button>
        </div>
      ) : (
        <>
          <p className="eyebrow text-terracotta">For artists and managers</p>
          <h2 className="display-tight mt-3 text-5xl text-forest">Pitch your city.</h2>
          <p className="mt-3 max-w-xl text-ink-soft">Have an album, a city and a crew? Tell us the record and where you’d run. We read every pitch.</p>
          <form onSubmit={submit} noValidate className="mt-8 grid gap-6 sm:grid-cols-2">
            {fields.map(field => (
              <div key={field.name}>
                <label htmlFor={`pitch-${field.name}`} className="eyebrow">{field.label}{field.required ? ' *' : ''}</label>
                <input id={`pitch-${field.name}`} name={field.name} type={field.name === 'email' ? 'email' : 'text'} required={field.required} autoComplete={'autoComplete' in field ? field.autoComplete : undefined} maxLength={field.limit} className={fieldClass} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} />
                {errors[field.name] && <p id={`error-${field.name}`} className="mt-2 text-sm text-destructive">{errors[field.name]}</p>}
              </div>
            ))}
            <div className="sm:col-span-2"><label htmlFor="pitch-links" className="eyebrow">Music / website / social links (optional)</label><textarea id="pitch-links" name="links" rows={2} maxLength={1000} className={fieldClass} /></div>
            <div className="sm:col-span-2"><label htmlFor="pitch-message" className="eyebrow">Tell us about the run (optional)</label><textarea id="pitch-message" name="message" rows={4} maxLength={2000} className={fieldClass} /></div>
            <input name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            {failure && <p role="alert" className="sm:col-span-2 text-destructive">{failure}</p>}
            <div className="sm:col-span-2">
              <p className="mb-4 text-sm text-ink-soft">We’ll use your contact details to reply about your pitch. <a href="/privacy" className="underline underline-offset-4">Privacy policy</a></p>
              <Button type="submit" disabled={busy} className="brush-btn min-h-14 w-full rounded-none bg-terracotta px-8 display-tight text-lg text-terracotta-ink hover:bg-forest hover:text-forest-ink sm:w-auto">{busy && <span className="spinner" aria-hidden="true" />}{busy ? 'Sending' : 'Send city pitch'}{!busy && <ArrowUpRight aria-hidden="true" />}</Button>
            </div>
          </form>
        </>
      )}
    </section>
  )
}