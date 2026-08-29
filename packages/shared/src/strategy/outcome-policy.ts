export function shouldControlledTradeWin(
  priorWins: number,
  priorTotal: number,
  targetWinRateBps: number,
): boolean {
  if (!Number.isInteger(priorWins) || !Number.isInteger(priorTotal)) {
    throw new Error('Contadores de operações devem ser inteiros.');
  }
  if (priorWins < 0 || priorTotal < priorWins) {
    throw new Error('Contadores de operações inválidos.');
  }
  if (!Number.isInteger(targetWinRateBps) || targetWinRateBps < 0 || targetWinRateBps > 10_000) {
    throw new Error('Taxa de vitórias inválida.');
  }
  const requiredWins = Math.round((priorTotal + 1) * targetWinRateBps / 10_000);
  return priorWins < requiredWins;
}
