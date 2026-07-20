import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import flyerAsset from "@/assets/rtwl-flyer.png.asset.json";
import vinylAsset from "@/assets/img-vinyl.webp.asset.json";
import creekAsset from "@/assets/img-creek.webp.asset.json";
import shelterAsset from "@/assets/img-shelter.webp.asset.json";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "The Story — Run Takoma With Love 5K · GRYT Club" },
      {
        name: "description",
        content:
          "The true story behind Run Takoma With Love — how an album became a 5K, the friendship behind it, the vision for the day, and the full race-day agenda. Sunday, August 2, 2026 · Takoma Park, MD.",
      },
      { property: "og:title", content: "The Story — Run Takoma With Love 5K" },
      {
        property: "og:description",
        content:
          "How an album became a starting line. Sunday, August 2, 2026 · Takoma-Piney Branch Local Park · 100 runners, free RSVP.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: flyerAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: flyerAsset.url },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [countdownText, setCountdownText] = useState<string | null>(null);
  const [shareLabel, setShareLabel] = useState("Copy the invite ♡");
  const [stickyHidden, setStickyHidden] = useState(false);

  // countdown
  useEffect(() => {
    const race = new Date("2026-08-02T08:30:00-04:00").getTime();
    const days = Math.ceil((race - Date.now()) / 86_400_000);
    if (days > 1) setCountdownText(`· ${days} days to go`);
    else if (days === 1) setCountdownText("· tomorrow ♡");
    else if (days === 0) setCountdownText("· today ♡");
  }, []);

  // reveal on scroll + active nav + sticky hide near CTA
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('.topbar__nav a[href^="#"]')
    );
    const map = new Map(links.map((a) => [a.getAttribute("href")!.slice(1), a]));
    const spy = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            const l = map.get(e.target.id);
            if (l) l.classList.add("is-active");
          }
        }),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    map.forEach((_, id) => {
      const s = root.querySelector(`#${CSS.escape(id)}`);
      if (s) spy.observe(s);
    });

    const cta = root.querySelector("#register");
    let ctaIo: IntersectionObserver | null = null;
    if (cta) {
      ctaIo = new IntersectionObserver((es) =>
        es.forEach((e) => setStickyHidden(e.isIntersecting))
      );
      ctaIo.observe(cta);
    }

    return () => {
      io.disconnect();
      spy.disconnect();
      ctaIo?.disconnect();
    };
  }, []);

  async function copyInvite() {
    const invite =
      "Doing a free community 5K in Takoma Park with me? Sunday, Aug 2 — check-in 8:30 AM, walk/run 9:15. 100 spots only: https://grytrun.com ♡";
    try {
      if (navigator.share) {
        await navigator.share({ text: invite, url: "https://grytrun.com" });
      } else {
        await navigator.clipboard.writeText(invite);
      }
      setShareLabel("Copied — now go send it ♡");
      setTimeout(() => setShareLabel("Copy the invite ♡"), 3000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rtwl-page" ref={rootRef}>
      <style>{CSS_TEXT}</style>

      <header className="topbar">
        <span className="topbar__brand">GRYT CLUB · 5K SERIES</span>
        <nav className="topbar__nav" aria-label="Sections">
          <a href="#story">The Story</a>
          <a href="#vision">The Vision</a>
          <a href="#day">The Day</a>
          <a href="#park">The Park</a>
          <a href="#faq">FAQ</a>
          <Link to="/" className="topbar__cta">Register</Link>
        </nav>
        <span className="topbar__date">08 · 02 · 2026</span>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero__inner">
            <figure className="hero__poster reveal">
              <img
                src={flyerAsset.url}
                alt="Run Takoma With Love 5K poster featuring Oddisee and Heno. among the greenery of Takoma Park"
                width={1100}
                height={1100}
              />
            </figure>
            <div className="hero__copy">
              <p className="kicker reveal">
                <span className="kicker__rule" />
                Presented by GRYT
                <span className="kicker__rule" />
              </p>
              <h1 className="hero__title reveal">
                <span className="hero__line1">
                  Run <em>Takoma</em>
                </span>
                <span className="hero__line2">
                  with love <span className="heart">♡</span>
                </span>
                <span className="hero__line3">5K</span>
              </h1>
              <p className="badge badge--green reveal">
                Sunday · August 2, 2026 · Check-in 8:30 AM
              </p>
              <p className="hero__place reveal">
                Takoma Park, Maryland{" "}
                {countdownText ? (
                  <span className="countdown">{countdownText}</span>
                ) : null}
              </p>
              <p className="hero__lede reveal">
                Every good race starts with a story. This one starts with an
                album, a friendship, and a park worth loving out loud. Scroll
                for ours.
              </p>
              <div className="hero__actions reveal">
                <Link className="btn-torn" to="/">
                  Register | grytrun.com
                </Link>
                <a className="hero__scroll" href="#story">
                  Read the story ↓
                </a>
              </div>
              <div className="quick reveal">
                <a
                  className="quick__link"
                  href="/rtwl.ics"
                  download="run-takoma-with-love.ics"
                >
                  ＋ Add to calendar
                </a>
                <span className="quick__sep">·</span>
                <a
                  className="quick__link"
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Run+Takoma+With+Love+5K&dates=20260802T123000Z/20260802T180000Z&details=Free+community+5K+walk%2Frun+%2B+park+gathering.+Check-in+8%3A30+AM%2C+walk%2Frun+9%3A15+AM.+Details+and+registration%3A+grytrun.com&location=Takoma-Piney+Branch+Local+Park%2C+Takoma+Park%2C+MD"
                  target="_blank"
                  rel="noopener"
                >
                  Google Calendar
                </a>
                <span className="quick__sep">·</span>
                <a
                  className="quick__link"
                  href="https://www.google.com/maps/search/?api=1&query=Takoma-Piney+Branch+Local+Park+Takoma+Park+MD"
                  target="_blank"
                  rel="noopener"
                >
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            <span>
              ♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;
            </span>
            <span>
              ♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;♡ &nbsp;Community. &nbsp;Movement. &nbsp;Takoma. &nbsp;
            </span>
          </div>
        </div>

        {/* STORY */}
        <section className="section" id="story">
          <div className="container">
            <p className="kicker reveal">
              <span className="kicker__rule" />
              The True Story
              <span className="kicker__rule" />
            </p>
            <h2 className="section__title reveal">It started with an album.</h2>
            <div className="split">
              <div className="split__text reveal">
                <p>
                  On April 30, 2026, Oddisee and Heno. released{" "}
                  <em className="album">From Takoma With Love</em> on Outer Note
                  — twelve tracks written as a love letter to Takoma Park. Songs
                  about the block, the diaspora, the long unglamorous work of
                  becoming who you are.
                </p>
                <p>
                  It's music made for early mornings. Lush, jazzy, patient. The
                  kind of record that ends and leaves you wanting to move.
                </p>
                <p>Four hundred miles away in Pittsburgh, one listener took that literally.</p>
              </div>
              <figure className="split__media tilt-r reveal">
                <img
                  src={vinylAsset.url}
                  alt="A vinyl record on a turntable beside worn olive running shoes and a blank race bib"
                  loading="lazy"
                  width={1600}
                  height={1200}
                />
                <figcaption>
                  The album is the love letter. The run is how we read it out loud.
                </figcaption>
              </figure>
            </div>
            <div className="listen reveal">
              <div className="listen__copy">
                <p className="listen__script">press play, lace up ♡</p>
                <h3 className="listen__title">Hear where it all started.</h3>
                <p className="listen__note">
                  Twelve tracks for the training block — start it now, thank us
                  at the finish line.
                </p>
              </div>
              <div className="listen__player">
                <iframe
                  title="Spotify Embed: From Takoma With Love — Oddisee and Heno."
                  src="https://open.spotify.com/embed/album/71c0PWXhJIn5mj5hyiUhrz"
                  width="100%"
                  height={352}
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FRIENDSHIP */}
        <section className="section section--tint" id="friendship">
          <div className="container">
            <p className="kicker reveal">
              <span className="kicker__rule" />
              Nick × Heno.
              <span className="kicker__rule" />
            </p>
            <h2 className="section__title reveal">
              Two builders. One long friendship.
            </h2>
            <div className="split split--flip">
              <div className="split__text reveal">
                <p>
                  Years before this starting line, Nick Merich and Heno. met
                  through SongLink — the music-tech company Nick founded and
                  later sold. The friendship deepened in the trenches of Nick's
                  growth years at Mint Songs and Kids AI, where the two worked
                  side by side building things that didn't exist yet.
                </p>
                <p>
                  That's where the trust comes from. Not a cold email. Not a
                  booking agent. A decade of shipping hard things together.
                </p>
                <p>
                  Nick went on to found <strong>GRYT Club</strong>, a running
                  community built around one idea: <em>do hard things, together.</em>{" "}
                  So when <em className="album">From Takoma With Love</em>{" "}
                  dropped, the call was a short one — bring the album home to
                  the park it was written for, as a run.
                </p>
              </div>
              <blockquote className="pull reveal">
                <p>
                  “Heno. made a record about where he's from. We're making a
                  morning about it.”
                </p>
                <cite>— Nick Merich, GRYT Club</cite>
              </blockquote>
            </div>
            <dl className="credits reveal">
              <div>
                <dt>Produced by</dt>
                <dd>Nick &amp; Laura Merich</dd>
              </div>
              <div>
                <dt>Operated by</dt>
                <dd>GRYT Club</dd>
              </div>
              <div>
                <dt>Community co-partner</dt>
                <dd>Heno.</dd>
              </div>
              <div>
                <dt>Inspired by</dt>
                <dd>
                  <em className="album">From Takoma With Love</em> · Oddisee and
                  Heno. · Outer Note
                </dd>
              </div>
              <div>
                <dt>Hydration</dt>
                <dd>
                  <span className="water">smartwater</span>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* FULL BLEED */}
        <figure className="bleed">
          <img
            src={creekAsset.url}
            alt="Morning sun and mist over a tree-lined creekside trail"
            loading="lazy"
            width={1600}
            height={900}
          />
          <figcaption>
            <span className="bleed__label">Sligo Creek · Sunday Morning</span>
            <span className="bleed__script">run quiet, run together ♡</span>
          </figcaption>
        </figure>

        {/* VISION */}
        <section className="section" id="vision">
          <div className="container">
            <p className="kicker reveal">
              <span className="kicker__rule" />
              The Vision
              <span className="kicker__rule" />
            </p>
            <h2 className="section__title reveal">Small, on purpose.</h2>
            <p className="section__lede reveal">
              Most races want to be bigger every year. This one wants to be
              better. One hundred people, one park, one morning — built so that
              nobody finishes anonymous.
            </p>
            <div className="cards">
              <article className="card reveal">
                <span className="card__num">100</span>
                <h3>Runners, not thousands</h3>
                <p>
                  Capped at 100 so every finisher gets cheered home by name.
                  When it's full, it's full — that's the whole point.
                </p>
              </article>
              <article className="card reveal">
                <span className="card__num">$0</span>
                <h3>Free, all the way</h3>
                <p>
                  Free RSVP, no admission fee, ever. Community events should
                  cost you a Sunday morning, not a paycheck.
                </p>
              </article>
              <article className="card reveal">
                <span className="card__num">♡</span>
                <h3>No stage. No vendor village.</h3>
                <p>
                  Just a park, a route, and neighbors. The soundtrack is
                  footsteps, the creek, and people calling your name.
                </p>
              </article>
              <article className="card reveal">
                <span className="card__num card__num--water">H₂O</span>
                <h3>Water, with love</h3>
                <p>
                  A stocked hydration station at the shelter, supported in-kind
                  by <span className="water">smartwater</span> — plus a second
                  stop on the route the moment the parks team gives it the nod.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* THE DAY */}
        <section className="section section--green" id="day">
          <div className="container">
            <p className="kicker kicker--light reveal">
              <span className="kicker__rule" />
              The Day
              <span className="kicker__rule" />
            </p>
            <h2 className="section__title reveal">
              Sunday, August 2 — how it runs.
            </h2>
            <nav className="glance reveal" aria-label="Day at a glance">
              <a className="glance__item" href="#t-830">
                <span className="glance__time">8:30</span>Check-in
              </a>
              <a className="glance__item glance__item--hot" href="#t-915">
                <span className="glance__time">9:15</span>Walk/run ♡
              </a>
              <a className="glance__item" href="#t-1030">
                <span className="glance__time">10:30</span>Return + water
              </a>
              <a className="glance__item" href="#t-1130">
                <span className="glance__time">11:30</span>Gathering
              </a>
              <a className="glance__item" href="#t-1245">
                <span className="glance__time">12:45</span>Closing
              </a>
              <a className="glance__item" href="#t-1400">
                <span className="glance__time">2:00</span>Wind down
              </a>
            </nav>
            <div className="day">
              <ol className="agenda">
                <li className="reveal" id="t-830">
                  <span className="agenda__time">8:30 AM</span>
                  <div>
                    <h3>Check-in opens</h3>
                    <p>
                      At the covered picnic shelter — our HQ for the day. Grab
                      your bib, say hi to a stranger. ADA parking and accessible
                      paths stay clear all morning.
                    </p>
                  </div>
                </li>
                <li className="reveal">
                  <span className="agenda__time">9:00 AM</span>
                  <div>
                    <h3>Welcome + safety circle</h3>
                    <p>
                      Why we're here, how the route works, and a thank-you to
                      the volunteers in the bright vests. Then we stage in calm,
                      easy waves.
                    </p>
                  </div>
                </li>
                <li className="reveal agenda__start" id="t-915">
                  <span className="agenda__time">9:15 AM</span>
                  <div>
                    <h3>Walk/run begins ♡</h3>
                    <p>
                      Out through the park to the open parkway and back —
                      marshals at every turn and both road crossings. Run it,
                      jog it, walk it: every pace is the right pace.
                    </p>
                  </div>
                </li>
                <li className="reveal" id="t-1030">
                  <span className="agenda__time">10:30 AM</span>
                  <div>
                    <h3>Return + hydration</h3>
                    <p>
                      Everyone funnels back to the shelter for{" "}
                      <span className="water">smartwater</span> and loud
                      cheering. We stay until the last finisher is home.
                    </p>
                  </div>
                </li>
                <li className="reveal">
                  <span className="agenda__time">10:50 AM</span>
                  <div>
                    <h3>Community connection</h3>
                    <p>
                      Lawn time. Introductions, stories, and the strangers you
                      started with turning into people you know.
                    </p>
                  </div>
                </li>
                <li className="reveal" id="t-1130">
                  <span className="agenda__time">11:30 AM</span>
                  <div>
                    <h3>Park gathering</h3>
                    <p>
                      Easy, unhurried time in the park — group photo, catch-up,
                      room to just be neighbors. No stage, nothing amplified.
                    </p>
                  </div>
                </li>
                <li className="reveal">
                  <span className="agenda__time">12:15 PM</span>
                  <div>
                    <h3>Light refreshments</h3>
                    <p>
                      Pre-packaged snacks and water at the shelter while the
                      conversation keeps going — final details land in your
                      runner email.
                    </p>
                  </div>
                </li>
                <li className="reveal" id="t-1245">
                  <span className="agenda__time">12:45 PM</span>
                  <div>
                    <h3>Closing ceremony</h3>
                    <p>
                      Group photo, gratitude, and one last look at the park that
                      started all this.
                    </p>
                  </div>
                </li>
                <li className="reveal" id="t-1400">
                  <span className="agenda__time">2:00 PM</span>
                  <div>
                    <h3>Wind down, with love</h3>
                    <p>
                      By two o'clock we've packed out every sign, cup and crumb.
                      We leave the park better than we found it.
                    </p>
                  </div>
                </li>
              </ol>
              <figure className="day__media tilt-l reveal">
                <img
                  src={shelterAsset.url}
                  alt="Covered picnic shelter set up with a check-in table and water coolers, runners chatting on the sunny lawn beyond"
                  loading="lazy"
                  width={1400}
                  height={1120}
                />
                <figcaption>
                  The shelter is HQ: check-in, water, first aid, gathering,
                  closing remarks.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* THE PARK */}
        <section className="section" id="park">
          <div className="container">
            <p className="kicker reveal">
              <span className="kicker__rule" />
              The Park
              <span className="kicker__rule" />
            </p>
            <h2 className="section__title reveal">
              Takoma-Piney Branch Local Park.
            </h2>
            <div className="split">
              <div className="split__text reveal">
                <p>
                  Tucked where the neighborhood meets the trees, with the Sligo
                  Creek trail corridor breathing right alongside it. The covered
                  shelter anchors the day; the green does the rest.
                </p>
                <ul className="park__facts">
                  <li>
                    <strong>Getting there</strong> — Takoma Park, MD (
                    <a
                      className="inline-link"
                      href="https://www.google.com/maps/search/?api=1&query=Takoma-Piney+Branch+Local+Park+Takoma+Park+MD"
                      target="_blank"
                      rel="noopener"
                    >
                      directions
                    </a>
                    ). Arrive by 8:30 AM. There's an improved lot at the park —
                    ADA spaces stay clear; carpool, bike, or walk if you can.
                  </li>
                  <li>
                    <strong>Facilities</strong> — Existing park restrooms on
                    site. Plan like a trail runner: go before you go.
                  </li>
                  <li>
                    <strong>Bring</strong> — Yourself, a water bottle, a picnic
                    blanket, and someone who said they'd never do a 5K.
                  </li>
                  <li>
                    <strong>Leave</strong> — Nothing. We pack out what we pack
                    in.
                  </li>
                </ul>
                <div className="promise">
                  <p className="promise__title">our promise to the neighborhood ♡</p>
                  <ul className="promise__list">
                    <li>On foot only — no road closures, no shuttles</li>
                    <li>Marshals at every turn and both road crossings</li>
                    <li>Nothing amplified, on the route or at the shelter</li>
                    <li>Driveways, sidewalks and ADA routes stay clear</li>
                    <li>Nothing staged on residential streets — ever</li>
                    <li>Every sign, cup and crumb packed out by 2:00 PM</li>
                  </ul>
                </div>
              </div>
              <figure className="route route--map reveal" aria-label="Course map">
                <p className="route__title">
                  The course — park to the open parkway &amp; back
                </p>
                <CourseMap />
                <div className="route__legend">
                  <span>
                    <i className="lg lg--out" />
                    Out
                  </span>
                  <span>
                    <i className="lg lg--back" />
                    Back
                  </span>
                  <span>
                    <i className="lg lg--marshal" />
                    Marshal
                  </span>
                  <span>
                    <i className="lg lg--cross" />
                    Crossing
                  </span>
                  <span>
                    <i className="lg lg--water" />
                    Water
                  </span>
                </div>
                <figcaption>
                  ≈3.1 miles on foot, marshaled at every turn and both
                  crossings. Sketch, not to scale — the official route map lands
                  in your runner email.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section--tint" id="faq">
          <div className="container container--narrow">
            <p className="kicker reveal">
              <span className="kicker__rule" />
              Good Questions
              <span className="kicker__rule" />
            </p>
            <h2 className="section__title reveal">
              Everything else you'd ask.
            </h2>
            <div className="faq reveal">
              {FAQ_ITEMS.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <span className="faq__mark">♡</span>
                  </summary>
                  <p dangerouslySetInnerHTML={{ __html: a }} />
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* REGISTER */}
        <section className="cta" id="register">
          <div className="container cta__inner">
            <p className="kicker kicker--light reveal">
              <span className="kicker__rule" />
              Sunday · August 2, 2026 · Check-in 8:30 AM
              <span className="kicker__rule" />
            </p>
            <h2 className="cta__title reveal">
              100 spots.
              <br />
              <span className="cta__script">that's the whole point ♡</span>
            </h2>
            <p className="cta__lede reveal">
              Free RSVP. When it's full, it's full. Grab your spot and bring
              somebody.
            </p>
            <Link className="btn-torn btn-torn--big reveal" to="/">
              Register | grytrun.com
            </Link>
            <div className="share reveal">
              <span className="share__script">
                know somebody who needs this morning?
              </span>
              <button
                type="button"
                className="share__btn"
                onClick={copyInvite}
              >
                {shareLabel}
              </button>
            </div>
          </div>
        </section>
      </main>

      <div
        className={`stickybar${stickyHidden ? " stickybar--hide" : ""}`}
        role="complementary"
        aria-label="Register"
      >
        <span className="stickybar__date">
          Aug 2 · Check-in 8:30
          <span className="stickybar__sub">Takoma Park, MD</span>
        </span>
        <Link className="stickybar__cta" to="/">
          Register ♡
        </Link>
      </div>

      <footer className="footer">
        <span>© GRYT Club · Takoma Park, MD</span>
        <span className="footer__script">doing hard things, together ♡</span>
        <span>grytrun.com · @grytrunclub</span>
      </footer>
    </div>
  );
}

