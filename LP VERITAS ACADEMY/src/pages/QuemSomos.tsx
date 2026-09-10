import { Globe, ShieldCheck, TrendingUp, Users, Building2 } from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { B, BD, BB, GD, MFG, FG, BORDER, IBox, Badge, SectionHeader, navigate } from "../shared";

const PILLARS = [
  { icon: <Globe className="w-5 h-5" />, title: "Presença Global",
    desc: "Operamos nos principais mercados financeiros internacionais, com acesso direto às bolsas americanas, europeias e asiáticas." },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Gestão Responsável",
    desc: "Cada operação é conduzida com rigorosos protocolos de gestão de risco, priorizando a proteção do capital do investidor." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Resultados Consistentes",
    desc: "Nossa metodologia é orientada por dados e inteligência de mercado, buscando performance sustentável no longo prazo." },
  { icon: <Users className="w-5 h-5" />, title: "Pessoas em Primeiro Lugar",
    desc: "Acreditamos que o sucesso financeiro dos nossos clientes é a verdadeira medida do nosso trabalho." },
];

const TIMELINE = [
  { year: "2014", text: "Fundação da Veritas com foco em mercados internacionais" },
  { year: "2016", text: "Expansão das operações para mercados norte-americanos" },
  { year: "2019", text: "Lançamento da plataforma proprietária de análise de ativos" },
  { year: "2021", text: "Superamos 3.000 investidores ativos em nosso ecossistema" },
  { year: "2023", text: "Integração de automação com IA nas estratégias operacionais" },
  { year: "2025", text: "Consolidação como referência em gestão internacional para brasileiros" },
];

export default function QuemSomos() {
  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><Building2 className="w-3 h-3" />A Veritas Global</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "22ch" }}>
            <ScrollRevealText>Conectando investidores brasileiros ao mercado global</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Somos uma gestora especializada em mercados financeiros internacionais, comprometida com a educação, transparência e o crescimento sustentável do patrimônio dos nossos clientes.
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-4">
          <div className="bento-card p-8 flex flex-col gap-4" style={{ background: "linear-gradient(135deg, rgba(25,172,254,0.07) 0%, var(--card) 70%)" }}>
            <IBox><Globe className="w-5 h-5" /></IBox>
            <div>
              <h2 className="card-title text-xl mb-3">Nossa Missão</h2>
              <p className="card-body">
                Democratizar o acesso aos mercados financeiros internacionais para o investidor brasileiro, oferecendo estratégias profissionais, tecnologia de ponta e acompanhamento próximo — independentemente do tamanho do capital inicial.
              </p>
            </div>
          </div>
          <div className="bento-card p-8 flex flex-col gap-4" style={{ background: "linear-gradient(135deg, rgba(0,232,122,0.05) 0%, var(--card) 60%)" }}>
            <IBox color="green"><ShieldCheck className="w-5 h-5" /></IBox>
            <div>
              <h2 className="card-title text-xl mb-3">Nossa Visão</h2>
              <p className="card-body">
                Ser a principal referência em gestão de investimentos internacionais para o público brasileiro, reconhecida pela integridade operacional, transparência e pela capacidade de gerar crescimento real e consistente para nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--muted)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Nossos Pilares" heading="Os princípios que guiam cada decisão" sub="E cada operação da Veritas Global." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((p) => (
              <div key={p.title} className="bento-card p-6 flex flex-col gap-4">
                <IBox>{p.icon}</IBox>
                <div>
                  <h3 className="card-title mb-2">{p.title}</h3>
                  <p className="card-body">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader center badge="Nossa Trajetória" heading="Uma década construindo expertise" sub="E resultados no mercado global." />
          <div className="relative pl-8">
            <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: BORDER }} />
            <div className="space-y-8">
              {TIMELINE.map((t) => (
                <div key={t.year} className="relative">
                  <span className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full" style={{ background: B, boxShadow: "0 0 0 4px var(--primary-dim)" }} />
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8125rem", fontWeight: 800, color: B, letterSpacing: "0.04em" }}>{t.year}</p>
                  <p className="mt-1" style={{ fontSize: "0.9375rem", fontWeight: 500, color: FG }}>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bento-card p-8 flex flex-wrap items-center justify-center gap-3" style={{ background: GD }}>
            <span className="px-3 py-1 rounded-full" style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.75rem", fontWeight: 700 }}>Presença Global</span>
            <span className="px-3 py-1 rounded-full" style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.75rem", fontWeight: 700 }}>Gestão Responsável</span>
            <span className="px-3 py-1 rounded-full" style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.75rem", fontWeight: 700 }}>Resultados Consistentes</span>
            <span className="px-3 py-1 rounded-full" style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.75rem", fontWeight: 700 }}>Pessoas em Primeiro Lugar</span>
          </div>
          <button onClick={() => navigate("/nossa-equipe")} className="block mx-auto mt-4" style={{ fontSize: "0.75rem", fontWeight: 500, color: MFG }}>
            Quer conhecer as pessoas por trás da Veritas Global? <span style={{ color: B, fontWeight: 700 }}>Veja nossa equipe →</span>
          </button>
        </div>
      </section>
    </>
  );
}
