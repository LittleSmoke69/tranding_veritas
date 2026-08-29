export function ema(values: number[], period: number): number[] {
  if (!values.length || period <= 0) return [];
  const factor = 2 / (period + 1);
  const out: number[] = [values[0]!];
  for (let index = 1; index < values.length; index += 1) {
    out.push(values[index]! * factor + out[index - 1]! * (1 - factor));
  }
  return out;
}

export function rsi(values: number[], period = 14): number {
  if (values.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let index = values.length - period; index < values.length; index += 1) {
    const delta = values[index]! - values[index - 1]!;
    if (delta > 0) gains += delta;
    else losses -= delta;
  }
  if (losses === 0) return gains === 0 ? 50 : 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

export function atr(
  candles: { high: number; low: number; close: number }[],
  period = 14,
): number {
  if (candles.length < 2) return 0;
  const ranges: number[] = [];
  for (let index = 1; index < candles.length; index += 1) {
    const candle = candles[index]!;
    const prior = candles[index - 1]!;
    ranges.push(Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - prior.close),
      Math.abs(candle.low - prior.close),
    ));
  }
  const sample = ranges.slice(-period);
  return sample.reduce((sum, value) => sum + value, 0) / sample.length;
}
