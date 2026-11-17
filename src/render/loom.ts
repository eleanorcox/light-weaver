import type { Cloth } from '../core/cloth';
import type { Place } from '../core/programme';

export interface LoomOptions {
  cell: number; // CSS pixels per thread
  picksPerSecond: number;
  // Picks already woven when it starts; by default enough to fill the screen above the fell.
  startPick?: number;
  // Called when the piece at the fell changes, including at the start.
  onPiece?: (place: Place) => void;
}

const BACKGROUND = '#05050a';

// Draws one crossing as a short glowing dash: upright where the warp is on top, level where
// the weft is.
function drawCrossing(ctx: CanvasRenderingContext2D, cloth: Cloth, i: number, j: number, x: number, y: number, c: number): void {
  const up = cloth.warpUp(i, j);
  const colour = up ? cloth.warpColour(i, j) : cloth.weftColour(j, i);
  ctx.strokeStyle = colour;
  ctx.shadowColor = colour;
  ctx.beginPath();
  if (up) {
    ctx.moveTo(x + c / 2, y + c * 0.12);
    ctx.lineTo(x + c / 2, y + c * 0.88);
  } else {
    ctx.moveTo(x + c * 0.12, y + c / 2);
    ctx.lineTo(x + c * 0.88, y + c / 2);
  }
  ctx.stroke();
}

function threadStyle(ctx: CanvasRenderingContext2D, c: number): void {
  ctx.lineWidth = c * 0.62;
  ctx.lineCap = 'round';
  ctx.shadowBlur = c * 0.9;
}

// Weaves the cloth for ever: each pick (one pass of the weft) is carried across by a point of
// light, then joins the woven cloth above, which moves up a row. Woven rows are drawn once
// into an offscreen canvas; the frame copies it and adds the row being woven.
export function startLoom(canvas: HTMLCanvasElement, at: (j: number) => Place | null, options: LoomOptions): () => void {
  const ctx = canvas.getContext('2d')!;
  const woven = document.createElement('canvas');
  const wovenCtx = woven.getContext('2d')!;
  const warp = document.createElement('canvas');
  const warpCtx = warp.getContext('2d')!;

  let width = 0;
  let height = 0;
  let c = options.cell;
  let columns = 0;
  let rowsAbove = 0;
  let fellY = 0;
  let committed = 0; // picks drawn into the woven canvas so far
  let start = performance.now();
  let frame = 0;

  // Draws pick j of the programme; a gap between pieces is left as bare dark loom.
  function drawRowInto(target: CanvasRenderingContext2D, j: number, y: number, upTo: number, fromRight: boolean): void {
    const place = at(j);
    if (!place) return;
    threadStyle(target, c);
    for (let n = 0; n < upTo; n++) {
      const i = fromRight ? columns - 1 - n : n;
      drawCrossing(target, place.piece.cloth, i, place.pick, i * c, y, c);
    }
  }

  let warpCloth: Cloth | null = null;
  let warpFrom = 0; // the pick at the fell when the warp was drawn
  let lastIndex = -1;

  // Rebuilds everything at the current size. The cloth is the same for the same pick numbers,
  // so the visible woven rows can simply be drawn again.
  function layout(): void {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    for (const cv of [canvas, woven, warp]) {
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
    }
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    for (const g of [ctx, wovenCtx, warpCtx]) g.setTransform(dpr, 0, 0, dpr, 0, 0);
    c = options.cell;
    columns = Math.ceil(width / c);
    fellY = Math.round((height * 0.72) / c) * c;
    rowsAbove = Math.ceil(fellY / c);
    // Never show unwoven rows at the top: if the window grew, weave on far enough to fill it.
    const wanted = Math.max(options.startPick ?? 0, rowsAbove);
    if (committed < wanted) {
      start -= ((wanted - committed) / options.picksPerSecond) * 1000;
      committed = wanted;
    }

    wovenCtx.fillStyle = BACKGROUND;
    wovenCtx.fillRect(0, 0, width, height);
    for (let r = 0; r < rowsAbove; r++) {
      const j = committed - rowsAbove + r;
      if (j >= 0) drawRowInto(wovenCtx, j, fellY - (rowsAbove - r) * c, columns, false);
    }

    drawWarp();
  }

  // The unwoven warp below the fell, fading into the dark, for the piece being woven.
  function drawWarp(): void {
    warpCtx.clearRect(0, 0, width, height);
    const cloth = warpCloth;
    if (!cloth) return;
    const warpPick = warpFrom;
    warpCtx.lineWidth = c * 0.3;
    for (let i = 0; i < columns; i++) {
      const g = warpCtx.createLinearGradient(0, fellY, 0, height);
      g.addColorStop(0, cloth.warpColour(i, warpPick));
      g.addColorStop(1, 'transparent');
      warpCtx.strokeStyle = g;
      warpCtx.globalAlpha = 0.45;
      warpCtx.beginPath();
      warpCtx.moveTo(i * c + c / 2, fellY + c);
      warpCtx.lineTo(i * c + c / 2, height);
      warpCtx.stroke();
    }
    warpCtx.globalAlpha = 1;
  }

  function commit(j: number): void {
    const dpr = window.devicePixelRatio || 1;
    // Move the woven cloth up one row, then draw the finished pick at the bottom.
    wovenCtx.save();
    wovenCtx.setTransform(1, 0, 0, 1, 0, 0);
    wovenCtx.globalCompositeOperation = 'copy';
    wovenCtx.drawImage(woven, 0, -c * dpr);
    wovenCtx.restore();
    wovenCtx.fillStyle = BACKGROUND;
    wovenCtx.fillRect(0, fellY - c, width, height - fellY + c);
    drawRowInto(wovenCtx, j, fellY - c, columns, j % 2 === 1);
  }

  function draw(now: number): void {
    const progress = ((now - start) / 1000) * options.picksPerSecond;
    const pick = Math.floor(progress);
    while (committed < pick) commit(committed++);

    const place = at(pick);
    if (place && place.index !== lastIndex) {
      lastIndex = place.index;
      warpCloth = place.piece.cloth;
      warpFrom = place.pick;
      drawWarp();
      options.onPiece?.(place);
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.drawImage(woven, 0, 0, width, height);
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, fellY, width, height - fellY);
    ctx.drawImage(warp, 0, 0, width, height);

    // The pick being woven, revealed behind the shuttle, which runs the other way each time.
    const fromRight = pick % 2 === 1;
    const reached = Math.floor((progress - pick) * columns);
    drawRowInto(ctx, pick, fellY, reached, fromRight);

    if (place) {
      const sx = fromRight ? width - reached * c : reached * c;
      const sy = fellY + c / 2;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, c * 5);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.15, place.piece.cloth.weftColour(place.pick, reached));
      glow.addColorStop(1, 'transparent');
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = glow;
      ctx.fillRect(sx - c * 5, sy - c * 5, c * 10, c * 10);
    }

    frame = requestAnimationFrame(draw);
  }

  // layout() starts part-way through, with cloth already woven, rather than on an empty screen.
  layout();
  window.addEventListener('resize', layout);
  frame = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', layout);
  };
}
