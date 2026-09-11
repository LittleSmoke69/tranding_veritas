import { useEffect, useState } from "react";
import {
  Globe, ShieldCheck, Zap, TrendingUp, BarChart3, Users, Rocket, Eye,
  BookOpen, Target, Award, Clock, Building2, Handshake, Scale, Lightbulb,
  GraduationCap, UserPlus, CreditCard, Settings, ArrowRight, Check, Star,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useCountUp, BrokersSection, type LandingView } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/ (raspado em 2026-09-10).
// Estilo próprio (não usa os tokens de marca do resto do site) para reproduzir
// exatamente as cores, tipografia e espaçamentos do site original.
// A Home antiga (App.tsx `Home()`) segue intocada no código.

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

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2.5 rounded-full border transition-colors hover:border-white/30"
      style={{ borderColor: BORDER, color: WHITE, background: "transparent", fontSize: "0.875rem", fontWeight: 600, padding: "1rem 2rem" }}>
      {children}
    </button>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    icon: <Globe className="w-10 h-10" />,
    heading: "Desenvolvimento estratégico para o ",
    gradient: "mercado financeiro global",
    sub: "A Veritas Global foi estruturada com o propósito de desenvolver investidores que desejam compreender os mercados financeiros internacionais com uma visão mais estratégica e disciplinada.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    heading: "Conhecimento e estrutura para ",
    gradient: "mercados globais",
    sub: "Nosso trabalho está focado na construção de conhecimento, estrutura de acompanhamento e integração com plataformas internacionais utilizadas por investidores ao redor do mundo.",
  },
  {
    icon: <Zap className="w-10 h-10" />,
    heading: "Mais de 10 anos no ",
    gradient: "mercado financeiro",
    sub: "Experiência consolidada no desenvolvimento de investidores e integração com infraestrutura global de mercados financeiros.",
  },
];

