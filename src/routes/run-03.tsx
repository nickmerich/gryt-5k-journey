import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowDown, CalendarDays, MapPin, Route as RouteIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Run3Signup } from '@/components/Run3Signup'
import groupPhoto from '@/assets/rtwl-group-1200.webp.asset.json'
import bearLogo from '@/assets/gryt-bear.png.asset.json'

const title = 'Run #03 — Run Takoma With Love | GRYT Club'
const description = 'Join the Run #03 interest list for Run Takoma With Love. Date, location, and 5K route are to be confirmed.'
export const Route = createFileRoute('/run-03')({
  head: () => ({ meta: [
    { title }, { name: 'description', content: description },
    { property: 'og:title', content: title }, { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'og:image', content: groupPhoto.url }, { name: 'twitter:image', content: groupPhoto.url },
  ] }),
  component: Run3Page,
})
function Run3Page() {
  return <main className="min-h-screen overflow-x-clip bg-paper text-ink">
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-6 sm:py-7"><Button asChild variant="link" className="h-auto p-0 text-forest"><Link to="/5k-series"><ArrowLeft /><span className="eyebrow">The 5K Series</span></Link></Button><Link to="/" aria-label="GRYT Club homepage"><img src={bearLogo.url} width={56} height={60} alt="GRYT Club" className="h-12 w-auto" /></Link></header>
    <section className="relative isolate bg-forest"><img src={groupPhoto.url} alt="Run #01 finishers together in Takoma Park" width={1200} height={800} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div aria-hidden className="absolute inset-0 -z-10 bg-ink/65" /><div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24"><p className="eyebrow text-paper">Run Takoma With Love · 5K Series</p><h1 className="mt-5 display-tight text-7xl text-paper sm:text-8xl">RUN #03<span className="mt-3 block brush-script text-4xl sm:text-5xl">More miles. Same love.</span></h1><p className="mt-6 max-w-md leading-relaxed text-paper">The next chapter starts with the people. Takoma roots. Five kilometers. A starting line we build together.</p><p className="mt-4 text-sm text-paper">Photo: Run #01 · Run #03 details to be confirmed.</p><Button asChild className="brush-btn mt-7 h-auto min-h-14 w-full rounded-none bg-terracotta px-6 py-4 display-tight text-lg text-terracotta-ink hover:bg-paper hover:text-forest sm:w-auto"><a href="#signup">Join the Run #03 list <ArrowDown /></a></Button></div></section>
    <section aria-label="Run #03 event details" className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:grid-cols-3 sm:px-6">{[[CalendarDays, 'Date', 'To be confirmed'], [MapPin, 'Meeting point', 'To be confirmed'], [RouteIcon, 'Distance', '5K · Route to be confirmed']].map(([Icon, label, value]) => { const DetailIcon = Icon as typeof CalendarDays; return <div key={String(label)} className="border-t-2 border-ink pt-5"><DetailIcon className="size-6 text-terracotta" /><h2 className="eyebrow mt-4 text-forest">{String(label)}</h2><p className="mt-2 text-ink-soft">{String(value)}</p></div> })}</section>
    <Run3Signup />
    <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 py-10 sm:flex-row sm:px-6"><p className="display-tight text-2xl text-forest">DO HARD THINGS TOGETHER</p><nav aria-label="Footer" className="flex flex-wrap gap-5 text-sm text-ink-soft"><Link to="/5k-series">5K Series</Link><Link to="/partners">Partners</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></nav></footer>
  </main>
}