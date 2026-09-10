import { useState, useEffect, useRef } from "react";
import ScrollRevealText from "./components/ScrollRevealText";
import logo1 from "./assets/logo_1.png";
import imgBinance    from "./assets/image-7.png";
import imgCoinbase   from "./assets/image-8.png";
import imgBybit      from "./assets/image-9.png";
import imgKucoin     from "./assets/image-10.png";
import imgTitaniumfx from "./assets/image-11.png";
import imgKraken     from "./assets/image-12.png";
import imgXm         from "./assets/image-13.png";
import imgPepperstone from "./assets/image-14.png";
import imgBlackbull  from "./assets/image-15.png";
import imgAvenue     from "./assets/image-16.png";

/**
 * Peças compartilhadas entre a Home (Landing.tsx) e as páginas em
 * src/landing/pages/. Vivem à parte para evitar dependência circular
 * (Landing.tsx importa as páginas, então elas não podem importar de
 * volta de "../Landing").
 */

export type LandingView =
  | "home" | "mercados" | "educacao" | "planos" | "quemsomos" | "nossaequipe" | "carreiras"
  | "copytrading" | "consultoria" | "automacao";

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
    <footer className="border-t py-16" style={{ borderColor: BORDER, background: CARD }}>
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
