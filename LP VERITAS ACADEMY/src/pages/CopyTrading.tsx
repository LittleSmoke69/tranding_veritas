import {
  Copy, Zap, Brain, Users, Layers, GraduationCap, ArrowRight,
  AlertTriangle, Check, ListChecks,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import {
  B, BD, BB, G, MFG, FG, BORDER, GOLD, Badge, IBox, SectionHeader, navigate,
} from "../shared";

const STEPS = [
  "Você seleciona um trader ou estratégia disponível",
  "Analisa métricas como desempenho, risco e consistência",
  "Define o valor que deseja alocar",
  "As operações são replicadas automaticamente na sua conta",
  "Acompanhe tudo em tempo real",
];

const METRICS = [
  "Histórico de performance",
  "Taxa de acerto",
  "Drawdown (nível de risco)",
  "Frequência de operações",
  "Tempo médio por operação",
];

const BENEFITS = [
  { icon: <Zap className="w-5 h-5" />, title: "Automação estratégica", desc: "Operações automatizadas baseadas em estratégias reais e testadas no mercado." },
  { icon: <Brain className="w-5 h-5" />, title: "Redução emocional", desc: "Elimine decisões impulsivas. A estratégia guia cada operação." },
  { icon: <Users className="w-5 h-5" />, title: "Traders experientes", desc: "Acesso direto a profissionais com histórico comprovado de resultados." },
  { icon: <Layers className="w-5 h-5" />, title: "Diversificação", desc: "Copie múltiplas estratégias simultâneas para equilibrar o risco." },
  { icon: <GraduationCap className="w-5 h-5" />, title: "Ideal para iniciantes", desc: "Aprenda na prática acompanhando operações reais de especialistas." },
];

const PROFILE = [
  "Iniciantes no mercado financeiro",
  "Pessoas sem tempo para operar",
  "Investidores que buscam diversificação",
  "Usuários que desejam aprender na prática",
];

export default function CopyTrading() {
  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><Copy className="w-3 h-3" />Serviço Exclusivo</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "24ch" }}>
            <ScrollRevealText>Copy Trading: acesso a estratégias profissionais no mercado global</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Execute operações automaticamente ao replicar estratégias de traders experientes, com total transparência e controle da sua conta.
          </p>
          <div className="mt-10">
            <button onClick={() => navigate("/planos")} className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
              style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
              Ativar Copy Trading agora <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader center badge="Conceito" heading="O que é Copy Trading?" />
          <p className="section-body-center mx-auto" style={{ maxWidth: "68ch" }}>
            O Copy Trading é uma tecnologia que permite que investidores repliquem, em tempo real, as operações
            realizadas por traders profissionais. Ao invés de tomar decisões sozinho, você acompanha estratégias
            já testadas no mercado, com base em dados e consistência operacional.
          </p>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--muted)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader badge="Processo" heading="Como funciona na prática" />
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bento-card p-8">
              <ol className="space-y-5">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-start gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.8125rem", fontWeight: 800 }}>{i + 1}</span>
                    <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: FG, paddingTop: "0.3rem" }}>{s}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bento-card p-8 flex flex-col gap-5">
              <IBox><ListChecks className="w-5 h-5" /></IBox>
              <div>
                <h3 className="card-title mb-2">Métricas que você acompanha</h3>
                <p className="card-body">Indicadores transparentes de cada estratégia antes e depois de ativar o Copy Trading.</p>
              </div>
              <ul className="space-y-3 mt-auto">
                {METRICS.map((m) => (
                  <li key={m} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 shrink-0" style={{ color: G }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: FG }}>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Benefícios" heading="Por que operar com Copy Trading" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bento-card p-7 flex flex-col gap-4">
                <IBox>{b.icon}</IBox>
                <div>
                  <h3 className="card-title mb-2">{b.title}</h3>
                  <p className="card-body">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader center badge="Perfil" heading="Para quem é indicado" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {PROFILE.map((p) => (
              <div key={p} className="bento-card p-5 flex items-center gap-3">
                <Check className="w-4 h-4 shrink-0" style={{ color: G }} />
                <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: FG }}>{p}</span>
              </div>
            ))}
          </div>
          <div className="bento-card p-7 flex items-start gap-4" style={{ background: "rgba(201,168,76,0.05)", borderColor: "rgba(201,168,76,0.2)" }}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GOLD }} />
            <div>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: FG, marginBottom: "0.4rem" }}>Transparência e responsabilidade</h3>
              <p className="card-body">
                O desempenho passado não garante resultados futuros. O mercado financeiro envolve riscos, e os
                resultados podem variar. A Veritas Global oferece estrutura, acompanhamento e educação — não gestão
                de recursos de terceiros.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" style={{ background: "var(--card)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(25,172,254,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="mb-6"><Badge color="blue">Comece agora</Badge></div>
          <h2 className="section-heading-xl mx-auto mb-5" style={{ maxWidth: "26ch" }}>
            <ScrollRevealText>Ative o Copy Trading com suporte estratégico</ScrollRevealText>
          </h2>
          <p className="section-body-center mb-10">
            Disponível a partir do Plano Estratégico. Você não opera sozinho — conta com acompanhamento
            especializado em cada etapa.
          </p>
          <button onClick={() => navigate("/planos")} className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
            style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
            Ativar Copy Trading agora <ArrowRight className="w-4 h-4" />
          </button>
          <p style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG, marginTop: "1rem" }}>
            Ativação imediata após confirmação. Investimentos envolvem riscos.
          </p>
        </div>
      </section>
    </>
  );
}