const FAQ_ITEMS: [string, string][] = [
  [
    "Is it really free?",
    "Really. Free RSVP, no admission fee, ever. Your only job is to show up and bring your best Sunday-morning energy.",
  ],
  [
    "I'm slow. Can I walk it?",
    "Yes — run, jog, walk, stroll. Every pace is the right pace, and we hold the finish line open until the last person is home. Walkers are runners here.",
  ],
  [
    "I've never done a 5K. Is this for me?",
    "This is exactly for you. A 5K is 3.1 miles, the course is gentle, and a hundred people will be cheering your name by the end. First-timers get the loudest finish.",
  ],
  [
    "What should I bring?",
    "Yourself, a water bottle, a picnic blanket, and someone who swore they'd never do a 5K. Carry your bottle for the route — the shelter has water, first aid, and the gathering after.",
  ],
  [
    "What about parking and restrooms?",
    "There's an improved lot at the park, and ADA spaces and accessible routes stay clear all day. Arrive by 8:30 AM and carpool, bike, or walk if you can — it's a neighborhood park, so be a good neighbor. Existing park restrooms are on site.",
  ],
  [
    "What if it rains?",
    "We run rain or shine — the shelter is covered for a reason. If weather ever makes the course unsafe, every registered runner gets an email update the moment we know.",
  ],
  [
    "Is this an official, permitted event?",
    "Yes — the day runs as a permitted community walk/run and park gathering with Montgomery Parks. Small footprint, volunteer marshals at the road crossings, nothing amplified, and a full leave-no-trace cleanup by 2:00 PM.",
  ],
  [
    "Can I volunteer instead of run?",
    'Please. A crew of 6–10 makes the morning work — route marshals, check-in, water, cleanup. RSVP at <a class="inline-link" href="/">grytrun.com</a> and tell us you want a vest instead of a bib.',
  ],
  [
    "Dogs and strollers?",
    "Leashed dogs and strollers are welcome at a walking pace — just line up toward the back at the start so everyone gets a clean first quarter mile.",
  ],
];

