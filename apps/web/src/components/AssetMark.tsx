import { assetMonogram, type TradingAsset } from '../data/assets';

/**
 * Selo do ativo — monograma vetorial em superfície neutra.
 * Substitui as bandeiras em emoji: elas renderizam diferente por sistema
 * (o Windows não desenha bandeiras) e não respondem aos tokens de cor.
 */
export function AssetMark({ asset, size = 24 }: { asset: TradingAsset; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-elevated font-cond font-semibold text-ink"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {assetMonogram(asset)}
    </span>
  );
}
