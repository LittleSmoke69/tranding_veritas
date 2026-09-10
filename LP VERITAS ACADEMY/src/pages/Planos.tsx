import { useState } from "react";
import {
  Award, ShieldCheck, Check, Copy, Link2, Users2, Clock3, Zap, TrendingDown,
  AlertTriangle, PlayCircle, FileText, ChevronDown, BadgeCheck, ArrowRight,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { BrokersSection, PLATFORM_URL } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/Planos (raspado em 2026-09-10).
// Mesmo tema visual da Home nova (HomeOriginal.tsx): fundo quase preto, gradiente
// azul-índigo, cards com borda sutil sem fundo colorido. Tokens definidos localmente,
// sem usar os tokens de marca antiga (B/BD/BB/G/.../bento-card/var(--card)).

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
      <h2 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.1, maxWidth: "26ch" }}>
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
          style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Mais escolhido pelos investidores
        </span>
      )}
      <div
        className="relative flex flex-col p-6 h-full rounded-2xl border"
        style={{
          borderColor: plan.highlight ? BLUE_LIGHT : BORDER,
          background: "transparent",
          boxShadow: plan.highlight ? "0 0 40px rgba(94,144,255,0.15), 0 20px 50px rgba(0,0,0,0.5)" : undefined,
          transform: plan.highlight ? "scale(1.02)" : undefined,
        }}
      >
        <p className="mt-2" style={{ color: WHITE, fontSize: "1.125rem", fontWeight: 700 }}>Plano {plan.name}</p>
        <p className="mt-2" style={{ fontSize: "2rem", fontWeight: 800, color: WHITE }}>{plan.price}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg border" style={{ borderColor: BORDER }}>
            <p className="mb-1" style={{ color: MUTED, fontSize: "0.5625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Margem operacional</p>
            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#22c55e" }}>{plan.marginUsd} na corretora</p>
          </div>
          <div className="p-2.5 rounded-lg border" style={{ borderColor: BORDER }}>
            <p className="mb-1" style={{ color: MUTED, fontSize: "0.5625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Acompanhamento</p>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: WHITE, lineHeight: 1.2 }}>{plan.cadence}</p>
          </div>
        </div>

        <p className="mt-4" style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{plan.desc}</p>

        <ul className="mt-4 space-y-2.5 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2" style={{ fontSize: "0.8125rem", color: MUTED }}>
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <a href={PLATFORM_URL}
          className="mt-6 block text-center py-3 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02]"
          style={{
            backgroundImage: plan.highlight ? BTN_GRADIENT : undefined,
            background: plan.highlight ? undefined : "transparent",
            color: WHITE,
            border: plan.highlight ? "none" : `1px solid ${BORDER}`,
            fontSize: "0.8125rem", fontWeight: 700,
            boxShadow: plan.highlight ? "0 0 24px rgba(94,144,255,0.35)" : undefined,
          }}>
          Iniciar minha conta internacional
        </a>
        <p className="text-center mt-2" style={{ fontSize: "0.6875rem", color: MUTED }}>Ativação imediata após confirmação</p>
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
    <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: WHITE }}>Valor inicial</label>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: BLUE_LIGHT }}>R$ {inicial.toLocaleString("pt-BR")}</span>
          </div>
          <input type="range" min={500} max={50000} step={500} value={inicial} onChange={(e) => setInicial(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: WHITE }}>Período (meses)</label>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: BLUE_LIGHT }}>{meses} meses</span>
          </div>
          <input type="range" min={1} max={36} step={1} value={meses} onChange={(e) => setMeses(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div className="p-4 rounded-xl border" style={{ borderColor: BORDER }}>
          <p className="mb-1" style={{ color: MUTED, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Capital final projetado</p>
          <p style={{ fontSize: "1.375rem", fontWeight: 800, color: BLUE_LIGHT }}>R$ {brl(final)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border" style={{ borderColor: BORDER }}>
            <p className="mb-1" style={{ color: MUTED, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Lucro estimado</p>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "#22c55e" }}>+R$ {brl(lucro)}</p>
          </div>
          <div className="p-4 rounded-xl border" style={{ borderColor: BORDER }}>
            <p className="mb-1" style={{ color: MUTED, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Rentabilidade</p>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: BLUE_LIGHT }}>+{roi.toFixed(1)}%</p>
          </div>
        </div>
        <p className="flex items-start gap-1.5 mt-1" style={{ fontSize: "0.6875rem", color: MUTED }}>
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          <span><strong style={{ color: WHITE }}>Importante:</strong> Simulação baseada em retornos hipotéticos de 5% ao mês. Resultados reais podem variar e não há garantia de lucros.</span>
        </p>
      </div>
    </Card>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((f, i) => (
        <Card key={i} style={{ borderColor: open === i ? BLUE_LIGHT : BORDER }}>
          <button className="w-full flex items-center justify-between p-6 text-left gap-4" onClick={() => setOpen(open === i ? null : i)}>
            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: WHITE }}>{f.q}</span>
            <ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ color: BLUE_LIGHT, transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
          {open === i && <div className="px-6 pb-6"><p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.7 }}>{f.a}</p></div>}
        </Card>
      ))}
    </div>
  );
}

