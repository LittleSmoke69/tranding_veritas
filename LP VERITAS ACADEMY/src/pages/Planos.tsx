import { useState } from "react";
import {
  Award, ShieldCheck, Check, Copy, Link2, Users2, Clock3, Zap, TrendingDown,
  AlertTriangle, PlayCircle, FileText, ChevronDown, BadgeCheck,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import {
  B, BD, BB, G, MFG, FG, BORDER, CARD,
  Badge, IBox, SectionHeader, BrokersSection, PLATFORM_URL,
} from "../shared";

type Plan = {
  name: string;
  price: string;
  marginUsd: string;
  cadence: string;
  desc: string;
  features: string[];
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Essencial", price: "R$ 250", marginUsd: "USD 100", cadence: "3 encontros mensais",
    desc: "Ideal para quem está dando os primeiros passos no mercado internacional com suporte estratégico.",
    features: [
      "3 encontros estratégicos por mês",
      "Direcionamento para corretoras parceiras",
      "Acompanhamento estratégico inicial",
      "Curso de introdução ao mercado financeiro",
      "Acesso à estrutura internacional",
    ],
  },
  {
    name: "Estratégico", price: "R$ 500", marginUsd: "USD 200", cadence: "2 encontros semanais",
    desc: "Para quem quer evoluir com estratégias práticas e acompanhamento próximo e consistente.",
    features: [
      "2 encontros estratégicos por semana",
      "Estratégias práticas de operação",
      "Acompanhamento contínuo personalizado",
      "Acesso ao CopyTrade com suporte",
      "Curso completo de mercado financeiro",
    ],
  },
  {
    name: "Performance", price: "R$ 1.000", marginUsd: "USD 400", cadence: "3–4 encontros semanais",
    desc: "Evolução acelerada com gestão estratégica ativa para quem quer resultados consistentes.",
    features: [
      "3 a 4 encontros estratégicos por semana",
      "Gestão estratégica ativa e personalizada",
      "Evolução acelerada de conhecimento",
      "CopyTrade com acompanhamento especializado",
      "Análises e relatórios periódicos",
      "Suporte prioritário",
    ],
    highlight: true,
  },
  {
    name: "Elite", price: "R$ 2.200", marginUsd: "USD 600", cadence: "4 a 5 encontros semanais",
    desc: "Para investidores em transição entre performance e gestão patrimonial, com acompanhamento próximo e dedicado.",
    features: [
      "4 a 5 encontros estratégicos por semana",
      "Acompanhamento próximo e dedicado",
      "Gestão estratégica avançada",
      "CopyTrade com supervisão especializada",
      "Análises e relatórios periódicos",
      "Suporte prioritário",
    ],
  },
  {
    name: "Expansão", price: "R$ 4.000", marginUsd: "USD 1.000", cadence: "Encontros diários",
    desc: "Acompanhamento intensivo para investidores que buscam gestão patrimonial e visão de longo prazo.",
    features: [
      "Encontros diários com especialistas",
      "Acompanhamento intensivo e dedicado",
      "Gestão ativa de portfólio",
      "Visão patrimonial de longo prazo",
      "CopyTrade com gestão completa",
      "Relatórios detalhados e estratégias exclusivas",
      "Atendimento VIP prioritário",
    ],
  },
];

const CURRICULUM = [
  "Fundamentos do Mercado Financeiro",
  "Análise Técnica e Fundamentalista",
  "Gestão de Risco e Capital",
  "Psicologia do Investidor",
  "Estratégias de Operação",
  "Mercados Internacionais",
  "Plataformas e Ferramentas",
];

