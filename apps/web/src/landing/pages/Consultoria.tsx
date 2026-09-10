import {
  Handshake, FileSearch, PieChart, ShieldCheck, RefreshCw, ArrowRight, Check,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { type LandingView } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/Consultoria (raspado em 2026-09-10).
// Mesmo tema visual aplicado em HomeOriginal.tsx — fundo quase preto, gradiente
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

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2.5 rounded-full hover:opacity-90 transition-opacity"
      style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.875rem", fontWeight: 600, padding: "1rem 2rem" }}>
      {children}
    </button>
  );
}

function SecondaryLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2.5 rounded-full border transition-colors hover:border-white/30"
      style={{ borderColor: BORDER, color: WHITE, background: "transparent", fontSize: "0.875rem", fontWeight: 600, padding: "1rem 2rem" }}>
      {children}
    </a>
  );
}

// ── Serviços de consultoria ────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: "Diagnóstico Financeiro",
    desc: "Mapeamos sua situação financeira atual, objetivos de curto, médio e longo prazo, tolerância ao risco e horizonte de investimento para construir uma estratégia sob medida.",
    items: ["Entrevista detalhada de perfil", "Análise do portfólio atual", "Definição de metas e horizonte temporal", "Relatório diagnóstico completo"],
  },
  {
    icon: <PieChart className="w-6 h-6" />,
    title: "Planejamento de Portfólio",
    desc: "Desenvolvemos uma alocação estratégica de ativos diversificada, combinando mercados nacionais e internacionais conforme seu perfil e objetivos.",
    items: ["Alocação estratégica entre classes de ativos", "Seleção de ativos internacionais", "Definição de proporções e exposição cambial", "Estratégia de rebalanceamento periódico"],
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Gestão de Risco Personalizada",
    desc: "Implementamos e monitoramos os mecanismos de proteção do seu capital, garantindo que nenhuma posição coloque em risco sua estratégia de longo prazo.",
    items: ["Definição de stop loss por posição", "Monitoramento de correlação de ativos", "Hedging estratégico quando necessário", "Relatórios de risco periódicos"],
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Acompanhamento Contínuo",
    desc: "Reuniões regulares com sua equipe dedicada para revisar performance, ajustar estratégias e manter você informado sobre o que acontece com seu capital.",
    items: ["Reuniões estratégicas conforme o plano", "Relatórios de performance periódicos", "Canal de comunicação direta com analistas", "Ajustes táticos em tempo real"],
  },
];

// ── Como funciona ──────────────────────────────────────────────────────────────
const HOW = [
  { n: "01", title: "Contato Inicial", desc: "Você nos contata e agendamos uma conversa de apresentação sem custo e sem compromisso." },
  { n: "02", title: "Diagnóstico", desc: "Realizamos uma análise completa do seu perfil financeiro, objetivos e situação atual." },
  { n: "03", title: "Proposta Estratégica", desc: "Apresentamos um plano personalizado com estratégias, alocações e projeções de resultado." },
  { n: "04", title: "Implementação", desc: "Com a sua aprovação, iniciamos as operações e o acompanhamento contínuo." },
];

export default function Consultoria({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <section className="relative py-24 overflow-hidden" style={{ background: BG }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(94,144,255,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
            <Handshake className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
            <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Consultoria Especializada</span>
          </div>
          <h1 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(2rem, 5.5vw, 3.5rem)", lineHeight: 1.05, maxWidth: "24ch" }}>
            <ScrollRevealText>Estratégia sob medida para o seu perfil</ScrollRevealText>
          </h1>
          <p className="mx-auto mt-5" style={{ color: MUTED, fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "56ch" }}>
            Nossa consultoria vai além da execução de operações. Construímos com você uma estratégia financeira
            completa, personalizada e orientada para o seu crescimento de longo prazo.
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ background: BG, borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead eyebrow="O que oferecemos" title="Serviços de" gradientPart="consultoria" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <Card key={s.title} className="p-8 flex flex-col gap-5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                  {s.icon}
                </div>
                <div>
                  <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.25rem", fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
                <ul className="space-y-2.5 mt-auto pt-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: MUTED, lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead eyebrow="Passo a passo" title="Como" gradientPart="funciona" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW.map((h) => (
              <Card key={h.n} className="p-7 flex flex-col gap-4">
                <span style={{ fontSize: "1.75rem", fontWeight: 900, color: BLUE_LIGHT, letterSpacing: "-0.03em" }}>{h.n}</span>
                <div>
                  <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{h.title}</h3>
                  <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{h.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" style={{ background: BG }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(94,144,255,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
            <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Pronto para começar?</span>
          </div>
          <h2 className="mx-auto mb-5" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, maxWidth: "26ch" }}>
            <ScrollRevealText>Agende uma conversa sem compromisso</ScrollRevealText>
          </h2>
          <p className="mx-auto mb-10" style={{ color: MUTED, fontSize: "1.125rem", maxWidth: "56ch" }}>
            Com nossa equipe, descubra qual estratégia faz mais sentido para o seu perfil.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PrimaryButton onClick={() => onNavigate("planos")}>Ver planos <ArrowRight className="w-4 h-4" /></PrimaryButton>
            <SecondaryLink href="https://wa.me/5511999999999">Falar no WhatsApp</SecondaryLink>
          </div>
        </div>
      </section>
    </>
  );
}
