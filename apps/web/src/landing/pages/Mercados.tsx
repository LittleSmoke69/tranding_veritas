import {
  Globe, ShieldCheck, Coins, LineChart, Boxes,
  Landmark, Bot, AlertTriangle, BookOpen, Percent, BarChart3, Brain,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { type LandingView } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/Mercados (raspado em 2026-09-10).
// Mesmo tema visual aplicado em HomeOriginal.tsx — fundo quase preto, gradiente
// azul-índigo, cards com borda sutil sem fundo colorido. Tokens definidos localmente,
// sem depender das variáveis de marca do resto do site.

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

// ── Dados ─────────────────────────────────────────────────────────────────────
const MARKETS = [
  { icon: <Globe className="w-5 h-5" />, title: "Mercado Forex (Câmbio)",
    desc: "O mercado global de moedas é o maior e mais líquido do mundo, operando 24 horas por dia. Permite negociar pares de moedas como EUR/USD, GBP/USD e USD/JPY através de análise técnica e fundamental. Requer disciplina, gestão de risco rigorosa e compreensão dos fatores macroeconômicos que movimentam as moedas internacionais." },
  { icon: <Coins className="w-5 h-5" />, title: "Mercado de Criptomoedas",
    desc: "Ativos digitais baseados em tecnologia blockchain, como Bitcoin, Ethereum e outras altcoins. Caracterizado por alta volatilidade e oportunidades de diversificação. Exige conhecimento técnico da tecnologia, disciplina operacional e gestão de risco apropriada para navegar em um mercado 24/7 descentralizado e em constante evolução." },
  { icon: <LineChart className="w-5 h-5" />, title: "Mercado de Índices Internacionais",
    desc: "Índices como S&P 500, Nasdaq, Dow Jones e FTSE 100 funcionam como termômetros das principais economias mundiais. Representam a performance de grupos de empresas líderes e permitem exposição diversificada às maiores economias globais, refletindo tendências de crescimento e ciclos econômicos internacionais." },
  { icon: <Boxes className="w-5 h-5" />, title: "Mercado de Commodities",
    desc: "Inclui ativos reais como ouro, petróleo, prata, cobre e commodities agrícolas. São utilizados para diversificação de portfólio e proteção contra inflação. O ouro, por exemplo, é considerado ativo de reserva em momentos de incerteza, enquanto o petróleo reflete a dinâmica da economia global." },
  { icon: <Landmark className="w-5 h-5" />, title: "Mercado de Ações Internacionais",
    desc: "Acesso a empresas líderes globais listadas nas principais bolsas mundiais como NYSE, Nasdaq e LSE. Permite investir em gigantes tecnológicas, industriais e de serviços. A diversificação internacional reduz riscos regionais e oferece exposição a diferentes setores e ciclos econômicos globais." },
  { icon: <Bot className="w-5 h-5" />, title: "Estratégias Assistidas e Automatizadas",
    desc: "Uso de tecnologia avançada com algoritmos e inteligência artificial, sempre sob supervisão humana. As estratégias combinam automação com controle de risco profissional, análise de mercado em tempo real e ajustes baseados em condições de mercado, mantendo a disciplina operacional e gestão responsável." },
];

const HIGHLIGHTS = [
  { icon: <Globe className="w-5 h-5" />, title: "Operação Global", desc: "Todos os mercados operam no ambiente internacional através de corretoras regulamentadas." },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Gestão de Risco", desc: "Estratégias globais com controle de risco profissional e disciplina operacional." },
  { icon: <Brain className="w-5 h-5" />, title: "Acompanhamento Contínuo", desc: "Suporte de analistas seniores com experiência internacional em múltiplos mercados." },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Diversificação Estratégica", desc: "Acesso simultâneo a diferentes classes de ativos para reduzir riscos regionais." },
];

const CURRICULUM = [
  "Fundamentos do mercado financeiro internacional",
  "Análise técnica e leitura de gráficos",
  "Gestão de risco e capital",
  "Psicologia do investidor",
  "Estratégias práticas aplicadas",
  "Boas práticas e ética no mercado",
];

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ background: BG }}>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(94,144,255,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
          style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
          <Globe className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
          <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Mercados Financeiros Internacionais</span>
        </div>
        <h1 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.1, maxWidth: "18ch" }}>
          <ScrollRevealText>Acesso aos principais mercados do mundo</ScrollRevealText>
        </h1>
        <p className="mx-auto mt-5" style={{ color: MUTED, fontSize: "1.125rem", lineHeight: 1.6, maxWidth: "56ch" }}>
          Opere nos mercados financeiros globais com formação completa, acompanhamento profissional e gestão de risco estruturada.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)", color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>
            <BarChart3 className="w-3.5 h-3.5" /> Múltiplos Mercados — Diversificação global
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)", color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>
            <BookOpen className="w-3.5 h-3.5" /> Formação Premium — Educação estruturada
          </span>
        </div>
      </div>
    </section>
  );
}

