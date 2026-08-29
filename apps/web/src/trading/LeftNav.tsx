import { Icon, type IconName } from '../components/Icon';

export type NavId =
  | 'assets'
  | 'history'
  | 'perf'
  | 'robots';

type NavItem = { id: NavId; label: string; icon: IconName; badge?: string };

const ITEMS: NavItem[] = [
  { id: 'assets', label: 'Ativos', icon: 'layers' },
  { id: 'robots', label: 'Agentes IA', icon: 'aiAgent', badge: 'NEW' },
  { id: 'history', label: 'Histórico', icon: 'clock' },
  { id: 'perf', label: 'Desempenho', icon: 'trendUp' },
];

/** Barra inferior no mobile: no máximo 5 destinos, o resto vai para "Mais". */
const BAR_IDS: NavId[] = ['assets', 'robots', 'history', 'perf'];

type LeftNavProps = {
  activeId: NavId;
  orientation?: 'rail' | 'bar';
  onNavigate: (id: NavId) => void;
};

function Badge({ text }: { text: string }) {
  return (
    <span className="absolute right-2 top-2 rounded-ctl bg-accent px-1 py-px font-cond text-[9px] font-semibold uppercase leading-tight tracking-[0.06em] text-[#1a1204]">
      {text}
    </span>
  );
}

export function LeftNav({ activeId, orientation = 'rail', onNavigate }: LeftNavProps) {
  if (orientation === 'bar') {
    const items = ITEMS.filter((i) => BAR_IDS.includes(i.id));
    return (
      <nav aria-label="Navegação principal" className="flex h-full items-stretch border-t border-line bg-app">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`u-focus relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 transition ${
                isActive ? 'text-ink' : 'text-muted'
              } active:bg-elevated`}
            >
              {isActive && (
                <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-brand" aria-hidden="true" />
              )}
              <Icon name={item.icon} size={22} />
              <span className={`u-caps ${isActive ? 'text-ink' : ''}`}>{item.label}</span>
              {item.badge && <Badge text={item.badge} />}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Navegação principal"
      className="u-scroll flex h-full w-full flex-col items-stretch overflow-y-auto border-r border-line bg-app py-2"
    >
      {ITEMS.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`u-focus relative flex flex-col items-center gap-1.5 px-2 py-3 transition ${
              isActive ? 'bg-elevated text-ink' : 'text-muted hover:bg-elevated hover:text-ink'
            }`}
          >
            {isActive && (
              <span className="absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-brand" aria-hidden="true" />
            )}
            <Icon name={item.icon} size={24} />
            {/* duas linhas reservadas: rótulos longos quebram sem desalinhar o rail */}
            <span
              className={`u-caps flex min-h-[24px] items-start justify-center text-center ${
                isActive ? 'text-ink' : ''
              }`}
            >
              {item.label}
            </span>
            {item.badge && <Badge text={item.badge} />}
          </button>
        );
      })}
    </nav>
  );
}
