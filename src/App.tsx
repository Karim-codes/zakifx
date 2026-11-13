import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Menu,
  X,
  Check,
  ShieldCheck,
  MessageCircle,
  MoveUpRight,
} from "lucide-react";
import { MarketStory } from "@/components/market-story";
import { prepareEnquiry } from "@/lib/enquiry";
import { programmes, type Programme } from "@/data/programmes";
import { EnrolmentDialog } from "@/components/enrolment-dialog";
import { ProgrammePage } from "@/components/programme-page";
import { AgencyCredit } from "@/components/agency-credit";

const questions = [
  [
    "Where should I start?",
    "Beginner to Advanced covers the fundamentals. Advanced Strategies focuses on Gold, liquidity and specialised analysis. VIP mentorship provides personal guidance. Tell the academy about your experience and goals if you need help choosing.",
  ],
  [
    "How will I learn?",
    "The academy describes its courses as structured trading education with video lessons and practical analysis. VIP mentorship includes private Zoom sessions. Confirm the schedule, access period, session allocation and support for your programme before enrolling.",
  ],
  [
    "Do I need a live trading account?",
    "You do not need a live account to enquire or explore the programmes. Broker referrals are optional and separate from course selection. Consider using a demo environment to practise before risking real funds.",
  ],
  [
    "Will this guarantee trading profits?",
    "No. Education does not guarantee profits or prevent losses. Forex and leveraged products carry significant risk, and you may lose your capital. Chart examples, market updates and any educational signals are not personalised investment advice.",
  ],
  [
    "What should I confirm before enrolling?",
    "Check the current price, delivery format, lesson access period, mentorship availability, support and purchase/refund terms directly with the academy. Explore the curriculum on this site, then use the enrolment form to discuss the details with the academy.",
  ],
];

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#home"
      className="brand"
      aria-label="ZAKI FX Trading Academy home"
      onClick={onClick}
    >
      <svg
        className="brand-symbol"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 8h27L8 32h27M5 32 32 5"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path d="M31 5h5v5" stroke="currentColor" strokeWidth="3" />
      </svg>
      <span>
        ZAKI<span className="brand-fx">FX</span>
        <small>TRADING ACADEMY</small>
      </span>
    </a>
  );
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label mono">
      <span>{children}</span>
    </div>
  );
}
function Arrow({ large = false }: { large?: boolean }) {
  return (
    <ArrowUpRight
      className={large ? "button-arrow large" : "button-arrow"}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}

function usePageMotion() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const configure = () => {
      observer?.disconnect();
      if (media.matches || !("IntersectionObserver" in window)) {
        document.documentElement.classList.remove("motion-ready");
        return;
      }
      try {
        observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting)
                entry.target.classList.add("is-visible");
              // Replay when a section returns from below, without hiding content already read above.
              else if (entry.boundingClientRect.top > window.innerHeight)
                entry.target.classList.remove("is-visible");
            }),
          { threshold: 0.08, rootMargin: "0px 0px -35px 0px" },
        );
        elements.forEach((el) => observer!.observe(el));
        document.documentElement.classList.add("motion-ready");
      } catch {
        observer?.disconnect();
        document.documentElement.classList.remove("motion-ready");
      }
    };
    configure();
    media.addEventListener("change", configure);
    let queued = false;
    const progress = () => {
      queued = false;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty(
        "--page-progress",
        String(total > 0 ? window.scrollY / total : 0),
      );
    };
    const scroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(progress);
      }
    };
    progress();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", configure);
      window.removeEventListener("scroll", scroll);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
}