const FAQS = [
  { q: "O valor fica na corretora?",
    a: "Sim. A margem operacional referente ao seu plano é aplicada diretamente na corretora internacional parceira escolhida — o dinheiro não fica retido com a Veritas Global." },
  { q: "Como funciona o acompanhamento estratégico?",
    a: "Você tem encontros periódicos com especialistas (a frequência varia por plano) para alinhar estratégia, revisar performance e ajustar sua alocação conforme o mercado." },
  { q: "Como funciona a garantia de 7 dias?",
    a: "Após a ativação, você tem 7 dias para conhecer toda a estrutura da plataforma. Se entender que o serviço não atende às suas expectativas nesse período, pode solicitar o estorno integral do valor pago." },
  { q: "Quando recebo acesso ao curso educacional?",
    a: "O acesso ao curso estruturado de 7 módulos é liberado imediatamente após a ativação do seu plano, junto com o primeiro contato com um especialista." },
  { q: "Como funciona a ativação da conta?",
    a: "Após a confirmação do pagamento, a ativação é imediata: você recebe o direcionamento para a corretora parceira e o agendamento do primeiro encontro estratégico." },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className={`relative h-full${plan.highlight ? " mt-5 sm:mt-0" : ""}`}>
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full whitespace-nowrap"
          style={{ background: B, color: "#fff", fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Mais escolhido pelos investidores
        </span>
      )}
      <div
        className="bento-card relative flex flex-col p-6 h-full"
        style={{
          borderColor: plan.highlight ? BB : BORDER,
          boxShadow: plan.highlight ? "0 0 40px var(--primary-glow), 0 20px 50px rgba(0,0,0,0.5)" : undefined,
          transform: plan.highlight ? "scale(1.02)" : undefined,
        }}
      >
      <p className="card-title text-lg mt-2">{plan.name}</p>
      <p className="mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 800, color: FG }}>{plan.price}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
          <p className="card-label mb-1" style={{ fontSize: "0.5625rem" }}>Margem operacional</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8125rem", fontWeight: 700, color: G }}>{plan.marginUsd}</p>
        </div>
        <div className="p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
          <p className="card-label mb-1" style={{ fontSize: "0.5625rem" }}>Acompanhamento</p>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: FG, lineHeight: 1.2 }}>{plan.cadence}</p>
        </div>
      </div>

      <p className="card-body mt-4">{plan.desc}</p>

      <ul className="mt-4 space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2" style={{ fontSize: "0.8125rem", color: MFG }}>
            <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: G }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a href={PLATFORM_URL}
        className="mt-6 block text-center py-3 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02]"
        style={{
          background: plan.highlight ? B : "rgba(255,255,255,0.05)",
          color: plan.highlight ? "#fff" : FG,
          border: plan.highlight ? "none" : `1px solid ${BORDER}`,
          fontSize: "0.8125rem", fontWeight: 700,
          boxShadow: plan.highlight ? "0 0 24px var(--primary-glow)" : undefined,
        }}>
        Iniciar minha conta internacional
      </a>
      <p className="text-center mt-2" style={{ fontSize: "0.6875rem", color: MFG }}>Ativação imediata após confirmação</p>
      </div>
    </div>
  );
}

function GrowthSimulator() {
  const [inicial, setInicial] = useState(1000);
  const [meses, setMeses] = useState(12);
  const taxaMensal = 0.05;
  const final = inicial * Math.pow(1 + taxaMensal, meses);
  const lucro = final - inicial;
  const roi = (lucro / inicial) * 100;
  const brl = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bento-card p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: FG }}>Valor inicial</label>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 700, color: B }}>R$ {inicial.toLocaleString("pt-BR")}</span>
          </div>
          <input type="range" min={500} max={50000} step={500} value={inicial} onChange={(e) => setInicial(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: FG }}>Período</label>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 700, color: B }}>{meses} meses</span>
          </div>
          <input type="range" min={1} max={36} step={1} value={meses} onChange={(e) => setMeses(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
          <p className="card-label mb-1">Capital final projetado</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.375rem", fontWeight: 800, color: B }}>R$ {brl(final)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
            <p className="card-label mb-1">Lucro estimado</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: G }}>+R$ {brl(lucro)}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
            <p className="card-label mb-1">Rentabilidade</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: B }}>+{roi.toFixed(1)}%</p>
          </div>
        </div>
        <p className="flex items-start gap-1.5 mt-1" style={{ fontSize: "0.6875rem", color: MFG }}>
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          Simulação baseada em retornos hipotéticos de 5% ao mês. Resultados reais podem variar e não há garantia de lucros.
        </p>
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((f, i) => (
        <div key={i} className="bento-card" style={{ borderColor: open === i ? BB : BORDER }}>
          <button className="w-full flex items-center justify-between p-6 text-left gap-4" onClick={() => setOpen(open === i ? null : i)}>
            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: FG }}>{f.q}</span>
            <ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ color: B, transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
          {open === i && <div className="px-6 pb-6"><p className="card-body">{f.a}</p></div>}
        </div>
      ))}
    </div>
  );
}

