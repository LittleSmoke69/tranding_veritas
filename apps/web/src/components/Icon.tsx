import type { ReactNode, SVGProps } from 'react';

/**
 * Família única de ícones — contorno, grade 24px, traço 1.5.
 * Nunca use emoji como ícone estrutural: renderiza diferente por
 * plataforma e não obedece aos tokens de cor.
 */
export type IconName =
  | 'grid'
  | 'clock'
  | 'trendUp'
  | 'trendDown'
  | 'message'
  | 'play'
  | 'gift'
  | 'trophy'
  | 'bars'
  | 'flag'
  | 'layers'
  | 'plus'
  | 'minus'
  | 'user'
  | 'logout'
  | 'wallet'
  | 'candles'
  | 'timer'
  | 'sliders'
  | 'pen'
  | 'expand'
  | 'info'
  | 'bell'
  | 'star'
  | 'chevronDown'
  | 'chevronUp'
  | 'help'
  | 'close'
  | 'search'
  | 'inbox'
  | 'aiAgent'
  | 'refresh'
  | 'more';

const PATHS: Record<IconName, ReactNode> = {
  grid: <path d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.25V12l3.25 1.9" />
    </>
  ),
  trendUp: (
    <>
      <path d="M4 16.5l5.25-5.25 3.5 3.5L20 7.5" />
      <path d="M20 12.5v-5h-5" />
    </>
  ),
  trendDown: (
    <>
      <path d="M4 7.5l5.25 5.25 3.5-3.5L20 16.5" />
      <path d="M20 11.5v5h-5" />
    </>
  ),
  message: <path d="M20 15.5a2.5 2.5 0 0 1-2.5 2.5H8.5L4 21V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z" />,
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.4 8.9l5 3.1-5 3.1z" />
    </>
  ),
  gift: (
    <>
      <path d="M19.5 12v7.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V12" />
      <path d="M3.5 8.25h17V12h-17z" />
      <path d="M12 8.25v12.25" />
      <path d="M12 8.25H8.6a2.3 2.3 0 1 1 0-4.6c2 0 3.4 4.6 3.4 4.6z" />
      <path d="M12 8.25h3.4a2.3 2.3 0 1 0 0-4.6c-2 0-3.4 4.6-3.4 4.6z" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5.25a4 4 0 0 1-8 0z" />
      <path d="M8 6.25H5.5v.9a3.5 3.5 0 0 0 2.6 3.38" />
      <path d="M16 6.25h2.5v.9a3.5 3.5 0 0 1-2.6 3.38" />
      <path d="M12 13.4V17" />
      <path d="M8.75 20h6.5" />
    </>
  ),
  bars: (
    <>
      <path d="M3.5 20h17" />
      <path d="M7 20v-6.5M12 20V6.5M17 20v-9.5" />
    </>
  ),
  flag: <path d="M5.5 21V3.75M5.5 4.75h11l-2.1 3.6 2.1 3.6h-11" />,
  layers: (
    <>
      <path d="M12 3.25l8.5 4.6-8.5 4.6-8.5-4.6z" />
      <path d="M3.75 12.4L12 16.9l8.25-4.5" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  minus: <path d="M5.5 12h13" />,
  user: (
    <>
      <circle cx="12" cy="8.25" r="3.75" />
      <path d="M4.75 20a7.25 7.25 0 0 1 14.5 0" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M9 8l-4 4 4 4" />
      <path d="M5 12h10" />
    </>
  ),
  wallet: (
    <>
      <path d="M20 9.5V7a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 1 4 4.5v13A2.5 2.5 0 0 0 6.5 20H19a1 1 0 0 0 1-1v-2.5" />
      <path d="M21 9.5v5h-4.25a2.5 2.5 0 0 1 0-5z" />
    </>
  ),
  candles: (
    <>
      <path d="M7.5 3.5v3.25M7.5 17.25v3.25" />
      <path d="M5.25 6.75h4.5v10.5h-4.5z" />
      <path d="M16.5 3.5v4M16.5 16v4.5" />
      <path d="M14.25 7.5h4.5V16h-4.5z" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 10v3.5l2.4 1.4" />
      <path d="M9.25 3h5.5" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7.5h16M4 12h16M4 16.5h16" />
      <path d="M9 5.5v4M15.5 10v4M7 14.5v4" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l4.25-1.05L18.6 8.6a2.05 2.05 0 0 0-2.9-2.9L5.35 16.05z" />
      <path d="M14.75 6.9l2.9 2.9" />
    </>
  ),
  expand: <path d="M4 9.25V5a1 1 0 0 1 1-1h4.25M14.75 4H19a1 1 0 0 1 1 1v4.25M20 14.75V19a1 1 0 0 1-1 1h-4.25M9.25 20H5a1 1 0 0 1-1-1v-4.25" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.25V16.5" />
      <path d="M12 7.9h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9.5a6 6 0 1 0-12 0c0 4.6-1.75 5.75-1.75 5.75h15.5S18 14.1 18 9.5z" />
      <path d="M13.7 19a2 2 0 0 1-3.4 0" />
    </>
  ),
  star: <path d="M12 3.75l2.6 5.27 5.82.85-4.21 4.1 1 5.8L12 17.03l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85z" />,
  chevronDown: <path d="M6.5 9.75l5.5 5.5 5.5-5.5" />,
  chevronUp: <path d="M6.5 14.25l5.5-5.5 5.5 5.5" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.65 9.6a2.4 2.4 0 1 1 3.3 2.27c-.62.26-.95.86-.95 1.53v.35" />
      <path d="M12 16.9h.01" />
    </>
  ),
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7.25" />
      <path d="M16.4 16.4L20.5 20.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 13.25h4.1l1.4 2.75h5l1.4-2.75H20" />
      <path d="M4 13.25l2.4-7.1A2 2 0 0 1 8.3 4.8h7.4a2 2 0 0 1 1.9 1.35l2.4 7.1V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </>
  ),
  aiAgent: (
    <>
      <rect x="4" y="6" width="16" height="13" rx="4" />
      <path d="M12 3v3M9 3h6" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M9 16h6M4 11H2.5M21.5 11H20" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M18.2 16.8A8 8 0 1 1 19.6 9L20 12" />
    </>
  ),
  more: <path d="M6 12h.01M12 12h.01M18 12h.01" />,
};

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
