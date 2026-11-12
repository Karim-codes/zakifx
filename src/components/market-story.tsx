import { useEffect, useRef, useState } from "react";
import { ArrowDown, ScanLine, ShieldCheck, Focus } from "lucide-react";
import { MarketLab } from "./market-lab";

const chapters = [
  {
    name: "Structure",
    title: "Start with the swings.",
    text: "The dotted path connects swing points. HH marks a higher high; HL marks a higher low. Together, they describe the upward structure in this example.",
    icon: ScanLine,
  },
  {
    name: "Retest",
    title: "A break. Then a return.",
    text: "BOS marks the first candle to close above the earlier swing high. Price later returns to the shaded retest zone. A retest is context to study, never a guarantee that a level will hold.",
    icon: Focus,
  },
  {
    name: "Risk plan",
    title: "Define the downside.",
    text: "Example entry 2,345. Stop 2,337. Target 2,361. Eight price units at risk for sixteen of potential reward: 2:1 before costs. This describes a plan, not its chance of success; stops can slip.",
    icon: ShieldCheck,
  },
];

export function MarketStory() {
  const ref = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    const section = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let queued = false;
    const update = () => {
      queued = false;
      if (reduced.matches || window.matchMedia("(max-width: 760px)").matches) return;
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -bounds.top / distance));
      section.style.setProperty("--story-progress", String(progress));
      setChapter(Math.min(2, Math.floor(progress * 3)));
    };
    const scroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    const configure = () => {
      setInteractive(true);
      setEnhanced(
        !reduced.matches && !window.matchMedia("(max-width: 760px)").matches,
      );
      update();
    };
    configure();
    reduced.addEventListener("change", configure);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", configure);
    return () => {
      reduced.removeEventListener("change", configure);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", configure);
    };
  }, []);
  function goToChapter(index: number) {
    const section = ref.current!;
    if (section.classList.contains("story-enhanced")) {
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      window.scrollTo({
        top:
          window.scrollY +
          section.getBoundingClientRect().top +
          distance * ((index + 0.18) / 3),
        behavior: "smooth",
      });
    }
    setChapter(index);
  }
  return (
    <section
      id="method"
      ref={ref}
      className={`market-story chapter-${chapter} ${enhanced ? "story-enhanced" : ""} ${interactive ? "story-interactive" : ""}`}
      aria-labelledby="story-heading"
    >
      <div className="story-sticky">
        <div className="shell">
          <div className="story-header">
            <p className="mono">Field note 01 / A lesson in looking closer</p>
            <p className="mono story-scroll">
              <ArrowDown size={13} /> A change of perspective
            </p>
          </div>
          <div className="story-heading-row">
            <h2 id="story-heading">
              Read the structure.
              <br />
              <span>Plan around the risk.</span>
            </h2>
            <div className="story-narrative" aria-live="polite">
              {chapters.map((item, i) => (
                <article
                  className={`story-step ${chapter === i ? "active" : ""}`}
                  key={item.name}
                >
                  <span className="mono">
                    0{i + 1} / {item.name}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="story-chart">
            <MarketLab immersive chapter={chapter} />
          </div>
          <div className="story-tabs" aria-label="Chart learning chapters">
            {chapters.map((item, i) => (
              <button
                key={item.name}
                onClick={() => goToChapter(i)}
                aria-pressed={chapter === i}
              >
                <span className="mono">0{i + 1}</span>
                <item.icon size={17} strokeWidth={1.3} />
                <span>{item.name}</span>
                <span className="story-tab-line" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
