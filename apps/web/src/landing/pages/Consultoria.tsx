import {
  Handshake, FileSearch, PieChart, ShieldCheck, RefreshCw, ArrowRight, Check,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import {
  B, G, FG, BORDER, Badge, IBox, SectionHeader,
  type LandingView,
} from "../shared";

const SERVICES = [
  {
    icon: <FileSearch className="w-5 h-5" />,
    title: "Diagnóstico Financeiro",
    desc: "Mapeamos sua situação financeira atual, objetivos de curto, médio e longo prazo, tolerância ao risco e horizonte de investimento para construir uma estratégia sob medida.",
    items: ["Entrevista detalhada de perfil", "Análise do portfólio atual", "Definição de metas e horizonte temporal", "Relatório diagnóstico completo"],
  },
  {
    icon: <PieChart className="w-5 h-5" />,
    title: "Planejamento de Portfólio",
    desc: "Desenvolvemos uma alocação estratégica de ativos diversificada, combinando mercados nacionais e internacionais conforme seu perfil e objetivos.",
    items: ["Alocação estratégica entre classes de ativos", "Seleção de ativos internacionais", "Definição de proporções e exposição cambial", "Estratégia de rebalanceamento periódico"],
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Gestão de Risco Personalizada",
    desc: "Implementamos e monitoramos os mecanismos de proteção do seu capital, garantindo que nenhuma posição coloque em risco sua estratégia de longo prazo.",
    items: ["Definição de stop loss por posição", "Monitoramento de correlação de ativos", "Hedging estratégico quando necessário", "Relatórios de risco periódicos"],
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Acompanhamento Contínuo",
    desc: "Reuniões regulares com sua equipe dedicada para revisar performance, ajustar estratégias e manter você informado sobre o que acontece com seu capital.",
    items: ["Reuniões estratégicas conforme o plano", "Relatórios de performance periódicos", "Canal de comunicação direta com analistas", "Ajustes táticos em tempo real"],
  },
];

const HOW = [
  { n: "01", title: "Contato Inicial", desc: "Você nos contata e agendamos uma conversa de apresentação sem custo e sem compromisso." },
  { n: "02", title: "Diagnóstico", desc: "Realizamos uma análise completa do seu perfil financeiro, objetivos e situação atual." },
  { n: "03", title: "Proposta Estratégica", desc: "Apresentamos um plano personalizado com estratégias, alocações e projeções de resultado." },
  { n: "04", title: "Implementação", desc: "Com a sua aprovação, iniciamos as operações e o acompanhamento contínuo." },
];

export default function Consultoria({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><Handshake className="w-3 h-3" />Consultoria Especializada</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "24ch" }}>
            <ScrollRevealText>Estratégia sob medida para o seu perfil</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Nossa consultoria vai além da execução de operações. Construímos com você uma estratégia financeira
            completa, personalizada e orientada para o seu crescimento de longo prazo.
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="O que oferecemos" heading="Serviços de consultoria" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bento-card p-8 flex flex-col gap-5">
                <IBox>{s.icon}</IBox>
                <div>
                  <h3 className="card-title mb-2">{s.title}</h3>
                  <p className="card-body">{s.desc}</p>
                </div>
                <ul className="space-y-2.5 mt-auto pt-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: G }} />
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: FG, lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--muted)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Passo a passo" heading="Como funciona" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW.map((h) => (
              <div key={h.n} className="bento-card p-7 flex flex-col gap-4">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.75rem", fontWeight: 900, color: B, letterSpacing: "-0.03em" }}>{h.n}</span>
                <div>
                  <h3 className="card-title mb-2">{h.title}</h3>
                  <p className="card-body">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" style={{ background: "var(--card)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(25,172,254,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="mb-6"><Badge color="blue">Pronto para começar?</Badge></div>
          <h2 className="section-heading-xl mx-auto mb-5" style={{ maxWidth: "26ch" }}>
            <ScrollRevealText>Agende uma conversa sem compromisso</ScrollRevealText>
          </h2>
          <p className="section-body-center mb-10">
            Descubra qual estratégia faz mais sentido para o seu perfil com nossa equipe especializada.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => onNavigate("planos")} className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
              style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
              Ver planos <ArrowRight className="w-4 h-4" />
            </button>
            <a href="https://wa.me/5511999999999" className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl border transition-all hover:border-white/20"
              style={{ borderColor: BORDER, color: FG, background: "rgba(255,255,255,0.03)", fontSize: "0.9375rem", fontWeight: 600 }}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
