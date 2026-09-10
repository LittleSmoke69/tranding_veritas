import { useState } from "react";
import {
  Globe, ShieldCheck, Zap, TrendingUp, BarChart3, Users, Rocket, Eye,
  BookOpen, Target, Award, Clock, Building2, Handshake, Scale, Lightbulb,
  GraduationCap, UserPlus, CreditCard, Settings, ArrowRight, Check, Star,
  PlayCircle,
} from "lucide-react";
import {
  B, BD, BB, G, GD, RED, RB, GOLD, MFG, FG, BORDER, CARD,
  IBox, Badge, SectionHeader, useCountUp, BrokersSection, PLATFORM_URL, navigate,
} from "../shared";

// Réplica fiel do conteúdo de https://veritasacademy.base44.app/ (raspado em 2026-09-10).
// Mantida como página separada — a Home original (App.tsx `Home()`) segue intocada no código.

// ── Hero ──────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    icon: <Globe className="w-10 h-10" />,
    badgeIcon: <Globe className="w-3 h-3" />,
    heading: "Desenvolvimento estratégico para o mercado financeiro global",
    sub: "A Veritas Global foi estruturada com o propósito de desenvolver investidores que desejam compreender os mercados financeiros internacionais com uma visão mais estratégica e disciplinada.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    badgeIcon: <ShieldCheck className="w-3 h-3" />,
    heading: "Conhecimento e estrutura para mercados globais",
    sub: "Nosso trabalho está focado na construção de conhecimento, estrutura de acompanhamento e integração com plataformas internacionais utilizadas por investidores ao redor do mundo.",
  },
  {
    icon: <Zap className="w-10 h-10" />,
    badgeIcon: <Zap className="w-3 h-3" />,
    heading: "Mais de 10 anos no mercado financeiro",
    sub: "Experiência consolidada no desenvolvimento de investidores e integração com infraestrutura global de mercados financeiros.",
  },
];

