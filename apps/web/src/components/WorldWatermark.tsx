/**
 * Mapa-múndi pontilhado usado como marca d'água atrás dos candles.
 *
 * A massa continental é uma grade 64×32 (equirretangular aproximada):
 * cada linha lista os intervalos [colInício, colFim] que são terra.
 * Os pontos viram UM único <path> — cada subpath `h0` com ponta redonda
 * rende um ponto — em vez de ~1.100 <circle>, que pesariam no DOM.
 */
const LAND: Record<number, [number, number][]> = {
  1: [[10, 16], [24, 27], [46, 56]],
  2: [[6, 18], [23, 28], [44, 58]],
  3: [[4, 19], [23, 28], [33, 35], [42, 59]],
  4: [[3, 20], [23, 28], [31, 36], [40, 60]],
  5: [[3, 21], [24, 28], [30, 38], [40, 61]],
  6: [[3, 21], [29, 39], [41, 61]],
  7: [[4, 21], [29, 40], [42, 60]],
  8: [[5, 21], [30, 40], [42, 59]],
  9: [[6, 21], [30, 41], [43, 58], [60, 61]],
  10: [[7, 20], [31, 40], [43, 57], [59, 60]],
  11: [[8, 19], [31, 38], [42, 55], [58, 59]],
  12: [[9, 18], [31, 37], [42, 52]],
  13: [[11, 17], [31, 37], [42, 50]],
  14: [[13, 16], [31, 38], [43, 49], [52, 55]],
  15: [[15, 18], [31, 39], [44, 48], [52, 56]],
  16: [[17, 24], [30, 39], [52, 57]],
  17: [[17, 24], [30, 39], [53, 58]],
  18: [[18, 24], [30, 40], [53, 59]],
  19: [[18, 23], [31, 40], [52, 59]],
  20: [[18, 23], [31, 40], [53, 59]],
  21: [[19, 23], [32, 40], [52, 59]],
  22: [[19, 23], [32, 39], [52, 59]],
  23: [[19, 22], [33, 38], [53, 58], [61, 63]],
  24: [[19, 22], [34, 37], [54, 57], [61, 62]],
  25: [[19, 21]],
  26: [[19, 21]],
  27: [[19, 20]],
};

const DOTS = Object.entries(LAND)
  .flatMap(([row, spans]) =>
    spans.flatMap(([from, to]) => {
      const y = Number(row) + 0.5;
      const out: string[] = [];
      for (let col = from; col <= to; col++) out.push(`M${col + 0.5} ${y}h0`);
      return out;
    }),
  )
  .join('');

export function WorldWatermark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 32"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={DOTS}
        stroke="var(--watermark)"
        strokeWidth={0.62}
        strokeLinecap="round"
        fill="none"
        opacity={0.35}
      />
    </svg>
  );
}
