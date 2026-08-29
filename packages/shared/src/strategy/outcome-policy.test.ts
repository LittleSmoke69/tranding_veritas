import { describe, expect, it } from 'vitest';
import { shouldControlledTradeWin } from './outcome-policy.js';

function runSequence(total: number, targetBps: number) {
  let wins = 0;
  for (let settled = 0; settled < total; settled += 1) {
    if (shouldControlledTradeWin(wins, settled, targetBps)) wins += 1;
  }
  return wins;
}

describe('política de taxa de vitórias', () => {
  it.each([
    [10, 9],
    [20, 18],
    [100, 90],
  ])('mantém 90%% em %i operações', (total, expectedWins) => {
    expect(runSequence(total, 9_000)).toBe(expectedWins);
  });

  it('suporta os limites de 0% e 100%', () => {
    expect(runSequence(20, 0)).toBe(0);
    expect(runSequence(20, 10_000)).toBe(20);
  });

  it('rejeita contadores e taxas inválidos', () => {
    expect(() => shouldControlledTradeWin(2, 1, 9_000)).toThrow();
    expect(() => shouldControlledTradeWin(0, 0, 10_001)).toThrow();
  });
});
