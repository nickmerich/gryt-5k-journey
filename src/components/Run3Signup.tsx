import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { Check, Loader2, ArrowUpRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { joinRun3 } from '@/lib/run3.functions'
import { run3Schema } from '@/lib/run3-schema'

const STORAGE_KEY = 'gryt-run-03-receipt'
type Receipt = { name: string; id: string }
export function Run3Signup() {
  const submitSignup = useServerFn(joinRun3)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null')
      if (typeof saved?.name === 'string' && typeof saved?.id === 'string') setReceipt(saved)
    } catch { /* Storage may be unavailable. */ }
  }, [])
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const parsed = run3Schema.safeParse(data)
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message
      setErrors(next)
      const first = form.elements.namedItem(parsed.error.issues[0]?.path[0]?.toString() ?? '')
      if (first instanceof HTMLElement) first.focus()
      return
    }
    setErrors({}); setBusy(true)
    try {
      const result = await submitSignup({ data: parsed.data })
      const next = { name: parsed.data.name, id: result.id }
      setReceipt(next)
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* Receipt still displays. */ }
    } catch { setErrors({ submit: 'We couldn’t save your signup. Please try again.' }) }
    finally { setBusy(false) }
  }
  return <section id="signup" className="border-y-2 border-ink bg-paper-warm px-5 py-14 sm:px-6 sm:py-20">
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
      <div><p className="eyebrow text-terracotta">Run #03 · Interest list</p><h2 className="mt-4 display-tight text-5xl text-forest">SAVE YOUR<span className="mt-2 block brush-script text-terracotta">next starting line.</span></h2><p className="mt-6 max-w-md leading-relaxed text-ink-soft">Put your name down for Run #03. Date, meeting point, and route are still to be confirmed.</p><p className="mt-4 max-w-md text-sm font-medium text-forest">Joining this list does not reserve a race bib or confirm race registration.</p></div>
      <div className="border-2 border-ink bg-paper p-6 sm:p-8">
        {receipt ? <div role="status" aria-live="polite"><Check className="size-8 text-forest" /><h3 className="mt-4 display-tight text-3xl text-terracotta">YOU’RE ON THE RUN #03 LIST.</h3><p className="mt-4 leading-relaxed text-ink-soft">Thanks, {receipt.name}. Your interest has been saved for Run #03.</p><dl className="mt-6 border-y border-ink/20 py-4 text-sm"><dt className="eyebrow text-forest">Signup reference</dt><dd className="mt-2 break-all text-ink-soft">{receipt.id}</dd></dl><Button variant="link" className="mt-5 px-0 text-forest" onClick={() => { setReceipt(null); try { sessionStorage.removeItem(STORAGE_KEY) } catch {} }}>Sign up someone else <ArrowUpRight /></Button></div> :
        <form onSubmit={submit} noValidate className="space-y-5" aria-label="Run #03 interest signup">
          <h3 className="display-tight text-2xl text-forest">JOIN RUN #03</h3>
          {(['name', 'email'] as const).map(field => <div key={field}><Label htmlFor={`run3-${field}`} className="eyebrow text-forest">{field === 'name' ? 'Full name' : 'Email'}</Label><Input id={`run3-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} autoComplete={field} maxLength={field === 'name' ? 100 : 255} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `run3-${field}-error` : undefined} className="mt-2 h-12 rounded-none border-ink/40 bg-paper text-ink" />{errors[field] && <p id={`run3-${field}-error`} className="mt-2 text-sm text-terracotta">{errors[field]}</p>}</div>)}
          <div><Label htmlFor="run3-pace" className="eyebrow text-forest">Your pace</Label><select id="run3-pace" name="pace" defaultValue="" aria-invalid={Boolean(errors.pace)} aria-describedby={errors.pace ? 'run3-pace-error' : undefined} className="mt-2 h-12 w-full border border-ink/40 bg-paper px-3 text-ink"><option value="" disabled>Choose your pace</option><option value="first-5k">My first 5K</option><option value="casual">Casual</option><option value="regular">Regular runner</option><option value="fast">Fast</option></select>{errors.pace && <p id="run3-pace-error" className="mt-2 text-sm text-terracotta">{errors.pace}</p>}</div>
          <div hidden aria-hidden><input name="website" tabIndex={-1} autoComplete="off" /></div>
          <p className="text-sm leading-relaxed text-ink-soft">Your details are used to manage your Run #03 interest. <Link to="/privacy" className="underline text-forest">Privacy policy</Link></p>
          {errors.submit && <p role="alert" className="text-sm text-terracotta">{errors.submit}</p>}
          <Button disabled={busy} type="submit" className="brush-btn h-auto min-h-14 w-full rounded-none bg-forest px-5 py-4 display-tight text-lg text-forest-ink hover:bg-terracotta hover:text-terracotta-ink">{busy ? <><Loader2 className="motion-safe:animate-spin" /> Saving your signup</> : <>Put me on the Run #03 list <ArrowUpRight /></>}</Button>
        </form>}
      </div>
    </div>
  </section>
}