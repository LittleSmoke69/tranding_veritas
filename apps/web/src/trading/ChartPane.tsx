import { CandlestickChart, LineChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AssetMark } from '../components/AssetMark';
import { Icon, type IconName } from '../components/Icon';
import { WorldWatermark } from '../components/WorldWatermark';
import { categoryLabel, formatAssetPrice, type TradingAsset } from '../data/assets';
import { api } from '../lib/api';
import {
  barRemaining,
  formatBarLabel,
  historyCount,
  intervalLabel,
  seedCandles,
  tickBar,
  type ChartInterval,
  type LiveBar,
} from './chartEngine';
import type { BinaryPosition } from './PositionsBar';

echarts.use([CandlestickChart, LineChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer]);

/** Moldura do plot. Valores base; ajustados por largura em telas menores. */
const DEFAULT_GRID = { left: 64, right: 84, top: 56, bottom: 34 };

function chartGridForWidth(width: number) {
  if (width < 480) return { left: 40, right: 54, top: 48, bottom: 42 };
  if (width < 768) return { left: 48, right: 62, top: 52, bottom: 36 };
  return DEFAULT_GRID;
}

const INTERVALS: { id: ChartInterval; label: string }[] = [
  { id: 15, label: '15s' },
  { id: 60, label: '1m' },
  { id: 300, label: '5m' },
];

type ChartKind = 'candle' | 'line';

type ChartPaneProps = {
  asset: TradingAsset;
  positions: BinaryPosition[];
  onPrice?: (price: number) => void;
  onOpenPicker: () => void;
};

type OverlayGeom = {
  priceY: number;
  tipX: number;
  tipY: number;
  width: number;
  height: number;
  grid: typeof DEFAULT_GRID;
  positions: {
    id: string;
    color: string;
    entryY: number;
    entryX: number;
    expX: number;
    stake: string;
    side: 'up' | 'down';
    remainSec: number;
  }[];
};

type Tokens = Record<string, string>;
type MarketCandleResponse = {
  candles: { time: number; open: number; high: number; low: number; close: number }[];
};
type MarketTicker = { symbol: string; time: number; price: number };

/** Lê os tokens do tema para dentro do ECharts (que não aceita var()). */
function readTokens(): Tokens {
  const cs = getComputedStyle(document.documentElement);
  const get = (n: string) => cs.getPropertyValue(n).trim();
  return {
    bull: get('--bull') || '#34b565',
    bear: get('--bear') || '#c4573d',
    grid: get('--grid') || 'rgba(255,255,255,0.06)',
    muted: get('--text-muted') || '#8a99a8',
    ink: get('--text-primary') || '#e6edf3',
    panel: get('--bg-panel') || '#16202b',
    border: get('--border') || '#2a3744',
  };
}

