import { describe, expect, it } from 'vitest';
import {
  DEMO_CREDIT_CENTS,
  SPOT_TAKER_FEE_BPS,
  QTY_SCALE,
  add,
  cents,
  formatBrl,
  mulBps,
  mulPpm,
  notionalCents,
  qty,
  qtyFromNotional,
  roundDivHalfEven,
  sub,
} from './money.js';

describe('Money', () => {
  it('rejeita float em cents()', () => {
    expect(() => cents(1.5 as unknown as number)).toThrow(/não inteiro/);
  });

  it('add/sub com bigint', () => {
    expect(add(100n, 50n)).toBe(150n);
    expect(sub(100n, 30n)).toBe(70n);
  });

  it('roundDivHalfEven: meio vai para par', () => {
    // 5/2 = 2.5 → 2 (par)
    expect(roundDivHalfEven(5n, 2n)).toBe(2n);
    // 7/2 = 3.5 → 4 (ímpar 3 → sobe)
    expect(roundDivHalfEven(7n, 2n)).toBe(4n);
  });

  it('taxa spot 0,10% via bps', () => {
    const bruto = 1_000_000n; // R$ 10.000
    const taxa = mulBps(bruto, SPOT_TAKER_FEE_BPS);
    expect(taxa).toBe(1_000n); // R$ 10,00
  });

  it('spread 0,05% via ppm', () => {
    const mid = 10_000_00n; // R$ 10.000,00 em centavos
    expect(mulPpm(mid, 500n)).toBe(5_00n); // R$ 5,00
  });

  it('notional e qty round-trip aproximado', () => {
    const price = 100_00n; // R$ 100,00
    const q = QTY_SCALE; // 1.00000000
    const n = notionalCents(q, price);
    expect(n).toBe(100_00n);
    expect(qtyFromNotional(n, price)).toBe(QTY_SCALE);
  });

  it('saldo exato zero', () => {
    expect(mulBps(0n, SPOT_TAKER_FEE_BPS)).toBe(0n);
    expect(notionalCents(0n, 100n)).toBe(0n);
  });

  it('demo credit = R$ 10.000,00', () => {
    expect(DEMO_CREDIT_CENTS).toBe(1_000_000n);
    expect(formatBrl(DEMO_CREDIT_CENTS)).toBe('R$ 10000,00');
  });

  it('qty() aceita string inteira', () => {
    expect(qty('100000000')).toBe(QTY_SCALE);
  });

  it('partida conceitual: crédito + débito = 0', () => {
    const credit = DEMO_CREDIT_CENTS;
    const debit = -DEMO_CREDIT_CENTS;
    expect(add(credit, debit)).toBe(0n);
  });
});