function HeroOriginal({ onAccessPlatform }: { onAccessPlatform: () => void }) {
  const [slide, setSlide] = useState(0);
  const s = HERO_SLIDES[slide];

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((v) => (v + 1) % HERO_SLIDES.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: BG }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
              <Globe className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
              <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Investimentos Globais</span>
            </div>

            <h1 className="mb-7" key={slide}
              style={{ fontWeight: 700, fontSize: "clamp(2rem, 6.5vw, 3.75rem)", lineHeight: 1, color: WHITE, overflowWrap: "break-word" }}>
              {s.heading}
              <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{s.gradient}</span>
            </h1>

            <p className="mb-10" key={`sub-${slide}`} style={{ fontSize: "1.25rem", lineHeight: 1.6, color: MUTED, maxWidth: "46ch", minHeight: "3.2em" }}>
              {s.sub}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <PrimaryButton onClick={onAccessPlatform}>Abrir Conta <ArrowRight className="w-4 h-4" /></PrimaryButton>
              <SecondaryButton>Saiba Mais</SecondaryButton>
            </div>

            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ width: i === slide ? 32 : 16, background: i === slide ? BLUE_LIGHT : "#27272a" }} />
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center relative" style={{ height: 420 }}>
            <div className="absolute rounded-full" style={{ inset: 0, border: "1px solid rgba(94,144,255,0.15)" }} />
            <div className="absolute rounded-full" style={{ inset: 55, border: "1px solid rgba(94,144,255,0.25)" }} />
            <div className="absolute rounded-full" style={{ inset: 110, border: "1px solid rgba(94,144,255,0.35)" }} />
            <div key={slide} className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: "rgba(94,144,255,0.1)", border: "1px solid rgba(94,144,255,0.3)", color: BLUE_LIGHT }}>
              {s.icon}
            </div>
            {[{ t: 10, l: 20 }, { t: 65, l: 85 }, { t: 85, l: 15 }].map((p, i) => (
              <span key={i} className="absolute w-2 h-2 rounded-full" style={{ top: `${p.t}%`, left: `${p.l}%`, background: BLUE_LIGHT, opacity: 0.5 }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Nossas Soluções ───────────────────────────────────────────────────────────
const SOLUCOES = [
  { icon: <TrendingUp className="w-6 h-6" />, gradient: "linear-gradient(to right bottom, #3b82f6, #06b6d4)", title: "Mercado Financeiro", desc: "Soluções inteligentes conectando empresas e investidores com agilidade e segurança." },
  { icon: <BarChart3 className="w-6 h-6" />, gradient: "linear-gradient(to right bottom, #a855f7, #ec4899)", title: "Performance", desc: "Tecnologia, experiência e estratégia. Conheça nossos números e o diferencial." },
  { icon: <Users className="w-6 h-6" />, gradient: "linear-gradient(to right bottom, #2e64ff, #f97316)", title: "Consultoria", desc: "Transforme decisões financeiras em estratégias vencedoras com segurança." },
  { icon: <ShieldCheck className="w-6 h-6" />, gradient: "linear-gradient(to right bottom, #22c55e, #10b981)", title: "Segurança", desc: "A proteção de seus dados e investimentos é a base de tudo que fazemos." },
  { icon: <Zap className="w-6 h-6" />, gradient: "linear-gradient(to right bottom, #ef4444, #f43f5e)", title: "Robô", desc: "Robôs configurados para operar com precisão e agilidade no mercado." },
  { icon: <GraduationCap className="w-6 h-6" />, gradient: "linear-gradient(to right bottom, #6366f1, #3b82f6)", title: "Cursos e Material", desc: "Cursos e materiais complementares para você aprender de forma prática e eficiente." },
];

function NossasSolucoes() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Nossas Soluções" title="Soluções para você investir" gradientPart="com inteligência"
          sub="Educação, análise e tecnologia de ponta para sua operação no mercado financeiro global." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLUCOES.map((s) => (
            <Card key={s.title} className="p-10 flex flex-col gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundImage: s.gradient }}>
                {s.icon}
              </div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.25rem", fontWeight: 700 }}>{s.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
              <button className="mt-auto flex items-center gap-1.5 self-start" style={{ fontSize: "0.875rem", fontWeight: 700, color: BLUE_LIGHT }}>
                Mais detalhes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Nossa Atuação em números ──────────────────────────────────────────────────
function StatItem({ icon, target, suffix, label }: { icon: React.ReactNode; target: number; suffix: string; label: string }) {
  const { value, ref } = useCountUp(target);
  return (
    <Card className="p-7 text-center flex flex-col items-center gap-3">
      <div ref={ref} className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{icon}</div>
      <p style={{ fontSize: "2rem", fontWeight: 900, color: WHITE }}>{value}{suffix}</p>
      <p style={{ color: MUTED, fontSize: "0.875rem" }}>{label}</p>
    </Card>
  );
}

function NossaAtuacao() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Nossa Atuação" title="Nossa atuação no mercado internacional" gradientPart="em números"
          sub="Indicadores que refletem a experiência e a estrutura da Veritas Global no acompanhamento estratégico de investidores no mercado financeiro internacional." />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatItem icon={<Users className="w-5 h-5" />} target={5000} suffix="+" label="Investidores atendidos" />
          <StatItem icon={<Award className="w-5 h-5" />} target={98} suffix="%" label="Satisfação dos clientes" />
          <StatItem icon={<Globe className="w-5 h-5" />} target={10} suffix="+" label="Anos de atuação no mercado financeiro" />
          <Card className="p-7 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}><Clock className="w-5 h-5" /></div>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: WHITE }}>24/7</p>
            <p style={{ color: MUTED, fontSize: "0.875rem" }}>Suporte estratégico dedicado</p>
          </Card>
          <StatItem icon={<Building2 className="w-5 h-5" />} target={10} suffix="+" label="Corretoras internacionais integradas" />
        </div>
      </div>
    </section>
  );
}

// ── Quem Somos (intro) ────────────────────────────────────────────────────────
function QuemSomosIntro({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-16 h-16 pointer-events-none hidden sm:block"
            style={{ borderTop: `2px solid ${BLUE_LIGHT}`, borderLeft: `2px solid ${BLUE_LIGHT}`, borderTopLeftRadius: "1.5rem" }} />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 pointer-events-none hidden sm:block"
            style={{ borderBottom: `2px solid ${BLUE_LIGHT}`, borderRight: `2px solid ${BLUE_LIGHT}`, borderBottomRightRadius: "1.5rem" }} />
          <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: BORDER }}>
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&h=700&fit=crop" alt="Equipe Veritas Global"
              className="w-full h-full object-cover" style={{ maxHeight: 460 }} />
            <div className="absolute left-4 right-4 bottom-4 rounded-xl px-4 py-3 flex items-center gap-3 backdrop-blur-md"
              style={{ background: "rgba(10,10,10,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: BLUE_LIGHT, color: "#fff" }}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: WHITE }}>Segurança Garantida</p>
                <p style={{ fontSize: "0.8125rem", color: MUTED }}>Proteção em todas as operações</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Eyebrow>Quem Somos</Eyebrow>
          <h2 className="mb-6" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.1 }}>
            Estrutura Global para{" "}
            <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Investidores Estratégicos</span>
          </h2>
          <p className="mb-4" style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.7 }}>
            A Veritas Global foi estruturada com o propósito de desenvolver investidores que desejam compreender
            os mercados financeiros internacionais com uma visão mais estratégica e disciplinada.
          </p>
          <p className="mb-8" style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.7 }}>
            Nosso trabalho está focado na construção de conhecimento, estrutura de acompanhamento e integração
            com plataformas internacionais utilizadas por investidores ao redor do mundo.
          </p>
          <div className="mb-8 pl-4 border-l-2 flex items-center gap-4" style={{ borderColor: BLUE_LIGHT }}>
            <p style={{ fontSize: "2.25rem", fontWeight: 800, color: BLUE_LIGHT, lineHeight: 1 }}>10+</p>
            <p style={{ color: WHITE, fontSize: "0.9375rem", fontWeight: 600, lineHeight: 1.4 }}>Anos de atuação no mercado financeiro internacional</p>
          </div>
          <ul className="space-y-3 mb-8">
            {["Conhecimento estratégico para mercados globais", "Disciplina operacional e acompanhamento profissional", "Integração com plataformas internacionais"].map((t) => (
              <li key={t} className="flex items-center gap-3" style={{ fontSize: "0.9375rem", color: WHITE }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: BLUE_LIGHT }}>
                  <Check className="w-3 h-3" style={{ color: "#fff" }} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate("planos")} className="px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            style={{ background: "#fff", color: "#0a0a0a", fontSize: "0.9375rem", fontWeight: 700 }}>
            Ver Planos
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Missão e Visão ────────────────────────────────────────────────────────────
function MissaoVisao() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-center mb-14" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.1 }}>
          Nossa Missão e{" "}
          <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Visão</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-9 flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}><Rocket className="w-6 h-6" /></div>
          <h3 style={{ color: WHITE, fontSize: "1.375rem", fontWeight: 700 }}>Missão</h3>
          <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>
            Desenvolver investidores estratégicos por meio de conhecimento estruturado, acompanhamento profissional
            e integração com mercados financeiros internacionais, promovendo uma atuação mais consciente e
            disciplinada no ambiente global.
          </p>
        </Card>
        <Card className="p-9 flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}><Eye className="w-6 h-6" /></div>
          <h3 style={{ color: WHITE, fontSize: "1.375rem", fontWeight: 700 }}>Visão</h3>
          <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>
            Ser reconhecida como referência no desenvolvimento estratégico de investidores, estabelecendo um
            padrão de excelência na formação, acompanhamento e integração com mercados financeiros globais.
          </p>
        </Card>
        </div>
      </div>
    </section>
  );
}