function fmtCountdown(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** Separa os 3 últimos dígitos do preço para o realce do badge. */
function splitPrice(text: string): [string, string] {
  let cut = Math.max(0, text.length - 3);
  if (/[.,]/.test(text[cut] ?? '')) cut += 1;
  return [text.slice(0, cut), text.slice(cut)];
}

function seriesFor(kind: ChartKind, ohlc: number[][], t: Tokens, name: string) {
  if (kind === 'line') {
    return {
      id: 'price',
      type: 'line' as const,
      name,
      data: ohlc.map((c) => c[1]),
      showSymbol: false,
      lineStyle: { color: t.ink, width: 1.5, opacity: 0.9 },
    };
  }
  return {
    id: 'price',
    type: 'candlestick' as const,
    name,
    data: ohlc,
    // corpo cheio: a borda usa a MESMA cor do preenchimento, então some;
    // a mesma largura desenha o pavio (1,5px) na cor do corpo.
    barCategoryGap: '28%',
    itemStyle: {
      color: t.bull,
      color0: t.bear,
      borderColor: t.bull,
      borderColor0: t.bear,
      borderWidth: 1.5,
    },
  };
}

function ToolButton({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      aria-pressed={active}
      title={disabled ? `${label} — em breve` : label}
      aria-label={disabled ? `${label} — em breve` : label}
      className={`u-focus flex h-10 w-10 items-center justify-center rounded-ctl border transition ${
        disabled
          ? 'cursor-not-allowed border-line/60 bg-panel/70 text-faint/60'
          : active
            ? 'border-brand bg-brand/15 text-brand'
            : 'border-line bg-panel/85 text-muted backdrop-blur hover:bg-elevated hover:text-ink'
      }`}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

export function ChartPane({ asset, positions, onPrice, onOpenPicker }: ChartPaneProps) {
  const paneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const barRef = useRef<LiveBar | null>(null);
  const priceRef = useRef(asset.price);
  const timesRef = useRef<number[]>([]);
  const ohlcRef = useRef<number[][]>([]);
  const positionsRef = useRef(positions);
  const onPriceRef = useRef(onPrice);
  const intervalRef = useRef<ChartInterval>(15);
  const kindRef = useRef<ChartKind>('candle');
  const tokensRef = useRef<Tokens>({});
  const gridRef = useRef(DEFAULT_GRID);

  const [livePrice, setLivePrice] = useState(asset.price);
  const [intervalSec, setIntervalSec] = useState<ChartInterval>(15);
  const [kind, setKind] = useState<ChartKind>('candle');
  const [sentiment, setSentiment] = useState({ up: 42, down: 58 });
  const [overlay, setOverlay] = useState<OverlayGeom | null>(null);
  const [barRemain, setBarRemain] = useState(15);
  const [tfOpen, setTfOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  positionsRef.current = positions;
  onPriceRef.current = onPrice;
  intervalRef.current = intervalSec;
  kindRef.current = kind;

  const openOnAsset = useMemo(
    () => positions.filter((p) => p.status === 'open' && p.symbol === asset.symbol),
    [positions, asset.symbol],
  );

  const toggleFullscreen = useCallback(() => {
    const el = paneRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  }, []);

  useEffect(() => {
    priceRef.current = asset.price;
    setLivePrice(asset.price);
    onPriceRef.current?.(asset.price);
  }, [asset.symbol, asset.price]);

  useEffect(() => {
    let active = true;
    const update = async () => {
      const ticker = await api<MarketTicker>(`/market/${asset.symbol}/ticker`);
      if (!active) return;
      priceRef.current = ticker.price;
      setLivePrice(ticker.price);
      onPriceRef.current?.(ticker.price);
    };
    void update().catch(() => undefined);
    const timer = window.setInterval(() => void update().catch(() => undefined), 1_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [asset.symbol]);

  // Troca de tipo de gráfico sem re-semear o histórico.
  useEffect(() => {
    const c = chartRef.current;
    if (!c) return;
    c.setOption(
      { series: [seriesFor(kind, ohlcRef.current, tokensRef.current, asset.label)] },
      { replaceMerge: ['series'] },
    );
  }, [kind, asset.label]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const t = readTokens();
    tokensRef.current = t;
    gridRef.current = chartGridForWidth(el.clientWidth);

    const chart = echarts.init(el, undefined, { renderer: 'canvas' });
    chartRef.current = chart;

    const seeded = seedCandles(asset.price, intervalSec);
    timesRef.current = seeded.candles.map((c) => c.time);
    ohlcRef.current = seeded.candles.map((c) => [c.open, c.close, c.low, c.high]);

    const last = seeded.candles[seeded.candles.length - 1];
    if (last) {
      barRef.current = { ...last, volume: 1 };
      priceRef.current = last.close;
      setLivePrice(last.close);
      setBarRemain(barRemaining(Math.floor(Date.now() / 1000), intervalSec));
      onPriceRef.current?.(last.close);
    }

    chart.setOption({
      backgroundColor: 'transparent',
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', lineStyle: { color: 'rgba(255,255,255,0.25)' } },
        backgroundColor: t.panel,
        borderColor: t.border,
        textStyle: { color: t.ink, fontSize: 12 },
      },
      grid: {
        left: gridRef.current.left,
        right: gridRef.current.right,
        top: gridRef.current.top,
        bottom: gridRef.current.bottom,
      },
      xAxis: {
        type: 'category',
        data: timesRef.current.map((x) => formatBarLabel(x, intervalSec)),
        boundaryGap: true,
        axisLine: { lineStyle: { color: t.border } },
        axisLabel: { color: t.muted, fontSize: 12, margin: 12 },
        // sem linhas verticais: só a grade horizontal é desenhada
        splitLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        scale: true,
        position: 'right',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: t.muted,
          fontSize: 12,
          margin: 10,
          formatter: (v: number) => formatAssetPrice(v),
        },
        splitLine: { lineStyle: { color: t.grid } },
      },
      dataZoom: [{ type: 'inside', start: 55, end: 100, zoomOnMouseWheel: true }],
      series: [seriesFor(kindRef.current, ohlcRef.current, t, asset.label)],
    });

    void api<MarketCandleResponse>(
      `/market/${asset.symbol}/candles?interval=${intervalSec}&count=${historyCount(intervalSec)}`,
    ).then((data) => {
      if (chart.isDisposed() || !data.candles.length) return;
      timesRef.current = data.candles.map((candle) => candle.time);
      ohlcRef.current = data.candles.map((candle) => [
        candle.open, candle.close, candle.low, candle.high,
      ]);
      const lastCandle = data.candles.at(-1);
      if (lastCandle) {
        barRef.current = { ...lastCandle, volume: 1 };
        priceRef.current = lastCandle.close;
      }
      chart.setOption({
        xAxis: { data: timesRef.current.map((time) => formatBarLabel(time, intervalSec)) },
        series: [seriesFor(kindRef.current, ohlcRef.current, t, asset.label)],
      });
    }).catch(() => undefined);

    const syncOverlay = () => {
      const c = chartRef.current;
      const n = ohlcRef.current.length;
      if (!c || !n) return;
      const price = priceRef.current;
      const lastIdx = n - 1;
      try {
        const tip = c.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [lastIdx, price]);
        const pricePt = c.convertToPixel({ yAxisIndex: 0 }, price);
        if (!tip || !Array.isArray(tip)) return;
        const [tipX, tipY] = tip;
        const priceY = typeof pricePt === 'number' ? pricePt : tipY;
        const w = el.clientWidth;
        const h = el.clientHeight;
        const grid = gridRef.current;
        const gridRight = w - grid.right;
        const now = Date.now();
        const iv = intervalRef.current;

        const p0 = c.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [Math.max(0, lastIdx - 1), price]) as number[];
        const dx = Math.max(8, tipX - (p0?.[0] ?? tipX - 14) || 14);

        const posGeom = positionsRef.current
          .filter((p) => p.status === 'open' && p.symbol === asset.symbol)
          .map((p) => {
            const expMs = new Date(p.expires_at).getTime();
            const createdMs = p.created_at ? new Date(p.created_at).getTime() : expMs - 30_000;
            const remainSec = (expMs - now) / 1000;
            const elapsedSec = Math.max(0, (now - createdMs) / 1000);
            const entryX = tipX - (elapsedSec / iv) * dx;
            const expX = tipX + (Math.max(0, remainSec) / iv) * dx;
            return {
              id: p.id,
              color: p.side === 'up' ? tokensRef.current.bull : tokensRef.current.bear,
              entryY: c.convertToPixel({ yAxisIndex: 0 }, p.entry_price) as number,
              entryX: Math.max(grid.left + 8, Number.isFinite(entryX) ? entryX : tipX - 40),
              expX: Math.min(gridRight - 8, Number.isFinite(expX) ? expX : tipX + 80),
              stake: p.stake_display,
              side: p.side,
              remainSec,
            };
          });

        setOverlay({ priceY, tipX, tipY, width: w, height: h, grid, positions: posGeom });
      } catch {
        /* gráfico ainda não pronto */
      }
    };

    let raf = 0;
    let lastTick = 0;
    const maxBars = historyCount(intervalSec) + 20;

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const iv = intervalRef.current;
      setBarRemain(barRemaining(Math.floor(Date.now() / 1000), iv));

      if (ts - lastTick < 80) {
        return;
      }
      lastTick = ts;

      const next = priceRef.current;

      const updated = tickBar(barRef.current, next, iv);
      const isNew = !barRef.current || updated.time !== barRef.current.time;
      barRef.current = updated;

      const candle = [updated.open, updated.close, updated.low, updated.high];
      if (isNew) {
        timesRef.current = [...timesRef.current.slice(-(maxBars - 1)), updated.time];
        ohlcRef.current = [...ohlcRef.current.slice(-(maxBars - 1)), candle];
      } else {
        ohlcRef.current = [...ohlcRef.current.slice(0, -1), candle];
      }

      chart.setOption(
        {
          xAxis: { data: timesRef.current.map((x) => formatBarLabel(x, iv)) },
          series: [
            kindRef.current === 'line'
              ? { id: 'price', data: ohlcRef.current.map((c) => c[1]) }
              : { id: 'price', data: ohlcRef.current },
          ],
        },
        { lazyUpdate: true },
      );

      if (Math.random() < 0.08) {
        setSentiment((s) => {
          const up = Math.min(95, Math.max(5, s.up + Math.round((Math.random() - 0.5) * 6)));
          return { up, down: 100 - up };
        });
      }

      syncOverlay();
    };
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      const nextGrid = chartGridForWidth(el.clientWidth);
      gridRef.current = nextGrid;
      chart.setOption({
        grid: {
          left: nextGrid.left,
          right: nextGrid.right,
          top: nextGrid.top,
          bottom: nextGrid.bottom,
        },
      });
      chart.resize();
      syncOverlay();
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
      barRef.current = null;
    };
  }, [asset.symbol, asset.price, asset.label, intervalSec]);

  const priceText = formatAssetPrice(livePrice);
  const [priceHead, priceTail] = splitPrice(priceText);

  return (
    <div ref={paneRef} className="relative h-full min-h-0 min-w-0 overflow-hidden bg-chart">
      {/* Marca d'água — atrás dos candles */}
      <WorldWatermark className="pointer-events-none absolute inset-x-[12%] inset-y-[14%] h-[72%] w-[76%]" />

      {/* Cabeçalho flutuante */}
      <div className="absolute left-2 top-2 z-[var(--z-chart-ui)] flex max-w-[calc(100%-5.5rem)] items-center gap-1 rounded-btn border border-line bg-panel/85 py-1 pl-1.5 pr-1 backdrop-blur sm:left-3 sm:top-3 sm:max-w-none">
        <button
          type="button"
          onClick={onOpenPicker}
          className="u-focus flex items-center gap-2 rounded-ctl px-1.5 py-1 transition hover:bg-elevated"
          aria-label={`Ativo ${asset.name}. Trocar de ativo`}
        >
          <AssetMark asset={asset} size={26} />
          <span className="text-left leading-none">
            <span className="flex items-center gap-1 text-[13px] font-semibold text-ink">
              {asset.name}
              <Icon name="chevronDown" size={13} className="text-muted" />
            </span>
            <span className="u-caps mt-1 hidden sm:block">{categoryLabel(asset.category)}</span>
          </span>
        </button>

        <span className="mx-0.5 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />

        <span className="u-num px-1 text-[12px] font-semibold text-ink sm:text-[13px]">{priceText}</span>

        <span className="mx-0.5 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />

        <span className="hidden items-center gap-0.5 sm:flex">
          <button type="button" aria-label="Informações do ativo" className="u-focus flex h-7 w-7 items-center justify-center rounded-ctl text-muted transition hover:bg-elevated hover:text-ink">
            <Icon name="info" size={15} />
          </button>
          <button type="button" aria-label="Criar alerta de preço" className="u-focus flex h-7 w-7 items-center justify-center rounded-ctl text-muted transition hover:bg-elevated hover:text-ink">
            <Icon name="bell" size={15} />
          </button>
          <button
            type="button"
            onClick={() => setFavorite((v) => !v)}
            aria-pressed={favorite}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className={`u-focus flex h-7 w-7 items-center justify-center rounded-ctl transition hover:bg-elevated ${
              favorite ? 'text-accent' : 'text-muted hover:text-ink'
            }`}
          >
            <Icon name="star" size={15} />
          </button>
        </span>
      </div>

      {/* Barra de ferramentas flutuante */}
      <div className="absolute left-2 top-[56px] z-[var(--z-chart-ui)] flex flex-col gap-1 sm:left-3 sm:top-[68px] sm:gap-1.5">
        <ToolButton
          icon="candles"
          label={kind === 'candle' ? 'Tipo de gráfico: velas' : 'Tipo de gráfico: linha'}
          active={kind === 'candle'}
          onClick={() => setKind((k) => (k === 'candle' ? 'line' : 'candle'))}
        />
        <div className="relative">
          <ToolButton
            icon="timer"
            label={`Timeframe: ${intervalLabel(intervalSec)}`}
            active={tfOpen}
            onClick={() => setTfOpen((v) => !v)}
          />
          {tfOpen && (
            <div
              role="radiogroup"
              aria-label="Timeframe"
              className="absolute left-0 top-11 flex max-w-[calc(100vw-2rem)] flex-wrap gap-1 rounded-ctl border border-line bg-panel p-1 shadow-[var(--shadow-float)] sm:left-12 sm:top-0 sm:max-w-none sm:flex-nowrap"
            >
              {INTERVALS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  role="radio"
                  aria-checked={i.id === intervalSec}
                  onClick={() => {
                    setIntervalSec(i.id);
                    setTfOpen(false);
                  }}
                  className={`u-focus u-num rounded-ctl px-2.5 py-1.5 text-[11px] font-semibold transition ${
                    i.id === intervalSec ? 'bg-brand/15 text-brand' : 'text-muted hover:bg-elevated hover:text-ink'
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <ToolButton icon="sliders" label="Indicadores" disabled />
        <ToolButton icon="pen" label="Desenho" disabled />
        <ToolButton icon="expand" label="Tela cheia" onClick={toggleFullscreen} />
      </div>

      {/* Termômetro de sentimento */}
      <div
        className="absolute bottom-3 left-3 z-[var(--z-chart-ui)] flex w-8 flex-col overflow-hidden rounded-ctl border border-line [@media(max-height:640px)]:hidden"
        role="img"
        aria-label={`Sentimento do mercado: ${sentiment.up}% em alta, ${sentiment.down}% em baixa`}
      >
        <span
          className="u-num flex items-center justify-center bg-bull py-1 font-cond text-[10px] font-semibold text-on-bull"
          style={{ height: `${sentiment.up * 1.5}px` }}
        >
          {sentiment.up >= 16 ? `${sentiment.up}%` : ''}
        </span>
        <span
          className="u-num flex items-center justify-center bg-bear-fill py-1 font-cond text-[10px] font-semibold text-white"
          style={{ height: `${sentiment.down * 1.5}px` }}
        >
          {sentiment.down >= 16 ? `${sentiment.down}%` : ''}
        </span>
      </div>

      <div ref={wrapRef} className="h-full w-full" />

      {/* Sobreposições: posições, linha de preço e badge */}
      {overlay && (
        <svg
          className="pointer-events-none absolute inset-0 z-[var(--z-chart-overlay)]"
          width={overlay.width}
          height={overlay.height}
        >
          {overlay.positions.map((p) => (
            <g key={p.id}>
              <line x1={overlay.grid.left} x2={p.expX} y1={p.entryY} y2={p.entryY} stroke={p.color} strokeWidth={1.5} />
              <rect
                x={Math.max(overlay.grid.left + 4, p.entryX - 28)}
                y={p.entryY - 10}
                width={56}
                height={20}
                rx={4}
                fill={p.color}
              />
              <text
                x={Math.max(overlay.grid.left + 32, p.entryX)}
                y={p.entryY + 4}
                textAnchor="middle"
                fill={p.side === 'up' ? 'var(--on-bull)' : '#fff'}
                fontSize="10"
                fontWeight="600"
              >
                {p.stake.replace(/\s/g, '')}
              </text>
              <line
                x1={p.expX}
                x2={p.expX}
                y1={overlay.grid.top}
                y2={overlay.height - overlay.grid.bottom}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text x={p.expX} y={overlay.grid.top + 14} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="600">
                {fmtCountdown(p.remainSec)}
              </text>
              <text x={p.expX} y={overlay.grid.top + 26} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                EXPIRAÇÃO
              </text>
              <circle cx={p.expX} cy={p.entryY} r={4.5} fill={p.color} />
            </g>
          ))}

          {/* Linha de preço atual — tracejada, branca a 60% */}
          <line
            x1={overlay.grid.left}
            x2={overlay.width - overlay.grid.right}
            y1={overlay.priceY}
            y2={overlay.priceY}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <circle
            cx={overlay.tipX}
            cy={overlay.tipY}
            r={4}
            className="animate-pulse"
            fill={
              (ohlcRef.current.at(-1)?.[1] ?? 0) >= (ohlcRef.current.at(-1)?.[0] ?? 0)
                ? 'var(--bull)'
                : 'var(--bear)'
            }
          />

          {/* Badge pentagonal no eixo de preço */}
          <g transform={`translate(${overlay.width - overlay.grid.right}, ${overlay.priceY})`}>
            <path
              d={`M0 0 L9 -11 L${overlay.grid.right - 4} -11 L${overlay.grid.right - 4} 11 L9 11 Z`}
              fill="var(--surface-bright)"
            />
            <text x={14} y={4} fontSize="11" fontWeight="700" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <tspan fill="var(--on-bright)">{priceHead}</tspan>
              <tspan fill="var(--bear-ink)">{priceTail}</tspan>
            </text>
          </g>
        </svg>
      )}

      {/* Cronômetro da vela — deslocado no mobile para não cobrir o botão Ordem */}
      <div className="pointer-events-none absolute bottom-14 right-3 z-[var(--z-chart-ui)] flex max-w-[calc(100%-6rem)] items-center gap-2 rounded-ctl border border-line bg-panel/85 px-2 py-1 backdrop-blur lg:bottom-3 lg:max-w-none">
        <span className="u-caps">Vela {intervalLabel(intervalSec)}</span>
        <span className="u-num text-[12px] font-semibold text-ink">{fmtCountdown(barRemain)}</span>
        {openOnAsset.length > 0 && (
          <>
            <span className="h-3.5 w-px bg-line" aria-hidden="true" />
            <span className="u-num text-[11px] text-muted">
              {openOnAsset.length} {openOnAsset.length === 1 ? 'posição' : 'posições'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
