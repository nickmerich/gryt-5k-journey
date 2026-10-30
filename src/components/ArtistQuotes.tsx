import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveImg } from "@/components/ResponsiveImg";
import oddiseeAvatar from "@/assets/oddisee-avatar.png.asset.json";
import henoAvatar from "@/assets/heno-avatar.webp.asset.json";
import albumCover from "@/assets/from-takoma-cover.jpg.asset.json";

export function ArtistQuotes() {
  const [slide, setSlide] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const artist = slide === 0 ? "Heno." : slide === 1 ? "Oddisee" : "The album";

  function next() {
    setSlide((current) => (current + 1) % 3);
  }

  function previous() {
    setSlide((current) => (current + 2) % 3);
  }

  return (
    <section aria-label="Artist testimonials" aria-roledescription="carousel" onKeyDown={(event) => {
      if (event.target instanceof HTMLElement && event.target.closest("a")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
    }} className="relative z-10 mx-auto max-w-4xl px-5 pt-14 pb-6 sm:px-6 sm:pt-20 sm:pb-10">
      <div className="relative mr-1 border-2 border-ink bg-paper-warm px-5 pb-5 pt-12 shadow-[4px_4px_0_0_var(--color-ink)] sm:mr-0 sm:px-12 sm:pb-7 sm:pt-14 sm:shadow-[8px_8px_0_0_var(--color-ink)]">
        <span className="paint-stroke absolute left-4 top-0 -translate-y-1/2 whitespace-nowrap bg-forest px-5 py-2.5 display-tight text-sm text-forest-ink sm:left-10">ARTISTS REVIEW THE RUN</span>
        <span aria-hidden className="pointer-events-none absolute right-3 top-2 select-none font-serif text-[6rem] leading-none text-terracotta/20 sm:right-8 sm:text-[9rem]">&rdquo;</span>
        <p className="relative eyebrow text-terracotta">Music brought us here. Running keeps us together.</p>
        <div className="grid" aria-live="polite" aria-atomic="true" onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }} onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={(event) => {
          const end = event.changedTouches[0];
          if (touchStart.current && end) {
            const dx = end.clientX - touchStart.current.x;
            const dy = end.clientY - touchStart.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
              if (dx < 0) next(); else previous();
            }
          }
          touchStart.current = null;
        }}>
          {[0, 1].map((index) => (
            <figure key={index} aria-hidden={slide !== index} aria-label={`${index + 1} of 3: ${index === 0 ? "Heno." : "Oddisee"}`} aria-roledescription="slide" className={`relative col-start-1 row-start-1 flex flex-col ${slide !== index ? "invisible" : ""}`}>
              <blockquote className="relative mt-4 sm:mt-5">
                <p className="serif-italic text-2xl leading-[1.3] text-ink sm:text-4xl sm:leading-[1.2]">
                  {index === 0 ? <>&ldquo;Working with GRYT on Run Takoma With Love has made me want to help make movement feel more accessible, social, and <span className="brush-script not-italic text-terracotta">connected to something bigger than ourselves.</span>&rdquo;</> : <>&ldquo;Socializing with community around a healthy activity is what <span className="brush-script not-italic text-terracotta">Gryt does best.</span>&rdquo;</>}
                </p>
              </blockquote>
              <figcaption className="relative mt-auto pt-6 sm:pt-8">
                <div className="flex items-center gap-4 border-t border-dashed border-hairline pt-5 sm:pt-6">
                  <ResponsiveImg asset={index === 0 ? henoAvatar.url : oddiseeAvatar.url} sizes="64px" alt={index === 0 ? "Heno." : "Oddisee"} width={64} height={64} className="size-14 shrink-0 rounded-full border-2 border-terracotta object-cover ring-4 ring-paper sm:size-16" />
                  <div className="min-w-0">
                    <p className="display-tight text-2xl leading-none text-ink sm:text-3xl">{index === 0 ? "Heno." : "Oddisee"}</p>
                    <p className="mt-2 eyebrow text-forest">Artist &amp; Producer</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 border-b border-hairline/30 pb-4 sm:gap-8">
                  <a href={index === 0 ? "https://www.instagram.com/mynameisheno/" : "https://www.instagram.com/oddisee/"} target="_blank" rel="noopener noreferrer" tabIndex={slide === index ? 0 : -1} className="group min-w-0 text-ink transition-colors hover:text-terracotta">
                    <span className="flex items-center gap-2"><Instagram aria-hidden className="size-4 shrink-0 text-forest" /><strong className="text-xl font-semibold leading-none tabular-nums sm:text-2xl">{index === 0 ? "12,127" : "117K"}</strong></span>
                    <span className="mt-2 block text-xs leading-snug text-ink-soft">Instagram followers</span>
                  </a>
                  {index === 0 ? <div className="min-w-0 text-ink">
                    <span className="flex items-center gap-2"><Music2 aria-hidden className="size-4 shrink-0 text-forest" /><strong className="text-xl font-semibold leading-none tabular-nums sm:text-2xl">26,301</strong></span>
                    <span className="mt-2 block text-xs leading-snug text-ink-soft">Spotify monthly listeners</span>
                  </div> : <a href="https://open.spotify.com/artist/72tRiBHei5G9M8it4h4sfC" target="_blank" rel="noopener noreferrer" tabIndex={slide === index ? 0 : -1} className="min-w-0 text-ink transition-colors hover:text-terracotta">
                    <span className="flex items-center gap-2"><Music2 aria-hidden className="size-4 shrink-0 text-forest" /><strong className="text-xl font-semibold leading-none tabular-nums sm:text-2xl">245.7K</strong></span>
                    <span className="mt-2 block text-xs leading-snug text-ink-soft">Spotify monthly listeners</span>
                  </a>}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">The {index === 0 ? "voice" : "sound"} behind <em>From Takoma With Love</em> — the album this run is named for</p>
                {index === 0 && <p className="mt-3 text-xs leading-relaxed text-ink-soft">As of Oct 19, 2026</p>}
              </figcaption>
            </figure>
          ))}
          <figure aria-hidden={slide !== 2} aria-label="3 of 3: From Takoma With Love" aria-roledescription="slide" className={`relative col-start-1 row-start-1 mt-5 flex flex-col justify-center gap-6 sm:flex-row sm:items-center sm:gap-10 ${slide !== 2 ? "invisible" : ""}`}>
            <a href="https://orcd.co/ykrr2qx" target="_blank" rel="noopener noreferrer" tabIndex={slide === 2 ? 0 : -1} aria-label="Listen to From Takoma With Love" className="mx-auto block w-64 shrink-0 border-2 border-ink shadow-[6px_6px_0_0_var(--color-terracotta)] sm:mx-0 sm:w-80 lg:w-96">
              <ResponsiveImg asset={albumCover.url} sizes="(min-width: 1024px) 384px, (min-width: 640px) 320px, 256px" alt="From Takoma With Love official album cover" width={400} height={400} className="aspect-square w-full object-contain" />
            </a>
            <figcaption className="min-w-0 text-center sm:text-left">
              <p className="eyebrow text-base text-forest">Oddisee &amp; Heno.</p>
              <h2 className="mt-3 display-tight text-5xl text-ink sm:text-6xl lg:text-7xl">From Takoma<br />With Love</h2>
              <p className="mt-4 text-lg text-ink-soft sm:text-xl">The album that brought us here.</p>
              <Button asChild className="mt-6 h-12 rounded-none bg-forest px-6 text-base text-forest-ink hover:bg-terracotta hover:text-terracotta-ink">
                <a href="https://orcd.co/ykrr2qx" target="_blank" rel="noopener noreferrer" tabIndex={slide === 2 ? 0 : -1}>Listen to the album <ArrowUpRight /></a>
              </Button>
            </figcaption>
          </figure>
        </div>
        <nav aria-label="Quote controls" className="mt-6 flex items-center justify-between gap-3 border-t border-hairline/30 pt-4">
          <p className="eyebrow text-forest">{artist} · {slide + 1} / 3</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previous} aria-label="Previous artist quote" title="Previous artist quote" className="size-11 rounded-none border-hairline bg-paper text-forest hover:bg-forest hover:text-forest-ink"><ArrowLeft /></Button>
            <Button variant="outline" size="icon" onClick={next} aria-label="Next artist quote" title="Next artist quote" className="size-11 rounded-none border-hairline bg-paper text-forest hover:bg-forest hover:text-forest-ink"><ArrowRight /></Button>
          </div>
        </nav>
      </div>
    </section>
  );
}