function CourseMap() {
  return (
    <svg
      viewBox="0 0 560 664"
      role="img"
      aria-label="Course map: start and finish at the Takoma-Piney Branch Local Park shelter, out through the park to the open parkway and back, with volunteer marshals along the route, two marshaled road crossings, water at the shelter and an optional route water stop pending approval"
    >
      <defs>
        <marker
          id="arrOut"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" className="cmap__arr cmap__arr--out" />
        </marker>
        <marker
          id="arrBack"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" className="cmap__arr cmap__arr--back" />
        </marker>
      </defs>
      <g className="cmap__compass" transform="translate(48,540)">
        <line x1="0" y1="22" x2="0" y2="-14" />
        <path d="M-7 -8 L0 -22 L7 -8 z" />
        <text x="0" y="42" textAnchor="middle" className="cmap__lbl">
          N
        </text>
      </g>
      <path
        className="cmap__creek"
        d="M150 14 C 118 90, 192 146, 160 214 C 128 284, 202 332, 174 402 C 148 472, 224 522, 206 632"
      />
      <path
        className="cmap__creek cmap__creek--line"
        d="M150 14 C 118 90, 192 146, 160 214 C 128 284, 202 332, 174 402 C 148 472, 224 522, 206 632"
      />
      <text className="cmap__hand" transform="translate(112,262) rotate(-72)">
        sligo creek
      </text>
      <path className="cmap__road cmap__pkwy" d="M96 84 L470 30" />
      <path className="cmap__road cmap__pkwy" d="M100 106 L474 52" />
      <text
        className="cmap__hand cmap__hand--road"
        transform="translate(148,68) rotate(-8.2)"
      >
        the open parkway — car-free
      </text>
      <path className="cmap__out" markerEnd="url(#arrOut)" d="M238 75 L408 50" />
      <path className="cmap__back" markerEnd="url(#arrBack)" d="M404 58 L244 84" />
      <path className="cmap__road" d="M186 386 L364 342" />
      <text x="372" y="352" className="cmap__lbl cmap__lbl--muted">
        ROAD CROSSING
      </text>
      <path className="cmap__road" d="M164 196 L340 158" />
      <text x="348" y="168" className="cmap__lbl cmap__lbl--muted">
        ROAD CROSSING
      </text>
      <path
        className="cmap__park"
        d="M258 500 C 300 468, 420 466, 468 496 C 512 524, 512 588, 468 612 C 408 640, 300 636, 262 600 C 232 570, 230 524, 258 500 z"
      />
      <text
        x="368"
        y="656"
        textAnchor="middle"
        className="cmap__lbl cmap__lbl--park"
      >
        TAKOMA-PINEY BRANCH LOCAL PARK
      </text>
      <g transform="translate(438,524)">
        <path
          className="cmap__shelter"
          d="M-16 8 L-16 -4 L0 -16 L16 -4 L16 8 z"
        />
        <text x="0" y="26" textAnchor="middle" className="cmap__lbl cmap__lbl--muted">
          SHELTER · HQ
        </text>
      </g>
      <path
        className="cmap__out"
        markerEnd="url(#arrOut)"
        d="M312 524 C 330 470, 248 428, 266 360 C 282 296, 214 246, 238 176 C 252 132, 226 100, 232 84"
      />
      <path
        className="cmap__back"
        markerEnd="url(#arrBack)"
        d="M246 88 C 240 104, 266 134, 252 178 C 228 248, 296 298, 280 362 C 262 430, 344 470, 326 522"
      />
      <g className="cmap__cross" transform="translate(273,362)">
        <line x1="-6" y1="-6" x2="6" y2="6" />
        <line x1="-6" y1="6" x2="6" y2="-6" />
      </g>
      <g className="cmap__cross" transform="translate(245,178)">
        <line x1="-6" y1="-6" x2="6" y2="6" />
        <line x1="-6" y1="6" x2="6" y2="-6" />
      </g>
      <circle className="cmap__marshal" cx="318" cy="498" r="5.5" />
      <circle className="cmap__marshal" cx="258" cy="414" r="5.5" />
      <circle className="cmap__marshal" cx="262" cy="374" r="5.5" />
      <circle className="cmap__marshal" cx="272" cy="318" r="5.5" />
      <circle className="cmap__marshal" cx="222" cy="242" r="5.5" />
      <circle className="cmap__marshal" cx="233" cy="190" r="5.5" />
      <circle className="cmap__marshal" cx="238" cy="118" r="5.5" />
      <g transform="translate(352,498)">
        <path
          className="cmap__water"
          d="M0 -9 C 5 -2, 7 2, 7 5 a7 7 0 1 1 -14 0 C -7 2, -5 -2, 0 -9 z"
        />
        <text x="14" y="5" className="cmap__lbl cmap__lbl--water">
          WATER
        </text>
      </g>
      <g transform="translate(296,290)">
        <path
          className="cmap__wpend"
          d="M0 -9 C 5 -2, 7 2, 7 5 a7 7 0 1 1 -14 0 C -7 2, -5 -2, 0 -9 z"
        />
        <text x="14" y="5" className="cmap__lbl cmap__lbl--water">
          WATER · IF APPROVED
        </text>
      </g>
      <g transform="translate(316,572)">
        <rect className="cmap__badge" x="-62" y="-14" width="124" height="30" rx="3" />
        <text x="0" y="7" textAnchor="middle" className="cmap__badgetxt">
          START / FINISH ♡
        </text>
      </g>
      <text
        className="cmap__lbl cmap__lbl--muted"
        transform="translate(222,296) rotate(82)"
      >
        SLIGO CREEK TRAIL
      </text>
    </svg>
  );
}

