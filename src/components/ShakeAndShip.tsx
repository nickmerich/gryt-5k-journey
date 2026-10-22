import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShakeAndShip() {
  return <section aria-labelledby="shake-ship-title" className="relative z-10 mx-auto max-w-4xl px-5 py-10 sm:px-6">
    <div className="ink-card p-6 sm:p-8">
      <p className="eyebrow text-terracotta">NEXT UP · PHILADELPHIA</p>
      <h2 id="shake-ship-title" className="mt-3 display-tight text-4xl text-forest sm:text-5xl">Shake &amp; Ship</h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">A music x endurance hackathon on Philadelphia Marathon weekend. A 30-minute shakeout run at 10:00 AM Friday, Nov 20, then an open build session. Ship by 11:59 PM Saturday. Free. No coding required.</p>
      <p className="mt-3 text-xs text-ink-soft">Venue in final selection.</p>
      <Button asChild className="brush-btn mt-5 min-h-12 rounded-none bg-terracotta px-6 display-tight text-lg text-terracotta-ink hover:bg-forest hover:text-forest-ink"><a href="https://phihackathon.pplx.app" target="_blank" rel="noopener">See the event <ArrowUpRight /></a></Button>
    </div>
  </section>;
}