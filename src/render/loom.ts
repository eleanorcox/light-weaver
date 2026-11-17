import type { Cloth } from '../core/cloth';

export interface LoomOptions {
  cell: number; // CSS pixels per thread
  picksPerSecond: number;
  // Picks already woven when it starts; by default enough to fill the screen above the fell.
  startPick?: number;
}

const BACKGROUND = '#05050a';

// Draws one crossing as a short glowing dash: upright where the warp is on top, level where
// the weft is.
function drawCrossing(ctx: CanvasRenderingContext2D, cloth: Cloth, i: number, j: number, x: number, y: number, c: number): void {
  const up = cloth.warpUp(i, j);
  const colour = up ? cloth.warpColour(i) : cloth.weftColour(j);
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
export function startLoom(canvas: HTMLCanvasElement, cloth: Cloth, options: LoomOptions): () => void {
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

  function drawRowInto(target: CanvasRenderingContext2D, j: number, y: number, upTo: number, fromRight: boolean): void {
    threadStyle(target, c);
    for (let n = 0; n < upTo; n++) {
      const i = fromRight ? columns - 1 - n : n;
      drawCrossing(target, cloth, i, j, i * c, y, c);
    }
  }

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

    // The unwoven warp below the fell, fading into the dark.
    warpCtx.clearRect(0, 0, width, height);
    warpCtx.lineWidth = c * 0.3;
    for (let i = 0; i < columns; i++) {
      const g = warpCtx.createLinearGradient(0, fellY, 0, height);
      g.addColorStop(0, cloth.warpColour(i));
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

    const sx = fromRight ? width - reached * c : reached * c;
    const sy = fellY + c / 2;
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, c * 5);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.15, cloth.weftColour(pick));
    glow.addColorStop(1, 'transparent');
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = glow;
    ctx.fillRect(sx - c * 5, sy - c * 5, c * 10, c * 10);

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