// ── Nossa Metodologia (4 pilares) ─────────────────────────────────────────────
const PILARES = [
  { icon: <BookOpen className="w-6 h-6" />, title: "Conhecimento Estratégico", desc: "Formação estruturada para compreensão profunda dos mercados financeiros globais." },
  { icon: <Target className="w-6 h-6" />, title: "Disciplina Operacional", desc: "Desenvolvimento de processos consistentes e metodologia de atuação no mercado." },
  { icon: <Users className="w-6 h-6" />, title: "Acompanhamento Profissional", desc: "Estrutura de suporte técnico e análise contínua para desenvolvimento do investidor." },
  { icon: <Globe className="w-6 h-6" />, title: "Integração Global", desc: "Acesso e conexão com plataformas internacionais de mercados financeiros." },
];

function NossaMetodologia() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Nossa Metodologia" title="Metodologia" gradientPart="Veritas"
          sub="Nossa estrutura de desenvolvimento é baseada em quatro pilares fundamentais que sustentam a formação de investidores estratégicos." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PILARES.map((p) => (
            <Card key={p.title} className="p-7 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{p.icon}</div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{p.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            </Card>
          ))}
        </div>
        <p className="mx-auto text-center" style={{ color: MUTED, fontSize: "1rem", maxWidth: "60ch" }}>
          Desenvolvimento estratégico para investidores que buscam uma atuação mais consciente no mercado
          financeiro global.
        </p>
      </div>
    </section>
  );
}

