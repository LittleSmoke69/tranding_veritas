import {
  Bot, Zap, Settings2, ShieldCheck, Activity, ArrowRight, AlertTriangle, Check,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import {
  B, G, RED, RD, RB, FG, BORDER, Badge, IBox, SectionHeader,
  type LandingView,
} from "../shared";

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

const STEPS = [
  { n: "01", title: "Configuração da Estratégia", desc: "Definimos os parâmetros da estratégia conforme seu perfil de risco e objetivo financeiro." },
  { n: "02", title: "Aprovação e Ativação", desc: "Você aprova a estratégia e ela é ativada na sua conta na corretora internacional." },
  { n: "03", title: "Operação Automática", desc: "O sistema monitora o mercado 24/7 e executa ordens conforme os critérios pré-definidos." },
  { n: "04", title: "Relatórios e Ajustes", desc: "Você recebe relatórios periódicos e nossa equipe ajusta os parâmetros quando necessário." },
];

export default function Automacao({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><Bot className="w-3 h-3" />Automação de Operações</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "24ch" }}>
            <ScrollRevealText>Tecnologia operando para você, 24 horas por dia</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Nossas estratégias automatizadas combinam inteligência de mercado com execução precisa, eliminando o
            fator emocional e aproveitando oportunidades a qualquer hora do dia — mesmo enquanto você dorme.
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader center badge="O que é automação de operações?" heading="Trading algorítmico e sistemático" />
          <div className="space-y-5">
            <p className="card-body" style={{ fontSize: "0.9375rem" }}>
              Automação de operações, ou trading algorítmico, é o uso de sistemas computacionais para executar
              operações financeiras de forma automática, baseado em regras pré-definidas por especialistas.
            </p>
            <p className="card-body" style={{ fontSize: "0.9375rem" }}>
              Em vez de depender de um analista monitorando telas o dia todo, o sistema identifica oportunidades
              conforme os critérios configurados — como rompimento de níveis técnicos, cruzamento de médias móveis
              ou variação de volatilidade — e executa a ordem imediatamente.
            </p>
            <p className="card-body" style={{ fontSize: "0.9375rem" }}>
              Na Veritas Global, utilizamos automação como complemento, não substituição, da inteligência humana.
              Nossos analistas constroem e supervisionam os sistemas, garantindo que eles operem corretamente em
              qualquer condição de mercado.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--muted)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Como funciona" heading="Como nossa automação funciona" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bento-card p-8 flex flex-col gap-5">
                <IBox>{f.icon}</IBox>
                <div>
                  <h3 className="card-title mb-2">{f.title}</h3>
                  <p className="card-body">{f.desc}</p>
                </div>
                <ul className="space-y-2.5 mt-auto pt-2">
                  {f.items.map((item) => (
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

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Passo a passo" heading="Do parâmetro à execução" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {STEPS.map((s) => (
              <div key={s.n} className="bento-card p-7 flex flex-col gap-4">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.75rem", fontWeight: 900, color: B, letterSpacing: "-0.03em" }}>{s.n}</span>
                <div>
                  <h3 className="card-title mb-2">{s.title}</h3>
                  <p className="card-body">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bento-card p-7 flex items-start gap-4 max-w-3xl mx-auto" style={{ background: RD, borderColor: RB }}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: RED }} />
            <div>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: FG, marginBottom: "0.4rem" }}>Importante</h3>
              <p className="card-body">
                Automação não garante lucros. Todo sistema de trading automatizado opera com risco de perda de
                capital. Nossas estratégias são desenvolvidas para gerenciar esse risco de forma responsável, mas
                resultados passados não são garantia de resultados futuros. Invista sempre capital que você pode
                dedicar ao mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" style={{ background: "var(--card)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(25,172,254,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="mb-6"><Badge color="gold">Comece agora</Badge></div>
          <h2 className="section-heading-xl mx-auto mb-5" style={{ maxWidth: "24ch" }}>
            <ScrollRevealText>Deixe a tecnologia operar por você</ScrollRevealText>
          </h2>
          <button onClick={() => onNavigate("planos")} className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
            style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
            Começar com automação <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}
