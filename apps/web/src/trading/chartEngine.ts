export type ChartInterval = 5 | 15 | 60 | 300;

export type Candle = {
  time: number; // unix sec — início alinhado da vela
  open: number;
  high: number;
  low: number;
  close: number;
};

/** Início da vela alinhado ao relógio (ex.: 1m → :00, 5m → :00/:05/:10…). */
export function barTime(nowSec: number, intervalSec: ChartInterval): number {
  return Math.floor(nowSec / intervalSec) * intervalSec;
}

/** Segundos restantes até fechar a vela corrente. */
export function barRemaining(nowSec: number, intervalSec: ChartInterval): number {
  const start = barTime(nowSec, intervalSec);
  return Math.max(0, start + intervalSec - nowSec);
}

export function formatBarLabel(timeSec: number, intervalSec: ChartInterval): string {
  const d = new Date(timeSec * 1000);
  if (intervalSec >= 60) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function intervalLabel(intervalSec: ChartInterval): string {
  if (intervalSec < 60) return `${intervalSec}s`;
  if (intervalSec === 60) return '1m';
  return `${intervalSec / 60}m`;
}

/** Quantidade de velas históricas por timeframe (mantém ~mesmo “zoom”). */
export function historyCount(intervalSec: ChartInterval): number {
  if (intervalSec <= 5) return 120;
  if (intervalSec <= 15) return 100;
  if (intervalSec <= 60) return 90;
  return 72; // 5m → 6h
}

export function seedCandles(
  base: number,
  intervalSec: ChartInterval,
  count = historyCount(intervalSec),
): { candles: Candle[] } {
  const candles: Candle[] = [];
  let price = base;
  const now = Math.floor(Date.now() / 1000);
  const start = barTime(now - count * intervalSec, intervalSec);
  // Velas maiores → movimento proporcional (sqrt do tempo)
  const vol = base * 0.0012 * Math.sqrt(intervalSec / 15);

  for (let i = 0; i < count; i++) {
    const time = start + i * intervalSec;
    const open = price;
    const drift = (Math.random() - 0.5) * vol * 2.4;
    const close = Math.max(base * 0.55, open + drift);
    const wick = vol * (0.3 + Math.random());
    const high = Math.max(open, close) + wick;
    const low = Math.min(open, close) - wick;
    candles.push({ time, open, high, low, close });
    price = close;
  }

  return { candles };
}

export type LiveBar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

/**
 * Atualiza a vela do bucket atual (mesmo `time`) ou abre vela nova
 * quando o relógio cruza o intervalo (1m / 5m / …).
 */
export function tickBar(prev: LiveBar | null, price: number, intervalSec: ChartInterval): LiveBar {
  const time = barTime(Math.floor(Date.now() / 1000), intervalSec);
  if (prev && prev.time === time) {
    return {
      time,
      open: prev.open,
      high: Math.max(prev.high, price),
      low: Math.min(prev.low, price),
      close: price,
      volume: prev.volume + Math.random() * 2,
    };
  }
  return {
    time,
    open: price,
    high: price,
    low: price,
    close: price,
    volume: Math.random() * 5 + 1,
  };
}
