import { useState, useEffect, useRef } from "react";
import { useLenis } from "./hooks/useLenis";
import ScrollRevealText from "./components/ScrollRevealText";
import {
  Bitcoin, Target, Zap, BarChart3, Users,
  ShieldCheck, ArrowRight, ChevronDown, Clock, Trophy,
  Percent, AlertTriangle, Lightbulb, Eye, Rocket, Globe,
  BookOpen, Bot, Scale, Handshake, TrendingUp,
} from "lucide-react";
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

// ── Tokens ────────────────────────────────────────────────────────────────────
const B      = "var(--primary)";
const BD     = "var(--primary-dim)";
const BB     = "var(--primary-border)";
const G      = "var(--green)";
const GD     = "var(--green-dim)";
const RED    = "var(--red)";
const RD     = "rgba(248,113,113,0.1)";
const RB     = "rgba(248,113,113,0.2)";
const GOLD   = "var(--gold)";
const CARD   = "var(--card)";
const MFG    = "var(--muted-foreground)";
const FG     = "var(--foreground)";
const BORDER = "var(--border)";

// ── Shared: icon box ──────────────────────────────────────────────────────────
function IBox({ children, color = "blue" }: { children: React.ReactNode; color?: "blue"|"green"|"red"|"gold" }) {
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
function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: "blue"|"green"|"red"|"gold" }) {
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
function SectionHeader({
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

function Ticker() {
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
const PLATFORM_URL = "https://demo.investirbot.online";

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Início", "Binárias", "Cripto", "Sinais", "Educação", "Contato"];
  return (
    <nav className="sticky top-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(4,5,12,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${BORDER}` : "none" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <img src={logo1} alt="Veritas" className="h-9 w-auto object-contain"
          style={{ filter: "drop-shadow(0 0 8px rgba(25,172,254,0.3))" }} />
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href="#"
              style={{ color: MFG, fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.01em" }}
              className="transition-colors hover:text-white">{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href={PLATFORM_URL} style={{ color: MFG, fontSize: "0.8125rem", fontWeight: 600 }} className="px-4 py-2 rounded-lg">Entrar</a>
          <a href={PLATFORM_URL} className="px-5 py-2.5 rounded-xl hover:opacity-90 animate-pulse-blue"
            style={{ background: B, color: "#fff", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.01em", boxShadow: "0 0 24px var(--primary-glow)" }}>
            Acessar Plataforma
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
          {links.map((l) => (
            <a key={l} href="#" className="block py-3 border-b"
              style={{ color: MFG, fontSize: "0.875rem", fontWeight: 600, borderColor: BORDER }}>{l}</a>
          ))}
          <a href={PLATFORM_URL} className="mt-4 block w-full py-3 rounded-xl text-center"
            style={{ background: B, color: "#fff", fontSize: "0.875rem", fontWeight: 700 }}>Acessar Plataforma</a>
        </div>
      )}
    </nav>
  );
}

// ── Hero: binary trading panel ────────────────────────────────────────────────
function BinaryPanel() {
  const [timer, setTimer] = useState(47);
  const [selected, setSelected] = useState<"call" | "put" | null>(null);
  const [profit, setProfit] = useState<null | { win: boolean }>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (selected) setProfit({ win: Math.random() > 0.3 });
          setTimeout(() => { setTimer(60); setProfit(null); setSelected(null); }, 2000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [selected]);

  return (
    <div className="bento-card p-6 w-full max-w-sm mx-auto" style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
      {/* Asset header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BD }}>
            <Bitcoin className="w-4 h-4" style={{ color: B }} />
          </div>
          <div>
            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: FG }}>BTC/USD</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 600, color: G }}>▲ +2,34%</p>
          </div>
        </div>
        <div className="text-right">
          <p className="card-label">Payout</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", fontWeight: 700, color: G }}>+87%</p>
        </div>
      </div>

      {/* Candlestick chart */}
      <div className="rounded-xl overflow-hidden mb-5" style={{ background: "rgba(25,172,254,0.04)", border: `1px solid ${BB}`, height: 100 }}>
        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19ACFE" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#19ACFE" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 80 L25 72 L50 65 L75 70 L100 55 L125 48 L150 40 L175 35 L200 42 L225 28 L250 18 L275 12 L300 8"
            stroke={B} strokeWidth="1.5" fill="none" />
          <path d="M0 80 L25 72 L50 65 L75 70 L100 55 L125 48 L150 40 L175 35 L200 42 L225 28 L250 18 L275 12 L300 8 L300 100 L0 100Z"
            fill="url(#hg2)" />
          {[78,65,70,55,48,40,35,42,28,18,12].map((h, i) => {
            const up = i % 3 !== 0;
            const x = i * 28 + 4;
            const height = Math.max(8, (100 - h) * 0.4);
            return (
              <g key={i}>
                <rect x={x} y={h} width={10} height={height} rx="2" fill={up ? G : RED} opacity="0.8" />
                <line x1={x+5} y1={h-5} x2={x+5} y2={h} stroke={up ? G : RED} strokeWidth="1.5" />
                <line x1={x+5} y1={h+height} x2={x+5} y2={h+height+6} stroke={up ? G : RED} strokeWidth="1.5" />
              </g>
            );
          })}
          <line x1="0" y1="40" x2="300" y2="40" stroke={GOLD} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        </svg>
      </div>

      {/* Expiry timer */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: timer < 10 ? RED : B }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: MFG }}>Expiração</span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.375rem", fontWeight: 700, color: timer < 10 ? RED : FG }}>
          00:{timer.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Entry */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <p className="card-label mb-1">Entrada</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9375rem", fontWeight: 700, color: FG }}>R$ 100,00</p>
        </div>
        <div className="text-right">
          <p className="card-label mb-1">Retorno</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9375rem", fontWeight: 700, color: G }}>R$ 187,00</p>
        </div>
      </div>

      {profit ? (
        <div className="py-4 rounded-xl text-center"
          style={{ background: profit.win ? GD : RD, color: profit.win ? G : RED, border: `1px solid ${profit.win ? "rgba(0,232,122,0.3)" : RB}`, fontWeight: 700, fontSize: "1rem" }}>
          {profit.win ? "✓ WIN  +R$ 87,00" : "✗ LOSS  -R$ 100,00"}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setSelected("call")}
            className="py-3 rounded-xl transition-all hover:scale-105"
            style={{ background: selected === "call" ? G : GD, color: selected === "call" ? "#fff" : G, border: "1px solid rgba(0,232,122,0.3)", fontSize: "0.875rem", fontWeight: 800, letterSpacing: "0.04em" }}>
            ▲ CALL
          </button>
          <button onClick={() => setSelected("put")}
            className="py-3 rounded-xl transition-all hover:scale-105"
            style={{ background: selected === "put" ? RED : RD, color: selected === "put" ? "#fff" : RED, border: `1px solid ${RB}`, fontSize: "0.875rem", fontWeight: 800, letterSpacing: "0.04em" }}>
            ▼ PUT
          </button>
        </div>
      )}

      {/* Win rate strip */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t" style={{ borderColor: BORDER }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: MFG }}>Taxa de acerto hoje</p>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
            <div className="h-full rounded-full" style={{ width: "78%", background: G }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 700, color: G }}>78%</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,232,122,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            {/* Eyebrow */}
            <div className="mb-8">
              <Badge color="blue">
                <Globe className="w-3 h-3" />
                Veritas Global — Mercados Internacionais
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="mb-7"
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.75rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.03em", height: 298, width: 657 }}>
              <span style={{ color: FG }}>Desenvolvimento</span><br />
              <span className="blue-gradient">estratégico para o</span><br />
              <span style={{ color: FG }}>mercado financeiro global</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-10" style={{ fontSize: "1.0625rem", fontWeight: 500, lineHeight: 1.75, color: MFG, maxWidth: "46ch", width: 486 }}>
              A Veritas Global foi estruturada com o propósito de desenvolver investidores que desejam
              compreender os mercados financeiros internacionais com uma visão mais estratégica e disciplinada.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a href={PLATFORM_URL} className="flex items-center gap-2.5 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
                style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.01em", boxShadow: "0 0 40px var(--primary-glow)" }}>
                Acessar Plataforma <ArrowRight className="w-4 h-4" />
              </a>
              <button className="flex items-center gap-2.5 px-7 py-4 rounded-xl border transition-all hover:border-white/20"
                style={{ borderColor: BORDER, color: FG, background: "rgba(255,255,255,0.03)", fontSize: "0.9375rem", fontWeight: 600 }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Como funciona
              </button>
            </div>

            {/* Proof pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Taxa de acerto", value: "78%" },
                { label: "Payout médio",   value: "+87%" },
                { label: "Traders ativos", value: "5.200+" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                  style={{ background: BD, border: `1px solid ${BB}` }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 700, color: B }}>{p.value}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: MFG }}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float hidden lg:block">
            <BinaryPanel />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5" style={{ color: MFG }} />
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function useCountUp(target: number, d = 2000) {
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

const STATS = [
  { value: 5200, suffix: "+",  label: "Traders formados",       icon: <Users className="w-5 h-5" />,   prefix: ""  },
  { value: 78,   suffix: "%",  label: "Taxa média de acerto",   icon: <Target className="w-5 h-5" />,  prefix: ""  },
  { value: 87,   suffix: "%",  label: "Payout médio garantido", icon: <Percent className="w-5 h-5" />, prefix: "+" },
  { value: 3200, suffix: "+",  label: "Sinais emitidos/mês",    icon: <Zap className="w-5 h-5" />,     prefix: ""  },
];

function Stats() {
  const winRate = useCountUp(78);
  const payout  = useCountUp(87);
  const traders = useCountUp(5200);
  const signals = useCountUp(3200);

  return (
    <section className="py-24 border-y" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-4">

          {/* Top-left — Signals chart */}
          <div ref={signals.ref} className="bento-card p-7 flex flex-col gap-5" style={{ minHeight: 260 }}>
            {/* Chart area */}
            <div className="flex-1 overflow-hidden rounded-xl relative"
              style={{ background: "linear-gradient(135deg, rgba(25,172,254,0.07) 0%, rgba(4,5,12,0.6) 100%)", border: `1px solid ${BB}` }}>
              {/* Subtle inner grid lines */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "linear-gradient(rgba(25,172,254,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(25,172,254,0.3) 1px, transparent 1px)", backgroundSize: "40px 30px" }} />
              <svg viewBox="0 0 300 140" className="w-full h-full relative z-10" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sigGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(25,172,254,0.25)" />
                    <stop offset="100%" stopColor="rgba(25,172,254,0)" />
                  </linearGradient>
                </defs>
                <path d="M0 135 C20 130 40 118 60 108 C80 98 90 105 110 94 C130 83 138 66 160 56 C182 46 190 58 210 44 C230 30 245 10 270 6 C285 4 293 10 300 8"
                  stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M0 135 C20 130 40 118 60 108 C80 98 90 105 110 94 C130 83 138 66 160 56 C182 46 190 58 210 44 C230 30 245 10 270 6 C285 4 293 10 300 8 L300 140 L0 140Z"
                  fill="url(#sigGrad)" />
                {/* Dot at the end */}
                <circle cx="300" cy="8" r="4" fill={B} />
                <circle cx="300" cy="8" r="8" fill={B} opacity="0.2" />
              </svg>
            </div>
            {/* Text */}
            <div>
              <p className="stat-value" style={{ fontSize: "2.25rem" }}>+{signals.value.toLocaleString("pt-BR")}</p>
              <p className="stat-label">sinais emitidos/mês</p>
            </div>
          </div>

          {/* Top-right — Win rate */}
          <div ref={winRate.ref} className="bento-card p-7 flex flex-col items-center justify-center text-center gap-5" style={{ minHeight: 260 }}>
            {/* Ellipse decoration behind number */}
            <div className="relative flex items-center justify-center" style={{ width: 200, height: 100 }}>
              <svg viewBox="0 0 254 104" fill="none" className="absolute inset-0 w-full h-full" style={{ color: "rgba(25,172,254,0.1)" }}>
                <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" fill="currentColor" />
              </svg>
              <span className="relative z-10" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "4.5rem", fontWeight: 900, color: B, lineHeight: 1, letterSpacing: "-0.04em" }}>
                {winRate.value}%
              </span>
            </div>
            <div>
              <p className="card-title" style={{ fontSize: "1.0625rem" }}>Taxa de acerto</p>
              <p className="card-body mt-1" style={{ maxWidth: "26ch" }}>Média histórica dos traders formados pela Veritas</p>
            </div>
          </div>

          {/* Bottom-left — Payout */}
          <div ref={payout.ref} className="bento-card p-7 flex flex-col items-center justify-center text-center gap-5" style={{ minHeight: 220 }}>
            {/* Double-ring icon */}
            <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: `1px solid rgba(25,172,254,0.12)` }} />
              <div className="absolute rounded-full" style={{ inset: 10, border: `1px solid ${BB}` }} />
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(25,172,254,0.07) 0%, transparent 70%)" }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{ background: BD, border: `1px solid ${BB}` }}>
                <Percent className="w-7 h-7" style={{ color: B }} />
              </div>
            </div>
            <div>
              <p className="stat-value" style={{ fontSize: "2.5rem" }}>+{payout.value}%</p>
              <p className="stat-label">Payout médio garantido</p>
            </div>
          </div>

          {/* Bottom-right — Traders */}
          <div ref={traders.ref} className="bento-card p-7 flex flex-col items-center justify-center text-center gap-5" style={{ minHeight: 220 }}>
            {/* Double-ring icon */}
            <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(0,232,122,0.12)" }} />
              <div className="absolute rounded-full" style={{ inset: 10, border: "1px solid rgba(0,232,122,0.25)" }} />
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,232,122,0.06) 0%, transparent 70%)" }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{ background: GD, border: "1px solid rgba(0,232,122,0.25)" }}>
                <Users className="w-7 h-7" style={{ color: G }} />
              </div>
            </div>
            <div>
              <p className="stat-value" style={{ fontSize: "2.5rem", color: G }}>{traders.value.toLocaleString("pt-BR")}+</p>
              <p className="stat-label">Traders formados</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Solutions ─────────────────────────────────────────────────────────────────
