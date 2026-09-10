import {
  Globe, ShieldCheck, Coins, LineChart, Boxes,
  Landmark, Bot, AlertTriangle, BookOpen, Percent, BarChart3, Brain,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { B, BD, BB, MFG, FG, BORDER, IBox, Badge, SectionHeader, type LandingView } from "../shared";

const MARKETS = [
  { icon: <Globe className="w-5 h-5" />, title: "Mercado Forex (Câmbio)",
    desc: "O mercado global de moedas é o maior e mais líquido do mundo, operando 24 horas por dia. Permite negociar pares como EUR/USD, GBP/USD e USD/JPY através de análise técnica e fundamental. Requer disciplina, gestão de risco rigorosa e compreensão dos fatores macroeconômicos que movimentam as moedas internacionais." },
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

export default function Mercados({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><Globe className="w-3 h-3" />Mercados Financeiros Internacionais</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "18ch" }}>
            <ScrollRevealText>Acesso aos principais mercados do mundo</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Opere nos mercados financeiros globais com formação completa, acompanhamento profissional e gestão de risco estruturada.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge color="blue"><BarChart3 className="w-3 h-3" />Múltiplos Mercados — Diversificação global</Badge>
            <Badge color="gold"><BookOpen className="w-3 h-3" />Formação Premium — Educação estruturada</Badge>
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            center
            badge="Mercados Disponíveis"
            heading="Conheça os mercados globais"
            sub="Entenda o funcionamento, características e oportunidades de cada mercado financeiro internacional."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKETS.map((m) => (
              <div key={m.title} className="bento-card p-6 flex flex-col gap-4">
                <IBox>{m.icon}</IBox>
                <div>
                  <h3 className="card-title mb-2">{m.title}</h3>
                  <p className="card-body">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--muted)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            center
            badge="Acesso Internacional"
            heading="Mercados globais com acompanhamento profissional"
            sub="Todos os mercados operam no ambiente internacional através de corretoras regulamentadas e com estratégias globais desenvolvidas por profissionais experientes."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="bento-card p-6 flex flex-col gap-4">
                <IBox color="green">{h.icon}</IBox>
                <div>
                  <h3 className="card-title mb-2">{h.title}</h3>
                  <p className="card-body">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="flex items-start gap-2 rounded-ctl border px-4 py-3 text-xs"
            style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "var(--red)" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span><strong>Aviso importante:</strong> operações em mercados financeiros envolvem riscos. Não há garantia de lucros. Todo investimento deve ser feito com capital que você pode dedicar ao mercado e com conhecimento adequado dos riscos envolvidos.</span>
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="bento-card p-8 md:p-12 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
            <div>
              <div className="mb-4"><Badge color="gold">Diferencial Exclusivo</Badge></div>
              <h2 className="card-title text-2xl mb-4">Formação Investidor Premium</h2>
              <p className="card-body mb-4">
                Todos os participantes recebem acesso a um curso completo e estruturado, com objetivo de desenvolver autonomia, disciplina e visão estratégica no mercado financeiro internacional.
              </p>
              <p className="card-body">
                O curso é progressivo e acompanha o investidor durante os 6 meses do programa, com conteúdo teórico e aplicação prática em mercados reais sob supervisão profissional.
              </p>
              <button onClick={() => onNavigate("planos")} className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:opacity-90"
                style={{ background: B, color: "#fff", fontSize: "0.875rem", fontWeight: 700, boxShadow: "0 0 24px var(--primary-glow)" }}>
                Ver planos disponíveis
              </button>
            </div>
            <ul className="space-y-3">
              {CURRICULUM.map((c) => (
                <li key={c} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: BD, border: `1px solid ${BB}`, color: B }}>
                    <Percent className="w-4 h-4" />
                  </span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: FG }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center mt-6" style={{ fontSize: "0.75rem", fontWeight: 600, color: MFG }}>
            Incluído em todos os planos de participação.
          </p>
        </div>
      </section>
    </>
  );
}
