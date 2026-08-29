#!/usr/bin/env node
/**
 * Falha se encontrar float literal em caminho monetário do shared.
 * Aceita apenas inteiros / BigInt / strings de taxa documentadas.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../packages/shared/src', import.meta.url).pathname;
const floatRe = /\b\d+\.\d+\b/;
const allowFiles = new Set(['money.test.ts']); // asserts podem citar decimais em strings de mensagem

/** Taxas documentadas como inteiros (bps / ppm), não literais 0.001 no código de produção. */
const violations = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!p.endsWith('.ts') || p.endsWith('.d.ts')) continue;
    const rel = relative(root, p);
    if (allowFiles.has(name) || name.endsWith('.test.ts')) continue;
    const text = readFileSync(p, 'utf8');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
      if (floatRe.test(line) && !line.includes('1e-8') && !line.includes('1e8')) {
        // 1e8 / 1e-8 são escala documentada (inteiros conceituais)
        if (/SCALE|1e8|QTY_SCALE/.test(line)) return;
        violations.push(`${rel}:${i + 1}: ${line.trim()}`);
      }
    });
  }
}

walk(root);
if (violations.length) {
  console.error('Float literal em caminho monetário:\n' + violations.join('\n'));
  process.exit(1);
}
console.log('lint:money OK — sem float literal em packages/shared/src (exceto testes).');