export default function Planos() {
  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="gold"><Award className="w-3 h-3" />Planos de Inclusão</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "20ch" }}>
            <ScrollRevealText>Escolha seu plano de inclusão internacional</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Acesso ao mercado internacional com formação completa, atendimento VIP e acompanhamento profissional por 6 meses.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge color="blue">Formação Premium — Curso completo incluído</Badge>
            <Badge color="gold">Atendimento VIP — 2x por semana</Badge>
          </div>
        </div>
      </section>

      <section className="py-16 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="card-title text-xl mb-3">Programas de Desenvolvimento Estratégico</h2>
          <p className="card-body mx-auto mb-6" style={{ maxWidth: "60ch" }}>
            Os programas da Veritas Global foram estruturados para oferecer diferentes níveis de aprofundamento no desenvolvimento estratégico do investidor. Cada plano amplia o acesso a conteúdos, estrutura de acompanhamento e integração com plataformas internacionais.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Conhecimento estratégico estruturado", "Acompanhamento profissional contínuo", "Integração com mercados globais"].map((t) => (
              <span key={t} className="flex items-center gap-2" style={{ fontSize: "0.8125rem", fontWeight: 600, color: MFG }}>
                <Check className="w-4 h-4" style={{ color: G }} />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            center
            badge="Planos de Investimento"
            heading="Planos com margem operacional + acompanhamento"
            sub="Escolha o plano ideal e comece a operar com capital real na corretora internacional."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 pt-4">
            {PLANS.map((p) => <PlanCard key={p.name} plan={p} />)}
          </div>
          <p className="flex items-start gap-2 mt-10 rounded-ctl border px-4 py-3 text-xs max-w-4xl mx-auto"
            style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "var(--red)" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Aviso legal:</strong> as cotas representam o valor de inclusão no programa de 6 meses com formação, acompanhamento profissional e acesso aos mercados internacionais. Não há garantia de lucros. Todo investimento em mercados financeiros envolve riscos de perda de capital. Recomenda-se operar apenas com capital que você pode dedicar ao mercado e após compreender plenamente os riscos envolvidos.
            </span>
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Tecnologia Exclusiva" heading="O que é CopyTrade?"
            sub="CopyTrade é uma tecnologia que permite replicar automaticamente operações de traders profissionais em tempo real — sem precisar tomar decisões sozinho." />
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { n: 1, icon: <Link2 className="w-5 h-5" />, title: "Conexão com corretora", desc: "Vincule sua conta em uma das corretoras parceiras da Veritas." },
              { n: 2, icon: <Copy className="w-5 h-5" />, title: "Escolha de estratégia", desc: "Selecione traders experientes com histórico comprovado de performance." },
              { n: 3, icon: <Zap className="w-5 h-5" />, title: "Execução automática", desc: "Suas operações são replicadas automaticamente em tempo real." },
            ].map((s) => (
              <div key={s.n} className="bento-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: BD, color: B, fontSize: "0.875rem" }}>{s.n}</span>
                  <IBox>{s.icon}</IBox>
                </div>
                <div><h3 className="card-title mb-1">{s.title}</h3><p className="card-body">{s.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <Users2 className="w-5 h-5" />, title: "Acesso a especialistas", desc: "Opere junto com traders profissionais" },
              { icon: <Clock3 className="w-5 h-5" />, title: "Economia de tempo", desc: "Sem necessidade de monitorar o mercado 24h" },
              { icon: <TrendingDown className="w-5 h-5" />, title: "Redução emocional", desc: "Decisões baseadas em estratégia, não emoção" },
              { icon: <BadgeCheck className="w-5 h-5" />, title: "Diversificação", desc: "Copie múltiplas estratégias simultâneas" },
            ].map((b) => (
              <div key={b.title} className="bento-card p-5 flex flex-col gap-3">
                <IBox color="green">{b.icon}</IBox>
                <div><p className="card-title mb-1" style={{ fontSize: "0.9375rem" }}>{b.title}</p><p className="card-body">{b.desc}</p></div>
              </div>
            ))}
          </div>
          <p className="flex items-start gap-2 rounded-ctl border px-4 py-3 text-xs"
            style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "var(--red)" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>CopyTrade não garante lucros. O investidor continua exposto ao mercado e deve seguir uma gestão de risco adequada. Resultados passados não garantem resultados futuros. Disponível a partir do Plano Estratégico.</span>
          </p>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--muted)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="bento-card p-8 md:p-10 text-center">
            <div className="mb-4 flex justify-center"><IBox color="gold"><ShieldCheck className="w-5 h-5" /></IBox></div>
            <h2 className="card-title text-xl mb-3">Garantia de 7 Dias</h2>
            <p className="card-body mx-auto mb-6" style={{ maxWidth: "56ch" }}>
              Ao iniciar com Veritas Global, você conta com uma garantia de satisfação de 7 dias. Após a ativação do plano, você terá o primeiro contato com um de nossos especialistas, que apresentará toda a estrutura da plataforma, o funcionamento do sistema e o acompanhamento inicial. Caso dentro desse período você entenda que o serviço não atende às suas expectativas, poderá solicitar o estorno integral do valor pago.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Estorno integral", "Sem burocracia", "Suporte dedicado"].map((t) => (
                <span key={t} className="flex items-center gap-2" style={{ fontSize: "0.8125rem", fontWeight: 600, color: MFG }}>
                  <Check className="w-4 h-4" style={{ color: G }} />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Educação Inclusa" heading="Curso de Introdução ao Mercado Financeiro"
            sub="Após a ativação do plano, o cliente recebe acesso a um curso estruturado com 7 módulos educacionais, desenvolvido para apresentar os principais fundamentos do mercado financeiro internacional." />
          <div className="grid lg:grid-cols-[1fr_1fr] gap-4 mb-4">
            <div className="bento-card p-6 flex items-start gap-4">
              <IBox><PlayCircle className="w-5 h-5" /></IBox>
              <div><h3 className="card-title mb-1">Conteúdo em Vídeo</h3><p className="card-body">Aulas práticas e objetivas com exemplos reais do mercado.</p></div>
            </div>
            <div className="bento-card p-6 flex items-start gap-4">
              <IBox color="gold"><FileText className="w-5 h-5" /></IBox>
              <div><h3 className="card-title mb-1">Material de Apoio</h3><p className="card-body">PDFs, planilhas e recursos para aplicação prática.</p></div>
            </div>
          </div>
          <div className="bento-card p-6 md:p-8">
            <p className="card-label mb-4">7 Módulos Educacionais</p>
            <ol className="grid sm:grid-cols-2 gap-3">
              {CURRICULUM.map((c, i) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold" style={{ background: BD, color: B, fontSize: "0.75rem" }}>{i + 1}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: FG }}>{c}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <BrokersSection />

      <section className="py-24 border-t" style={{ borderColor: BORDER, background: CARD }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader center badge="Simulador" heading="Projeção de Crescimento de Capital" sub="Visualize o potencial de crescimento no mercado internacional." />
          <GrowthSimulator />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader center badge="Dúvidas Frequentes" heading="Perguntas Frequentes" sub="Tire suas dúvidas sobre os planos e serviços." />
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
