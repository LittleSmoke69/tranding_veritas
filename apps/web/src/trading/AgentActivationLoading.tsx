import { Icon } from '../components/Icon';

type AgentActivationLoadingProps = {
  profileName: string;
  assetName: string;
};

export function AgentActivationLoading({
  profileName,
  assetName,
}: AgentActivationLoadingProps) {
  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={`Ativando Agente de IA ${profileName}`}
    >
      <div className="w-full max-w-md rounded-panel border border-brand/40 bg-panel p-6 text-center shadow-[var(--shadow-sheet)]">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-brand/15 border-t-brand" aria-hidden="true" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-brand/10" aria-hidden="true" />
          <Icon name="aiAgent" size={44} className="relative text-brand" />
        </div>

        <p className="u-caps mt-5 text-brand">Preparando automação</p>
        <h2 className="mt-2 text-2xl font-semibold">Ativando Agente {profileName}</h2>
        <p className="mt-2 text-sm text-muted">
          Configurando a estratégia para operar em {assetName}.
        </p>

        <div className="mt-6 space-y-2 text-left text-sm">
          {[
            'Validando limites de risco',
            'Conectando aos dados de mercado',
            'Iniciando análise inteligente',
          ].map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-ctl border border-line bg-app/70 px-3 py-2.5">
              <span
                className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-brand"
                style={{ animationDelay: `${index * 180}ms` }}
                aria-hidden="true"
              />
              <span className="text-ink">{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-elevated" aria-hidden="true">
          <span className="loading-progress block h-full bg-brand" />
        </div>
        <p className="mt-3 text-xs text-muted">Isso pode levar alguns segundos.</p>
      </div>
    </div>
  );
}
