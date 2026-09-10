import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { scrollToId } from "./hooks/useLenis";
import ScrollRevealText from "./components/ScrollRevealText";
import logo1 from "./imports/logo_1.png";
import imgBinance    from "./imports/image-7.png";
import imgCoinbase   from "./imports/image-8.png";
import imgBybit      from "./imports/image-9.png";
import imgKucoin     from "./imports/image-10.png";
import imgTitaniumfx from "./imports/image-11.png";
import imgKraken     from "./imports/image-12.png";
import imgXm         from "./imports/image-13.png";
import imgPepperstone from "./imports/image-14.png";
import imgBlackbull  from "./imports/image-15.png";
import imgAvenue     from "./imports/image-16.png";

/**
 * Peças compartilhadas entre a Home (App.tsx) e as páginas em src/pages/.
 * Vivem à parte para evitar dependência circular (App importa as páginas,
 * então as páginas não podem importar de volta de "./App").
 */

// ── Tokens ────────────────────────────────────────────────────────────────────
export const B      = "var(--primary)";
export const BD     = "var(--primary-dim)";
export const BB     = "var(--primary-border)";
export const G      = "var(--green)";
export const GD     = "var(--green-dim)";
export const RED    = "var(--red)";
export const RD     = "rgba(248,113,113,0.1)";
export const RB     = "rgba(248,113,113,0.2)";
export const GOLD   = "var(--gold)";
export const CARD   = "var(--card)";
export const MFG    = "var(--muted-foreground)";
export const FG     = "var(--foreground)";
export const BORDER = "var(--border)";

// ── Shared: icon box ──────────────────────────────────────────────────────────
export function IBox({ children, color = "blue" }: { children: React.ReactNode; color?: "blue"|"green"|"red"|"gold" }) {
  const map = {
    blue:  { bg: BD, border: BB, c: B },
    green: { bg: GD, border: "rgba(0,232,122,0.2)", c: G },
    red:   { bg: RD, border: RB,  c: RED },
    gold:  { bg: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.25)", c: GOLD },
  };
  const s = map[color];
  return (
    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <div className="w-5 h-5" style={{ color: s.c }}>{children}</div>
    </div>
  );
}

// ── Shared: badge ─────────────────────────────────────────────────────────────
export function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: "blue"|"green"|"red"|"gold" }) {
  const map = {
    blue:  { bg: BD, border: BB, c: B },
    green: { bg: GD, border: "rgba(0,232,122,0.2)", c: G },
    red:   { bg: RD, border: RB,  c: RED },
    gold:  { bg: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.25)", c: GOLD },
  };
  const s = map[color];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.c, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.04em" }}>
      {children}
    </span>
  );
}

