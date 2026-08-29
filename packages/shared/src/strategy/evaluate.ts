import { atr, ema, rsi } from './indicators.js';
import type { RobotProfile } from './profiles.js';

export type StrategyCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type StrategyDecision = {
  decision: 'enter' | 'skip';
  side: 'up' | 'down' | null;
  confidence: number;
  reason: string;
  indicators: { ema9: number; ema21: number; rsi14: number; atr14: number };
};

export function evaluateStrategy(
  candles: StrategyCandle[],
  profile: RobotProfile,
): StrategyDecision {
  const closes = candles.map((candle) => candle.close);
  const fast = ema(closes, 9).at(-1) ?? 0;
  const slow = ema(closes, 21).at(-1) ?? 0;
  const momentum = rsi(closes);
  const volatility = atr(candles);
  const current = closes.at(-1) ?? 0;
  const indicators = { ema9: fast, ema21: slow, rsi14: momentum, atr14: volatility };
  if (candles.length < 24 || current <= 0) {
    return { decision: 'skip', side: null, confidence: 0, reason: 'Histórico insuficiente', indicators };
  }

  const direction: 'up' | 'down' = fast >= slow ? 'up' : 'down';
  const checks = [
    direction === 'up' ? fast > slow : fast < slow,
    direction === 'up' ? momentum >= 52 : momentum <= 48,
    direction === 'up' ? current >= slow : current <= slow,
  ];
  const confirmations = checks.filter(Boolean).length;
  const atrPct = current > 0 ? volatility / current : 0;
  const volatilityLimit = profile.code === 'conservative'
    ? 4 / 1000
    : profile.code === 'moderate'
      ? 8 / 1000
      : 2 / 100;
  if (atrPct > volatilityLimit) {
    return { decision: 'skip', side: null, confidence: 25, reason: 'Volatilidade acima do limite', indicators };
  }
  if (confirmations < profile.confirmationLevel) {
    return {
      decision: 'skip',
      side: null,
      confidence: Math.round(confirmations / 3 * 100),
      reason: 'Sinal sem confirmações suficientes',
      indicators,
    };
  }
  return {
    decision: 'enter',
    side: direction,
    confidence: Math.min(95, 55 + confirmations * 12),
    reason: 'Tendência, momentum e preço avaliados',
    indicators,
  };
}
