import { useId } from 'react';
import { Icon } from './Icon';

/**
 * Ícone de ajuda discreto. A dica aparece no hover E no foco por teclado
 * (`title` nativo não é alcançável por teclado de forma confiável).
 */
export function HelpTip({ text, align = 'right' }: { text: string; align?: 'left' | 'right' }) {
  const id = useId();
  return (
    <span className="relative inline-flex align-middle [&:focus-within>span]:opacity-100 [&:hover>span]:opacity-100">
      <button
        type="button"
        aria-label="Ajuda"
        aria-describedby={id}
        className="u-focus flex h-5 w-5 items-center justify-center rounded-full text-faint transition hover:text-muted"
      >
        <Icon name="help" size={14} />
      </button>
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-[var(--z-toast)] mb-1.5 w-[168px] rounded-panel border border-line bg-elevated px-2.5 py-1.5 text-[11px] font-normal leading-snug text-ink opacity-0 shadow-[var(--shadow-float)] transition-opacity duration-150 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
      >
        {text}
      </span>
    </span>
  );
}
