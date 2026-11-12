import { marketStudy } from "@/lib/market-study";

// Static SVG uses the same candles and level as the interactive canvas.
// It remains a useful, labelled study when JavaScript or canvas is unavailable.
export function StudyFallback() {
  const x = (index: number) => 16 + (index + 0.5) * 16;
  const y = (price: number) => 270 - (price - 2308) * 3.7;
  return (
    <svg className="chart-fallback" viewBox="0 0 800 300" role="img" aria-label="Illustrative higher highs and higher lows, with a break above the previous swing high">
      {[2320, 2340, 2360, 2380].map((price) => <path key={price} d={`M10 ${y(price)} H790`} stroke="#deded3" />)}
      {marketStudy.data.map((c, i) => <g key={i} stroke="#37493c" fill={c.c >= c.o ? "#faf8f2" : "#37493c"}>
        <path d={`M${x(i)} ${y(c.h)}V${y(c.l)}`} />
        <rect x={x(i) - 4} y={y(Math.max(c.o, c.c))} width="8" height={Math.max(1, Math.abs(y(c.o) - y(c.c)))} />
      </g>)}
      <path d={marketStudy.swings.map((p, i) => `${i ? "L" : "M"}${x(p.index)} ${y(p.price)}`).join(" ")} stroke="#896548" strokeDasharray="4 4" fill="none" />
      {marketStudy.swings.map((p) => <text key={p.index} x={x(p.index)} y={y(p.price) + (p.below ? 20 : -12)} textAnchor="middle" fill="#735539" fontFamily="Manrope, Arial, sans-serif" fontSize="13">{p.label}</text>)}
      <path d={`M${x(15)} ${y(marketStudy.level)}H${x(marketStudy.breakIndex)}`} stroke="#365947" strokeDasharray="4 4" />
      <text x={x(20)} y={y(marketStudy.level) - 10} fill="#365947" fontFamily="Manrope, Arial, sans-serif" fontSize="13">BOS</text>
    </svg>
  );
}