function HomePage() {
  const [enrolment, setEnrolment] = useState<Programme | null>(null);
  const [topic, setTopic] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof prepareEnquiry> | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const privacyRef = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const draftRef = useRef<HTMLAnchorElement>(null);
  usePageMotion();
  const closeMenu = () => menuRef.current?.close();
  useEffect(() => {
    if (!menuOpen) return;
    const media = window.matchMedia("(min-width: 801px)");
    const reset = () => {
      if (media.matches) closeMenu();
    };
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, [menuOpen]);
  function openMenu() {
    menuRef.current?.showModal();
    setMenuOpen(true);
    document.body.classList.add("dialog-open");
  }
  function openPrivacy() {
    privacyRef.current?.showModal();
    document.body.classList.add("dialog-open");
  }
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setDraft(
      prepareEnquiry({
        name: String(values.get("name") || ""),
        email: String(values.get("email") || ""),
        interest: topic,
        message: String(values.get("message") || ""),
      }),
    );
    setCopyStatus("");
    requestAnimationFrame(() => draftRef.current?.focus());
  }
  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(
        `To: youvsyou@zakifx.com\n\n${draft?.body}`,
      );
      setCopyStatus("Copied. Paste into your email app and send when ready.");
    } catch {
      setCopyStatus(
        "Copy is unavailable. Use the email draft link or email youvsyou@zakifx.com directly.",
      );
    }
  }
  const enquire = (interest: string) => {
    setTopic(interest);
    setDraft(null);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#about">Meet Zaki</a>
            <a href="#method">The approach</a>
            <a href="#courses">Programmes</a>
            <a href="#mentorship">1:1 mentorship</a>
          </nav>
          <a className="header-cta" href="#contact">
            Talk to Zaki <Arrow />
          </a>
          <button
            ref={menuTrigger}
            className="menu-trigger"
            aria-label="Open navigation"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={openMenu}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>
      <dialog
        className="menu-dialog"
        ref={menuRef}
        onClose={() => {
          setMenuOpen(false);
          document.body.classList.remove("dialog-open");
          menuTrigger.current?.focus({ preventScroll: true });
        }}
        aria-labelledby="menu-title"
      >
        <div className="menu-header">
          <Brand onClick={closeMenu} />
          <button
            className="icon-button"
            aria-label="Close navigation"
            onClick={closeMenu}
          >
            <X size={26} />
          </button>
        </div>
        <p id="menu-title" className="mono">
          ZAKI FX TRADING ACADEMY
        </p>
        <nav aria-label="Mobile navigation">
          {[
            ["Meet Zaki", "about"],
            ["The approach", "method"],
            ["Programmes", "courses"],
            ["1:1 mentorship", "mentorship"],
            ["Your questions", "questions"],
            ["Let’s talk", "contact"],
          ].map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={closeMenu}>
              {label}
              <Arrow />
            </a>
          ))}
        </nav>
        <a className="menu-email" href="mailto:youvsyou@zakifx.com">
          youvsyou@zakifx.com
        </a>
      </dialog>

      <main id="main">
        <section id="home" className="hero dark-section">
          <div className="shell hero-editorial">
            <div className="hero-copy">
              <p className="eyebrow" data-reveal="rise">
                <span className="tiny-rule" /> Forex education &amp; personal
                mentorship
              </p>
              <h1 data-reveal="rise">
                Understand
                <br />
                the market.
                <br />
                <em>With Zaki.</em>
              </h1>
              <p className="hero-intro" data-reveal="rise">
                Forex education with a personal approach. Study price action,
                market structure and risk through structured courses and
                one-to-one mentorship.
              </p>
              <div className="hero-actions" data-reveal="rise">
                <a className="button button-dark" href="#courses">
                  <span>Find your programme</span>
                  <Arrow />
                </a>
                <a className="understated-link" href="#about">
                  Meet Zaki <ArrowRight size={17} />
                </a>
              </div>
              <p className="hero-principle">
                <ShieldCheck size={17} strokeWidth={1.5} /> A foundation in
                knowledge. An understanding of risk.
              </p>
            </div>
            <figure className="hero-portrait" data-reveal="scale">
              <img
                src="/assets/zaki-portrait.webp"
                width="1109"
                height="1419"
                alt="Zaki reviewing his trading notes at his desk"
                fetchPriority="high"
              />
              <figcaption>
                <span className="portrait-byline">Zaki</span>
                <span>Gold trader &amp; educator</span>
              </figcaption>
            </figure>
          </div>
          <nav
            className="shell hero-programmes"
            aria-label="Explore academy programmes"
          >
            {programmes.map((programme) => (
              <a href={`/programmes/${programme.slug}/`} key={programme.id}>
                <span>{programme.interest}</span>
                <span>
                  £{programme.price} <Arrow />
                </span>
              </a>
            ))}
          </nav>
        </section>
        <section id="about" className="about-section dark-section">
          <div className="shell about-composition">
            <p className="eyebrow" data-reveal="rise">
              Meet your educator
            </p>
            <div className="about-statement" data-reveal="rise">
              <h2>
                The person
                <br />
                <em>behind the charts.</em>
              </h2>
              <p>
                Zaki is a Gold (XAUUSD) trader with over six years of trading
                experience. At ZAKI FX, the focus is on connecting market
                structure, price action and risk management through practical
                trading education.
              </p>
              <div className="about-topics" aria-label="Teaching focus">
                <span>Price action</span>
                <span>Risk management</span>
                <span>Trading psychology</span>
              </div>
            </div>
            <div className="about-aside" data-reveal="rise">
              <span className="about-number">1:1</span>
              <p>
                Learn directly with Zaki.
                <br />
                Bring your own questions.
              </p>
              <a href="#mentorship">
                Discover mentorship <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <MarketStory />

        <section id="courses" className="courses-section dark-section">
          <div className="shell">
            <SectionLabel>Choose your programme</SectionLabel>
            <div className="section-title-row">
              <h2 data-reveal="rise">
                Three ways to
                <br />
                <em>learn with Zaki.</em>
              </h2>
              <p data-reveal="rise">
                Explore the curriculum, find your level and ask the questions
                that matter before you enrol.
              </p>
            </div>
            <div className="programme-list">
              {programmes.map((course, index) => {
                return (
                  <details
                    className="programme"
                    name="programmes"
                    open={index === 0}
                    key={course.id}
                    data-reveal="rise"
                  >
                    <summary className="programme-toggle">
                      <span className="programme-number mono">
                        {course.number}
                      </span>
                      <span className="programme-title">
                        <small className="mono">{course.category}</small>
                        {course.title}
                      </span>
                      <span className="programme-price">
                        £{course.price}
                        <small className="mono">GBP</small>
                      </span>
                      <span className="programme-toggle-icon">
                        <Plus size={24} strokeWidth={1.2} />
                      </span>
                    </summary>
                    <div
                      id={`course-${course.id}`}
                      className="programme-detail"
                    >
                      <div className="programme-description">
                        <h3>{course.for}</h3>
                        <p>{course.description}</p>
                      </div>
                      <ul>
                        {course.topics.map((topic) => (
                          <li key={topic}>
                            <Check size={13} strokeWidth={1.5} />
                            {topic}
                          </li>
                        ))}
                      </ul>
                      <div className="programme-actions">
                        <a
                          className="button button-dark"
                          href={`/programmes/${course.slug}/`}
                        >
                          <span>Explore programme</span>
                          <Arrow />
                        </a>
                        <button
                          className="understated-link"
                          onClick={() => setEnrolment(course)}
                        >
                          Enrol in this programme <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
            <div className="programme-footnote">
              <p>
                Not sure?{" "}
                <a
                  href="#contact"
                  onClick={() => enquire("Help choosing a course")}
                >
                  Let’s find your starting point <ArrowUpRight size={13} />
                </a>
              </p>
              <p>
                Confirm current prices, access and purchase/refund terms before
                enrolling.
              </p>
            </div>
          </div>
        </section>

        <section id="mentorship" className="mentorship-section dark-section">
          <div className="shell">
            <SectionLabel>Private mentorship</SectionLabel>
            <div className="mentor-heading" data-reveal="rise">
              <h2>
                Your charts.
                <br />
                <em>Zaki’s guidance.</em>
              </h2>
              <p>
                Work through the reasoning behind your analysis, with room to
                ask, revisit and understand.
              </p>
            </div>
            <div className="mentor-grid">
              <article className="mentor-session-note" data-reveal="rise">
                <p className="eyebrow">Inside the conversation</p>
                <h3>
                  Start with a chart.
                  <br />
                  Explore the thinking.
                </h3>
                <ol>
                  <li>
                    <span>01</span>
                    <div>
                      <h4>Reading structure</h4>
                      <p>
                        Which levels matter, and what would change your view?
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>02</span>
                    <div>
                      <h4>Managing risk</h4>
                      <p>
                        Where does the idea become invalid? What are you
                        prepared to risk?
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>03</span>
                    <div>
                      <h4>Building a process</h4>
                      <p>
                        What can you learn from the decisions in your journal?
                      </p>
                    </div>
                  </li>
                </ol>
                <p className="session-note-footer">
                  <MessageCircle size={19} strokeWidth={1.5} /> Personal
                  guidance through private Zoom sessions.
                </p>
              </article>
              <div className="mentor-copy">
                <h3 data-reveal="rise">VIP 1-to-1 Mentorship</h3>
                <p className="mentor-price" data-reveal="rise">
                  £{programmes[2].price} <span>GBP</span>
                </p>
                <p data-reveal="rise">
                  Individual guidance around your learning needs, from Gold
                  analysis and market structure to risk and trading psychology.
                </p>
                <div className="mentor-details" data-reveal="rise">
                  <span>Private Zoom sessions</span>
                  <span>Practical chart analysis</span>
                  <span>Individual learning needs</span>
                </div>
                <button
                  className="button button-dark"
                  onClick={() => setEnrolment(programmes[2])}
                  data-reveal="rise"
                >
                  <span>Enquire about mentorship</span>
                  <Arrow />
                </button>
                <a
                  className="understated-link"
                  href="/programmes/vip-mentorship/"
                >
                  Explore the mentorship <ArrowRight size={17} />
                </a>
                <p className="mentor-availability">
                  Tell us where you are. We’ll discuss your goals, programme
                  details and session availability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="questions" className="questions-section light-section">
          <div className="shell questions-grid">
            <div>
              <SectionLabel>Frequently asked questions</SectionLabel>
              <h2 data-reveal="rise">
                Good questions.
                <br />
                <em>Clear answers.</em>
              </h2>
            </div>
            <div className="question-list">
              {questions.map(([q, a]) => (
                <details key={q} data-reveal="rise">
                  <summary>
                    <span>{q}</span>
                    <Plus size={19} strokeWidth={1.3} aria-hidden="true" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="shell">
            <SectionLabel>Talk to the academy</SectionLabel>
            <div className="contact-grid">
              <div className="contact-copy">
                <h2 data-reveal="rise">
                  Let’s find
                  <br />
                  <em>your starting point.</em>
                </h2>
                <p data-reveal="rise">
                  A course question. A mentorship enquiry.
                  <br />
                  Or simply figuring out where to begin.
                </p>
                <a className="contact-email" href="mailto:youvsyou@zakifx.com">
                  youvsyou@zakifx.com <Arrow />
                </a>
                <a
                  className="whatsapp-link"
                  href="https://wa.me/447522185202?text=Hello%20Zaki%2C%20I%27d%20like%20to%20ask%20about%20your%20courses."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={17} strokeWidth={1.5} /> Start on
                  WhatsApp <ArrowUpRight size={15} />
                  <span className="sr-only">Opens in a new tab</span>
                </a>
              </div>
              <form
                className="enquiry-form"
                onSubmit={onSubmit}
                onChange={() => {
                  setDraft(null);
                  setCopyStatus("");
                }}
                data-reveal="rise"
              >
                <p className="form-heading mono">
                  Tell us a little about yourself.
                </p>
                <div className="form-row">
                  <label htmlFor="full-name">
                    Your name
                    <input
                      id="full-name"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      placeholder="Full name"
                    />
                  </label>
                  <label htmlFor="email">
                    Your email
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={200}
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
                <label htmlFor="interest">
                  What brings you here?
                  <select
                    id="interest"
                    name="interest"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    required
                  >
                    <option value="">Choose a programme or topic</option>
                    {programmes.map((course) => (
                      <option key={course.id}>{course.interest}</option>
                    ))}
                    <option>Help choosing a course</option>
                    <option>General enquiry</option>
                  </select>
                </label>
                <label htmlFor="message">
                  Your experience. Your goals.
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={3}
                    maxLength={2500}
                    placeholder="Where are you now, and what would you like to learn?"
                  />
                </label>
                <div className="form-submit-row">
                  <p>
                    Prepare your enquiry, then send it through WhatsApp or
                    email.
                    <br />
                    <button
                      className="inline-button"
                      type="button"
                      onClick={openPrivacy}
                    >
                      Privacy details
                    </button>
                  </p>
                  <button type="submit" className="button button-dark">
                    <span>Prepare my enquiry</span>
                    <Arrow />
                  </button>
                </div>
                {draft && (
                  <div className="draft-result" role="status">
                    <strong>Your enquiry is ready.</strong>
                    <p>
                      Choose WhatsApp or email to review and send your enquiry.
                    </p>
                    <a
                      ref={draftRef}
                      href={draft.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Continue on WhatsApp <ArrowUpRight size={16} />
                      <span className="sr-only">Opens in a new tab</span>
                    </a>
                    <a href={draft.mailto}>
                      Open email draft <ArrowUpRight size={16} />
                    </a>
                    <button type="button" onClick={copyDraft}>
                      Copy enquiry
                    </button>
                    {copyStatus && <p>{copyStatus}</p>}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="broker-section dark-section">
          <div className="shell">
            <div className="broker-heading">
              <p className="mono">
                Optional connections. Independent decisions.
              </p>
              <p>Broker referrals, separate from your education.</p>
            </div>
            <div className="broker-grid">
              <a
                href="https://puvip.co/la-partners/JQb3QSxx"
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                <span>
                  PU PRIME
                  <small className="mono">External partner referral</small>
                </span>
                <MoveUpRight size={35} strokeWidth={1} />
                <span className="sr-only">Opens in a new tab</span>
              </a>
              <a
                href="https://one.justmarkets.link/a/tjmrwa0fdu"
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                <span>
                  JUSTMARKETS
                  <small className="mono">External partner referral</small>
                </span>
                <MoveUpRight size={35} strokeWidth={1} />
                <span className="sr-only">Opens in a new tab</span>
              </a>
            </div>
            <p className="referral-disclosure">
              <strong>Referral disclosure.</strong> ZAKI FX may receive
              compensation if you register or trade through these links. Check
              the broker’s legal entity, country eligibility, fees and risk
              disclosures. A referral does not guarantee suitability or safety.
              Forex and leveraged products carry a significant risk of loss.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer dark-section">
        <div className="shell">
          <div className="footer-top">
            <p className="mono">
              <span className="signal-dot" /> Knowledge before capital.
            </p>
            <div>
              <a
                href="https://t.me/ZAKIFXLINK"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram <Arrow />
                <span className="sr-only">Opens in a new tab</span>
              </a>
              <a
                href="https://www.tiktok.com/@zakifx55"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok <Arrow />
                <span className="sr-only">Opens in a new tab</span>
              </a>
              <a href="#home">
                Back to top <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <a
            className="footer-wordmark"
            href="#home"
            aria-label="ZAKI FX back to top"
            data-reveal="rise"
          >
            Zaki<span>FX</span>
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <path d="M10 90 90 10M10 10h80v80" />
            </svg>
          </a>
          <div className="risk-row">
            <span className="mono">Learn with your eyes open.</span>
            <p>
              ZAKI FX provides trading education. Content, chart examples and
              mentorship are educational and do not constitute personalised
              investment advice. Forex and leveraged products carry significant
              risk; you may lose your capital. Past performance does not predict
              future results. No course or strategy guarantees profits.
            </p>
          </div>
          <div className="footer-bottom mono">
            <span>© {new Date().getFullYear()} ZAKI FX TRADING ACADEMY</span>
            <button onClick={openPrivacy}>Privacy &amp; enquiries</button>
            <AgencyCredit />
          </div>
        </div>
      </footer>

      <EnrolmentDialog
        programme={enrolment}
        onClose={() => setEnrolment(null)}
      />
      <dialog
        className="privacy-dialog"
        ref={privacyRef}
        onClose={() => document.body.classList.remove("dialog-open")}
        aria-labelledby="privacy-heading"
      >
        <button
          className="icon-button privacy-close"
          type="button"
          aria-label="Close privacy details"
          onClick={() => privacyRef.current?.close()}
        >
          <X size={25} />
        </button>
        <p className="mono">Privacy &amp; enquiries</p>
        <h2 id="privacy-heading">
          Your enquiry.
          <br />
          <em>Your choice.</em>
        </h2>
        <p>
          The form prepares your enquiry on your device. Choose WhatsApp or your
          email app to review and send it to ZAKI FX. Opening WhatsApp shares
          the prepared text with that service. The website itself does not store
          enquiries on a server.
        </p>
        <p>
          WhatsApp, Telegram, TikTok and broker referrals are external services
          with their own privacy policies. This redesign adds no analytics or
          advertising cookies.
        </p>
        <p>
          For questions about messages you send, contact{" "}
          <a href="mailto:youvsyou@zakifx.com">youvsyou@zakifx.com</a>. Please
          avoid including financial account details or sensitive documents in an
          initial enquiry.
        </p>
      </dialog>
    </>
  );
}

export default function App({ initialPath = "/" }: { initialPath?: string }) {
  const slug = initialPath.replace(/\/$/, "").split("/programmes/")[1];
  const programme = programmes.find((item) => item.slug === slug);
  return programme ? <ProgrammePage programme={programme} /> : <HomePage />;
}
