import { useState } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { VeritasLogo } from '../components/VeritasLogo';
import { AssetsAdmin } from './AssetsAdmin';
import { RobotsAdmin } from './RobotsAdmin';
import { UsersAdmin } from './UsersAdmin';

type Section = 'users' | 'assets' | 'robots';

const sections: { id: Section; label: string; icon: IconName }[] = [
  { id: 'users', label: 'Usuários', icon: 'user' },
  { id: 'assets', label: 'Ativos', icon: 'layers' },
  { id: 'robots', label: 'Robôs', icon: 'bars' },
];

export function AdminApp({
  accountName,
  onTerminal,
  onLogout,
}: {
  accountName: string;
  onTerminal: () => void;
  onLogout: () => void;
}) {
  const [section, setSection] = useState<Section>('users');
  return (
    <div className="flex h-dvh overflow-hidden bg-app text-ink">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-panel md:flex">
        <div className="flex h-16 items-center border-b border-line px-4">
          <VeritasLogo size="sm" subtitle="ADMIN" />
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Administração">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`u-focus flex h-11 w-full items-center gap-3 rounded-ctl px-3 text-sm transition ${
                section === item.id ? 'bg-elevated text-ink' : 'text-muted hover:bg-elevated hover:text-ink'
              }`}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-line p-3 text-xs text-muted">
          <p className="truncate">{accountName}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-app px-4">
          <div>
            <p className="u-caps text-brand">Painel administrativo</p>
            <h1 className="text-lg font-semibold">{sections.find((item) => item.id === section)?.label}</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onTerminal} className="u-focus rounded-ctl border border-line px-3 py-2 text-sm text-muted hover:text-ink">
              Terminal
            </button>
            <button type="button" onClick={onLogout} className="u-focus rounded-ctl border border-line px-3 py-2 text-sm text-muted hover:text-ink">
              Sair
            </button>
          </div>
        </header>

        <div className="flex gap-1 overflow-x-auto border-b border-line bg-panel p-2 md:hidden">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`u-focus flex min-h-11 flex-1 items-center justify-center gap-2 rounded-ctl px-3 text-xs ${
                section === item.id ? 'bg-elevated text-ink' : 'text-muted'
              }`}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </button>
          ))}
        </div>

        <main className="u-scroll min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">
          {section === 'users' && <UsersAdmin />}
          {section === 'assets' && <AssetsAdmin />}
          {section === 'robots' && <RobotsAdmin />}
        </main>
      </div>
    </div>
  );
}
