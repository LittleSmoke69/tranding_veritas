/**
 * Money — aritmética monetária só com inteiros (BIGINT / bigint).
 *
 * - Valores em BRL: centavos (1 BRL = 100).
 * - Quantidades de ativo: unidades de 1e-8 (QTY_SCALE = 100_000_000n).
 * - Preços: centavos por unidade inteira do ativo (mesmo tick em centavos).
 *
 * Nenhum Number float no caminho de cálculo.
 */

/** Escala de quantidade: 1 unidade = 1e8 unidades atômicas. */
export const QTY_SCALE = 100_000_000n;

/** Escala de centavos: 1 BRL = 100 centavos. */
export const CENT_SCALE = 100n;

export type Cents = bigint;
export type Qty = bigint;

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoneyError';
  }
}

function asBigInt(value: bigint | number | string, label: string): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      throw new MoneyError(`${label}: número não inteiro rejeitado (${value})`);
    }
    return BigInt(value);
  }
  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
    return BigInt(value.trim());
  }
  throw new MoneyError(`${label}: valor inválido`);
}

export function cents(value: bigint | number | string): Cents {
  return asBigInt(value, 'cents');
}

export function qty(value: bigint | number | string): Qty {
  return asBigInt(value, 'qty');
}

export function add(a: Cents, b: Cents): Cents {
  return a + b;
}

export function sub(a: Cents, b: Cents): Cents {
  return a - b;
}

export function neg(a: Cents): Cents {
  return -a;
}

/**
 * Arredondamento half-even (banker's rounding) para divisão inteira.
 * quotient = round(numer / denom) com empate → múltiplo par de 1.
 */
export function roundDivHalfEven(numer: bigint, denom: bigint): bigint {
  if (denom === 0n) throw new MoneyError('divisão por zero');
  const sign = numer < 0n !== denom < 0n ? -1n : 1n;
  const n = numer < 0n ? -numer : numer;
  const d = denom < 0n ? -denom : denom;
  const q = n / d;
  const r = n % d;
  if (r === 0n) return sign * q;
  const twice = r * 2n;
  if (twice < d) return sign * q;
  if (twice > d) return sign * (q + 1n);
  // exatamente meio: half-even
  return sign * (q % 2n === 0n ? q : q + 1n);
}

/**
 * Taxa em basis points (1 bps = 0,01% = 1/10_000).
 * Ex.: 10 bps = 0,10% taker spot → mulBps(bruto, 10n)
 */
export function mulBps(amount: Cents, bps: bigint): Cents {
  if (bps < 0n) throw new MoneyError('bps negativo');
  return roundDivHalfEven(amount * bps, 10_000n);
}

/**
 * Taxa em parts-per-million (1 ppm = 1/1_000_000).
 * Spread 0,05% = 500 ppm.
 */
export function mulPpm(amount: Cents, ppm: bigint): Cents {
  if (ppm < 0n) throw new MoneyError('ppm negativo');
  return roundDivHalfEven(amount * ppm, 1_000_000n);
}

/**
 * bruto = round(qty / QTY_SCALE * priceCents)
 * priceCents = preço em centavos por 1 unidade do ativo.
 */
export function notionalCents(quantity: Qty, priceCents: Cents): Cents {
  if (quantity < 0n || priceCents < 0n) {
    throw new MoneyError('qty/price negativos em notional');
  }
  return roundDivHalfEven(quantity * priceCents, QTY_SCALE);
}

/**
 * qty = round(notionalCents * QTY_SCALE / priceCents)
 */
export function qtyFromNotional(notional: Cents, priceCents: Cents): Qty {
  if (priceCents <= 0n) throw new MoneyError('preço inválido');
  if (notional < 0n) throw new MoneyError('nocional negativo');
  return roundDivHalfEven(notional * QTY_SCALE, priceCents);
}

/** Formatação de exibição apenas (string). Não usar no ledger. */
export function formatBrl(centsValue: Cents): string {
  const negSign = centsValue < 0n;
  const v = negSign ? -centsValue : centsValue;
  const whole = v / CENT_SCALE;
  const frac = v % CENT_SCALE;
  const fracStr = frac.toString().padStart(2, '0');
  return `${negSign ? '-' : ''}R$ ${whole.toString()},${fracStr}`;
}

/** Crédito demo padrão F1: R$ 10000 = 1000000 centavos. */
export const DEMO_CREDIT_CENTS: Cents = 1_000_000n;

/** Spot taker fee: 10 bps = 0,10%. */
export const SPOT_TAKER_FEE_BPS = 10n;

/** CFD spread por lado: 500 ppm = 0,05%. */
export const CFD_SPREAD_PPM = 500n;