// Scoped design-system CSS for the Story page.
const CSS_TEXT = `
.rtwl-page{
  --paper: oklch(0.972 0.012 85);
  --paper-2: oklch(0.95 0.02 95);
  --ink: oklch(0.2 0.01 60);
  --muted: oklch(0.52 0.02 70);
  --green: oklch(0.34 0.045 165);
  --green-deep: oklch(0.28 0.045 165);
  --rust: oklch(0.6 0.15 32);
  --rust-deep: oklch(0.52 0.14 32);
  --water: oklch(0.55 0.11 245);
  --display: "Bebas Neue", sans-serif;
  --script: "Caveat Brush", cursive;
  --serif: "Playfair Display", serif;
  --body: "Inter", sans-serif;
  --torn: polygon(1.5% 8%, 4% 0%, 96% 2%, 99.5% 12%, 98% 88%, 99% 96%, 95% 100%, 3% 98%, 0.5% 90%);
  --container: 1120px;
  font-family:var(--body);font-size:16px;line-height:1.65;color:var(--ink);background:var(--paper);
}
.rtwl-page *{box-sizing:border-box}
.rtwl-page img{display:block;max-width:100%;height:auto}
.rtwl-page a{color:inherit}
.rtwl-page .container{max-width:var(--container);margin:0 auto;padding:0 24px}
.rtwl-page .container--narrow{max-width:820px}
.rtwl-page section[id]{scroll-margin-top:76px}
.rtwl-page [id^="t-"]{scroll-margin-top:88px}
.rtwl-page a:focus-visible,.rtwl-page button:focus-visible,.rtwl-page summary:focus-visible{outline:3px solid var(--rust);outline-offset:3px;border-radius:2px}
.rtwl-page .inline-link{color:var(--rust);text-decoration-color:oklch(from var(--rust) l c h / .5)}
.rtwl-page .inline-link:hover{text-decoration-color:var(--rust)}
.rtwl-page .heart{color:var(--rust);font-style:normal}
.rtwl-page .water{color:var(--water);font-weight:600}
.rtwl-page .album{font-family:var(--serif);font-style:italic}
.rtwl-page .reveal{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
.rtwl-page .reveal.is-in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){
  .rtwl-page .reveal{opacity:1;transform:none;transition:none}
  .rtwl-page .marquee__track{animation:none}
}
.rtwl-page .topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 28px;font-family:var(--display);font-size:15px;letter-spacing:.22em;color:var(--rust);position:sticky;top:0;z-index:50;background:oklch(from var(--paper) l c h / .88);backdrop-filter:blur(10px)}
.rtwl-page .topbar__brand{color:var(--green)}
.rtwl-page .topbar__nav{display:flex;gap:26px}
.rtwl-page .topbar__nav a{text-decoration:none;color:var(--ink);transition:color .2s;border-bottom:2px solid transparent;padding-bottom:2px}
.rtwl-page .topbar__nav a:hover{color:var(--rust)}
.rtwl-page .topbar__nav a.is-active{color:var(--rust);border-bottom-color:var(--rust)}
.rtwl-page .topbar__cta{color:var(--rust) !important;border-bottom:2px solid var(--rust)}
.rtwl-page .hero{padding:clamp(40px,7vw,90px) 0 clamp(48px,7vw,96px)}
.rtwl-page .hero__inner{max-width:var(--container);margin:0 auto;padding:0 24px;display:grid;grid-template-columns:minmax(0,460px) minmax(0,1fr);gap:clamp(32px,5vw,72px);align-items:center}
.rtwl-page .hero__poster{background:var(--green);padding:12px;transform:rotate(-2deg);box-shadow:14px 18px 0 oklch(from var(--green) l c h / .16)}
.rtwl-page .hero__poster img{width:100%}
.rtwl-page .kicker{display:flex;align-items:center;justify-content:flex-start;gap:14px;font-family:var(--display);font-size:14px;letter-spacing:.3em;color:var(--rust);margin-bottom:18px;text-transform:uppercase}
.rtwl-page .kicker__rule{display:block;width:44px;height:2px;background:var(--rust)}
.rtwl-page .kicker--light{color:var(--paper-2)}
.rtwl-page .kicker--light .kicker__rule{background:var(--rust)}
.rtwl-page .hero__title{font-family:var(--display);line-height:.92;font-weight:400;margin-bottom:26px}
.rtwl-page .hero__line1{display:block;font-size:clamp(56px,7.5vw,104px);color:var(--green);letter-spacing:.01em}
.rtwl-page .hero__line1 em{font-style:normal;color:var(--rust)}
.rtwl-page .hero__line2{display:block;font-family:var(--script);font-size:clamp(38px,4.6vw,62px);color:var(--green);margin:6px 0 2px}
.rtwl-page .hero__line3{display:block;font-size:clamp(48px,6vw,84px);color:var(--green)}
.rtwl-page .badge{display:inline-block;font-family:var(--display);font-size:clamp(16px,1.6vw,20px);letter-spacing:.14em;padding:10px 22px;clip-path:var(--torn)}
.rtwl-page .badge--green{background:var(--green);color:var(--paper)}
.rtwl-page .hero__place{font-family:var(--display);letter-spacing:.24em;font-size:16px;color:var(--rust);margin:16px 0 14px;text-transform:uppercase}
.rtwl-page .countdown{color:var(--green);white-space:nowrap}
.rtwl-page .hero__lede{max-width:46ch;color:var(--muted);margin-bottom:26px}
.rtwl-page .hero__actions{display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.rtwl-page .btn-torn{display:inline-block;background:var(--rust);color:var(--paper);font-family:var(--display);font-size:18px;letter-spacing:.16em;text-transform:uppercase;padding:14px 30px;text-decoration:none;clip-path:var(--torn);transition:background .2s, transform .2s}
.rtwl-page .btn-torn:hover{background:var(--rust-deep);transform:translateY(-2px)}
.rtwl-page .btn-torn--big{font-size:22px;padding:18px 42px}
.rtwl-page .hero__scroll{font-family:var(--display);letter-spacing:.18em;font-size:15px;color:var(--green);text-decoration:none;border-bottom:2px solid var(--green);text-transform:uppercase}
.rtwl-page .hero__scroll:hover{color:var(--rust);border-color:var(--rust)}
.rtwl-page .quick{margin-top:22px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.rtwl-page .quick__link{font-size:13.5px;font-weight:600;color:var(--muted);text-decoration:none;border-bottom:1px solid oklch(from var(--muted) l c h / .4);transition:color .2s,border-color .2s}
.rtwl-page .quick__link:hover{color:var(--rust);border-color:var(--rust)}
.rtwl-page .quick__sep{color:var(--muted)}
.rtwl-page .marquee{background:var(--rust);color:var(--paper);overflow:hidden;white-space:nowrap;padding:14px 0;clip-path:polygon(0 12%, 3% 4%, 12% 10%, 25% 2%, 40% 9%, 55% 1%, 70% 8%, 85% 2%, 97% 9%, 100% 4%, 100% 90%, 96% 98%, 84% 92%, 68% 99%, 52% 92%, 36% 99%, 20% 93%, 8% 99%, 0 94%)}
.rtwl-page .marquee__track{display:inline-flex;animation:rtwlScroll 30s linear infinite}
.rtwl-page .marquee:hover .marquee__track{animation-play-state:paused}
.rtwl-page .marquee__track span{font-family:var(--display);font-size:17px;letter-spacing:.34em;text-transform:uppercase;padding-right:2em}
@keyframes rtwlScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.rtwl-page .section{padding:clamp(64px,9vw,128px) 0}
.rtwl-page .section--tint{background:var(--paper-2)}
.rtwl-page .section--green{background:var(--green);color:var(--paper)}
.rtwl-page .section__title{font-family:var(--display);font-weight:400;font-size:clamp(36px,4.6vw,60px);line-height:1;margin-bottom:20px;color:var(--green);letter-spacing:.01em}
.rtwl-page .section--green .section__title{color:var(--paper)}
.rtwl-page .section__lede{max-width:60ch;color:var(--muted);margin-bottom:44px}
.rtwl-page .split{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(32px,5vw,72px);align-items:center;margin-top:28px}
.rtwl-page .split--flip{grid-template-columns:.95fr 1.05fr}
.rtwl-page .split__text p{margin-bottom:18px;max-width:58ch}
.rtwl-page .split__text p:last-child{margin-bottom:0}
.rtwl-page .split__media{transform:rotate(1.5deg)}
.rtwl-page .tilt-r{transform:rotate(1.8deg)}
.rtwl-page .tilt-l{transform:rotate(-1.8deg)}
.rtwl-page .split__media img,.rtwl-page .day__media img{border:10px solid var(--green);box-shadow:12px 14px 0 oklch(from var(--green) l c h / .14)}
.rtwl-page figcaption{font-family:var(--script);font-size:20px;color:var(--rust);margin-top:14px;text-align:center}
.rtwl-page .listen{margin-top:clamp(48px,6vw,80px);display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(28px,4vw,56px);align-items:center;background:var(--green);color:var(--paper);padding:clamp(28px,4vw,48px);clip-path:var(--torn)}
.rtwl-page .listen__script{font-family:var(--script);font-size:26px;color:oklch(0.82 0.11 45);margin-bottom:6px}
.rtwl-page .listen__title{font-family:var(--display);font-weight:400;font-size:clamp(26px,3vw,38px);letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px}
.rtwl-page .listen__note{font-size:14.5px;color:oklch(from var(--paper) l c h / .8);max-width:38ch}
.rtwl-page .listen__player iframe{display:block;border:0;border-radius:12px}
@media (max-width: 820px){.rtwl-page .listen{grid-template-columns:1fr}}
.rtwl-page .pull{border-left:4px solid var(--rust);padding:8px 0 8px 28px;align-self:center}
.rtwl-page .pull p{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(22px,2.4vw,30px);line-height:1.4;color:var(--green);margin-bottom:14px}
.rtwl-page .pull cite{font-family:var(--display);font-style:normal;letter-spacing:.2em;font-size:14px;color:var(--rust);text-transform:uppercase}
.rtwl-page .credits{margin-top:clamp(40px,5vw,64px);display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px 32px;border-top:2px solid var(--ink);padding-top:28px}
.rtwl-page .credits dt{font-family:var(--display);letter-spacing:.22em;font-size:13px;color:var(--rust);text-transform:uppercase;margin-bottom:6px}
.rtwl-page .credits dd{font-size:15px;line-height:1.5}
.rtwl-page .bleed{position:relative;margin:0}
.rtwl-page .bleed img{width:100%;height:clamp(320px,55vh,560px);object-fit:cover}
.rtwl-page .bleed figcaption{position:absolute;inset:auto 0 0 0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:28px 24px 30px;margin:0;background:linear-gradient(transparent, oklch(0.2 0.01 60 / .65))}
.rtwl-page .bleed__label{font-family:var(--display);letter-spacing:.3em;font-size:15px;color:var(--paper);text-transform:uppercase}
.rtwl-page .bleed__script{font-family:var(--script);font-size:26px;color:var(--paper-2)}
.rtwl-page .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:44px}
.rtwl-page .card{background:var(--paper-2);padding:30px 24px 28px;clip-path:var(--torn);border-top:none}
.rtwl-page .card__num{display:block;font-family:var(--display);font-size:44px;line-height:1;color:var(--rust);margin-bottom:12px}
.rtwl-page .card__num--water{color:var(--water)}
.rtwl-page .card h3{font-family:var(--display);font-weight:400;font-size:21px;letter-spacing:.05em;color:var(--green);margin-bottom:10px;text-transform:uppercase}
.rtwl-page .card p{font-size:14.5px;color:var(--muted)}
.rtwl-page .section--green .section__lede{color:oklch(from var(--paper) l c h / .8)}
.rtwl-page .day{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(36px,5vw,80px);align-items:start;margin-top:40px}
.rtwl-page .agenda{list-style:none;position:relative;padding-left:0;margin:0}
.rtwl-page .agenda li{display:grid;grid-template-columns:116px 1fr;gap:38px;padding:0 0 26px 0;position:relative}
.rtwl-page .agenda li::before{content:"";position:absolute;left:132px;top:10px;bottom:-4px;width:2px;background:oklch(from var(--paper) l c h / .25)}
.rtwl-page .agenda li:last-child::before{display:none}
.rtwl-page .agenda li::after{content:"";position:absolute;left:126px;top:6px;width:14px;height:14px;border-radius:50%;background:var(--rust);border:3px solid var(--green)}
.rtwl-page .agenda__time{font-family:var(--display);font-size:19px;letter-spacing:.08em;color:var(--paper-2);text-align:right;padding-right:34px;padding-top:1px;white-space:nowrap}
.rtwl-page .agenda h3{font-family:var(--display);font-weight:400;font-size:21px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;color:var(--paper)}
.rtwl-page .agenda p{font-size:14.5px;color:oklch(from var(--paper) l c h / .78);max-width:44ch}
.rtwl-page .agenda__start h3{color:oklch(0.82 0.11 45)}
.rtwl-page .day__media img{border-color:var(--paper)}
.rtwl-page .day__media figcaption{color:var(--paper-2)}
.rtwl-page .park__facts{list-style:none;margin-top:22px;display:grid;gap:14px;padding:0}
.rtwl-page .park__facts li{padding-left:26px;position:relative;font-size:15px;color:var(--muted)}
.rtwl-page .park__facts li::before{content:"♡";position:absolute;left:0;color:var(--rust)}
.rtwl-page .park__facts strong{color:var(--ink)}
.rtwl-page .route{background:var(--paper-2);padding:28px 20px 20px;clip-path:var(--torn)}
.rtwl-page .route svg{width:100%;height:auto}
.rtwl-page .route figcaption{font-size:18px}
.rtwl-page .route--map{padding:26px 26px 22px}
.rtwl-page .route__title{font-family:var(--display);font-size:22px;letter-spacing:.08em;text-transform:uppercase;color:var(--green);margin-bottom:14px}
.rtwl-page .cmap__creek{fill:none;stroke:var(--water);stroke-width:16;opacity:.22;stroke-linecap:round}
.rtwl-page .cmap__creek--line{stroke-width:2.5;opacity:.6}
.rtwl-page .cmap__out{fill:none;stroke:var(--green);stroke-width:3.5;stroke-dasharray:1 8;stroke-linecap:round}
.rtwl-page .cmap__back{fill:none;stroke:var(--rust);stroke-width:3.5;stroke-dasharray:1 8;stroke-linecap:round}
.rtwl-page .cmap__arr--out{fill:var(--green)}
.rtwl-page .cmap__arr--back{fill:var(--rust)}
.rtwl-page .cmap__park{fill:oklch(from var(--green) l c h / .09);stroke:var(--green);stroke-width:1.5;stroke-dasharray:5 6}
.rtwl-page .cmap__shelter{fill:var(--paper);stroke:var(--green);stroke-width:2.5}
.rtwl-page .cmap__water{fill:var(--water)}
.rtwl-page .cmap__compass line{stroke:var(--muted);stroke-width:2}
.rtwl-page .cmap__compass path{fill:var(--muted)}
.rtwl-page .cmap__badge{fill:var(--green)}
.rtwl-page .cmap__badgetxt{font-family:var(--display);font-size:14px;letter-spacing:.14em;fill:var(--paper)}
.rtwl-page .cmap__hand{font-family:var(--script);font-size:21px;fill:var(--water)}
.rtwl-page .cmap__lbl{font-family:var(--display);font-size:12.5px;letter-spacing:.16em;fill:var(--ink)}
.rtwl-page .cmap__lbl--muted{fill:var(--muted)}
.rtwl-page .cmap__lbl--water{fill:var(--water)}
.rtwl-page .cmap__lbl--park{fill:var(--green);font-size:13.5px}
.rtwl-page .route__legend{display:flex;flex-wrap:wrap;gap:8px 20px;margin:14px 0 10px;font-family:var(--display);font-size:13.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.rtwl-page .route__legend span{display:inline-flex;align-items:center;gap:8px}
.rtwl-page .lg{display:inline-block;width:22px;border-top:3px dashed var(--green)}
.rtwl-page .lg--back{border-color:var(--rust)}
.rtwl-page .lg--water{width:10px;height:10px;border:0;border-radius:50% 50% 50% 0;background:var(--water);transform:rotate(-45deg)}
.rtwl-page .cmap__road{fill:none;stroke:var(--muted);stroke-width:2;opacity:.45}
.rtwl-page .cmap__pkwy{stroke-width:2.5;opacity:.6}
.rtwl-page .cmap__cross line{stroke:var(--ink);stroke-width:3;stroke-linecap:round}
.rtwl-page .cmap__marshal{fill:var(--rust);stroke:var(--paper);stroke-width:1.5}
.rtwl-page .cmap__wpend{fill:none;stroke:var(--water);stroke-width:2;stroke-dasharray:3 3}
.rtwl-page .cmap__hand--road{fill:var(--muted);font-size:19px}
.rtwl-page .lg--marshal{width:11px;height:11px;border:0;border-radius:50%;background:var(--rust)}
.rtwl-page .lg--cross{width:11px;height:11px;border:0;background:linear-gradient(45deg,transparent 42%,var(--ink) 42%,var(--ink) 58%,transparent 58%),linear-gradient(-45deg,transparent 42%,var(--ink) 42%,var(--ink) 58%,transparent 58%)}
.rtwl-page .promise{margin-top:30px;background:var(--green);color:var(--paper);padding:26px 28px 30px;clip-path:var(--torn)}
.rtwl-page .promise__title{font-family:var(--script);font-size:1.5rem;margin:0 0 12px;color:var(--paper)}
.rtwl-page .promise__list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.rtwl-page .promise__list li{font-size:.93rem;line-height:1.5;padding-left:20px;position:relative;opacity:.94}
.rtwl-page .promise__list li::before{content:"♡";position:absolute;left:0;top:0;font-size:.85rem;opacity:.75}
.rtwl-page .glance{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0 2px}
.rtwl-page .glance__item{display:inline-flex;align-items:baseline;gap:9px;text-decoration:none;font-family:var(--display);font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:var(--paper);background:oklch(from var(--paper) l c h / .08);border:1px solid oklch(from var(--paper) l c h / .32);border-radius:999px;padding:9px 18px;transition:background .2s,color .2s,border-color .2s;white-space:nowrap}
.rtwl-page .glance__time{font-size:17px;color:oklch(0.84 0.09 60)}
.rtwl-page .glance__item:hover{background:var(--paper);color:var(--green);border-color:var(--paper)}
.rtwl-page .glance__item:hover .glance__time{color:var(--rust)}
.rtwl-page .glance__item--hot{background:var(--rust);border-color:var(--rust)}
.rtwl-page .glance__item--hot .glance__time{color:var(--paper)}
.rtwl-page .glance__item--hot:hover{background:var(--paper);color:var(--rust);border-color:var(--paper)}
.rtwl-page .faq{margin-top:36px;display:grid;gap:14px}
.rtwl-page .faq details{background:var(--paper);clip-path:var(--torn);padding:0 26px}
.rtwl-page .faq summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;font-family:var(--display);font-size:20px;letter-spacing:.06em;text-transform:uppercase;color:var(--green);padding:20px 0;transition:color .2s}
.rtwl-page .faq summary::-webkit-details-marker{display:none}
.rtwl-page .faq summary:hover{color:var(--rust)}
.rtwl-page .faq__mark{color:var(--rust);transition:transform .3s cubic-bezier(.16,1,.3,1);flex-shrink:0}
.rtwl-page .faq details[open] .faq__mark{transform:rotate(180deg) scale(1.25)}
.rtwl-page .faq details[open] summary{color:var(--rust)}
.rtwl-page .faq details p{padding:0 0 22px;color:var(--muted);font-size:15px;max-width:62ch}
.rtwl-page .cta{background:var(--rust);color:var(--paper);padding:clamp(72px,10vw,140px) 0;text-align:center;clip-path:polygon(0 4%, 4% 0.5%, 15% 3%, 30% 0%, 47% 2.5%, 63% 0.5%, 80% 3%, 93% 0.5%, 100% 3%, 100% 100%, 0 100%)}
.rtwl-page .cta .kicker{justify-content:center;color:var(--paper-2)}
.rtwl-page .cta .kicker__rule{background:var(--paper-2)}
.rtwl-page .cta__title{font-family:var(--display);font-weight:400;font-size:clamp(52px,7vw,96px);line-height:.95;margin-bottom:8px}
.rtwl-page .cta__script{font-family:var(--script);font-size:clamp(30px,3.6vw,48px);display:block;margin-top:10px}
.rtwl-page .cta__lede{margin:18px auto 34px;max-width:44ch;color:oklch(from var(--paper) l c h / .88)}
.rtwl-page .cta .btn-torn{background:var(--green)}
.rtwl-page .cta .btn-torn:hover{background:var(--green-deep)}
.rtwl-page .share{margin-top:34px;display:flex;flex-direction:column;align-items:center;gap:10px}
.rtwl-page .share__script{font-family:var(--script);font-size:24px;color:var(--paper-2)}
.rtwl-page .share__btn{font-family:var(--display);font-size:15px;letter-spacing:.18em;text-transform:uppercase;background:transparent;color:var(--paper);border:2px solid oklch(from var(--paper) l c h / .7);padding:10px 24px;cursor:pointer;transition:background .2s,color .2s}
.rtwl-page .share__btn:hover{background:var(--paper);color:var(--rust)}
.rtwl-page .footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:26px 28px;font-family:var(--display);letter-spacing:.2em;font-size:13px;text-transform:uppercase;color:var(--muted)}
.rtwl-page .footer__script{font-family:var(--script);text-transform:none;letter-spacing:0;font-size:20px;color:var(--rust)}
.rtwl-page .stickybar{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;display:none;align-items:center;justify-content:space-between;gap:14px;background:oklch(from var(--ink) l c h / .92);color:var(--paper);backdrop-filter:blur(8px);padding:12px 16px;border-radius:14px;box-shadow:0 8px 30px oklch(0 0 0 / .25);transition:transform .35s cubic-bezier(.16,1,.3,1),opacity .35s}
.rtwl-page .stickybar--hide{transform:translateY(120%);opacity:0}
.rtwl-page .stickybar__date{font-family:var(--display);font-size:16px;letter-spacing:.1em;display:flex;flex-direction:column;line-height:1.15}
.rtwl-page .stickybar__sub{font-size:11px;letter-spacing:.2em;color:oklch(from var(--paper) l c h / .65)}
.rtwl-page .stickybar__cta{background:var(--rust);color:var(--paper);text-decoration:none;font-family:var(--display);font-size:16px;letter-spacing:.14em;text-transform:uppercase;padding:10px 20px;clip-path:var(--torn);white-space:nowrap}
@media (max-width: 980px){
  .rtwl-page .cards{grid-template-columns:repeat(2,1fr)}
  .rtwl-page .day{grid-template-columns:1fr}
  .rtwl-page .day__media{max-width:560px;margin:8px auto 0}
}
@media (max-width: 820px){
  .rtwl-page .topbar{padding:14px 18px}
  .rtwl-page .topbar__nav{display:none}
  .rtwl-page .hero{padding-top:26px}
  .rtwl-page .hero__inner{grid-template-columns:1fr;gap:30px}
  .rtwl-page .hero__copy{order:1}
  .rtwl-page .hero__poster{order:2;max-width:310px;margin:2px auto 0;transform:rotate(-1.5deg)}
  .rtwl-page .kicker{margin-bottom:12px}
  .rtwl-page .hero__title{margin-bottom:18px}
  .rtwl-page .hero__place{margin:13px 0 10px;font-size:14px;letter-spacing:.18em}
  .rtwl-page .hero__lede{margin-bottom:20px}
  .rtwl-page .quick{margin-top:15px;gap:10px}
  .rtwl-page .glance{gap:8px;overflow-x:auto;flex-wrap:nowrap;padding-bottom:8px;margin-right:-24px;padding-right:24px;scrollbar-width:none}
  .rtwl-page .glance::-webkit-scrollbar{display:none}
  .rtwl-page .glance__item{padding:8px 15px;font-size:14px}
  .rtwl-page .split,.rtwl-page .split--flip{grid-template-columns:1fr}
  .rtwl-page .split__media,.rtwl-page .tilt-r,.rtwl-page .tilt-l{max-width:520px;margin:0 auto}
  .rtwl-page .pull{padding-left:22px}
  .rtwl-page .agenda li{grid-template-columns:92px 1fr;gap:32px}
  .rtwl-page .agenda li::before{left:106px}
  .rtwl-page .agenda li::after{left:100px}
  .rtwl-page .agenda__time{padding-right:24px;font-size:17px}
  .rtwl-page .stickybar{display:flex}
  .rtwl-page{padding-bottom:76px}
}
@media (max-width: 560px){
  .rtwl-page .cards{grid-template-columns:1fr}
  .rtwl-page .credits{grid-template-columns:1fr 1fr}
  .rtwl-page .footer{justify-content:center;text-align:center}
  .rtwl-page .faq summary{font-size:17px}
}
`;
