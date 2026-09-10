import {
  Copy, Users, BarChart3, Target, Zap, TrendingUp, Clock, CheckCircle2,
  Brain, Layers, GraduationCap, Lock, Shield, AlertTriangle, Check, ArrowRight,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { type LandingView } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/CopyTrading (raspado em 2026-09-10).
// Mesmo tema visual aplicado em HomeOriginal.tsx: fundo quase preto, gradiente
// azul-índigo, cards com borda sutil sem fundo colorido.

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

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="text-center mb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.1, maxWidth: "28ch" }}>
        {title}
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

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2.5 rounded-full hover:opacity-90 transition-opacity"
      style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.9375rem", fontWeight: 700, padding: "1rem 2rem" }}>
      {children}
    </button>
  );
}

// ── Como funciona na prática ──────────────────────────────────────────────────
const STEPS = [
  "Você seleciona um trader ou estratégia disponível",
  "Analisa métricas como desempenho, risco e consistência",
  "Define o valor que deseja alocar",
  "As operações são replicadas automaticamente na sua conta",
  "Acompanhe tudo em tempo real",
];
const STEP_ICONS = [Users, BarChart3, Target, Zap, TrendingUp];

// ── Métricas disponíveis ──────────────────────────────────────────────────────
const METRICS = [
  "Histórico de performance",
  "Taxa de acerto",
  "Drawdown (nível de risco)",
  "Frequência de operações",
  "Tempo médio por operação",
];
const METRIC_ICONS = [TrendingUp, CheckCircle2, BarChart3, Clock, Target];

// ── Benefícios ────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: <Zap className="w-6 h-6" />, title: "Automação estratégica", desc: "Operações automatizadas baseadas em estratégias reais e testadas no mercado." },
  { icon: <Brain className="w-6 h-6" />, title: "Redução emocional", desc: "Elimine decisões impulsivas. A estratégia guia cada operação." },
  { icon: <Users className="w-6 h-6" />, title: "Traders experientes", desc: "Acesso direto a profissionais com histórico comprovado de resultados." },
  { icon: <Layers className="w-6 h-6" />, title: "Diversificação", desc: "Copie múltiplas estratégias simultâneas para equilibrar o risco." },
  { icon: <GraduationCap className="w-6 h-6" />, title: "Ideal para iniciantes", desc: "Aprenda na prática acompanhando operações reais de especialistas." },
];

// ── Você mantém o controle total ──────────────────────────────────────────────
const CONTROLS = [
  { icon: <Lock className="w-5 h-5" />, label: "Limite de perda configurável" },
  { icon: <Shield className="w-5 h-5" />, label: "Controle de exposição" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Ajuste proporcional de capital" },
  { icon: <AlertTriangle className="w-5 h-5" />, label: "Interrupção automática em cenários de risco" },
];

// ── Para quem é indicado ──────────────────────────────────────────────────────
const PROFILE = [
  "Iniciantes no mercado financeiro",
  "Pessoas sem tempo para operar",
  "Investidores que buscam diversificação",
  "Usuários que desejam aprender na prática",
];

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: BG }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(94,144,255,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
          style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
          <Copy className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
          <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Serviço Exclusivo</span>
        </div>
        <h1 className="mx-auto mb-6" style={{ fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.1, maxWidth: "26ch" }}>
          <ScrollRevealText style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Copy Trading
          </ScrollRevealText>
          <ScrollRevealText style={{ color: WHITE }}>
            : acesso a estratégias profissionais no mercado global
          </ScrollRevealText>
        </h1>
        <p className="mx-auto mb-10" style={{ color: MUTED, fontSize: "1.125rem", lineHeight: 1.6, maxWidth: "56ch" }}>
          Execute operações automaticamente ao replicar estratégias de traders experientes, com total transparência e controle da sua conta.
        </p>
        <PrimaryButton onClick={() => onNavigate("planos")}>Ativar Copy Trading agora <ArrowRight className="w-4 h-4" /></PrimaryButton>
      </div>
    </section>
  );
}