// ── Nossos Valores ────────────────────────────────────────────────────────────
const VALORES = [
  { icon: <Lightbulb className="w-6 h-6" />, title: "Inovação", desc: "Tecnologia de ponta e estratégias modernas no mercado financeiro global.", color: "#a855f7", bg: "rgba(168,85,247,0.2)" },
  { icon: <Eye className="w-6 h-6" />, title: "Transparência", desc: "Clareza total nas operações, relatórios e comunicação com clientes.", color: "#3b82f6", bg: "rgba(59,130,246,0.2)" },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Segurança", desc: "Protocolos robustos de proteção de capital e gestão de risco em cada operação.", color: "#22c55e", bg: "rgba(34,197,94,0.2)" },
  { icon: <Handshake className="w-6 h-6" />, title: "Comprometimento", desc: "Acompanhamento próximo e suporte estratégico personalizado em cada etapa.", color: "#2e64ff", bg: "rgba(46,100,255,0.2)" },
  { icon: <Scale className="w-6 h-6" />, title: "Ética", desc: "Conduta profissional irrepreensível e respeito ao investidor em cada decisão.", color: "#f43f5e", bg: "rgba(244,63,94,0.2)" },
];

function NossosValores() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Nossos Valores" title="O que nos" gradientPart="move"
          sub="Clique em cada valor para entender como ele se aplica na nossa operação diária." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALORES.map((v, i) => (
            <button key={v.title} onClick={() => setOpen(open === i ? null : i)} type="button" className="text-left">
              <Card className="p-7 flex flex-col gap-4 transition" style={{ borderColor: open === i ? v.color : BORDER }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: v.bg, color: v.color }}>
                  {v.icon}
                </div>
                <h3 style={{ color: WHITE, fontSize: "1.125rem", fontWeight: 700 }}>{v.title}</h3>
                {open === i && <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{v.desc}</p>}
                <span className="flex items-center gap-1.5" style={{ fontSize: "0.8125rem", fontWeight: 700, color: v.color }}>
                  {open === i ? "Ocultar" : "Saiba mais"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Educação Financeira (preview) ─────────────────────────────────────────────
const MODULOS_PREVIEW = [
  { title: "Mentalidade para Prosperar", desc: "Construa uma base sólida para seu sucesso financeiro.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop" },
  { title: "Introdução aos Investimentos", desc: "Aprenda os conceitos fundamentais do mercado.", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=450&fit=crop" },
  { title: "Renda Fixa", desc: "Segurança e previsibilidade para sua carteira.", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=450&fit=crop" },
  { title: "Renda Variável", desc: "Potencial de crescimento com gestão de risco.", img: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=450&fit=crop" },
  { title: "Investimento no Exterior", desc: "Dolarize seu patrimônio e diversifique globalmente.", img: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&h=450&fit=crop" },
  { title: "O Novo Dinheiro", desc: "Novas fontes de renda através de ativos digitais.", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=450&fit=crop" },
];

function EducacaoPreview({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Educação Financeira" title="Conheça nossos" gradientPart="módulos"
          sub="Clique em qualquer módulo para ver o conteúdo completo." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {MODULOS_PREVIEW.map((m) => (
            <div key={m.title} className="rounded-2xl border group relative h-56 overflow-hidden cursor-pointer"
              style={{ borderColor: BORDER }} onClick={() => onNavigate("educacao")}>
              <img src={m.img} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95) 20%, transparent 70%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: WHITE }}>{m.title}</h3>
                <p className="mt-1" style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.75)" }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => onNavigate("educacao")} className="inline-flex items-center gap-2" style={{ fontSize: "0.9375rem", fontWeight: 700, color: BLUE_LIGHT }}>
            <BookOpen className="w-4 h-4" /> Ver todos os módulos na área de Educação <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Como funcionamos (4 fases) ────────────────────────────────────────────────
const FASES = [
  { n: 1, title: "Diagnóstico e Onboarding", desc: "Mapeamos seu perfil de investidor, objetivos financeiros, horizonte de tempo e tolerância ao risco. Esse diagnóstico é a base de toda a estratégia.",
    items: ["Questionário de perfil detalhado", "Definição de metas financeiras", "Alinhamento de expectativas reais", "Apresentação completa da plataforma"] },
  { n: 2, title: "Planejamento Estratégico", desc: "Desenvolvemos um plano personalizado com alocação de ativos, estratégias operacionais e metas de performance alinhadas ao seu perfil.",
    items: ["Seleção de ativos internacionais", "Definição de estratégias operacionais", "Configuração de limites de stop", "Cronograma de acompanhamento"] },
  { n: 3, title: "Execução e Operação", desc: "Implementamos as estratégias com agilidade e disciplina, monitorando os mercados em tempo real e ajustando posições conforme necessário.",
    items: ["Operações em mercados internacionais", "Monitoramento contínuo 24/7", "Ajustes táticos de posição", "Gestão ativa de risco em tempo real"] },
  { n: 4, title: "Relatórios e Otimização", desc: "Entregamos relatórios completos de performance, realizamos reuniões estratégicas e otimizamos continuamente para melhores resultados.",
    items: ["Relatórios periódicos de resultado", "Reuniões estratégicas regulares", "Análise detalhada de performance", "Otimização contínua da estratégia"] },
];

function ComoFuncionamos() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Metodologia" title="Como" gradientPart="funcionamos"
          sub="Nossa metodologia é validada, transparente e orientada por resultados consistentes." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FASES.map((f, i) => (
            <Card key={f.n} className="p-6 flex flex-col gap-4">
              <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.06em", color: BLUE_LIGHT, textTransform: "uppercase" }}>Fase {f.n}</span>
              <h3 style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{f.title}</h3>
              <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{f.desc}</p>
              {open === i && (
                <ul className="space-y-2 mt-1">
                  {f.items.map((it) => (
                    <li key={it} className="flex items-start gap-2" style={{ fontSize: "0.8125rem", color: MUTED }}>
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#22c55e" }} />{it}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => setOpen(open === i ? null : i)} className="mt-auto flex items-center gap-1.5 self-start" style={{ fontSize: "0.8125rem", fontWeight: 700, color: BLUE_LIGHT }}>
                {open === i ? "Ocultar detalhes ↑" : "Ver detalhes ↓"}
              </button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Depoimentos ───────────────────────────────────────────────────────────────
const DEPOIMENTOS = [
  { name: "Marcos Oliveira", role: "Empresário — São Paulo / SP", plan: "Essencial", initials: "MO",
    text: "Comecei pelo Plano Essencial mais como teste do que expectativa. Em 3 meses, a condução das operações foi tão transparente que ampliei meu capital. Os relatórios semanais me dão segurança real sobre onde meu dinheiro está alocado." },
  { name: "Dra. Fernanda Costa", role: "Médica Cardiologista — Rio de Janeiro / RJ", plan: "Performance", initials: "FC",
    text: "Como médica, tenho pouco tempo para acompanhar mercados. A equipe da Veritas cuida de tudo com um nível de profissionalismo que não esperava encontrar. Meu foco é minha clínica — sem preocupação com a parte financeira." },
  { name: "Rafael Souza", role: "Engenheiro de Software — Belo Horizonte / MG", plan: "Estratégico", initials: "RS",
    text: "Trabalho com tecnologia há 12 anos e sei a diferença entre um sistema bem estruturado e um fraco. A plataforma da Veritas é sólida, os dados são precisos e os analistas entendem o que fazem. Recomendo sem hesitar." },
  { name: "Patrícia Lima", role: "Servidora Pública Federal — Brasília / DF", plan: "Essencial", initials: "PL",
    text: "Sempre fui conservadora — tudo na poupança. Entrei com cautela e fui surpreendida pelo acompanhamento próximo. Hoje tenho parte do patrimônio dolarizado e me sinto muito mais protegida do que quando tudo estava em reais." },
  { name: "André Santos", role: "Corretor de Imóveis — Curitiba / PR", plan: "Expansão", initials: "AS",
    text: "Atuei anos no mercado imobiliário e aprendi que diversificação é fundamental. A Veritas me deu acesso a mercados que nunca imaginei operar — com clareza nos relatórios que qualquer leigo consegue entender." },
  { name: "Juliana Ferreira", role: "Professora Universitária — Porto Alegre / RS", plan: "Estratégico", initials: "JF",
    text: "Fiz cursos de investimento por anos mas nunca tive coragem de entrar sozinha nos mercados externos. A Veritas resolveu isso: além de operar, educam o cliente. Hoje entendo o que está sendo feito com o meu capital." },
];

const DEPOIMENTOS_POR_PAGINA = 3;

function Depoimentos() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(DEPOIMENTOS.length / DEPOIMENTOS_POR_PAGINA);
  const visiveis = DEPOIMENTOS.slice(page * DEPOIMENTOS_POR_PAGINA, page * DEPOIMENTOS_POR_PAGINA + DEPOIMENTOS_POR_PAGINA);

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Depoimentos Reais" title="O que dizem nossos" gradientPart="clientes"
          sub="Experiências reais de investidores que escolheram a Veritas Global." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visiveis.map((d) => (
            <Card key={d.name} className="p-7 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" fill="#facc15" style={{ color: "#facc15" }} />)}
              </div>
              <p className="flex-1" style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>"{d.text}"</p>
              <div className="mt-6 pt-4 border-t flex items-center gap-3" style={{ borderColor: BORDER }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(94,144,255,0.12)", color: BLUE_LIGHT, fontSize: "0.75rem", fontWeight: 700 }}>{d.initials}</div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: WHITE }}>{d.name}</p>
                  <p style={{ fontSize: "0.75rem", color: MUTED }}>{d.role}</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="inline-flex rounded-full border px-3 py-1" style={{ borderColor: "rgba(94,144,255,0.3)", color: BLUE_LIGHT, fontSize: "0.75rem", fontWeight: 700 }}>
                  Plano {d.plan}
                </span>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            aria-label="Depoimentos anteriores"
            className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 transition-opacity"
            style={{ borderColor: BORDER, color: WHITE }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} aria-label={`Página ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: i === page ? 24 : 8, background: i === page ? BLUE_LIGHT : "#27272a" }} />
            ))}
          </div>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
            aria-label="Próximos depoimentos"
            className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 transition-opacity"
            style={{ borderColor: BORDER, color: WHITE }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Simulação de investimento ─────────────────────────────────────────────────
function SimulacaoInvestimento({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  const [inicial, setInicial] = useState(10000);
  const [aporte, setAporte] = useState(500);
  const [retornoAnual, setRetornoAnual] = useState(12);
  const [periodo, setPeriodo] = useState(60);

  const taxaMensal = retornoAnual / 100 / 12;
  const valorFinal =
    inicial * Math.pow(1 + taxaMensal, periodo) +
    (taxaMensal > 0 ? aporte * ((Math.pow(1 + taxaMensal, periodo) - 1) / taxaMensal) : aporte * periodo);
  const totalInvestido = inicial + aporte * periodo;
  const rendimento = valorFinal - totalInvestido;
  const roiTotal = totalInvestido > 0 ? (rendimento / totalInvestido) * 100 : 0;

  const points = 6;
  const chart = Array.from({ length: points + 1 }, (_, i) => {
    const m = Math.round((periodo / points) * i);
    const investido = inicial + aporte * m;
    const projetado = inicial * Math.pow(1 + taxaMensal, m) +
      (taxaMensal > 0 ? aporte * ((Math.pow(1 + taxaMensal, m) - 1) / taxaMensal) : aporte * m);
    return { m, investido, projetado };
  });
  const maxV = Math.max(...chart.map((p) => p.projetado), 1);
  const toXY = (m: number, v: number) => ({ x: (m / periodo) * 300, y: 110 - (v / maxV) * 100 });
  const pathOf = (key: "investido" | "projetado") =>
    chart.map((p, i) => `${i === 0 ? "M" : "L"}${toXY(p.m, p[key]).x.toFixed(1)} ${toXY(p.m, p[key]).y.toFixed(1)}`).join(" ");
  const brl = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const controls = [
    { label: "Valor inicial", value: inicial, min: 1000, max: 500000, step: 500, set: setInicial, fmt: (v: number) => `R$ ${v.toLocaleString("pt-BR")}` },
    { label: "Aporte mensal", value: aporte, min: 0, max: 10000, step: 100, set: setAporte, fmt: (v: number) => `R$ ${v.toLocaleString("pt-BR")}` },
    { label: "Retorno anual", value: retornoAnual, min: 1, max: 50, step: 1, set: setRetornoAnual, fmt: (v: number) => `${v}% a.a.` },
    { label: "Período", value: periodo, min: 6, max: 360, step: 6, set: setPeriodo, fmt: (v: number) => `${v} meses` },
  ];

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto px-6">
        <SectionHead eyebrow="Simulação de Investimento" title="Calculadora de" gradientPart="Investimentos"
          sub="Simule o crescimento do seu patrimônio e descubra o poder dos juros compostos." />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {controls.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: 600, color: WHITE }}>{c.label}</label>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: BLUE_LIGHT }}>{c.fmt(c.value)}</span>
                </div>
                <input type="range" min={c.min} max={c.max} step={c.step} value={c.value}
                  onChange={(e) => c.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
          </div>
          <div>
            <Card className="p-6 mb-4">
              <p className="mb-5" style={{ color: MUTED, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Projeção ao final do período</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Total investido", value: `R$ ${brl(totalInvestido)}`, color: WHITE },
                  { label: "Rendimento", value: `+R$ ${brl(rendimento)}`, color: "#22c55e" },
                  { label: "Valor final", value: `R$ ${brl(valorFinal)}`, color: BLUE_LIGHT },
                  { label: "ROI total", value: `+${roiTotal.toFixed(1)}%`, color: BLUE_LIGHT },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl border" style={{ borderColor: BORDER }}>
                    <p className="mb-2" style={{ color: MUTED, fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</p>
                    <p style={{ fontSize: "1.0625rem", fontWeight: 700, color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3.5 rounded-xl border" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-4 mb-2 text-[0.6875rem] font-semibold" style={{ color: MUTED }}>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: BORDER }} />Investido</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: BLUE_LIGHT }} />Projetado</span>
                </div>
                <svg viewBox="0 0 300 115" className="w-full h-28" preserveAspectRatio="none">
                  <path d={pathOf("investido")} fill="none" stroke={BORDER} strokeWidth="2" strokeDasharray="4,3" />
                  <path d={pathOf("projetado")} fill="none" stroke={BLUE_LIGHT} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </Card>
            <button onClick={() => onNavigate("planos")} className="w-full py-4 rounded-full hover:opacity-90"
              style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.9375rem", fontWeight: 700 }}>
              Pronto para investir? Ver planos →
            </button>
            <p className="mt-3" style={{ fontSize: "0.75rem", color: MUTED }}>
              Simulação com fins educacionais baseada em juros compostos. Resultados passados não garantem
              resultados futuros. Investimentos envolvem risco de perda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Automatize em 4 passos simples ────────────────────────────────────────────
const PASSOS = [
  { n: 1, icon: <UserPlus className="w-5 h-5" />, title: "Cadastre-se gratuitamente", desc: "Crie sua conta em poucos segundos e conecte sua corretora à plataforma com segurança." },
  { n: 2, icon: <CreditCard className="w-5 h-5" />, title: "Escolha o plano ideal", desc: "Analise os recursos de cada plano e selecione a solução que melhor se adapta ao seu perfil." },
  { n: 3, icon: <Settings className="w-5 h-5" />, title: "Configure sua estratégia", desc: "Personalize os parâmetros operacionais conforme seus objetivos ou conte com nossos especialistas." },
  { n: 4, icon: <BarChart3 className="w-5 h-5" />, title: "Monitore os resultados", desc: "Acompanhe sua performance em tempo real com relatórios e alertas personalizados." },
];

function AutomatizePassos() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Comece Agora" title="Automatize em" gradientPart="4 passos simples"
          sub="Descubra como nossa plataforma pode transformar sua maneira de operar." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PASSOS.map((p) => (
            <Card key={p.n} className="p-6 flex flex-col gap-4 relative">
              <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.75rem", fontWeight: 800 }}>{p.n}</span>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{p.icon}</div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{p.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTAs finais ────────────────────────────────────────────────────────────────
function CTAsFinais({ onAccessPlatform, onNavigate }: { onAccessPlatform: () => void; onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <section className="py-24 relative overflow-hidden" style={{ background: BG }}>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="mx-auto mb-5" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, maxWidth: "24ch" }}>
            Pronto para começar sua jornada?
          </h2>
          <p className="mx-auto mb-10" style={{ color: MUTED, fontSize: "1.125rem" }}>
            Conecte-se a uma estrutura dedicada a facilitar o acesso de investidores brasileiros às oportunidades
            do mercado internacional.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <PrimaryButton onClick={onAccessPlatform}>Começar agora</PrimaryButton>
            <SecondaryButton>Falar com especialista</SecondaryButton>
          </div>
          <p style={{ fontSize: "0.8125rem", color: MUTED }}>
            ✓ Suporte especializado · ✓ Tecnologia avançada · ✓ Segurança garantida
          </p>
        </div>
      </section>

      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="mx-auto mb-5" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, maxWidth: "28ch" }}>
            Pronto para acessar oportunidades{" "}
            <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>no mercado internacional?</span>
          </h2>
          <p className="mx-auto mb-10" style={{ color: MUTED, fontSize: "1.125rem", maxWidth: "60ch" }}>
            Conecte-se a uma estrutura que facilita o acesso de investidores brasileiros às oportunidades do
            mercado global, com suporte estratégico e soluções voltadas para diversificação patrimonial
            internacional.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <PrimaryButton onClick={() => onNavigate("planos")}>Abrir Conta Internacional</PrimaryButton>
            <SecondaryButton onClick={() => onNavigate("planos")}>Conhecer os Planos</SecondaryButton>
            <SecondaryButton>Falar com um Especialista</SecondaryButton>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { title: "Tecnologia proprietária", desc: "Algoritmos avançados e inteligência de mercado" },
              { title: "Conexão estratégica", desc: "Acesso a estruturas e oportunidades financeiras globais" },
              { title: "Atendimento personalizado", desc: "Alinhado ao perfil e objetivos do investidor" },
            ].map((d) => (
              <div key={d.title} className="p-5 rounded-xl border" style={{ borderColor: BORDER }}>
                <p className="flex items-center gap-2 mb-2" style={{ fontSize: "0.875rem", fontWeight: 700, color: WHITE }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE_LIGHT }} />{d.title}
                </p>
                <p style={{ color: MUTED, fontSize: "0.875rem" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Página completa ────────────────────────────────────────────────────────────
export default function HomeOriginal({
  onAccessPlatform, onNavigate,
}: { onAccessPlatform: () => void; onNavigate: (v: LandingView) => void }) {
  return (
    <>
      <HeroOriginal onAccessPlatform={onAccessPlatform} />
      <NossasSolucoes />
      <NossaAtuacao />
      <BrokersSection />
      <QuemSomosIntro onNavigate={onNavigate} />
      <MissaoVisao />
      <NossaMetodologia />
      <NossosValores />
      <EducacaoPreview onNavigate={onNavigate} />
      <ComoFuncionamos />
      <Depoimentos />
      <SimulacaoInvestimento onNavigate={onNavigate} />
      <AutomatizePassos />
      <CTAsFinais onAccessPlatform={onAccessPlatform} onNavigate={onNavigate} />
    </>
  );
}
