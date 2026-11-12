import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Plus } from "lucide-react";
import { programmes, type Programme } from "@/data/programmes";
import { EnrolmentDialog } from "./enrolment-dialog";

const modules: Record<string, { title: string; detail: string }[]> = {
  foundation: [
    {
      title: "The forex fundamentals",
      detail:
        "An introduction to forex markets, currency pairs, pips, lots and leverage. Establish the vocabulary before moving to chart analysis.",
    },
    {
      title: "Reading price",
      detail:
        "Candlestick patterns, price action, market structure, technical analysis, support and resistance.",
    },
    {
      title: "Looking beneath the move",
      detail:
        "ICT (Inner Circle Trader) and Smart Money concepts, liquidity, order blocks and fair value gaps.",
    },
    {
      title: "Risk, psychology and application",
      detail:
        "Risk management, trading psychology, trading strategies and practical chart analysis. Education does not guarantee trading profits.",
    },
  ],
  advanced: [
    {
      title: "Gold in focus",
      detail:
        "Develop your understanding of Gold (XAUUSD) through practical analysis and more specialised trading concepts.",
    },
    {
      title: "Liquidity and market structure",
      detail:
        "Explore liquidity, market structure shifts and break of structure (BOS).",
    },
    {
      title: "Fair value gaps and entries",
      detail:
        "Study fair value gaps (FVG), ICT concepts and entry confirmations in their wider market context.",
    },
    {
      title: "Keeping risk in the picture",
      detail:
        "Connect advanced analysis with risk management. A pattern or potential entry is never a guarantee of an outcome.",
    },
  ],
  mentorship: [
    {
      title: "Private, personal guidance",
      detail:
        "1-to-1 Zoom mentorship with Zaki, forex education from beginner to advanced, and guidance around your learning needs.",
    },
    {
      title: "Structure, liquidity and Gold",
      detail:
        "Price action, market structure, ICT and Smart Money concepts, liquidity, order blocks, fair value gaps and inverse fair value gaps (IFVG).",
    },
    {
      title: "Practical chart work",
      detail:
        "Advanced entry and exit concepts, live chart analysis, practical examples, market updates and educational trading signals. These are not personalised investment recommendations.",
    },
    {
      title: "Risk, psychology and support",
      detail:
        "Risk management, trading psychology, personalised guidance and student support. Confirm session allocation and availability directly with the academy.",
    },
  ],
};

export function ProgrammePage({ programme }: { programme: Programme }) {
  const [enrol, setEnrol] = useState<Programme | null>(null);
  return (
    <>
      <a href="#programme-main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="/" aria-label="ZAKI FX home">
            ZAKI<span className="brand-fx">FX</span>
          </a>
          <a className="back-link" href="/#courses">
            <ArrowLeft size={16} /> All programmes
          </a>
          <button className="header-cta" onClick={() => setEnrol(programme)}>
            Enrol <ArrowUpRight size={20} />
          </button>
        </div>
      </header>
      <main id="programme-main">
        <section className="programme-hero dark-section">
          <div className="shell">
            <p className="mono lime-text">
              PROGRAMME {programme.number} / {programme.category}
            </p>
            <h1>{programme.title}</h1>
            <div className="programme-hero-bottom">
              <p>{programme.description}</p>
              <span className="programme-page-price">
                £{programme.price}
                <small className="mono">GBP / LISTED PROGRAMME PRICE</small>
              </span>
            </div>
          </div>
        </section>
        <section className="programme-content light-section">
          <div className="shell programme-content-grid">
            <aside className="programme-summary">
              <p className="mono">At a glance</p>
              <h2>{programme.for}</h2>
              <dl>
                <div>
                  <dt>Format</dt>
                  <dd>
                    {programme.id === "mentorship"
                      ? "Private 1-to-1 Zoom sessions"
                      : "Structured lessons and guided trading education"}
                  </dd>
                </div>
                <div>
                  <dt>Focus</dt>
                  <dd>
                    {programme.id === "foundation"
                      ? "Forex fundamentals to advanced concepts"
                      : programme.id === "advanced"
                        ? "Gold, liquidity and advanced analysis"
                        : "Personal learning needs and practical chart analysis"}
                  </dd>
                </div>
                <div>
                  <dt>Access &amp; schedule</dt>
                  <dd>Confirm with the academy before enrolling.</dd>
                </div>
                <div>
                  <dt>Price &amp; payment terms</dt>
                  <dd>
                    Listed at £{programme.price} GBP. Confirm payment frequency
                    and purchase/refund terms with the academy.
                  </dd>
                </div>
              </dl>
              <button
                className="button button-dark"
                onClick={() => setEnrol(programme)}
              >
                Enrol in this programme <ArrowUpRight size={21} />
              </button>
              <p className="summary-note">
                Opens an enrolment enquiry. No payment is taken on this website.
              </p>
            </aside>
            <div className="programme-curriculum">
              <p className="mono">The learning, in focus.</p>
              <h2>
                Your curriculum,
                <br />
                <em>in perspective.</em>
              </h2>
              <p className="curriculum-intro">
                Explore the programme’s subjects below. These are curriculum
                themes; the exact lesson structure, access and support are
                confirmed by the academy.
              </p>
              {modules[programme.id].map((module, i) => (
                <details
                  key={module.title}
                  className="curriculum-module"
                  open={i === 0}
                >
                  <summary>
                    <span className="mono">0{i + 1}</span>
                    <h3>{module.title}</h3>
                    <Plus size={20} />
                  </summary>
                  <p>{module.detail}</p>
                </details>
              ))}
              <div className="included-topics">
                <h3>Subjects &amp; support</h3>
                <ul>
                  {programme.topics.map((topic) => (
                    <li key={topic}>
                      <Check size={14} />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="enrolment-process contact-section">
          <div className="shell">
            <p className="mono">A clear next step.</p>
            <h2>
              Explore. Ask.
              <br />
              <em>Then decide.</em>
            </h2>
            <div className="enrolment-steps">
              <div>
                <span className="mono">01 / YOUR ENQUIRY</span>
                <p>
                  Open the form and tell us about your experience and goals.
                </p>
              </div>
              <div>
                <span className="mono">02 / THE DETAILS</span>
                <p>
                  Discuss suitability, availability, delivery, price and terms
                  with the academy.
                </p>
              </div>
              <div>
                <span className="mono">03 / YOUR DECISION</span>
                <p>
                  Choose whether to proceed once you have the information you
                  need.
                </p>
              </div>
            </div>
            <button
              className="button button-dark"
              onClick={() => setEnrol(programme)}
            >
              Start your enrolment enquiry <ArrowUpRight size={21} />
            </button>
          </div>
        </section>
        <section className="other-programmes light-section">
          <div className="shell">
            <p className="mono">Another starting point?</p>
            {programmes
              .filter((p) => p.id !== programme.id)
              .map((p) => (
                <a href={`/programmes/${p.slug}/`} key={p.id}>
                  <span>{p.title}</span>
                  <span>
                    £{p.price}
                    <ArrowUpRight size={25} />
                  </span>
                </a>
              ))}
          </div>
        </section>
      </main>
      <footer className="programme-footer dark-section">
        <div className="shell">
          <a href="/">ZAKI FX / TRADING ACADEMY</a>
          <p>
            Trading education only. No guaranteed returns. Forex and leveraged
            products carry significant risk, and you may lose your capital.
          </p>
          <a href="mailto:youvsyou@zakifx.com">
            youvsyou@zakifx.com <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
      <EnrolmentDialog programme={enrol} onClose={() => setEnrol(null)} />
    </>
  );
}
