import { VeritasLogo } from './VeritasLogo';

const BARS = [18, 24, 21, 30, 27, 38, 34, 45, 41, 54, 48, 62, 58, 70, 64, 76, 69, 82, 75, 88, 80, 94, 86, 98];
const GRID_LINES = [16, 32, 48, 64, 80];

export function TradingLoadingScreen() {
  return (
    <div
      className="relative flex h-dvh items-center justify-center overflow-hidden bg-app px-6 text-ink"
      role="status"
      aria-live="polite"
      aria-label="Preparando o terminal de trading"
    >
      <div className="absolute inset-0 bg-chart" aria-hidden="true">
        {GRID_LINES.map((position) => (
          <span
            key={position}
            className="absolute inset-x-0 border-t border-brand/15"
            style={{ top: `${position}%` }}
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 flex h-[58%] items-end gap-[clamp(4px,1vw,18px)] px-[2vw]">
          {BARS.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="loading-chart-bar w-full origin-bottom rounded-t-[2px] bg-brand/55"
              style={{ height: `${height}%`, animationDelay: `${index * 45}ms` }}
            />
          ))}
        </div>

        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path
            className="loading-chart-line"
            d="M0 650 L90 610 L175 625 L270 540 L365 565 L455 460 L545 490 L640 385 L730 425 L820 315 L915 345 L1005 240 L1100 285 L1190 170 L1290 205 L1380 95 L1440 120"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="loading-chart-line loading-chart-line--secondary"
            d="M0 735 L115 690 L220 705 L320 635 L425 650 L530 570 L635 595 L735 505 L840 535 L945 440 L1050 465 L1155 375 L1260 405 L1365 305 L1440 330"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="loading-logo-panel relative z-10 flex flex-col items-center rounded-panel border border-brand/20 bg-app/75 px-10 py-7 backdrop-blur-sm">
        <div className="loading-logo">
          <VeritasLogo size="lg" />
        </div>
        <p className="u-caps mt-5 text-brand">Preparando seu terminal</p>
        <div className="mt-3 h-1 w-44 overflow-hidden rounded-full bg-elevated">
          <span className="loading-progress block h-full bg-brand" />
        </div>
      </div>
    </div>
  );
}