export default function Planos() {
  return (
    <>
      <section className="relative py-24 overflow-hidden" style={{ background: BG }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(94,144,255,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
            <Award className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
            <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Planos de Inclusão</span>
          </div>
          <h1 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.05, maxWidth: "20ch" }}>
            <ScrollRevealText>Escolha seu plano de inclusão internacional</ScrollRevealText>
          </h1>
          <p className="mx-auto mt-5" style={{ color: MUTED, fontSize: "1.125rem", maxWidth: "56ch" }}>
            Acesso ao mercado internacional com formação completa, atendimento VIP e acompanhamento profissional por 6 meses.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { title: "Formação Premium", sub: "Curso completo incluído" },
              { title: "Atendimento VIP", sub: "2x por semana" },
            ].map((c) => (
              <div key={c.title} className="px-4 py-2.5 rounded-xl border text-left" style={{ borderColor: BORDER }}>
                <p style={{ color: WHITE, fontSize: "0.8125rem", fontWeight: 700 }}>{c.title}</p>
                <p style={{ color: MUTED, fontSize: "0.75rem" }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t" style={{ borderColor: BORDER, background: BG }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="mx-auto mb-4" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2rem)", lineHeight: 1.2, maxWidth: "26ch" }}>
            Programas de{" "}
            <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Desenvolvimento Estratégico</span>
          </h2>
          <p className="mx-auto mb-3" style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.7, maxWidth: "60ch" }}>
            Os programas da Veritas Global foram estruturados para oferecer diferentes níveis de aprofundamento no desenvolvimento estratégico do investidor.
          </p>
          <p className="mx-auto mb-6" style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.7, maxWidth: "60ch" }}>
            Cada plano amplia o acesso a conteúdos, estrutura de acompanhamento e integração com plataformas internacionais.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Conhecimento estratégico estruturado", "Acompanhamento profissional contínuo", "Integração com mercados globais"].map((t) => (
              <span key={t} className="flex items-center gap-2" style={{ fontSize: "0.8125rem", fontWeight: 600, color: MUTED }}>
                <Check className="w-4 h-4" style={{ color: "#22c55e" }} />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="py-16" style={{ background: BG }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead eyebrow="Planos de Investimento" title="Planos com" gradientPart="margem operacional + acompanhamento"
            sub="Escolha o plano ideal e comece a operar com capital real na corretora internacional." />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 pt-4">
            {PLANS.map((p) => <PlanCard key={p.name} plan={p} />)}
          </div>
          <p className="flex items-start gap-2 mt-10 rounded-2xl border px-4 py-3 text-xs max-w-4xl mx-auto"
            style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>⚠️ Aviso Legal:</strong> as cotas representam o valor de inclusão no programa de 6 meses com formação, acompanhamento profissional e acesso aos mercados internacionais. Não há garantia de lucros. Todo investimento em mercados financeiros envolve riscos de perda de capital. Recomenda-se operar apenas com capital que você pode dedicar ao mercado e após compreender plenamente os riscos envolvidos em operações financeiras internacionais.
            </span>
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER, background: BG }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead eyebrow="Tecnologia Exclusiva" title="O que é" gradientPart="CopyTrade?"
            sub="CopyTrade é uma tecnologia que permite replicar automaticamente operações de traders profissionais em tempo real — sem precisar tomar decisões sozinho." />

          <h3 className="text-center mb-6" style={{ color: WHITE, fontSize: "1.125rem", fontWeight: 700 }}>Como funciona</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-14">
            {[
              { n: 1, icon: <Link2 className="w-5 h-5" />, title: "Conexão com corretora", desc: "Vincule sua conta em uma das corretoras parceiras da Veritas." },
              { n: 2, icon: <Copy className="w-5 h-5" />, title: "Escolha de estratégia", desc: "Selecione traders experientes com histórico comprovado de performance." },
              { n: 3, icon: <Zap className="w-5 h-5" />, title: "Execução automática", desc: "Suas operações são replicadas automaticamente em tempo real." },
            ].map((s) => (
              <Card key={s.n} className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT, fontSize: "0.875rem" }}>{s.n}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{s.icon}</div>
                </div>
                <div>
                  <h4 className="mb-1" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{s.title}</h4>
                  <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <h3 className="text-center mb-6" style={{ color: WHITE, fontSize: "1.125rem", fontWeight: 700 }}>Benefícios</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Users2 className="w-5 h-5" />, title: "Acesso a especialistas", desc: "Opere junto com traders profissionais" },
              { icon: <Clock3 className="w-5 h-5" />, title: "Economia de tempo", desc: "Sem necessidade de monitorar o mercado 24h" },
              { icon: <TrendingDown className="w-5 h-5" />, title: "Redução emocional", desc: "Decisões baseadas em estratégia, não emoção" },
              { icon: <BadgeCheck className="w-5 h-5" />, title: "Diversificação", desc: "Copie múltiplas estratégias simultâneas" },
            ].map((b) => (
              <Card key={b.title} className="p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>{b.icon}</div>
                <div>
                  <p className="mb-1" style={{ color: WHITE, fontSize: "0.9375rem", fontWeight: 700 }}>{b.title}</p>
                  <p style={{ color: MUTED, fontSize: "0.8125rem", lineHeight: 1.5 }}>{b.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <p className="flex items-center gap-2 mb-2" style={{ color: WHITE, fontSize: "0.9375rem", fontWeight: 700 }}>
                <AlertTriangle className="w-4 h-4" style={{ color: "#f87171" }} /> Aviso Importante
              </p>
              <p style={{ color: MUTED, fontSize: "0.8125rem", lineHeight: 1.6 }}>
                CopyTrade <strong style={{ color: WHITE }}>não garante lucros</strong>. O investidor continua exposto ao mercado e deve seguir uma gestão de risco adequada. Resultados passados não garantem resultados futuros. Disponível a partir do Plano Estratégico.
              </p>
            </Card>
            <Card className="p-6" style={{ borderColor: BLUE_LIGHT }}>
              <p className="mb-2" style={{ color: WHITE, fontSize: "0.9375rem", fontWeight: 700 }}>Comece agora</p>
              <p className="mb-1" style={{ color: MUTED, fontSize: "0.8125rem", lineHeight: 1.6 }}>Acesso ao CopyTrade com acompanhamento estratégico.</p>
              <p className="mb-4" style={{ color: MUTED, fontSize: "0.8125rem", lineHeight: 1.6 }}>Disponível a partir do Plano Estratégico. Você não opera sozinho.</p>
              <a href="#planos" className="inline-flex items-center gap-2 rounded-full hover:opacity-90 transition-opacity"
                style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.8125rem", fontWeight: 700, padding: "0.75rem 1.5rem" }}>
                Ver planos disponíveis <ArrowRight className="w-4 h-4" />
              </a>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <Card className="p-8 md:p-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <h2 className="mb-4" style={{ color: WHITE, fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 700 }}>Garantia de 7 Dias</h2>
            <p className="mx-auto mb-4" style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.7, maxWidth: "56ch" }}>
              Ao iniciar com <strong style={{ color: WHITE }}>Veritas Global</strong>, você conta com uma garantia de satisfação de <strong style={{ color: WHITE }}>7 dias</strong>. Após a ativação do plano, você terá o primeiro contato com um de nossos especialistas, que apresentará toda a estrutura da plataforma, o funcionamento do sistema e o acompanhamento inicial. Caso dentro desse período você entenda que o serviço não atende às suas expectativas, poderá solicitar o <span style={{ color: BLUE_LIGHT, fontWeight: 700 }}>estorno integral do valor pago</span>.
            </p>
            <p className="mx-auto mb-6" style={{ color: MUTED, fontSize: "0.9375rem", fontStyle: "italic", maxWidth: "50ch" }}>
              "Seu início no mercado internacional acontece com segurança, transparência e suporte profissional."
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Estorno integral", "Sem burocracia", "Suporte dedicado"].map((t) => (
                <span key={t} className="flex items-center gap-2" style={{ fontSize: "0.8125rem", fontWeight: 600, color: MUTED }}>
                  <Check className="w-4 h-4" style={{ color: "#22c55e" }} />{t}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER, background: BG }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead eyebrow="Educação Inclusa" title="Curso de Introdução ao" gradientPart="Mercado Financeiro"
            sub="Após a ativação do plano, o cliente recebe acesso a um curso estruturado com 7 módulos educacionais, desenvolvido para apresentar os principais fundamentos do mercado financeiro internacional." />
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <Card className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}><PlayCircle className="w-5 h-5" /></div>
              <div>
                <h3 className="mb-1" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>Conteúdo em Vídeo</h3>
                <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>Aulas práticas e objetivas com exemplos reais do mercado.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}><FileText className="w-5 h-5" /></div>
              <div>
                <h3 className="mb-1" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>Material de Apoio</h3>
                <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>PDFs, planilhas e recursos para aplicação prática.</p>
              </div>
            </Card>
          </div>
          <Card className="p-6 md:p-8">
            <p className="mb-4" style={{ color: MUTED, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>7 Módulos Educacionais</p>
            <ol className="grid sm:grid-cols-2 gap-3">
              {CURRICULUM.map((c, i) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT, fontSize: "0.75rem" }}>{i + 1}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: WHITE }}>{c}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6" style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.7 }}>
              O conteúdo tem como objetivo preparar o investidor para compreender melhor os movimentos de mercado e aproveitar de forma estratégica o acompanhamento oferecido pela Veritas Global.
            </p>
          </Card>
        </div>
      </section>

      <BrokersSection />

      <section className="py-24 border-t" style={{ borderColor: BORDER, background: BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionHead eyebrow="Simulador" title="Projeção de" gradientPart="Crescimento de Capital"
            sub="Visualize o potencial de crescimento no mercado internacional." />
          <GrowthSimulator />
        </div>
      </section>

      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionHead eyebrow="Dúvidas Frequentes" title="Perguntas" gradientPart="Frequentes"
            sub="Tire suas dúvidas sobre os planos e serviços." />
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
