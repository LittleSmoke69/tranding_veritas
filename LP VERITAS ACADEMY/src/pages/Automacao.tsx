import {
  Bot, Zap, Settings2, ShieldCheck, Activity, ArrowRight, AlertTriangle, Check,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { navigate } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/Automacao (raspado em 2026-09-10).
// Mesmo tema visual aplicado em HomeOriginal.tsx: fundo quase preto, gradiente
// azul-índigo, cards com borda sutil e fundo transparente.

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
      <h2 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.15, maxWidth: "30ch" }}>
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
      style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.9375rem", fontWeight: 700, padding: "1rem 2rem" }}>
      {children}
    </button>
  );
}

// ── Como funciona (4 recursos) ────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Execução Automática de Ordens",
    desc: "Nossas estratégias automatizadas executam ordens de compra e venda com precisão milissegundos, eliminando atrasos e erros humanos que podem custar caro em mercados voláteis.",
    items: ["Execução em fração de segundo", "Sem interferência emocional nas decisões", "Operação 24/7 mesmo sem monitoramento humano", "Múltiplos ativos gerenciados simultaneamente"],
  },
  {
    icon: <Settings2 className="w-5 h-5" />,
    title: "Estratégias Configuradas por Especialistas",
    desc: "As estratégias algorítmicas utilizadas são desenvolvidas, testadas e monitoradas pela nossa equipe de analistas e engenheiros financeiros com anos de experiência em mercados globais.",
    items: ["Backtesting com dados históricos extensivos", "Otimização contínua dos parâmetros", "Adaptação a diferentes condições de mercado", "Múltiplos sistemas com lógicas distintas"],
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Controle de Risco Integrado",
    desc: "Todo sistema automatizado possui mecanismos de proteção que limitam as perdas máximas por operação e por dia, garantindo que o capital seja preservado mesmo em cenários adversos.",
    items: ["Stop loss automático por operação e por dia", "Limites de exposição máxima por ativo", "Desativação automática em condições anômalas", "Proteção contra gaps de mercado e alta volatilidade"],
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Monitoramento Contínuo",
    desc: "Apesar da automação, nossa equipe monitora continuamente o desempenho dos sistemas, intervindo manualmente quando detectadas condições de mercado fora do padrão esperado.",
    items: ["Alertas em tempo real para nossa equipe", "Dashboards de performance ao vivo", "Intervenção humana quando necessário", "Relatórios automáticos de execução"],
  },
];

// ── Passo a passo ──────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", title: "Configuração da Estratégia", desc: "Definimos os parâmetros da estratégia conforme seu perfil de risco e objetivo financeiro." },
  { n: "02", title: "Aprovação e Ativação", desc: "Você aprova a estratégia e ela é ativada na sua conta na corretora internacional." },
  { n: "03", title: "Operação Automática", desc: "O sistema monitora o mercado 24/7 e executa ordens conforme os critérios pré-definidos." },
  { n: "04", title: "Relatórios e Ajustes", desc: "Você recebe relatórios periódicos e nossa equipe ajusta os parâmetros quando necessário." },
];

export default function Automacao() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-28 overflow-hidden" style={{ background: BG }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(94,144,255,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
            <Bot className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
            <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Automação de Operações</span>
          </div>
          <h1 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(2rem, 5.5vw, 3.5rem)", lineHeight: 1.1, maxWidth: "22ch" }}>
            <ScrollRevealText>Tecnologia operando para você, 24 horas por dia</ScrollRevealText>
          </h1>
          <p className="mx-auto mt-6" style={{ color: MUTED, fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "56ch" }}>
            Nossas estratégias automatizadas combinam inteligência de mercado com execução precisa, eliminando o
            fator emocional e aproveitando oportunidades a qualquer hora do dia — mesmo enquanto você dorme.
          </p>
        </div>
      </section>

      {/* O que é automação de operações */}
      <section className="py-24 border-t" style={{ background: BG, borderColor: BORDER }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionHead eyebrow="O que é automação de operações?" title="Trading algorítmico" gradientPart="e sistemático" />
          <div className="space-y-5 mt-10">
            <p style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.8 }}>
              Automação de operações, ou trading algorítmico, é o uso de sistemas computacionais para executar
              operações financeiras de forma automática, baseado em regras pré-definidas por especialistas.
            </p>
            <p style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.8 }}>
              Em vez de depender de um analista monitorando telas o dia todo, o sistema identifica oportunidades
              conforme os critérios configurados — como rompimento de níveis técnicos, cruzamento de médias móveis
              ou variação de volatilidade — e executa a ordem imediatamente.
            </p>
            <p style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.8 }}>
              Na Veritas Global, utilizamos automação como complemento, não substituição, da inteligência humana.
              Nossos analistas constroem e supervisionam os sistemas, garantindo que eles operem corretamente em
              qualquer condição de mercado.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead eyebrow="Como funciona" title="Como nossa automação" gradientPart="funciona" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-8 flex flex-col gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.125rem", fontWeight: 700 }}>{f.title}</h3>
                  <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
                <ul className="space-y-2.5 mt-auto pt-2">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: WHITE, lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Passo a passo */}
      <section className="py-24 border-t" style={{ background: BG, borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead eyebrow="Passo a passo" title="Do parâmetro" gradientPart="à execução" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {STEPS.map((s) => (
              <Card key={s.n} className="p-7 flex flex-col gap-4">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.75rem", fontWeight: 900, color: BLUE_LIGHT, letterSpacing: "-0.03em" }}>
                  {s.n}
                </span>
                <div>
                  <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-7 flex items-start gap-4 max-w-3xl mx-auto" style={{ borderColor: "rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.06)" }}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#f87171" }} />
            <div>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: WHITE, marginBottom: "0.4rem" }}>Importante</h3>
              <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                Automação não garante lucros. Todo sistema de trading automatizado opera com risco de perda de
                capital. Nossas estratégias são desenvolvidas para gerenciar esse risco de forma responsável, mas
                resultados passados não são garantia de resultados futuros. Invista sempre capital que você pode
                dedicar ao mercado.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 relative overflow-hidden" style={{ background: BG }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(94,144,255,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Eyebrow>Comece agora</Eyebrow>
          <h2 className="mx-auto mb-8" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, maxWidth: "24ch" }}>
            <ScrollRevealText>Deixe a tecnologia operar por você</ScrollRevealText>
          </h2>
          <PrimaryButton onClick={() => navigate("/planos")}>
            Começar com automação <ArrowRight className="w-4 h-4" />
          </PrimaryButton>
        </div>
      </section>
    </>
  );
}