function HeroOriginal() {
  const [slide, setSlide] = useState(0);
  const s = HERO_SLIDES[slide];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="mb-8"><Badge color="blue">{s.badgeIcon}Investimentos Globais</Badge></div>

            <h1 className="mb-7" key={slide}
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.1rem, 7.5vw, 4.25rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", minHeight: "3.2em", animation: "hero-fade 500ms ease", overflowWrap: "break-word", color: FG }}>
              {s.heading}
            </h1>

            <p className="mb-10" key={`sub-${slide}`} style={{ fontSize: "1.0625rem", fontWeight: 500, lineHeight: 1.75, color: MFG, maxWidth: "46ch", minHeight: "3.5em" }}>
              {s.sub}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a href={PLATFORM_URL} className="flex items-center gap-2.5 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
                style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
                Abrir Conta <ArrowRight className="w-4 h-4" />
              </a>
              <button className="flex items-center gap-2.5 px-7 py-4 rounded-xl border transition-all hover:border-white/20"
                style={{ borderColor: BORDER, color: FG, background: "rgba(255,255,255,0.03)", fontSize: "0.9375rem", fontWeight: 600 }}>
                <PlayCircle className="w-4 h-4" /> Ver como funciona
              </button>
            </div>

            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ width: i === slide ? 32 : 16, background: i === slide ? B : BORDER }} />
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center relative" style={{ height: 420 }}>
            <div className="absolute rounded-full" style={{ inset: 0, border: `1px solid ${BB}`, opacity: 0.35 }} />
            <div className="absolute rounded-full" style={{ inset: 55, border: `1px solid ${BB}`, opacity: 0.5 }} />
            <div className="absolute rounded-full" style={{ inset: 110, border: `1px solid ${BB}`, opacity: 0.7 }} />
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(25,172,254,0.12) 0%, transparent 70%)" }} />
            <div key={slide} className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: BD, border: `1px solid ${BB}`, color: B, animation: "hero-fade 500ms ease" }}>
              {s.icon}
            </div>
            {[{ t: 10, l: 20 }, { t: 65, l: 85 }, { t: 85, l: 15 }].map((p, i) => (
              <span key={i} className="absolute w-2 h-2 rounded-full" style={{ top: `${p.t}%`, left: `${p.l}%`, background: B, opacity: 0.5 }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Nossas Soluções ───────────────────────────────────────────────────────────
const SOLUCOES = [
  { icon: <TrendingUp className="w-5 h-5" />, gradient: "linear-gradient(135deg, #38bdf8, #2563eb)", title: "Mercado Financeiro", desc: "Soluções inteligentes conectando empresas e investidores com agilidade e segurança." },
  { icon: <BarChart3 className="w-5 h-5" />, gradient: "linear-gradient(135deg, #f472b6, #a21caf)", title: "Performance", desc: "Tecnologia, experiência e estratégia. Conheça nossos números e o diferencial." },
  { icon: <Users className="w-5 h-5" />, gradient: "linear-gradient(135deg, #fb923c, #ec4899)", title: "Consultoria", desc: "Transforme decisões financeiras em estratégias vencedoras com segurança." },
  { icon: <ShieldCheck className="w-5 h-5" />, gradient: "linear-gradient(135deg, #34d399, #059669)", title: "Segurança", desc: "A proteção de seus dados e investimentos é a base de tudo que fazemos." },
  { icon: <Zap className="w-5 h-5" />, gradient: "linear-gradient(135deg, #f87171, #dc2626)", title: "Robô", desc: "Robôs configurados para operar com precisão e agilidade no mercado." },
  { icon: <GraduationCap className="w-5 h-5" />, gradient: "linear-gradient(135deg, #818cf8, #4f46e5)", title: "Cursos e Material", desc: "Cursos e materiais complementares para você aprender de forma prática e eficiente." },
];

function NossasSolucoes() {
  return (
    <section className="py-24 border-y" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Nossas Soluções"
          heading="Soluções para você investir com inteligência"
          sub="Educação, análise e tecnologia de ponta para sua operação no mercado financeiro global." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLUCOES.map((s) => (
            <div key={s.title} className="bento-card p-7 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: s.gradient }}>
                {s.icon}
              </div>
              <div>
                <h3 className="card-title mb-2">{s.title}</h3>
                <p className="card-body">{s.desc}</p>
              </div>
              <button className="mt-auto flex items-center gap-1.5 self-start" style={{ fontSize: "0.8125rem", fontWeight: 700, color: B }}>
                Mais detalhes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
    <div ref={ref} className="bento-card p-7 text-center flex flex-col items-center gap-3">
      <IBox>{icon}</IBox>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 900, color: FG }}>{value}{suffix}</p>
      <p className="card-body">{label}</p>
    </div>
  );
}

function NossaAtuacao() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Nossa Atuação"
          heading="Nossa atuação no mercado internacional em números"
          sub="Indicadores que refletem a experiência e a estrutura da Veritas Global no acompanhamento estratégico de investidores no mercado financeiro internacional." />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatItem icon={<Users className="w-5 h-5" />} target={5000} suffix="+" label="Investidores atendidos" />
          <StatItem icon={<Award className="w-5 h-5" />} target={98} suffix="%" label="Satisfação dos clientes" />
          <StatItem icon={<Globe className="w-5 h-5" />} target={10} suffix="+" label="Anos de atuação no mercado financeiro" />
          <div className="bento-card p-7 text-center flex flex-col items-center gap-3">
            <IBox><Clock className="w-5 h-5" /></IBox>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 900, color: FG }}>24/7</p>
            <p className="card-body">Suporte estratégico dedicado</p>
          </div>
          <StatItem icon={<Building2 className="w-5 h-5" />} target={10} suffix="+" label="Corretoras internacionais integradas" />
        </div>
      </div>
    </section>
  );
}

