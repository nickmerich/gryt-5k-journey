import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import oddiseeAvatar from "@/assets/oddisee-avatar.png.asset.json";
import henoAvatar from "@/assets/heno-avatar.webp.asset.json";
import albumCover from "@/assets/from-takoma-cover.jpg.asset.json";

export function ArtistQuotes() {
  const [slide, setSlide] = useState(0);
  const touchStart = useRef<number | null>(null);
  const artist = slide === 0 ? "Heno." : slide === 1 ? "Oddisee" : "The album";

  function next() {
    setSlide((current) => (current + 1) % 3);
  }

  function previous() {
    setSlide((current) => (current + 2) % 3);
  }

  return (
    <section aria-label="Artist testimonials" aria-roledescription="carousel" className="relative z-10 mx-auto max-w-4xl px-5 pt-14 pb-6 sm:px-6 sm:pt-20 sm:pb-10">
      <div className="relative mr-1 border-2 border-ink bg-paper-warm px-6 pb-6 pt-14 shadow-[4px_4px_0_0_var(--color-ink)] sm:mr-0 sm:px-14 sm:pb-8 sm:pt-16 sm:shadow-[8px_8px_0_0_var(--color-ink)]">
        <span className="paint-stroke absolute left-4 top-0 -translate-y-1/2 whitespace-nowrap bg-forest px-5 py-2.5 display-tight text-sm text-forest-ink sm:left-10">ARTISTS REVIEW THE RUN</span>
        <span aria-hidden className="pointer-events-none absolute right-3 top-2 select-none font-serif text-[6rem] leading-none text-terracotta/20 sm:right-8 sm:text-[9rem]">&rdquo;</span>
        <p className="relative eyebrow text-terracotta">Music brought us here. Running keeps us together.</p>
        <div className="grid" aria-live="polite" aria-atomic="true" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
          const end = event.changedTouches[0]?.clientX;
          if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) {
            if (end < touchStart.current) next(); else previous();
          }
          touchStart.current = null;
        }}>
          {[0, 1].map((index) => (
            <figure key={index} aria-hidden={slide !== index} aria-label={`${index + 1} of 3: ${index === 0 ? "Heno." : "Oddisee"}`} aria-roledescription="slide" className={`relative col-start-1 row-start-1 flex flex-col ${slide !== index ? "invisible" : ""}`}>
              <blockquote className="relative mt-4 sm:mt-5">
                <p className="serif-italic text-[1.75rem] leading-[1.2] text-ink sm:text-[2.5rem] sm:leading-[1.15]">
                  {index === 0 ? <>&ldquo;Working with GRYT on Run Takoma With Love has made me want to help make movement feel more accessible, social, and <span className="brush-script not-italic text-terracotta">connected to something bigger than ourselves.</span>&rdquo;</> : <>&ldquo;Socializing with community around a healthy activity is what <span className="brush-script not-italic text-terracotta">Gryt does best.</span>&rdquo;</>}
                </p>
              </blockquote>
              <figcaption className="relative mt-auto pt-8 sm:pt-10">
                <div className="flex items-center gap-4 border-t border-dashed border-hairline pt-6 sm:pt-8">
                  <img src={index === 0 ? henoAvatar.url : oddiseeAvatar.url} alt={index === 0 ? "Heno." : "Oddisee"} width={72} height={72} loading="lazy" className="h-16 w-16 shrink-0 rounded-full border-2 border-terracotta object-cover ring-4 ring-paper sm:h-[72px] sm:w-[72px]" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2"><span className="display-tight text-2xl text-ink">{index === 0 ? "Heno." : "Oddisee"}</span><span className="eyebrow text-forest">Artist &amp; Producer</span></div>
                    {index === 0 && <>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <a href="https://www.instagram.com/mynameisheno/" target="_blank" rel="noopener noreferrer" tabIndex={slide === index ? 0 : -1} className="inline-flex flex-wrap items-center gap-1 border border-hairline/50 px-2 py-0.5 eyebrow text-[0.65rem] text-ink hover:bg-forest hover:text-forest-ink"><strong className="font-bold">12,127</strong> Instagram followers</a>
                        <span className="inline-flex flex-wrap items-center gap-1 border border-hairline/50 px-2 py-0.5 eyebrow text-[0.65rem] text-ink"><strong className="font-bold">26,301</strong> Spotify monthly listeners</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-ink-soft">As of Oct 19, 2026 · Instagram count via Social Blade; not verified directly on Instagram.</p>
                    </>}
                    {index === 1 && <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <a href="https://www.instagram.com/oddisee/" target="_blank" rel="noopener noreferrer" tabIndex={slide === index ? 0 : -1} className="inline-flex items-center gap-1 border border-hairline/50 px-2 py-0.5 eyebrow text-[0.65rem] text-ink hover:bg-forest hover:text-forest-ink"><strong className="font-bold">117K</strong> Instagram followers</a>
                      <a href="https://open.spotify.com/artist/72tRiBHei5G9M8it4h4sfC" target="_blank" rel="noopener noreferrer" tabIndex={slide === index ? 0 : -1} className="inline-flex items-center gap-1 border border-hairline/50 px-2 py-0.5 eyebrow text-[0.65rem] text-ink hover:bg-forest hover:text-forest-ink"><strong className="font-bold">245.7K</strong> Spotify monthly listeners</a>
                    </div>}
                    <p className="mt-1 text-sm text-ink-soft">{index === 0 ? <em>From Takoma With Love</em> : <>The voice behind <em>From Takoma With Love</em> — the album this run is named for</>}</p>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
          <figure aria-hidden={slide !== 2} aria-label="3 of 3: From Takoma With Love" aria-roledescription="slide" className={`relative col-start-1 row-start-1 mt-5 flex flex-col justify-center gap-5 sm:flex-row sm:items-center sm:gap-8 ${slide !== 2 ? "invisible" : ""}`}>
            <a href="https://orcd.co/ykrr2qx" target="_blank" rel="noopener noreferrer" tabIndex={slide === 2 ? 0 : -1} aria-label="Listen to From Takoma With Love" className="mx-auto block w-52 shrink-0 border-2 border-ink shadow-[4px_4px_0_0_var(--color-terracotta)] sm:w-64">
              <img src={albumCover.url} alt="From Takoma With Love official album cover" width={300} height={300} loading="lazy" className="aspect-square w-full object-contain" />
            </a>
            <figcaption className="min-w-0 text-center sm:text-left">
              <p className="eyebrow text-forest">Oddisee &amp; Heno.</p>
              <h2 className="mt-3 display-tight text-4xl text-ink sm:text-5xl">From Takoma<br />With Love</h2>
              <p className="mt-3 text-sm text-ink-soft">The album that brought us here.</p>
              <Button asChild className="mt-5 rounded-none bg-forest text-forest-ink hover:bg-terracotta hover:text-terracotta-ink">
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