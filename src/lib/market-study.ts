import type { Candle } from "@/components/ui/candlestick-chart";

export type StudyPoint = { index: number; price: number; label?: string; below?: boolean };
export type ChartDrawing =
  | { kind: "swings"; points: StudyPoint[] }
  | { kind: "level"; from: number; to: number; price: number; label: string }
  | { kind: "zone"; from: number; to: number; high: number; low: number; label: string }
  | { kind: "point"; index: number; price: number; label: string; below?: boolean }
  | { kind: "position"; from: number; to: number; entry: number; stop: number; target: number };

// A deliberately constructed lesson, not sampled market history or a live quote.
// Every annotation uses a candle index and a price; the renderer owns the transform.
export function createMarketStudy(hours = 1) {
  const anchors = [[0, 2316], [5, 2334], [9, 2324], [15, 2343], [20, 2333],
    [27, 2361], [34, 2343], [39, 2359], [44, 2373], [47, 2367]];
  const data: Candle[] = [];
  for (let i = 0; i < 48; i++) {
    const segment = anchors.findIndex((point, j) => j < anchors.length - 1 && i >= point[0] && i <= anchors[j + 1][0]);
    const [a, b] = [anchors[segment], anchors[segment + 1]];
    const fraction = (i - a[0]) / (b[0] - a[0]);
    const close = a[1] + (b[1] - a[1]) * fraction + Math.sin(fraction * Math.PI * 2) * 0.45;
    const open = i ? data[i - 1].c : close - 1.8;
    const wick = 1.2 + (i % 3) * 0.4;
    data.push({ t: Date.UTC(2025, 0, 6) + i * hours * 3600000,
      o: open, c: close, h: Math.max(open, close) + wick, l: Math.min(open, close) - wick,
      v: 40000 + (i % 7) * 7500 + Math.abs(close - open) * 9000 });
  }
  const swings: StudyPoint[] = [
    { index: 5, price: data[5].h, label: "H" },
    { index: 9, price: data[9].l, label: "HL", below: true },
    { index: 15, price: data[15].h, label: "HH" },
    { index: 20, price: data[20].l, label: "HL", below: true },
    { index: 27, price: data[27].h, label: "HH" },
    { index: 34, price: data[34].l, label: "HL", below: true },
  ];
  const level = data[15].h;
  const breakIndex = data.findIndex((c, i) => i > 20 && c.c > level);
  const position = { kind: "position" as const, from: 35, to: 47, entry: 2345, stop: 2337, target: 2361 };
  const zone: ChartDrawing = { kind: "zone", from: 24, to: 47, high: level, low: data[34].l, label: "Retest zone" };
  const drawings: ChartDrawing[][] = [
    [{ kind: "swings", points: swings }],
    [zone, { kind: "level", from: 15, to: breakIndex, price: level, label: "BOS" },
      { kind: "point", index: 34, price: data[34].l, label: "Retest", below: true }],
    [position],
  ];
  return { data, drawings, swings, level, breakIndex, position };
}

export const marketStudy = createMarketStudy();