// ── Mercados Disponíveis ───────────────────────────────────────────────────────
function MercadosDisponiveis() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Mercados Disponíveis" title="Conheça os" gradientPart="mercados globais"
          sub="Entenda o funcionamento, características e oportunidades de cada mercado financeiro internacional." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKETS.map((m) => (
            <Card key={m.title} className="p-7 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{m.icon}</div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{m.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Acesso Internacional ───────────────────────────────────────────────────────
function AcessoInternacional() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Acesso Internacional" title="Mercados globais com" gradientPart="acompanhamento profissional"
          sub="Todos os mercados operam no ambiente internacional através de corretoras regulamentadas e com estratégias globais desenvolvidas por profissionais experientes." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {HIGHLIGHTS.map((h) => (
            <Card key={h.title} className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{h.icon}</div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1rem", fontWeight: 700 }}>{h.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.8125rem", lineHeight: 1.6 }}>{h.desc}</p>
              </div>
            </Card>
          ))}
        </div>
        <p className="flex items-start gap-2 rounded-xl border px-4 py-3"
          style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171", fontSize: "0.8125rem", lineHeight: 1.6 }}>
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span><strong>Aviso importante:</strong> operações em mercados financeiros envolvem riscos. Não há garantia de lucros. Todo investimento deve ser feito com capital que você pode dedicar ao mercado e com conhecimento adequado dos riscos envolvidos.</span>
        </p>
      </div>
    </section>
  );
}

// ── Formação Investidor Premium ─────────────────────────────────────────────────
function FormacaoPremium({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto px-6">
        <Card className="p-8 md:p-12 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <p className="mb-4" style={{ color: BLUE_LIGHT, fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Diferencial Exclusivo</p>
            <h2 className="mb-4" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.15 }}>
              Formação{" "}
              <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Investidor Premium</span>
            </h2>
            <p className="mb-4" style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>
              Todos os participantes recebem acesso a um curso completo e estruturado, com objetivo de desenvolver autonomia, disciplina e visão estratégica no mercado financeiro internacional.
            </p>
            <p className="mb-6" style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>
              O curso é progressivo e acompanha o investidor durante os 6 meses do programa, com conteúdo teórico e aplicação prática em mercados reais sob supervisão profissional.
            </p>
            <PrimaryButton onClick={() => onNavigate("planos")}>Ver planos disponíveis</PrimaryButton>
          </div>
          <ul className="space-y-3">
            {CURRICULUM.map((c) => (
              <li key={c} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: BORDER }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                  <Percent className="w-4 h-4" />
                </span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: WHITE }}>{c}</span>
              </li>
            ))}
          </ul>
        </Card>
        <p className="text-center mt-6" style={{ fontSize: "0.75rem", fontWeight: 600, color: MUTED }}>
          Incluído em todos os planos de participação.
        </p>
      </div>
    </section>
  );
}

// ── Página completa ────────────────────────────────────────────────────────────
export default function Mercados({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <Hero />
      <MercadosDisponiveis />
      <AcessoInternacional />
      <FormacaoPremium onNavigate={onNavigate} />
    </>
  );
}