function Solutions() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          badge="O que você aprende"
          heading="Do sinal ao lucro em operações reais"
          sub="Metodologia completa para operar binárias e cripto com consistência — estratégia, gestão e psicologia do trader."
        />

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">

          {/* Card 1 — large */}
          <div className="bento-card sm:col-span-6 lg:col-span-4 p-8 flex flex-col justify-between min-h-72">
            <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(25,172,254,0.1) 0%, transparent 70%)", filter: "blur(30px)" }} />
            <div className="flex items-start justify-between relative">
              <div>
                <div className="mb-4">
                  <Badge color="blue">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: G }} />Mais popular
                  </Badge>
                </div>
                <h3 className="card-title text-xl mb-3">Opções Binárias na Prática</h3>
                <p className="card-body max-w-sm">
                  Aprenda a identificar entradas de CALL e PUT com alta precisão — análise de tendência, suporte/resistência
                  e padrões de vela em ativos cripto e Forex.
                </p>
              </div>
              <IBox><Target className="w-5 h-5" /></IBox>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl" style={{ background: GD, border: "1px solid rgba(0,232,122,0.2)" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 700, color: G, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>▲ CALL</p>
                <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: FG }}>BTC/USD · 5min</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.25rem" }}>Payout: +87% · WIN</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: RD, border: `1px solid ${RB}` }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 700, color: RED, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>▼ PUT</p>
                <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: FG }}>ETH/USD · 1min</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.25rem" }}>Payout: +83% · WIN</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bento-card sm:col-span-3 lg:col-span-2 p-6 flex flex-col gap-5">
            <IBox color="gold"><ShieldCheck className="w-5 h-5" /></IBox>
            <div>
              <h3 className="card-title mb-2">Gestão de Banca</h3>
              <p className="card-body">Regras de stop, martingale controlado e tamanho de entrada — proteja seu capital em qualquer cenário.</p>
            </div>
            <div className="mt-auto p-3 rounded-lg" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD }}>Regra dos 2%</p>
              <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.2rem" }}>Nunca arrisque mais que 2% por operação</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bento-card sm:col-span-3 lg:col-span-3 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <IBox color="green"><Zap className="w-5 h-5" /></IBox>
              <Badge color="green">
                <span className="w-1.5 h-1.5 rounded-full animate-glow-green" style={{ background: G }} />Ao vivo
              </Badge>
            </div>
            <div>
              <h3 className="card-title mb-2">Sinais em Tempo Real</h3>
              <p className="card-body">Receba 12–20 sinais por dia no grupo exclusivo — ativo, direção, horário e payout esperado.</p>
            </div>
            <div className="mt-auto space-y-2">
              {[
                { asset: "BTC/USD", dir: "CALL", time: "14:30", pay: "+87%" },
                { asset: "EUR/USD", dir: "PUT",  time: "14:45", pay: "+83%" },
              ].map((s) => (
                <div key={s.time} className="flex items-center justify-between p-2.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 700, color: FG }}>{s.asset}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.04em", color: s.dir === "CALL" ? G : RED }}>{s.dir}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 500, color: MFG }}>{s.time}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 700, color: B }}>{s.pay}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4 */}
          <div className="bento-card sm:col-span-3 lg:col-span-3 p-6 flex flex-col gap-5">
            <IBox><Bitcoin className="w-5 h-5" /></IBox>
            <div>
              <h3 className="card-title mb-2">Cripto Spot & Futuros</h3>
              <p className="card-body">Análise on-chain, estrutura de mercado e operações alavancadas em BTC, ETH e altcoins de alto potencial.</p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              {["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE"].map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-full"
                  style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.75rem", fontWeight: 700 }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Card 5 */}
          <div className="bento-card sm:col-span-3 lg:col-span-2 p-6 flex flex-col gap-5">
            <IBox><BarChart3 className="w-5 h-5" /></IBox>
            <div>
              <h3 className="card-title mb-2">Análise Técnica</h3>
              <p className="card-body">Price action, médias, RSI, Bandas de Bollinger e IFR aplicados às binárias e cripto.</p>
            </div>
          </div>

          {/* Card 6 — large */}
          <div className="bento-card sm:col-span-6 lg:col-span-4 p-8 flex flex-col sm:flex-row gap-8 items-center">
            <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(25,172,254,0.06) 0%, transparent 70%)", filter: "blur(30px)" }} />
            <div className="flex-1 relative">
              <div className="mb-4"><Badge color="gold">Exclusivo</Badge></div>
              <h3 className="card-title text-xl mb-3">Sala de Operações ao Vivo</h3>
              <p className="card-body">
                Entre ao vivo com nossos traders toda semana — veja operações sendo executadas em tempo real,
                faça perguntas e aprenda no ritmo do mercado.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: BD, border: `1px solid ${BB}` }}>
                <Trophy className="w-8 h-8" style={{ color: B }} />
              </div>
              <div className="text-center">
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: FG }}>Toda semana</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.2rem" }}>Terças e Quintas · 20h</p>
              </div>
              <button className="px-6 py-2.5 rounded-xl hover:opacity-90"
                style={{ background: B, color: "#fff", fontSize: "0.875rem", fontWeight: 700, boxShadow: "0 0 20px var(--primary-glow)" }}>
                Entrar na Sala
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Live Operations ───────────────────────────────────────────────────────────
const OPS = [
  { user: "M. Oliveira", asset: "BTC/USD", dir: "CALL", entry: "R$ 200", result: "+R$ 174", win: true,  time: "2min" },
  { user: "F. Costa",    asset: "ETH/USD", dir: "PUT",  entry: "R$ 150", result: "+R$ 124", win: true,  time: "4min" },
  { user: "R. Souza",    asset: "EUR/USD", dir: "CALL", entry: "R$ 100", result: "-R$ 100", win: false, time: "7min" },
  { user: "A. Lima",     asset: "SOL/USD", dir: "CALL", entry: "R$ 300", result: "+R$ 261", win: true,  time: "10min" },
  { user: "C. Santos",   asset: "GBP/USD", dir: "PUT",  entry: "R$ 80",  result: "+R$ 69",  win: true,  time: "13min" },
  { user: "L. Ferreira", asset: "BNB/USD", dir: "CALL", entry: "R$ 250", result: "+R$ 217", win: true,  time: "17min" },
];

