import { type CSSProperties, useEffect, useState } from 'react';
import logo1 from '../landing/assets/logo_1.png';
import '../landing/landing.css';

const BARS = [18, 24, 21, 30, 27, 38, 34, 45, 41, 54, 48, 62, 58, 70, 64, 76, 69, 82, 75, 88, 80, 94, 86, 98];
const GRID_LINES = [16, 32, 48, 64, 80];

const STEPS = [
  'Conectando com sua conta…',
  'Sincronizando saldo e posições…',
  'Carregando cotações em tempo real…',
  'Quase pronto…',
];

const DURATION_MS = 2_300;

export function TradingLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setProgress(pct);
      setStep(Math.min(STEPS.length - 1, Math.floor((elapsed / DURATION_MS) * STEPS.length)));
      if (pct >= 100) window.clearInterval(timer);
    }, 60);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="veritas-landing grid-bg relative flex h-dvh items-center justify-center overflow-hidden px-6"
      style={{
        background: 'var(--background)',
        '--primary': '#2e64ff',
        '--primary-dim': 'rgba(46,100,255,0.12)',
        '--primary-border': 'rgba(46,100,255,0.22)',
        '--primary-glow': 'rgba(46,100,255,0.18)',
      } as CSSProperties}
      role="status"
      aria-live="polite"
      aria-label="Preparando o acesso à plataforma Veritas"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(46,100,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />

      <div className="absolute inset-0" aria-hidden="true">
        {GRID_LINES.map((position) => (
          <span
            key={position}
            className="absolute inset-x-0 border-t"
            style={{ top: `${position}%`, borderColor: 'var(--primary-border)', opacity: 0.5 }}
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 flex h-[58%] items-end gap-[clamp(4px,1vw,18px)] px-[2vw]">
          {BARS.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="loading-chart-bar w-full origin-bottom rounded-t-[2px]"
              style={{ height: `${height}%`, animationDelay: `${index * 45}ms`, background: 'var(--primary-border)' }}
            />
          ))}
        </div>

        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path
            className="loading-chart-line"
            d="M0 650 L90 610 L175 625 L270 540 L365 565 L455 460 L545 490 L640 385 L730 425 L820 315 L915 345 L1005 240 L1100 285 L1190 170 L1290 205 L1380 95 L1440 120"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="loading-chart-line loading-chart-line--secondary"
            d="M0 735 L115 690 L220 705 L320 635 L425 650 L530 570 L635 595 L735 505 L840 535 L945 440 L1050 465 L1155 375 L1260 405 L1365 305 L1440 330"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        className="bento-card loading-logo-panel relative z-10 flex w-full max-w-[360px] flex-col items-center px-8 py-8 text-center backdrop-blur-sm"
        style={{ background: 'rgba(8,12,24,0.75)' }}
      >
        <span
          className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: 'var(--primary-dim)',
            border: '1px solid var(--primary-border)',
            color: 'var(--primary)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}
            aria-hidden="true"
          />
          Ambiente de simulação
        </span>

        <img
          src={logo1}
          alt="Veritas"
          className="loading-logo h-16 w-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(46,100,255,0.3))' }}
        />

        <p className="mt-5 text-lg font-bold" style={{ color: 'var(--foreground)' }}>
          Preparando sua plataforma
        </p>
        <p
          className="mt-1.5 min-h-[18px] text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {STEPS[step]}
        </p>

        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <span
            className="block h-full rounded-full transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%`, background: 'var(--primary)', boxShadow: '0 0 12px var(--primary-glow)' }}
          />
        </div>
        <p className="u-num mt-2 text-xs font-semibold" style={{ color: 'var(--primary)' }}>
          {progress}%
        </p>
      </div>
    </div>
  );
}
