import { describe, expect, it } from 'vitest';
import { evaluateStrategy } from './evaluate.js';
import { ema, rsi } from './indicators.js';
import { ROBOT_PROFILES } from './profiles.js';

describe('indicadores dos robôs', () => {
  it('calcula EMA sem perder o tamanho da série', () => {
    expect(ema([1, 2, 3, 4], 3)).toHaveLength(4);
    expect(ema([1, 2, 3, 4], 3).at(-1)).toBeGreaterThan(2);
  });

  it('identifica momentum comprador no RSI', () => {
    const values = Array.from({ length: 20 }, (_, index) => 100 + index);
    expect(rsi(values)).toBe(100);
  });

  it('mantém as faixas de meta aprovadas', () => {
    expect(ROBOT_PROFILES.conservative.targetMinBps).toBe(50);
    expect(ROBOT_PROFILES.moderate.targetMaxBps).toBe(400);
    expect(ROBOT_PROFILES.aggressive.targetMaxBps).toBe(800);
  });

  it('não opera sem histórico suficiente', () => {
    const candles = Array.from({ length: 10 }, (_, index) => ({
      time: index,
      open: 100,
      high: 101,
      low: 99,
      close: 100 + index / 10,
    }));
    expect(evaluateStrategy(candles, ROBOT_PROFILES.conservative).decision).toBe('skip');
  });
});