function OpCard({ op }: { op: typeof OPS[0] }) {
  return (
    <div className="bento-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: BD, color: B, fontSize: "0.75rem", fontWeight: 700 }}>{op.user[0]}</div>
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: FG }}>{op.user}</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 500, color: MFG }}>há {op.time}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full"
          style={{ background: op.win ? GD : RD, color: op.win ? G : RED, border: `1px solid ${op.win ? "rgba(0,232,122,0.2)" : RB}`, fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.06em" }}>
          {op.win ? "WIN" : "LOSS"}
        </span>
      </div>
      <div className="flex items-end justify-between pt-4 border-t" style={{ borderColor: BORDER }}>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9375rem", fontWeight: 700, color: FG }}>{op.asset}</p>
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded"
            style={{ background: op.dir === "CALL" ? GD : RD, color: op.dir === "CALL" ? G : RED, fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.04em" }}>
            {op.dir === "CALL" ? "▲" : "▼"} {op.dir}
          </span>
        </div>
        <div className="text-right">
          <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginBottom: "0.2rem" }}>Entrada: {op.entry}</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: op.win ? G : RED }}>{op.result}</p>
        </div>
      </div>
    </div>
  );
}

function LiveOps() {
  const winRateLive = useCountUp(83);

  return (
    <section className="py-24" style={{ background: "var(--muted)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div className="mb-5"><Badge color="green">
            <span className="w-1.5 h-1.5 rounded-full animate-glow-green" style={{ background: G }} />
            Operações ao vivo
          </Badge></div>
          <h2 className="section-heading-xl" style={{ marginBottom: 0 }}>
            <ScrollRevealText>Resultados reais dos nossos alunos</ScrollRevealText>
          </h2>
        </div>

        <div className="grid grid-cols-6 gap-3">

          {/* Hero card — ops table, col-span-full lg:col-span-4 */}
          <div className="bento-card p-7 col-span-full lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="card-title text-lg">Operações ao vivo</p>
                <p className="card-body mt-1">Últimas operações executadas pelos alunos</p>
              </div>
              <Badge color="green">
                <span className="w-1.5 h-1.5 rounded-full animate-glow-green" style={{ background: G }} />
                Ao vivo
              </Badge>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
              <div className="grid grid-cols-4 px-4 py-2.5 border-b" style={{ borderColor: BORDER, background: "rgba(255,255,255,0.02)" }}>
                {["Ativo", "Direção", "Resultado", "Status"].map((h) => (
                  <span key={h} style={{ fontSize: "0.6875rem", fontWeight: 700, color: MFG, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {OPS.slice(0, 4).map((op, idx) => (
                <div key={idx} className="grid grid-cols-4 items-center px-4 py-3 border-b last:border-0" style={{ borderColor: BORDER }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8125rem", fontWeight: 700, color: FG }}>{op.asset}</span>
                  <span className="px-2 py-0.5 rounded inline-flex w-fit items-center gap-1"
                    style={{ background: op.dir === "CALL" ? GD : RD, color: op.dir === "CALL" ? G : RED, fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.04em" }}>
                    {op.dir === "CALL" ? "▲" : "▼"} {op.dir}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 700, color: op.win ? G : RED }}>{op.result}</span>
                  <span className="px-2.5 py-0.5 rounded-full inline-flex w-fit"
                    style={{ background: op.win ? GD : RD, color: op.win ? G : RED, border: `1px solid ${op.win ? "rgba(0,232,122,0.2)" : RB}`, fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em" }}>
                    {op.win ? "WIN" : "LOSS"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Win rate card, col-span-full lg:col-span-2 */}
          <div ref={winRateLive.ref} className="bento-card p-8 col-span-full lg:col-span-2 flex flex-col items-center justify-center text-center gap-4">
            <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
              <svg viewBox="0 0 220 220" fill="none" className="absolute inset-0 w-full h-full" style={{ color: BD }}>
                <path d="M112.891 97.7022C140.366 97.0802 169.015 97.7022 197.891 97.7022C207.281 97.7022 215.891 106.312 215.891 115.702C215.891 125.092 207.281 133.702 197.891 133.702C169.015 133.702 140.366 134.324 112.891 133.702C85.4156 133.08 57.6948 130.14 31.1909 123.741C20.0166 121.044 8.14318 112.741 8.14317 101.241C8.14317 89.741 20.0166 81.4379 31.1909 78.741C57.6948 72.3424 85.4156 68.3242 112.891 97.7022Z" fill="currentColor" />
              </svg>
              <span className="relative" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3rem", fontWeight: 900, color: G, lineHeight: 1 }}>
                {winRateLive.value}%
              </span>
            </div>
            <div>
              <p className="card-title">Taxa de acerto</p>
              <p className="stat-label mt-1">5/6 wins hoje</p>
            </div>
          </div>

          {/* Remaining op cards — 3 cards, col-span-full sm:col-span-3 lg:col-span-2 each */}
          {OPS.slice(3, 6).map((op, i) => (
            <div key={i} className="col-span-full sm:col-span-3 lg:col-span-2">
              <OpCard op={op} />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

// ── Platforms ─────────────────────────────────────────────────────────────────

// ── Education ─────────────────────────────────────────────────────────────────
const MODS = [
  { title: "Fundamentos das Opções Binárias", level: "Iniciante",     lessons: 14, img: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop" },
  { title: "Estratégias de CALL e PUT",       level: "Intermediário", lessons: 18, img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop" },
  { title: "Gestão de Banca Profissional",    level: "Fundamental",   lessons: 10, img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop" },
  { title: "Bitcoin e Altcoins na Prática",   level: "Intermediário", lessons: 20, img: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop" },
  { title: "Price Action & Padrões de Vela",  level: "Avançado",      lessons: 22, img: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=600&h=400&fit=crop" },
  { title: "Psicologia do Trader Vencedor",   level: "Fundamental",   lessons: 8,  img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop" },
];

const LCOL: Record<string, string> = {
  Iniciante: G, Fundamental: B, Intermediário: GOLD, Avançado: RED,
};

function Education() {
  return (
    <section className="py-24" style={{ background: "var(--muted)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          center
          badge="Trilha Completa"
          heading="Aprenda do zero ao avançado"
          sub="6 módulos estruturados para transformar qualquer pessoa em um trader consistente de binárias e cripto."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODS.map((m) => (
            <div key={m.title} className="bento-card group">
              <div className="relative h-44 overflow-hidden">
                <img src={m.img} alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(8,12,24,0.95) 100%)" }} />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(4,5,12,0.85)", color: LCOL[m.level], border: `1px solid ${LCOL[m.level]}40`, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                  {m.level}
                </span>
              </div>
              <div className="p-5">
                <h3 className="card-title mb-3">{m.title}</h3>
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 600, color: MFG }}>{m.lessons} aulas</p>
                  <button className="flex items-center gap-1" style={{ fontSize: "0.75rem", fontWeight: 700, color: B }}>
                    Ver módulo <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Profit Calculator ─────────────────────────────────────────────────────────
function Calculator() {
  const [banca, setBanca] = useState(1000);
  const [entrada, setEntrada] = useState(2);
  const [payout, setPayout] = useState(87);
  const [acerto, setAcerto] = useState(70);
  const [ops, setOps] = useState(20);

  const entradaVal = (banca * entrada) / 100;
  const wins = Math.round((ops * acerto) / 100);
  const losses = ops - wins;
  const lucro = wins * entradaVal * (payout / 100) - losses * entradaVal;
  const roi = ((lucro / banca) * 100).toFixed(1);

  const controls = [
    { label: "Banca inicial",    value: banca,   min: 100,  max: 50000, step: 100,  set: setBanca,   fmt: (v: number) => `R$ ${v.toLocaleString("pt-BR")}` },
    { label: "Entrada (%banca)", value: entrada, min: 1,    max: 10,    step: 0.5,  set: setEntrada, fmt: (v: number) => `${v}%` },
    { label: "Payout médio",     value: payout,  min: 70,   max: 95,    step: 1,    set: setPayout,  fmt: (v: number) => `+${v}%` },
    { label: "Taxa de acerto",   value: acerto,  min: 50,   max: 90,    step: 1,    set: setAcerto,  fmt: (v: number) => `${v}%` },
    { label: "Operações/dia",    value: ops,     min: 5,    max: 50,    step: 1,    set: setOps,     fmt: (v: number) => `${v} ops` },
  ];

  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          center
          badge="Calculadora"
          heading="Calcule seu lucro em binárias"
          sub="Simule seus resultados com base em taxa de acerto, payout e gestão de banca real."
        />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {controls.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: 600, color: FG }}>{c.label}</label>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 700, color: B }}>{c.fmt(c.value)}</span>
                </div>
                <input type="range" min={c.min} max={c.max} step={c.step} value={c.value}
                  onChange={(e) => c.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
          </div>

          <div>
            <div className="bento-card p-6 mb-4">
              <p className="card-label mb-5">Resultado estimado por dia</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Entrada por op.",   value: `R$ ${entradaVal.toFixed(2)}`,                            color: FG  },
                  { label: "Wins",              value: `${wins} ops`,                                             color: G   },
                  { label: "Losses",            value: `${losses} ops`,                                           color: RED },
                  { label: "Lucro líquido",     value: `${lucro >= 0 ? "+" : ""}R$ ${lucro.toFixed(2)}`,         color: lucro >= 0 ? G : RED },
                  { label: "ROI diário",        value: `${lucro >= 0 ? "+" : ""}${roi}%`,                        color: lucro >= 0 ? B : RED },
                  { label: "ROI mensal est.",   value: `${(Number(roi) * 22).toFixed(1)}%`,                      color: B   },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
                    <p className="card-label mb-2">{item.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.0625rem", fontWeight: 700, color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: MFG }}>Taxa de acerto</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 700, color: acerto >= 60 ? G : RED }}>{acerto}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${acerto}%`, background: acerto >= 60 ? G : RED }} />
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl hover:opacity-90"
              style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 30px var(--primary-glow)" }}>
              Quero esses resultados →
            </button>
            <div className="flex items-start gap-2 mt-3">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: MFG }} />
              <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, lineHeight: 1.6 }}>
                Simulação com fins educacionais. Resultados passados não garantem resultados futuros. Operações binárias envolvem risco de perda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTS = [
  { name: "Marcos Oliveira", role: "Trader — São Paulo", gain: "R$ 4.800/mês", plan: "Elite",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "Comecei com R$500 e hoje opero com banca de R$8.000. A metodologia de gestão da Veritas mudou tudo — parei de quebrar e comecei a lucrar consistentemente." },
  { name: "Fernanda Costa", role: "Médica + Trader — Rio",  gain: "R$ 3.200/mês", plan: "Pro",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    text: "Em 4 meses aprendi a operar BTC e binárias enquanto trabalhava. Os sinais do grupo são precisos e a sala ao vivo me ensinou a pensar como trader." },
  { name: "Rafael Souza", role: "Engenheiro + Trader — BH", gain: "78% acerto",    plan: "Starter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    text: "Tentei várias plataformas sozinho e só perdia. Com a Veritas aprendi gestão de banca e análise técnica — hoje tenho 78% de acerto consistente." },
];

function Testimonials() {
  return (
    <section className="py-24" style={{ background: "var(--muted)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          center
          badge="Depoimentos"
          heading="Traders que transformaram resultados"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTS.map((t) => (
            <div key={t.name} className="bento-card p-7 flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: FG }}>{t.name}</p>
                    <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.15rem" }}>{t.role}</p>
                  </div>
                </div>
                <Badge color="green">{t.gain}</Badge>
              </div>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill={GOLD} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="card-body flex-1 leading-relaxed">"{t.text}"</p>
              <div className="mt-6 pt-4 border-t" style={{ borderColor: BORDER }}>
                <Badge color="blue">Plano {t.plan}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Lead Capture ──────────────────────────────────────────────────────────────
function LeadCapture() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: CARD }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(25,172,254,0.06) 0%, transparent 70%)" }} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-6"><Badge color="red">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: RED }} />
          Apenas 30 vagas disponíveis
        </Badge></div>
        <h2 className="section-heading-xl mx-auto mb-6" style={{ maxWidth: "26ch" }}>
          <ScrollRevealText>Comece a operar com resultado ainda esta semana</ScrollRevealText>
        </h2>
        <p className="section-body-center mb-12">
          Preencha abaixo — um especialista da Veritas entrará em contato para montar sua estratégia de banca
          e indicar os melhores ativos para o seu perfil.
        </p>

        {sent ? (
          <div className="max-w-md mx-auto bento-card p-8 text-center" style={{ borderColor: "rgba(0,232,122,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: FG, marginBottom: "0.5rem" }}>Solicitação recebida!</h3>
            <p className="card-body mx-auto" style={{ maxWidth: "30ch" }}>Nossa equipe vai entrar em contato em até 2 horas.</p>
            <a href="https://wa.me/5511999999999"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl"
              style={{ background: "#25D366", color: "#fff", fontSize: "0.875rem", fontWeight: 700 }}>
              Falar no WhatsApp agora
            </a>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="max-w-md mx-auto space-y-4">
            {[
              { ph: "Seu nome completo",  v: name,  s: setName,  t: "text"  },
              { ph: "Seu melhor e-mail",  v: email, s: setEmail, t: "email" },
              { ph: "WhatsApp (com DDD)", v: phone, s: setPhone, t: "tel"   },
            ].map((f) => (
              <input key={f.ph} type={f.t} placeholder={f.ph} value={f.v}
                onChange={(e) => f.s(e.target.value)} required
                className="w-full px-5 py-4 rounded-xl border outline-none"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: BORDER, color: FG, fontFamily: "'Manrope', sans-serif", fontSize: "0.9375rem", fontWeight: 500 }}
                onFocus={(e) => (e.target.style.borderColor = BB)}
                onBlur={(e)  => (e.target.style.borderColor = BORDER)}
              />
            ))}
            <button type="submit" className="w-full py-4 rounded-xl hover:opacity-90"
              style={{ background: B, color: "#fff", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.01em", boxShadow: "0 0 40px var(--primary-glow)" }}>
              Quero começar a operar gratuitamente →
            </button>
            <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG }}>
              Sem spam. Ao enviar, você concorda com nossa Política de Privacidade.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Opções binárias são legais no Brasil?",
    a: "Sim. A operação com opções binárias é legal para residentes brasileiros em plataformas internacionais. O trader é responsável por declarar os ganhos à Receita Federal conforme a legislação vigente." },
  { q: "Preciso de experiência para começar?",
    a: "Não. Nosso Módulo 1 começa do absoluto zero — explicamos o que é uma opção binária, como funciona o payout, como escolher ativos e como fazer sua primeira operação com segurança." },
  { q: "Qual o valor mínimo para começar a operar?",
    a: "A maioria das plataformas aceita depósito mínimo de R$50 a R$200. Recomendamos começar com pelo menos R$500 para conseguir aplicar a gestão de banca de forma eficiente." },
  { q: "Como funcionam os sinais de operação?",
    a: "Enviamos sinais diários no grupo exclusivo contendo: ativo, direção (CALL ou PUT), horário de entrada e tempo de expiração. Você executa na sua plataforma e acompanha o resultado." },
  { q: "Posso operar cripto e binárias ao mesmo tempo?",
    a: "Sim, e ensinamos as duas modalidades. Muitos alunos usam cripto para investimento de médio/longo prazo e binárias para geração de renda mensal — estratégias complementares." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader center badge="Dúvidas" heading="Perguntas frequentes" />
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bento-card" style={{ borderColor: open === i ? BB : BORDER }}>
              <button className="w-full flex items-center justify-between p-6 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: FG, lineHeight: 1.4 }}>{faq.q}</span>
                <ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-300"
                  style={{ color: B, transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="card-body">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-16" style={{ borderColor: BORDER, background: CARD }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <img src={logo1} alt="Veritas" className="h-10 w-auto object-contain mb-6"
              style={{ filter: "drop-shadow(0 0 6px rgba(25,172,254,0.25))" }} />
            <p className="card-body max-w-xs mb-6">
              Formação profissional em opções binárias e criptomoedas — do iniciante ao trader consistente.
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 500, color: MFG }}>contato@academyveritas.net</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "0.3rem" }}>Vila Olímpia, São Paulo/SP</p>
          </div>
          {[
            { title: "Conteúdo", links: ["Binárias", "Cripto", "Sinais", "Educação"] },
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
            Opções binárias e criptomoedas envolvem risco de perda. Opere com responsabilidade.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Missão e Visão ────────────────────────────────────────────────────────────
function MissionVision() {
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-5"><Badge color="blue">Fundamentos</Badge></div>
          <h2 className="section-heading-xl mx-auto" style={{ maxWidth: "20ch" }}>
            Nossa <span className="blue-gradient">Missão</span> e Visão
          </h2>
        </div>
        <div className="grid grid-cols-6 gap-3">

          {/* Missão — equal, col-span-full lg:col-span-3 */}
          <div className="bento-card p-10 col-span-full lg:col-span-3 flex flex-col gap-8"
            style={{ background: "linear-gradient(135deg, rgba(25,172,254,0.07) 0%, var(--card) 70%)" }}>
            <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(25,172,254,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
            {/* Double-ring visual */}
            <div className="relative mx-auto flex items-center justify-center" style={{ width: 112, height: 112 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${BB}`, opacity: 0.3 }} />
              <div className="absolute rounded-full" style={{ inset: 10, border: `1px solid ${BB}`, opacity: 0.6 }} />
              {/* Radial glow */}
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(25,172,254,0.12) 0%, transparent 70%)" }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{ background: BD, border: `1px solid ${BB}` }}>
                <Rocket className="w-8 h-8" style={{ color: B }} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="card-title text-xl mb-4">Missão</h3>
              <p className="card-body leading-relaxed mx-auto" style={{ maxWidth: "52ch" }}>
                Desenvolver traders estratégicos por meio de conhecimento estruturado, acompanhamento profissional
                e integração com os melhores mercados financeiros — promovendo uma atuação consciente, disciplinada
                e lucrativa em opções binárias e cripto.
              </p>
            </div>
            <div className="pt-4 mt-auto border-t flex justify-center" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {["Educação", "Estratégia", "Resultado"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full"
                    style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.6875rem", fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Visão — equal, col-span-full lg:col-span-3 */}
          <div className="bento-card p-10 col-span-full lg:col-span-3 flex flex-col gap-8"
            style={{ background: "linear-gradient(135deg, rgba(0,232,122,0.05) 0%, var(--card) 60%)" }}>
            <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,232,122,0.07) 0%, transparent 70%)", filter: "blur(30px)" }} />
            {/* Double-ring visual */}
            <div className="relative mx-auto flex items-center justify-center" style={{ width: 112, height: 112 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(0,232,122,0.15)", opacity: 0.4 }} />
              <div className="absolute rounded-full" style={{ inset: 10, border: "1px solid rgba(0,232,122,0.25)", opacity: 0.7 }} />
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,232,122,0.1) 0%, transparent 70%)" }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{ background: GD, border: "1px solid rgba(0,232,122,0.2)" }}>
                <Eye className="w-8 h-8" style={{ color: G }} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="card-title text-xl mb-3">Visão</h3>
              <p className="card-body leading-relaxed">
                Ser reconhecida como referência no desenvolvimento de traders no Brasil e na América Latina,
                estabelecendo um padrão de excelência na formação e integração com os mercados digitais globais.
              </p>
            </div>
            <div className="pt-4 mt-auto border-t flex justify-center" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {["Excelência", "Liderança", "Impacto"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full"
                    style={{ background: GD, border: "1px solid rgba(0,232,122,0.2)", color: G, fontSize: "0.6875rem", fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Metodologia ───────────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Conhecimento Estratégico",
    desc: "Formação estruturada para compreensão profunda dos mercados financeiros — análise técnica, price action e padrões de binárias.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Disciplina Operacional",
    desc: "Desenvolvimento de processos consistentes e metodologia de atuação — gestão de banca, stop e controle emocional.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Acompanhamento Profissional",
    desc: "Estrutura de suporte técnico com sala ao vivo, sinais diários e análise contínua para evolução constante do trader.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Integração Global",
    desc: "Acesso e conexão com as principais plataformas internacionais de binárias e exchanges de cripto do mundo.",
  },
];

function Methodology() {
  const consistRate = useCountUp(95);

  return (
    <section className="py-24" style={{ background: "var(--muted)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          center
          badge="Nossa Metodologia"
          heading="Metodologia Veritas"
          sub="Nossa estrutura de formação é baseada em quatro pilares fundamentais que sustentam o desenvolvimento de traders consistentes."
        />
        <div className="grid grid-cols-6 gap-3">

          {/* Card 1 — Conhecimento Estratégico, col-span-full lg:col-span-2 */}
          <div className="bento-card p-8 col-span-full lg:col-span-2 flex flex-col gap-6">
            <div className="relative flex items-center justify-center mb-2" style={{ width: 96, height: 96 }}>
              <svg viewBox="0 0 220 220" fill="none" className="absolute inset-0 w-full h-full" style={{ color: BD }}>
                <path d="M112.891 97.7022C140.366 97.0802 169.015 97.7022 197.891 97.7022C207.281 97.7022 215.891 106.312 215.891 115.702C215.891 125.092 207.281 133.702 197.891 133.702C169.015 133.702 140.366 134.324 112.891 133.702C85.4156 133.08 57.6948 130.14 31.1909 123.741C20.0166 121.044 8.14318 112.741 8.14317 101.241C8.14317 89.741 20.0166 81.4379 31.1909 78.741C57.6948 72.3242 85.4156 68.3242 112.891 97.7022Z" fill="currentColor" />
              </svg>
              <span className="relative" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3rem", fontWeight: 900, color: B, lineHeight: 1, letterSpacing: "-0.04em" }}>01</span>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: BD, border: `1px solid ${BB}` }}>
              <BookOpen className="w-5 h-5" style={{ color: B }} />
            </div>
            <div>
              <h3 className="card-title mb-3">{PILLARS[0].title}</h3>
              <p className="card-body">{PILLARS[0].desc}</p>
            </div>
          </div>

          {/* Card 2 — Disciplina Operacional, col-span-full sm:col-span-3 lg:col-span-2 */}
          <div ref={consistRate.ref} className="bento-card p-8 col-span-full sm:col-span-3 lg:col-span-2 flex flex-col items-center text-center gap-5">
            <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${BB}`, opacity: 0.4 }} />
              <div className="absolute rounded-full" style={{ inset: 8, border: `1px solid ${BB}`, opacity: 0.7 }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: BD, border: `1px solid ${BB}` }}>
                <Target className="w-6 h-6" style={{ color: B }} />
              </div>
            </div>
            <div className="mb-1">
              <p className="stat-value">{consistRate.value}%</p>
              <p className="stat-label">taxa de consistência</p>
            </div>
            <div>
              <h3 className="card-title mb-2">{PILLARS[1].title}</h3>
              <p className="card-body">{PILLARS[1].desc}</p>
            </div>
          </div>

          {/* Card 3 — Acompanhamento Profissional, col-span-full sm:col-span-3 lg:col-span-2 */}
          <div className="bento-card p-8 col-span-full sm:col-span-3 lg:col-span-2 flex flex-col items-center text-center gap-5">
            <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(0,232,122,0.2)", opacity: 0.4 }} />
              <div className="absolute rounded-full" style={{ inset: 8, border: "1px solid rgba(0,232,122,0.2)", opacity: 0.7 }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: GD, border: "1px solid rgba(0,232,122,0.2)" }}>
                <Users className="w-6 h-6" style={{ color: G }} />
              </div>
            </div>
            <div>
              <h3 className="card-title mb-2">{PILLARS[2].title}</h3>
              <p className="card-body">{PILLARS[2].desc}</p>
            </div>
          </div>

          {/* Card 4 — Integração Global, col-span-full lg:col-span-3 */}
          <div className="bento-card col-span-full lg:col-span-3 p-8 flex flex-col sm:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: BD, border: `1px solid ${BB}` }}>
                <Globe className="w-5 h-5" style={{ color: B }} />
              </div>
              <div>
                <h3 className="card-title mb-2">{PILLARS[3].title}</h3>
                <p className="card-body">{PILLARS[3].desc}</p>
              </div>
            </div>
            <div className="sm:w-52 shrink-0 rounded-xl overflow-hidden" style={{ background: "rgba(8,12,24,0.8)", border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b" style={{ borderColor: BORDER }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
              </div>
              <div className="p-4 space-y-3">
                {["IQ Option", "Binance", "Quotex"].map((platform) => (
                  <div key={platform} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: G }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, color: FG }}>{platform}</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded" style={{ background: GD, color: G, fontSize: "0.6rem", fontWeight: 700 }}>LIVE</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 5 — Sala ao Vivo, col-span-full lg:col-span-3 */}
          <div className="bento-card col-span-full lg:col-span-3 p-8 flex flex-col sm:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <Trophy className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <h3 className="card-title mb-2">Sala ao Vivo</h3>
                <p className="card-body">Acompanhe operações ao vivo com traders experientes toda semana — terças e quintas às 20h.</p>
              </div>
            </div>
            <div className="sm:w-52 shrink-0 rounded-xl overflow-hidden" style={{ background: "rgba(8,12,24,0.8)", border: `1px solid ${BORDER}` }}>
              <div className="px-3 py-2.5 border-b" style={{ borderColor: BORDER }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: MFG, letterSpacing: "0.06em" }}>SINAIS AO VIVO</span>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { asset: "BTC/USD", dir: "CALL", pay: "+87%", win: true },
                  { asset: "EUR/USD", dir: "PUT",  pay: "+83%", win: true },
                  { asset: "SOL/USD", dir: "CALL", pay: "+85%", win: false },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 700, color: FG, flex: 1 }}>{s.asset}</span>
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, color: s.dir === "CALL" ? G : RED }}>{s.dir}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", fontWeight: 700, color: s.win ? G : RED }}>{s.pay}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Valores ───────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Inovação",
    desc: "Tecnologia de ponta e estratégias modernas aplicadas ao mercado de binárias e cripto.",
    accent: "rgba(139,92,246,0.15)",
    accentBorder: "rgba(139,92,246,0.25)",
    accentText: "#a78bfa",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Transparência",
    desc: "Clareza total nas operações, sinais e comunicação — você sabe exatamente o que está fazendo.",
    accent: BD,
    accentBorder: BB,
    accentText: B,
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Segurança",
    desc: "Protocolos robustos de gestão de capital e risco em cada operação — preservar a banca é prioridade.",
    accent: GD,
    accentBorder: "rgba(0,232,122,0.2)",
    accentText: G,
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Comprometimento",
    desc: "Acompanhamento próximo e suporte estratégico personalizado em cada etapa da sua jornada.",
    accent: BD,
    accentBorder: BB,
    accentText: B,
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Ética",
    desc: "Conduta profissional irrepreensível e respeito ao trader em cada decisão e comunicação.",
    accent: "rgba(201,168,76,0.1)",
    accentBorder: "rgba(201,168,76,0.25)",
    accentText: GOLD,
  },
];

function DoubleRingIcon({ v, isActive }: { v: typeof VALUES[0]; isActive: boolean }) {
  return (
    <div className="relative mx-auto mb-6 flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${v.accentBorder}`, opacity: isActive ? 0.8 : 0.4 }} />
      <div className="absolute rounded-full" style={{ inset: 8, border: `1px solid ${v.accentBorder}`, opacity: isActive ? 1 : 0.7 }} />
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: v.accent, border: `1px solid ${v.accentBorder}` }}>
        <div style={{ color: v.accentText }}>{v.icon}</div>
      </div>
    </div>
  );
}

function ValuesSection() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          center
          badge="Nossos Valores"
          heading="O que nos move"
          sub="Clique em cada valor para entender como ele se aplica na nossa operação diária."
        />
        <div className="grid grid-cols-6 gap-3">

          {/* Card 0 — Inovação, col-span-full lg:col-span-2 */}
          {[0, 1, 2].map((i) => {
            const v = VALUES[i];
            const isActive = active === i;
            return (
              <div key={i} onClick={() => setActive(isActive ? null : i)}
                className={`bento-card p-8 cursor-pointer flex flex-col items-center text-center transition-all duration-300 ${i === 0 ? "col-span-full lg:col-span-2" : "col-span-full sm:col-span-3 lg:col-span-2"}`}
                style={{
                  background: isActive ? `linear-gradient(135deg, ${v.accent} 0%, var(--card) 70%)` : "var(--card)",
                  borderColor: isActive ? v.accentBorder : BORDER,
                  transform: isActive ? "translateY(-4px)" : undefined,
                  boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.4)" : undefined,
                }}>
                <DoubleRingIcon v={v} isActive={isActive} />
                <div>
                  <h3 className="card-title mb-2">{v.title}</h3>
                  <p className="card-body">{v.desc}</p>
                </div>
                <div className="mt-auto pt-4">
                  <span className="flex items-center gap-1.5 justify-center"
                    style={{ fontSize: "0.8125rem", fontWeight: 700, color: v.accentText }}>
                    Saiba mais <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Card 3 — Comprometimento, col-span-full lg:col-span-3 */}
          {(() => {
            const i = 3;
            const v = VALUES[i];
            const isActive = active === i;
            return (
              <div onClick={() => setActive(isActive ? null : i)}
                className="bento-card p-8 col-span-full lg:col-span-3 cursor-pointer flex flex-col sm:flex-row gap-8 transition-all duration-300"
                style={{
                  background: isActive ? `linear-gradient(135deg, ${v.accent} 0%, var(--card) 70%)` : "var(--card)",
                  borderColor: isActive ? v.accentBorder : BORDER,
                  transform: isActive ? "translateY(-4px)" : undefined,
                  boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.4)" : undefined,
                }}>
                <div className="flex-1 flex flex-col gap-4">
                  <DoubleRingIcon v={v} isActive={isActive} />
                  <div>
                    <h3 className="card-title mb-2">{v.title}</h3>
                    <p className="card-body">{v.desc}</p>
                  </div>
                  <span className="flex items-center gap-1.5 mt-auto"
                    style={{ fontSize: "0.8125rem", fontWeight: 700, color: v.accentText }}>
                    Saiba mais <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                {/* Mini support panel */}
                <div className="sm:w-52 shrink-0 rounded-xl overflow-hidden" style={{ background: "rgba(8,12,24,0.8)", border: `1px solid ${BORDER}` }}>
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: BORDER }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: MFG, letterSpacing: "0.06em" }}>SUPORTE</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { msg: "Dúvida sobre gestão?", right: false, avatar: "M" },
                      { msg: "Claro! Explico agora.", right: true,  avatar: "V" },
                      { msg: "Muito obrigado!",       right: false, avatar: "M" },
                    ].map((bubble, idx) => (
                      <div key={idx} className={`flex items-end gap-1.5 ${bubble.right ? "flex-row-reverse" : ""}`}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: bubble.right ? BD : "rgba(255,255,255,0.08)", fontSize: "0.5625rem", fontWeight: 700, color: bubble.right ? B : MFG }}>
                          {bubble.avatar}
                        </div>
                        <div className="px-2.5 py-1.5 rounded-xl max-w-[140px]"
                          style={{ background: bubble.right ? BD : "rgba(255,255,255,0.06)", border: `1px solid ${bubble.right ? BB : BORDER}` }}>
                          <span style={{ fontSize: "0.6875rem", fontWeight: 500, color: bubble.right ? B : FG }}>{bubble.msg}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 4 — Ética, col-span-full lg:col-span-3 */}
          {(() => {
            const i = 4;
            const v = VALUES[i];
            const isActive = active === i;
            return (
              <div onClick={() => setActive(isActive ? null : i)}
                className="bento-card p-8 col-span-full lg:col-span-3 cursor-pointer flex flex-col sm:flex-row gap-8 transition-all duration-300"
                style={{
                  background: isActive ? `linear-gradient(135deg, ${v.accent} 0%, var(--card) 70%)` : "var(--card)",
                  borderColor: isActive ? v.accentBorder : BORDER,
                  transform: isActive ? "translateY(-4px)" : undefined,
                  boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.4)" : undefined,
                }}>
                <div className="flex-1 flex flex-col gap-4">
                  <DoubleRingIcon v={v} isActive={isActive} />
                  <div>
                    <h3 className="card-title mb-2">{v.title}</h3>
                    <p className="card-body">{v.desc}</p>
                  </div>
                  <span className="flex items-center gap-1.5 mt-auto"
                    style={{ fontSize: "0.8125rem", fontWeight: 700, color: v.accentText }}>
                    Saiba mais <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                {/* Mini donut / ethics visual */}
                <div className="sm:w-48 shrink-0 flex flex-col items-center justify-center gap-4">
                  <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="12" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke={GOLD} strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset="0"
                        strokeLinecap="round" transform="rotate(-90 50 50)" />
                    </svg>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 900, color: GOLD }}>100%</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD, textAlign: "center" }}>Conduta Ética</p>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </section>
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

function BrokersSection() {
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
function NoiseOverlay() {
  return (
    <div style={{
      width: "100vw", height: "100vh", opacity: 0.12,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
      position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 50, mixBlendMode: "plus-lighter",
    }} />
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useLenis();
  return (
    <div style={{ background: "var(--background)", minHeight: "100%" }}>
      <NoiseOverlay />
      <Ticker />
      <Navbar />
      <Hero />
      <Stats />
      <MissionVision />
      <Solutions />
      <LiveOps />
      <Methodology />
      <BrokersSection />
      <Education />
      <Calculator />
      <ValuesSection />
      <Testimonials />
      <LeadCapture />
      <FAQ />
      <Footer />
    </div>
  );
}
