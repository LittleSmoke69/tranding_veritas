type VeritasLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  className?: string;
};

const SIZES = {
  sm: 'h-[42px] w-[120px]',
  md: 'h-[58px] w-[170px]',
  lg: 'h-[130px] w-[280px] max-w-[76vw]',
};

/** Logo oficial fornecida: escudo + wordmark Veritas Finance Academy. */
export function VeritasLogo({
  size = 'md',
  subtitle = 'FINANCE ACADEMY',
  className = '',
}: VeritasLogoProps) {
  return (
    <img
      src="/veritas-finance-academy.jpg"
      alt={`Veritas Finance Academy — ${subtitle}`}
      className={`${SIZES[size]} shrink-0 object-contain mix-blend-screen ${className}`}
    />
  );
}
