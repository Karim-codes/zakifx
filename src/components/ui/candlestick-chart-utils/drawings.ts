import type { ChartDrawing } from "@/lib/market-study";

type DrawingFrame = {
  ctx: CanvasRenderingContext2D;
  xOf: (index: number) => number;
  yOf: (price: number) => number;
  plot: { l: number; r: number; t: number; b: number };
  palette: {
    accent: string;
    textMedium: string;
    stage: string;
    success: string;
    error: string;
  };
};

export function drawStudyAnnotations(
  drawings: ChartDrawing[],
  { ctx, xOf, yOf, plot, palette }: DrawingFrame,
) {
  const structure = palette.accent,
    bronze = palette.accent,
    loss = palette.error;
  const compact = plot.r - plot.l < 400;
  const fontSize = compact ? 11 : 12;
  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.l, plot.t, plot.r - plot.l, plot.b - plot.t);
  ctx.clip();
  ctx.font = `600 ${fontSize}px Manrope, Arial, sans-serif`;
  ctx.lineWidth = 1;
  function label(text: string, x: number, y: number, color = structure) {
    // Offscreen anchors must not turn into floating labels at the plot edge.
    if (x < plot.l || x > plot.r || y < plot.t || y > plot.b) return;
    const width = ctx.measureText(text).width + 10;
    const height = fontSize + 8;
    const left = Math.max(plot.l, Math.min(plot.r - width, x - width / 2));
    const top = Math.max(plot.t + 1, Math.min(plot.b - height, y - height / 2));
    ctx.fillStyle = `${palette.stage}f2`;
    ctx.fillRect(left, top, width, height);
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, left + width / 2, top + height / 2);
  }
  function line(
    x1: number,
    x2: number,
    price: number,
    color: string,
    dashed = false,
  ) {
    ctx.strokeStyle = color;
    ctx.setLineDash(dashed ? [4, 4] : []);
    ctx.beginPath();
    ctx.moveTo(x1, yOf(price));
    ctx.lineTo(x2, yOf(price));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (const drawing of drawings) {
    if (drawing.kind === "swings") {
      ctx.strokeStyle = `${bronze}99`;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      drawing.points.forEach((point, i) => {
        const x = xOf(point.index),
          y = yOf(point.price);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      drawing.points.forEach((point) => {
        const x = xOf(point.index),
          y = yOf(point.price);
        if (x < plot.l || x > plot.r) return;
        ctx.fillStyle = bronze;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        label(point.label ?? "", x, y + (point.below ? 16 : -16), bronze);
      });
    } else if (drawing.kind === "level") {
      const x1 = xOf(drawing.from),
        x2 = xOf(drawing.to);
      line(x1, x2, drawing.price, structure, true);
      label(drawing.label, (x1 + x2) / 2, yOf(drawing.price) - 12);
      // Mark the first candle whose close clears the previous swing high.
      ctx.strokeStyle = structure;
      ctx.beginPath();
      ctx.arc(x2, yOf(drawing.price), 4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (drawing.kind === "zone") {
      const x1 = xOf(drawing.from),
        x2 = xOf(drawing.to),
        top = yOf(drawing.high),
        bottom = yOf(drawing.low);
      ctx.fillStyle = `${bronze}15`;
      ctx.fillRect(x1, top, x2 - x1, bottom - top);
      line(x1, x2, drawing.high, `${bronze}99`, true);
      line(x1, x2, drawing.low, `${bronze}66`, true);
      label(drawing.label, x2 - 40, (top + bottom) / 2, bronze);
    } else if (drawing.kind === "point") {
      const x = xOf(drawing.index),
        y = yOf(drawing.price),
        offset = drawing.below ? 29 : -29;
      ctx.strokeStyle = bronze;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + (drawing.below ? 5 : -5));
      ctx.lineTo(x, y + offset);
      ctx.stroke();
      label(drawing.label, x, y + offset + (drawing.below ? 8 : -8), bronze);
    } else {
      const x1 = xOf(drawing.from),
        x2 = xOf(drawing.to);
      const entryY = yOf(drawing.entry),
        stopY = yOf(drawing.stop),
        targetY = yOf(drawing.target);
      const ratio =
        (drawing.target - drawing.entry) / (drawing.entry - drawing.stop);
      ctx.fillStyle = `${palette.success}22`;
      ctx.fillRect(x1, targetY, x2 - x1, entryY - targetY);
      ctx.fillStyle = `${loss}22`;
      ctx.fillRect(x1, entryY, x2 - x1, stopY - entryY);
      line(x1, x2, drawing.target, structure);
      line(x1, x2, drawing.entry, palette.textMedium, true);
      line(x1, x2, drawing.stop, loss);
      // The bracket begins at the hypothetical entry candle, in data coordinates.
      ctx.strokeStyle = palette.textMedium;
      ctx.beginPath();
      ctx.moveTo(x1, targetY);
      ctx.lineTo(x1, stopY);
      ctx.stroke();
      const center = (x1 + x2) / 2;
      label(
        compact
          ? `Target · ${ratio}R`
          : `Target ${drawing.target.toFixed(0)} · ${ratio}R`,
        center,
        targetY - 12,
      );
      label(
        compact ? "Entry" : `Entry ${drawing.entry.toFixed(0)}`,
        center,
        entryY - 11,
        palette.textMedium,
      );
      label(
        compact ? "Stop · 1R" : `Stop ${drawing.stop.toFixed(0)} · 1R`,
        center,
        stopY + 12,
        loss,
      );
    }
  }
  ctx.restore();
}