// ── Quem Somos (intro) ────────────────────────────────────────────────────────
function QuemSomosIntro() {
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="rounded-panel overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&h=700&fit=crop" alt="Equipe Veritas Global"
              className="w-full h-full object-cover" style={{ maxHeight: 460 }} />
          </div>
          <div className="absolute -bottom-5 left-6 bento-card px-4 py-3 flex items-center gap-3">
            <IBox color="green"><ShieldCheck className="w-4 h-4" /></IBox>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: FG }}>Segurança Garantida</span>
          </div>
        </div>
        <div>
          <div className="mb-5"><Badge color="blue">Quem Somos</Badge></div>
          <h2 className="section-heading-xl mb-6">
            Estrutura Global para <span className="blue-gradient">Investidores Estratégicos</span>
          </h2>
          <p className="card-body mb-4" style={{ fontSize: "1rem" }}>
            A Veritas Global foi estruturada com o propósito de desenvolver investidores que desejam compreender
            os mercados financeiros internacionais com uma visão mais estratégica e disciplinada.
          </p>
          <p className="card-body mb-8" style={{ fontSize: "1rem" }}>
            Nosso trabalho está focado na construção de conhecimento, estrutura de acompanhamento e integração
            com plataformas internacionais utilizadas por investidores ao redor do mundo.
          </p>
          <div className="mb-8 pl-4 border-l-2" style={{ borderColor: BB }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.75rem", fontWeight: 900, color: B }}>10+</p>
            <p className="card-body">Anos de atuação no mercado financeiro internacional</p>
          </div>
          <ul className="space-y-3 mb-8">
            {["Conhecimento estratégico para mercados globais", "Disciplina operacional e acompanhamento profissional", "Integração com plataformas internacionais"].map((t) => (
              <li key={t} className="flex items-start gap-2.5" style={{ fontSize: "0.9375rem", color: MFG }}>
                <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: G }} />{t}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/planos")} className="px-6 py-3 rounded-xl hover:opacity-90"
            style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 24px var(--primary-glow)" }}>
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
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-4">
        <div className="bento-card p-9 flex flex-col items-center text-center gap-5">
          <IBox><Rocket className="w-6 h-6" /></IBox>
          <h3 className="card-title text-xl">Missão</h3>
          <p className="card-body leading-relaxed">
            Desenvolver investidores estratégicos por meio de conhecimento estruturado, acompanhamento profissional
            e integração com mercados financeiros internacionais, promovendo uma atuação mais consciente e
            disciplinada no ambiente global.
          </p>
        </div>
        <div className="bento-card p-9 flex flex-col items-center text-center gap-5">
          <IBox color="green"><Eye className="w-6 h-6" /></IBox>
          <h3 className="card-title text-xl">Visão</h3>
          <p className="card-body leading-relaxed">
            Ser reconhecida como referência no desenvolvimento estratégico de investidores, estabelecendo um
            padrão de excelência na formação, acompanhamento e integração com mercados financeiros globais.
          </p>
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
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Nossa Metodologia"
          heading="Metodologia Veritas"
          sub="Nossa estrutura de desenvolvimento é baseada em quatro pilares fundamentais que sustentam a formação de investidores estratégicos." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PILARES.map((p) => (
            <div key={p.title} className="bento-card p-7 flex flex-col gap-4">
              <IBox>{p.icon}</IBox>
              <div>
                <h3 className="card-title mb-2">{p.title}</h3>
                <p className="card-body">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="section-body-center mx-auto" style={{ maxWidth: "60ch" }}>
          Desenvolvimento estratégico para investidores que buscam uma atuação mais consciente no mercado
          financeiro global.
        </p>
      </div>
    </section>
  );
}

// ── Nossos Valores ────────────────────────────────────────────────────────────
const VALORES = [
  { icon: <Lightbulb className="w-6 h-6" />, title: "Inovação", desc: "Tecnologia de ponta e estratégias modernas no mercado financeiro global.", color: "#a78bfa" },
  { icon: <Eye className="w-6 h-6" />, title: "Transparência", desc: "Clareza total nas operações, relatórios e comunicação com clientes.", color: B },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Segurança", desc: "Protocolos robustos de proteção de capital e gestão de risco em cada operação.", color: G },
  { icon: <Handshake className="w-6 h-6" />, title: "Comprometimento", desc: "Acompanhamento próximo e suporte estratégico personalizado em cada etapa.", color: B },
  { icon: <Scale className="w-6 h-6" />, title: "Ética", desc: "Conduta profissional irrepreensível e respeito ao investidor em cada decisão.", color: RED },
];

function NossosValores() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Nossos Valores"
          heading="O que nos move"
          sub="Clique em cada valor para entender como ele se aplica na nossa operação diária." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALORES.map((v, i) => (
            <button key={v.title} onClick={() => setOpen(open === i ? null : i)} type="button"
              className="bento-card p-7 text-left flex flex-col gap-4 transition"
              style={{ borderColor: open === i ? v.color : BORDER }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${v.color}22`, color: v.color }}>
                {v.icon}
              </div>
              <h3 className="card-title">{v.title}</h3>
              {open === i && <p className="card-body">{v.desc}</p>}
              <span className="flex items-center gap-1.5" style={{ fontSize: "0.8125rem", fontWeight: 700, color: v.color }}>
                {open === i ? "Ocultar" : "Saiba mais"} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Educação Financeira (preview) ─────────────────────────────────────────────
const MODULOS_PREVIEW = [
  { title: "Mentalidade para Prosperar", desc: "Construa uma base sólida para seu sucesso financeiro", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop" },
  { title: "Introdução aos Investimentos", desc: "Aprenda os conceitos fundamentais do mercado", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=450&fit=crop" },
  { title: "Renda Fixa", desc: "Segurança e previsibilidade para sua carteira", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=450&fit=crop" },
  { title: "Renda Variável", desc: "Potencial de crescimento com gestão de risco", img: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=450&fit=crop" },
  { title: "Investimento no Exterior", desc: "Dolarize seu patrimônio e diversifique globalmente", img: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&h=450&fit=crop" },
  { title: "O Novo Dinheiro", desc: "Novas fontes de renda através de ativos digitais", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=450&fit=crop" },
];

function EducacaoPreview() {
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Educação Financeira"
          heading="Conheça nossos módulos"
          sub="Clique em qualquer módulo para ver o conteúdo completo." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {MODULOS_PREVIEW.map((m) => (
            <div key={m.title} className="bento-card group relative h-56 overflow-hidden cursor-pointer" onClick={() => navigate("/educacao")}>
              <img src={m.img} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,12,24,0.95) 20%, transparent 70%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#fff" }}>{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => navigate("/educacao")} className="inline-flex items-center gap-2" style={{ fontSize: "0.9375rem", fontWeight: 700, color: B }}>
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
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Metodologia"
          heading="Como funcionamos"
          sub="Nossa metodologia é validada, transparente e orientada por resultados consistentes." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FASES.map((f, i) => (
            <div key={f.n} className="bento-card p-6 flex flex-col gap-4">
              <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.06em", color: B, textTransform: "uppercase" }}>Fase {f.n}</span>
              <h3 className="card-title">{f.title}</h3>
              <p className="card-body">{f.desc}</p>
              {open === i && (
                <ul className="space-y-2 mt-1">
                  {f.items.map((it) => (
                    <li key={it} className="flex items-start gap-2" style={{ fontSize: "0.8125rem", color: MFG }}>
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: G }} />{it}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => setOpen(open === i ? null : i)} className="mt-auto flex items-center gap-1.5 self-start" style={{ fontSize: "0.8125rem", fontWeight: 700, color: B }}>
                {open === i ? "Ocultar detalhes ↑" : "Ver detalhes ↓"}
              </button>
            </div>
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
];

function Depoimentos() {
  return (
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Depoimentos Reais"
          heading="O que dizem nossos clientes"
          sub="Experiências reais de investidores que escolheram a Veritas Global." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEPOIMENTOS.map((d) => (
            <div key={d.name} className="bento-card p-7 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" fill={GOLD} style={{ color: GOLD }} />)}
              </div>
              <p className="card-body flex-1 leading-relaxed">"{d.text}"</p>
              <div className="mt-6 pt-4 border-t flex items-center gap-3" style={{ borderColor: BORDER }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: BD, color: B, fontSize: "0.75rem", fontWeight: 700 }}>{d.initials}</div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: FG }}>{d.name}</p>
                  <p style={{ fontSize: "0.75rem", color: MFG }}>{d.role}</p>
                </div>
              </div>
              <div className="mt-3"><Badge color="blue">Plano {d.plan}</Badge></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Simulação de investimento ─────────────────────────────────────────────────
function SimulacaoInvestimento() {
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
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader center badge="Simulação de Investimento" heading="Simule seus Investimentos"
          sub="Simule o crescimento do seu patrimônio e descubra o poder dos juros compostos." />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {controls.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: 600, color: FG }}>{c.label}</label>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 700, color: B }}>{c.fmt(c.value)}</span>
                </div>
                <input type="range" min={c.min} max={c.max} step={c.step} value={c.value}
                  onChange={(e) => c.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
          </div>
          <div>
            <div className="bento-card p-6 mb-4">
              <p className="card-label mb-5">Projeção ao final do período</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Total investido", value: `R$ ${brl(totalInvestido)}`, color: FG },
                  { label: "Rendimento", value: `+R$ ${brl(rendimento)}`, color: G },
                  { label: "Valor final", value: `R$ ${brl(valorFinal)}`, color: B },
                  { label: "ROI total", value: `+${roiTotal.toFixed(1)}%`, color: B },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
                    <p className="card-label mb-2">{item.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.0625rem", fontWeight: 700, color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-4 mb-2 text-[0.6875rem] font-semibold" style={{ color: MFG }}>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: BORDER }} />Investido</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: B }} />Projetado</span>
                </div>
                <svg viewBox="0 0 300 115" className="w-full h-28" preserveAspectRatio="none">
                  <path d={pathOf("investido")} fill="none" stroke={BORDER} strokeWidth="2" strokeDasharray="4,3" />
                  <path d={pathOf("projetado")} fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <button onClick={() => navigate("/planos")} className="w-full py-4 rounded-xl hover:opacity-90"
              style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 30px var(--primary-glow)" }}>
              Pronto para investir? Ver planos →
            </button>
            <p className="mt-3" style={{ fontSize: "0.75rem", color: MFG }}>
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
    <section className="py-24 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader center badge="Comece Agora"
          heading="Automatize em 4 passos simples"
          sub="Descubra como nossa plataforma pode transformar sua maneira de operar." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PASSOS.map((p) => (
            <div key={p.n} className="bento-card p-6 flex flex-col gap-4 relative">
              <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: B, color: "#fff", fontSize: "0.75rem", fontWeight: 800 }}>{p.n}</span>
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
  );
}

// ── CTAs finais ────────────────────────────────────────────────────────────────
function CTAsFinais() {
  return (
    <>
      <section className="py-24 border-t relative overflow-hidden" style={{ borderColor: BORDER, background: CARD }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(25,172,254,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="section-heading-xl mx-auto mb-5" style={{ maxWidth: "24ch" }}>Pronto para começar sua jornada?</h2>
          <p className="section-body-center mb-10">
            Conecte-se a uma estrutura dedicada a facilitar o acesso de investidores brasileiros às oportunidades
            do mercado internacional.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <a href={PLATFORM_URL} className="px-7 py-4 rounded-xl hover:opacity-90"
              style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
              Começar agora
            </a>
            <button className="px-7 py-4 rounded-xl border" style={{ borderColor: BORDER, color: FG, fontSize: "0.9375rem", fontWeight: 600 }}>
              Falar com especialista
            </button>
          </div>
          <p style={{ fontSize: "0.8125rem", color: MFG }}>
            ✓ Suporte especializado · ✓ Tecnologia avançada · ✓ Segurança garantida
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="section-heading-xl mx-auto mb-5" style={{ maxWidth: "28ch" }}>
            Pronto para acessar oportunidades <span className="blue-gradient">no mercado internacional?</span>
          </h2>
          <p className="section-body-center mb-10 mx-auto" style={{ maxWidth: "60ch" }}>
            Conecte-se a uma estrutura que facilita o acesso de investidores brasileiros às oportunidades do
            mercado global, com suporte estratégico e soluções voltadas para diversificação patrimonial
            internacional.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button onClick={() => navigate("/planos")} className="px-7 py-4 rounded-xl hover:opacity-90"
              style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
              Abrir Conta Internacional
            </button>
            <button onClick={() => navigate("/planos")} className="px-7 py-4 rounded-xl border" style={{ borderColor: BORDER, color: FG, fontSize: "0.9375rem", fontWeight: 600 }}>
              Conhecer os Planos
            </button>
            <button className="px-7 py-4 rounded-xl border" style={{ borderColor: BORDER, color: FG, fontSize: "0.9375rem", fontWeight: 600 }}>
              Falar com um Especialista
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { title: "Tecnologia proprietária", desc: "Algoritmos avançados e inteligência de mercado" },
              { title: "Conexão estratégica", desc: "Acesso a estruturas e oportunidades financeiras globais" },
              { title: "Atendimento personalizado", desc: "Alinhado ao perfil e objetivos do investidor" },
            ].map((d) => (
              <div key={d.title} className="p-5 rounded-xl border" style={{ borderColor: BORDER }}>
                <p className="flex items-center gap-2 mb-2" style={{ fontSize: "0.875rem", fontWeight: 700, color: FG }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: B }} />{d.title}
                </p>
                <p className="card-body">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Página completa ────────────────────────────────────────────────────────────
export default function HomeOriginal() {
  return (
    <>
      <HeroOriginal />
      <NossasSolucoes />
      <NossaAtuacao />
      <BrokersSection />
      <QuemSomosIntro />
      <MissaoVisao />
      <NossaMetodologia />
      <NossosValores />
      <EducacaoPreview />
      <ComoFuncionamos />
      <Depoimentos />
      <SimulacaoInvestimento />
      <AutomatizePassos />
      <CTAsFinais />
    </>
  );
}
