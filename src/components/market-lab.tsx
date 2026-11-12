import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Crosshair, RotateCcw } from "lucide-react";
import CandlestickChart from "@/components/ui/candlestick-chart";
import { createMarketStudy } from "@/lib/market-study";
import { StudyFallback } from "./study-fallback";

export function MarketLab({ immersive = false, chapter = 0 }: { immersive?: boolean; chapter?: number }) {
  const [timeframe, setTimeframe] = useState(1);
  const [reset, setReset] = useState(0);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const study = useMemo(() => createMarketStudy(timeframe), [timeframe]);

  return (
    <div className={`market-lab ${immersive ? "immersive" : ""}`}>
      <div className="lab-top">
        <span className="mono lab-label">
          <span className="signal-dot" /> THE CHART LAB
        </span>
        <span className="mono">STUDY 001 / XAUUSD</span>
      </div>
      <div className="lab-title">
        <h2>
          A different way
          <br />
          to see the market.
        </h2>
        <Crosshair size={28} strokeWidth={1} aria-hidden="true" />
      </div>
      <div className="lab-toolbar">
        <span className="mono demo-label">Illustrative chart · XAUUSD</span>
        <div className="timeframes" aria-label="Example chart timeframe">
          {[1, 4].map((hours) => (
            <button
              key={hours}
              aria-pressed={timeframe === hours}
              onClick={() => setTimeframe(hours)}
            >
              {hours}H
            </button>
          ))}
          <button
            onClick={() => setReset((r) => r + 1)}
            aria-label="Reset example chart"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
      <div className="chart-render-area">
        <CandlestickChart
          key={`${timeframe}-${reset}`}
          data={study.data}
          drawings={study.drawings[chapter]}
          minCandleSpacing={4}
          tone="light"
          palette="ink"
          height={mobile ? 300 : immersive ? 350 : 350}
          defaultVisibleCount={48}
          showVolume={false}
          className="lab-canvas"
          ariaLabel="Fictional Gold chart with candle-anchored study drawings. Use the Structure, Retest and Risk plan chapters to explore. Not a trading signal"
          formatTime={(t, detail) =>
            new Intl.DateTimeFormat(
              "en-GB",
              detail === "axis"
                ? { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }
                : {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  },
            ).format(t)
          }
        />
        <StudyFallback />
      </div>
      <div className="lab-bottom">
        <span>
          <ArrowLeftRight size={13} strokeWidth={1.4} /> Drag to explore. Tap a
          candle.
        </span>
        <span className="mono">PERSPECTIVE, NOT PREDICTIONS.</span>
      </div>
      <p className="lab-disclaimer">
        Constructed teaching example, shown with hindsight. Not live prices or a trade recommendation.
      </p>
    </div>
  );
}
