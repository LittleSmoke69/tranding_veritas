import {
  Briefcase, TrendingUp, Globe, Sparkles, HeartPulse, Users, Handshake,
  MapPin, Building, Laptop, ArrowRight, Mail,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";

// Réplica visual fiel de https://veritasacademy.base44.app/Carreiras (raspado em 2026-09-10).
// Mesmo tema visual da Home nova (HomeOriginal.tsx): fundo quase preto, gradiente
// azul-índigo, cards com borda sutil e sem fundo colorido. Tokens locais, sem
// dependência dos tokens de marca antigos.

const BG = "#0a0a0a";
const WHITE = "#ffffff";
const MUTED = "#9ca3af";
const BLUE_LIGHT = "#5e90ff";
const BORDER = "rgba(31,41,55,0.5)";
const BTN_GRADIENT = "linear-gradient(to right, #2e64ff, #1f4ee6)";
const TEXT_GRADIENT = "linear-gradient(to right, #5e90ff, #1f4ee6)";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-center" style={{ color: BLUE_LIGHT, fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title, gradientPart, sub }: { eyebrow: string; title: string; gradientPart?: string; sub?: string }) {
  return (
    <div className="text-center mb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1, maxWidth: "26ch" }}>
        {title}{gradientPart && (
          <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}> {gradientPart}</span>
        )}
      </h2>
      {sub && <p className="mx-auto mt-4" style={{ color: MUTED, fontSize: "1.125rem", maxWidth: "56ch" }}>{sub}</p>}
    </div>
  );
}

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ borderColor: BORDER, background: "transparent", ...style }}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const cls = "inline-flex items-center gap-2.5 rounded-full hover:opacity-90 transition-opacity";
  const style: React.CSSProperties = { backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.875rem", fontWeight: 600, padding: "1rem 2rem" };
  return href
    ? <a href={href} className={cls} style={style}>{children}</a>
    : <button onClick={onClick} className={cls} style={style}>{children}</button>;
}

// ── Dados ──────────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: <TrendingUp className="w-5 h-5" />, label: "Participação nos resultados" },
  { icon: <Globe className="w-5 h-5" />, label: "Acesso a mercados globais" },
  { icon: <Sparkles className="w-5 h-5" />, label: "Ambiente inovador e dinâmico" },
  { icon: <HeartPulse className="w-5 h-5" />, label: "Plano de saúde completo" },
  { icon: <Users className="w-5 h-5" />, label: "Cultura de colaboração" },
  { icon: <Handshake className="w-5 h-5" />, label: "Desenvolvimento contínuo" },
];

const JOBS = [
  { dept: "Investimentos", title: "Analista de Mercados Financeiros", city: "São Paulo, SP", mode: "Presencial / Híbrido" },
  { dept: "Tecnologia", title: "Desenvolvedor FinTech (Full Stack)", city: "Qualquer lugar do Brasil", mode: "Remoto" },
  { dept: "Relacionamento", title: "Consultor de Investimentos", city: "São Paulo, SP", mode: "Híbrido" },
];

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: BG }}>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(94,144,255,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
          style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
          <Briefcase className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
          <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Trabalhe Conosco</span>
        </div>
        <h1 className="mx-auto mb-5" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.1, maxWidth: "22ch" }}>
          <ScrollRevealText>Construa sua carreira no mercado global</ScrollRevealText>
        </h1>
        <p className="mx-auto" style={{ color: MUTED, fontSize: "1.125rem", lineHeight: 1.6, maxWidth: "56ch" }}>
          Na Veritas Global, você trabalhará com profissionais de alto nível, tecnologia de ponta e um ambiente que valoriza resultado, transparência e crescimento contínuo.
        </p>
      </div>
    </section>
  );
}

// ── O que oferecemos ─────────────────────────────────────────────────────────
function Beneficios() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Benefícios" title="O que" gradientPart="oferecemos" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <Card key={b.label} className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                {b.icon}
              </div>
              <p style={{ fontSize: "0.875rem", fontWeight: 700, color: WHITE }}>{b.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Vagas abertas ────────────────────────────────────────────────────────────
function VagasAbertas() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto px-6">
        <SectionHead eyebrow="Oportunidades" title="Vagas" gradientPart="abertas" />
        <div className="space-y-3">
          {JOBS.map((j) => (
            <Card key={j.title} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <span className="px-3 py-1 rounded-full self-start" style={{ background: "rgba(94,144,255,0.1)", border: "1px solid rgba(94,144,255,0.3)", color: BLUE_LIGHT, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {j.dept}
              </span>
              <div className="flex-1">
                <h3 className="mb-1.5" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{j.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1" style={{ fontSize: "0.75rem", color: MUTED }}>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{j.city}</span>
                  <span className="flex items-center gap-1">
                    {j.mode === "Remoto" ? <Laptop className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                    {j.mode}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 self-start sm:self-auto shrink-0" style={{ fontSize: "0.8125rem", fontWeight: 700, color: BLUE_LIGHT }}>
                Ver vaga <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Envie seu currículo ──────────────────────────────────────────────────────
function EnvieCurriculo() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <Card className="p-10">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <h2 className="mb-3" style={{ color: WHITE, fontSize: "1.375rem", fontWeight: 700 }}>Não encontrou a vaga ideal?</h2>
          <p className="mx-auto mb-6" style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: "48ch" }}>
            Envie seu currículo para <strong style={{ color: WHITE }}>carreiras@veritasglobal.com</strong> e entraremos em contato quando surgir uma oportunidade alinhada ao seu perfil.
          </p>
          <PrimaryButton href="mailto:carreiras@veritasglobal.com"><Mail className="w-4 h-4" /> Enviar currículo</PrimaryButton>
        </Card>
      </div>
    </section>
  );
}

// ── Página completa ────────────────────────────────────────────────────────────
export default function Carreiras() {
  return (
    <>
      <Hero />
      <Beneficios />
      <VagasAbertas />
      <EnvieCurriculo />
    </>
  );
}