// ── Section header helper ─────────────────────────────────────────────────────
export function SectionHeader({
  badge, badgeColor = "blue", heading, sub, center = false,
}: {
  badge?: React.ReactNode;
  badgeColor?: "blue"|"green"|"red"|"gold";
  heading: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-16 ${center ? "text-center" : ""}`}>
      {badge && <div className={`mb-4 ${center ? "flex justify-center" : ""}`}><Badge color={badgeColor}>{badge}</Badge></div>}
      <h2 className={`section-heading-xl ${center ? "mx-auto" : ""}`} style={{ maxWidth: center ? "22ch" : undefined }}>
        <ScrollRevealText>{heading}</ScrollRevealText>
      </h2>
      {sub && <p className={center ? "section-body-center mt-4" : "section-body mt-4"}>{sub}</p>}
    </div>
  );
}

// ── Ticker ────────────────────────────────────────────────────────────────────
const TICK = [
  { sym: "BTC/USD",  p: "94.210,50", c: "+2,34%", up: true  },
  { sym: "ETH/USD",  p: "3.489,20",  c: "+1,87%", up: true  },
  { sym: "SOL/USD",  p: "182,40",    c: "+4,12%", up: true  },
  { sym: "BNB/USD",  p: "589,30",    c: "-0,42%", up: false },
  { sym: "XRP/USD",  p: "0,6821",    c: "+3,21%", up: true  },
  { sym: "DOGE/USD", p: "0,1543",    c: "-1,10%", up: false },
  { sym: "EUR/USD",  p: "1,0921",    c: "+0,08%", up: true  },
  { sym: "GBP/USD",  p: "1,2748",    c: "-0,14%", up: false },
  { sym: "GOLD",     p: "2.341,00",  c: "+0,62%", up: true  },
  { sym: "OIL",      p: "81,45",     c: "-0,31%", up: false },
];

export function Ticker() {
  const items = [...TICK, ...TICK];
  return (
    <div className="overflow-hidden py-2.5 border-b" style={{ borderColor: BORDER, background: "rgba(25,172,254,0.03)" }}>
      <div className="flex animate-ticker" style={{ width: "max-content" }}>
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-2.5 px-7 whitespace-nowrap">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 600, color: MFG, letterSpacing: "0.04em" }}>{t.sym}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 700, color: FG }}>{t.p}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 700, color: t.up ? G : RED }}>
              {t.up ? "▲" : "▼"} {t.c}
            </span>
            <span style={{ color: BORDER, fontSize: 7 }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Link para a plataforma (demo.investirbot.online) ───────────────────────────
export const PLATFORM_URL = "https://demo.investirbot.online";

// ── Router simples (sem dependências externas) ─────────────────────────────────
export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path;
}

export function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

const NAV_LINKS = [
  { label: "Página Inicial", path: "/" },
  { label: "Mercados", path: "/mercados" },
  { label: "Educação", path: "/educacao" },
  { label: "Planos", path: "/planos" },
];

const VERITAS_LINKS = [
  { label: "Quem Somos", path: "/quem-somos" },
  { label: "Nossa Equipe", path: "/nossa-equipe" },
  { label: "Carreiras", path: "/carreiras" },
];

const SERVICOS_LINKS = [
  { label: "Copy Trading", path: "/copy-trading" },
  { label: "Cursos", path: "/educacao" },
  { label: "Consultoria", path: "/consultoria" },
  { label: "Automação", path: "/automacao" },
  { label: "Análises", path: "/analises" },
];

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar({ path }: { path: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [veritasOpen, setVeritasOpen] = useState(false);
  const [mobileVeritasOpen, setMobileVeritasOpen] = useState(false);
  const [servicosOpen, setServicosOpen] = useState(false);
  const [mobileServicosOpen, setMobileServicosOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (p: string) => { navigate(p); setOpen(false); setVeritasOpen(false); setServicosOpen(false); };
  const veritasActive = VERITAS_LINKS.some((l) => l.path === path);
  const servicosActive = SERVICOS_LINKS.some((l) => l.path === path);
  return (
    <nav className="sticky top-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(4,5,12,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${BORDER}` : "none" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <button onClick={() => go("/")} className="shrink-0">
          <img src={logo1} alt="Veritas" className="h-9 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 8px rgba(25,172,254,0.3))" }} />
        </button>
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((l) => (
            <button key={l.path} onClick={() => go(l.path)}
              style={{ color: path === l.path ? FG : MFG, fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "0.01em" }}
              className="transition-colors hover:text-white">{l.label}</button>
          ))}
          <div className="relative" onMouseEnter={() => setVeritasOpen(true)} onMouseLeave={() => setVeritasOpen(false)}>
            <button
              style={{ color: veritasActive || veritasOpen ? FG : MFG, fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "0.01em" }}
              className="flex items-center gap-1.5 transition-colors hover:text-white">
              A Veritas
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" style={{ transform: veritasOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
            {veritasOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                <div className="w-52 rounded-xl overflow-hidden" style={{ background: "rgba(8,12,24,0.98)", border: `1px solid ${BORDER}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                  {VERITAS_LINKS.map((l) => (
                    <button key={l.path} onClick={() => go(l.path)}
                      className="block w-full px-4 py-3 text-left transition-colors hover:bg-white/5"
                      style={{ color: path === l.path ? B : MFG, fontSize: "0.8125rem", fontWeight: 600 }}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative" onMouseEnter={() => setServicosOpen(true)} onMouseLeave={() => setServicosOpen(false)}>
            <button
              style={{ color: servicosActive || servicosOpen ? FG : MFG, fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "0.01em" }}
              className="flex items-center gap-1.5 transition-colors hover:text-white">
              Serviços
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" style={{ transform: servicosOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
            {servicosOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                <div className="w-52 rounded-xl overflow-hidden" style={{ background: "rgba(8,12,24,0.98)", border: `1px solid ${BORDER}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                  {SERVICOS_LINKS.map((l) => (
                    <button key={l.path} onClick={() => go(l.path)}
                      className="block w-full px-4 py-3 text-left transition-colors hover:bg-white/5"
                      style={{ color: path === l.path ? B : MFG, fontSize: "0.8125rem", fontWeight: 600 }}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => scrollToId("contato")}
            style={{ color: MFG, fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "0.01em" }}
            className="transition-colors hover:text-white">Contato</button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href={PLATFORM_URL} className="px-5 py-2.5 rounded-xl hover:opacity-90"
            style={{ backgroundImage: "linear-gradient(to right, #2e64ff, #1f4ee6)", color: "#fff", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.01em", boxShadow: "0 0 24px rgba(46,100,255,0.35)" }}>
            Acesso à Plataforma
          </a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: FG }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-4" style={{ background: "rgba(4,5,12,0.98)" }}>
          {NAV_LINKS.map((l) => (
            <button key={l.path} onClick={() => go(l.path)} className="block w-full py-3 text-left border-b"
              style={{ color: path === l.path ? FG : MFG, fontSize: "0.875rem", fontWeight: 600, borderColor: BORDER }}>{l.label}</button>
          ))}
          <button onClick={() => setMobileVeritasOpen((v) => !v)}
            className="flex w-full items-center justify-between py-3 border-b"
            style={{ color: veritasActive ? FG : MFG, fontSize: "0.875rem", fontWeight: 600, borderColor: BORDER }}>
            A Veritas
            <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: mobileVeritasOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
          {mobileVeritasOpen && (
            <div className="pl-4">
              {VERITAS_LINKS.map((l) => (
                <button key={l.path} onClick={() => go(l.path)} className="block w-full py-2.5 text-left border-b"
                  style={{ color: path === l.path ? B : MFG, fontSize: "0.8125rem", fontWeight: 600, borderColor: BORDER }}>{l.label}</button>
              ))}
            </div>
          )}
          <button onClick={() => setMobileServicosOpen((v) => !v)}
            className="flex w-full items-center justify-between py-3 border-b"
            style={{ color: servicosActive ? FG : MFG, fontSize: "0.875rem", fontWeight: 600, borderColor: BORDER }}>
            Serviços
            <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: mobileServicosOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
          {mobileServicosOpen && (
            <div className="pl-4">
              {SERVICOS_LINKS.map((l) => (
                <button key={l.path} onClick={() => go(l.path)} className="block w-full py-2.5 text-left border-b"
                  style={{ color: path === l.path ? B : MFG, fontSize: "0.8125rem", fontWeight: 600, borderColor: BORDER }}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => { scrollToId("contato"); setOpen(false); }} className="block w-full py-3 text-left border-b"
            style={{ color: MFG, fontSize: "0.875rem", fontWeight: 600, borderColor: BORDER }}>Contato</button>
          <a href={PLATFORM_URL} className="mt-4 block w-full py-3 rounded-xl text-center"
            style={{ backgroundImage: "linear-gradient(to right, #2e64ff, #1f4ee6)", color: "#fff", fontSize: "0.875rem", fontWeight: 700 }}>Acesso à Plataforma</a>
        </div>
      )}
    </nav>
  );
}

// ── Count-up numérico (usado nos cards de estatística) ─────────────────────────
export function useCountUp(target: number, d = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / d, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, d]);
  return { value, ref };
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer id="contato" className="border-t py-16" style={{ borderColor: BORDER, background: CARD }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <img src={logo1} alt="Veritas" className="h-10 w-auto object-contain mb-6"
              style={{ filter: "drop-shadow(0 0 6px rgba(25,172,254,0.25))" }} />
            <p className="card-body max-w-xs mb-6">
              Formação profissional em criptomoedas e forex — do iniciante ao trader consistente.
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 500, color: MFG }}>contato@academyveritas.net</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.3rem" }}>Vila Olímpia, São Paulo/SP</p>
          </div>
          {[
            { title: "Conteúdo", links: ["Cripto", "Forex", "Sinais", "Educação"] },
            { title: "Suporte",  links: ["Ajuda", "Privacidade", "Termos", "Contato"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: FG, marginBottom: "1.25rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors"
                    style={{ fontSize: "0.875rem", fontWeight: 500, color: MFG }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: BORDER }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 500, color: MFG }}>
            © 2026 Veritas Academy — Veritas School Mentoria e Treinamento LTDA — CNPJ 33.893.234/0001-64
          </p>
          <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, maxWidth: "36ch", lineHeight: 1.6 }}>
            Criptomoedas e forex envolvem risco de perda. Opere com responsabilidade.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Brokers por categoria ─────────────────────────────────────────────────────
type BrokerEntry = { name: string; desc: string; logo?: string; logoBg?: string; initials?: string; initialsColor?: string };

const BROKER_CATS: { label: string; color: string; brokers: BrokerEntry[] }[] = [
  {
    label: "Criptomoedas",
    color: "#F0B90B",
    brokers: [
      { name: "Binance",  desc: "Maior exchange do mundo",       logo: imgBinance,  logoBg: "#0B0E11" },
      { name: "Coinbase", desc: "Exchange regulamentada EUA",    logo: imgCoinbase, logoBg: "#0052FF" },
      { name: "Bybit",    desc: "Derivativos e futuros cripto",  logo: imgBybit,    logoBg: "#F5F5F5" },
      { name: "KuCoin",   desc: "Exchange global de altcoins",   logo: imgKucoin,   logoBg: "#fff" },
    ],
  },
  {
    label: "Forex & CFDs",
    color: "#7C4DFF",
    brokers: [
      { name: "TitaniumFX",  desc: "CFDs de alta performance",      logo: imgTitaniumfx, logoBg: "#0D1117" },
      { name: "Kraken",      desc: "Forex + cripto unificados",     logo: imgKraken,     logoBg: "#fff" },
      { name: "XM",          desc: "Broker regulamentado global",   logo: imgXm,         logoBg: "#fff" },
      { name: "Pepperstone", desc: "Spreads baixos, execução rápida", logo: imgPepperstone, logoBg: "#1448FF" },
      { name: "BlackBull",   desc: "Broker NDD premium",            logo: imgBlackbull,  logoBg: "#111" },
    ],
  },
  {
    label: "Investimentos Internacionais",
    color: "#1A6B3C",
    brokers: [
      { name: "Avenue", desc: "Ações e ETFs nos EUA para brasileiros", logo: imgAvenue, logoBg: "#fff" },
    ],
  },
];

function BrokerCard({ b }: { b: BrokerEntry }) {
  return (
    <div className="bento-card flex flex-col items-center text-center gap-3 overflow-hidden hover:scale-105 transition-transform">
      {/* Logo area */}
      <div className="w-full h-20 flex items-center justify-center px-5 pt-5">
        {b.logo ? (
          <div className="w-full h-full rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: b.logoBg }}>
            <img src={b.logo} alt={b.name}
              className="w-full h-full object-contain p-3" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: BD, border: `1px solid ${BB}` }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 900, color: b.initialsColor ?? B, letterSpacing: "-0.02em" }}>
              {b.initials}
            </span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="px-4 pb-5">
        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: FG }}>{b.name}</p>
        <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.2rem", lineHeight: 1.45 }}>{b.desc}</p>
      </div>
    </div>
  );
}

export function BrokersSection() {
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          center
          badge="Plataformas Parceiras"
          heading="Opere nas melhores plataformas do mundo"
          sub="Ensinamos a operar nas principais exchanges de cripto, brokers Forex regulamentados e plataformas de investimentos internacionais."
        />
        <div className="space-y-10">
          {BROKER_CATS.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px" style={{ background: BORDER }} />
                <span className="px-4 py-1.5 rounded-full"
                  style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35`, color: cat.color, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {cat.label}
                </span>
                <div className="flex-1 h-px" style={{ background: BORDER }} />
              </div>
              <div className={`grid gap-3 ${cat.brokers.length === 1 ? "grid-cols-1 max-w-xs" : cat.brokers.length <= 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 md:grid-cols-4"} ${cat.brokers.length === 1 ? "" : ""}`}>
                {cat.brokers.map((b) => <BrokerCard key={b.name} b={b} />)}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-10" style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG }}>
          Plataformas independentes. A Veritas Global não atua como corretora ou intermediária financeira.
        </p>
      </div>
    </section>
  );
}

// ── Noise overlay ─────────────────────────────────────────────────────────────
export function NoiseOverlay() {
  return (
    <div style={{
      width: "100vw", height: "100vh", opacity: 0.12,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
      position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 50, mixBlendMode: "plus-lighter",
    }} />
  );
}