// ── O que é Copy Trading? ─────────────────────────────────────────────────────
function Conceito() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto px-6">
        <SectionHead eyebrow="Conceito" title="O que é Copy Trading?" />
        <p className="mx-auto text-center" style={{ color: MUTED, fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "68ch" }}>
          O Copy Trading é uma tecnologia que permite que investidores repliquem, em tempo real, as operações
          realizadas por traders profissionais. Ao invés de tomar decisões sozinho, você acompanha estratégias
          já testadas no mercado, com base em dados e consistência operacional.
        </p>
      </div>
    </section>
  );
}

// ── Como funciona na prática ──────────────────────────────────────────────────
function ComoFunciona() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Processo" title="Como funciona na prática" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Card key={s} className="p-6 flex flex-col gap-4 relative">
                <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.75rem", fontWeight: 800 }}>{i + 1}</span>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                  <Icon className="w-5 h-5" />
                </div>
                <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: WHITE, lineHeight: 1.5 }}>{s}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Métricas disponíveis ──────────────────────────────────────────────────────
function MetricasDisponiveis() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Transparência" title="Métricas disponíveis"
          sub="Indicadores transparentes de cada estratégia antes e depois de ativar o Copy Trading." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {METRICS.map((m, i) => {
            const Icon = METRIC_ICONS[i];
            return (
              <Card key={m} className="p-6 flex flex-col items-center text-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                  <Icon className="w-5 h-5" />
                </div>
                <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: WHITE }}>{m}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Benefícios ────────────────────────────────────────────────────────────────
function Beneficios() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Vantagens" title="Benefícios" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <Card key={b.title} className="p-7 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{b.icon}</div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{b.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Você mantém o controle total ──────────────────────────────────────────────
function Seguranca() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Eyebrow>Segurança</Eyebrow>
          <h2 className="mb-5" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15 }}>
            Você mantém o controle total
          </h2>
          <p style={{ color: MUTED, fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Você mantém controle total da sua conta em todos os momentos. O Copy Trading não realiza saques e
            pode ser pausado ou interrompido a qualquer momento.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTROLS.map((c) => (
            <Card key={c.label} className="p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{c.icon}</div>
              <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: WHITE }}>{c.label}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Para quem é indicado ──────────────────────────────────────────────────────
function Perfil() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto px-6">
        <SectionHead eyebrow="Perfil" title="Para quem é indicado" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {PROFILE.map((p) => (
            <Card key={p} className="p-5 flex items-center gap-3">
              <Check className="w-4 h-4 shrink-0" style={{ color: "#22c55e" }} />
              <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: WHITE }}>{p}</span>
            </Card>
          ))}
        </div>
        <Card className="p-7 flex items-start gap-4" style={{ background: "rgba(94,144,255,0.05)", borderColor: "rgba(94,144,255,0.25)" }}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BLUE_LIGHT }} />
          <div>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: WHITE, marginBottom: "0.4rem" }}>Transparência e responsabilidade</h3>
            <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>
              O desempenho passado não garante resultados futuros. O mercado financeiro envolve riscos, e os
              resultados podem variar. A Veritas Global oferece estrutura, acompanhamento e educação — não gestão
              de recursos de terceiros.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ── CTA final ─────────────────────────────────────────────────────────────────
function CTAFinal({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(94,144,255,0.08) 0%, transparent 70%)" }} />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="mb-6"><Eyebrow>Comece agora</Eyebrow></div>
        <h2 className="mx-auto mb-5" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, maxWidth: "26ch" }}>
          <ScrollRevealText>Ative o Copy Trading com suporte estratégico</ScrollRevealText>
        </h2>
        <p className="mx-auto mb-10" style={{ color: MUTED, fontSize: "1.125rem" }}>
          Disponível a partir do Plano Estratégico. Você não opera sozinho — conta com acompanhamento
          especializado em cada etapa.
        </p>
        <PrimaryButton onClick={() => onNavigate("planos")}>Ativar Copy Trading agora <ArrowRight className="w-4 h-4" /></PrimaryButton>
        <p style={{ fontSize: "0.8125rem", color: MUTED, marginTop: "1rem" }}>
          Ativação imediata após confirmação. Investimentos envolvem riscos.
        </p>
      </div>
    </section>
  );
}

// ── Página completa ────────────────────────────────────────────────────────────
export default function CopyTrading({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <Conceito />
      <ComoFunciona />
      <MetricasDisponiveis />
      <Beneficios />
      <Seguranca />
      <Perfil />
      <CTAFinal onNavigate={onNavigate} />
    </>
  );
}
