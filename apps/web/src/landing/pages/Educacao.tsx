import { useState } from "react";
import {
  GraduationCap, Video, HelpCircle, PlayCircle, Clock, ArrowRight, BookMarked,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { B, BD, BB, G, GD, RED, RD, RB, GOLD, MFG, BORDER, Badge, useCountUp, type LandingView } from "../shared";

type Level = "Todos" | "Iniciante" | "Intermediário" | "Avançado";

const STATS = [
  { value: 50,  suffix: "+", label: "Módulos" },
  { value: 100, suffix: "+", label: "Webinars" },
  { value: 10,  suffix: "k+", label: "Alunos" },
  { value: 95,  suffix: "%", label: "Satisfação" },
];

const MODULES: { title: string; desc: string; level: Level; category: string; minutes: number }[] = [
  { title: "Introdução aos Mercados Financeiros", desc: "Aprenda os fundamentos dos mercados financeiros e como começar a investir.", level: "Iniciante", category: "Mercados Financeiros", minutes: 45 },
  { title: "Mentalidade para Prosperar", desc: "Construa uma base sólida de disciplina e psicologia para o seu sucesso financeiro.", level: "Iniciante", category: "Psicologia", minutes: 35 },
  { title: "Renda Fixa Internacional", desc: "Segurança e previsibilidade para sua carteira com ativos de renda fixa global.", level: "Iniciante", category: "Renda Fixa", minutes: 40 },
  { title: "Análise Técnica: Candlesticks", desc: "Domine a leitura de gráficos de candlestick para identificar padrões.", level: "Intermediário", category: "Análise Técnica", minutes: 60 },
  { title: "Renda Variável e Diversificação", desc: "Potencial de crescimento com gestão de risco em ações e ETFs internacionais.", level: "Intermediário", category: "Renda Variável", minutes: 55 },
  { title: "Investimento no Exterior", desc: "Dolarize seu patrimônio e diversifique globalmente com segurança.", level: "Intermediário", category: "Câmbio", minutes: 50 },
  { title: "Gestão de Risco Avançada", desc: "Técnicas profissionais de gestão de risco e preservação de capital.", level: "Avançado", category: "Gestão de Risco", minutes: 90 },
  { title: "O Novo Dinheiro: Ativos Digitais", desc: "Novas fontes de renda através de criptoativos e tecnologia blockchain.", level: "Avançado", category: "Cripto", minutes: 70 },
];

const WEBINARS = [
  { title: "Como ler o mercado em cenários de alta volatilidade", date: "Toda terça · 20h", speaker: "Equipe Veritas" },
  { title: "Diversificação internacional na prática", date: "Toda quinta · 20h", speaker: "Equipe Veritas" },
  { title: "Perguntas e respostas com analistas seniores", date: "Última sexta do mês · 19h", speaker: "Equipe Veritas" },
];

const GLOSSARY = [
  { term: "Spread", def: "Diferença entre o preço de compra e venda de um ativo." },
  { term: "Alavancagem", def: "Uso de capital emprestado para ampliar o tamanho de uma posição." },
  { term: "Stop Loss", def: "Ordem que encerra automaticamente uma posição para limitar perdas." },
  { term: "Take Profit", def: "Ordem que encerra automaticamente uma posição ao atingir a meta de lucro." },
  { term: "Volatilidade", def: "Intensidade da variação de preço de um ativo em determinado período." },
  { term: "Liquidez", def: "Facilidade de comprar ou vender um ativo sem impactar seu preço." },
];

const LEVEL_COLOR: Record<string, string> = { Iniciante: G, Intermediário: GOLD, Avançado: RED };
const LEVEL_BG: Record<string, string> = { Iniciante: GD, Intermediário: "rgba(201,168,76,0.1)", Avançado: RD };
const LEVEL_BORDER: Record<string, string> = { Iniciante: "rgba(0,232,122,0.2)", Intermediário: "rgba(201,168,76,0.25)", Avançado: RB };

function StatBlock({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const c = useCountUp(value);
  return (
    <div ref={c.ref} className="bento-card p-6 text-center">
      <p className="stat-value" style={{ fontSize: "2rem" }}>{c.value}{suffix}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

export default function Educacao({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  const [tab, setTab] = useState<"modulos" | "webinars" | "glossario">("modulos");
  const [level, setLevel] = useState<Level>("Todos");

  const filtered = level === "Todos" ? MODULES : MODULES.filter((m) => m.level === level);

  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><GraduationCap className="w-3 h-3" />Portal Educacional</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "20ch" }}>
            <ScrollRevealText>Aprenda a investir com os melhores especialistas</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Cursos completos, webinars ao vivo e glossário interativo para transformar você em um investidor de sucesso.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => <StatBlock key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {[
              { id: "modulos" as const, label: "Módulos de Aprendizado", icon: <PlayCircle className="w-4 h-4" /> },
              { id: "webinars" as const, label: "Webinars", icon: <Video className="w-4 h-4" /> },
              { id: "glossario" as const, label: "Glossário", icon: <BookMarked className="w-4 h-4" /> },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition"
                style={{
                  background: tab === t.id ? BD : "transparent",
                  border: `1px solid ${tab === t.id ? BB : BORDER}`,
                  color: tab === t.id ? B : MFG,
                  fontSize: "0.8125rem", fontWeight: 700,
                }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {tab === "modulos" && (
            <>
              <div className="flex flex-wrap gap-2 mb-8">
                {(["Todos", "Iniciante", "Intermediário", "Avançado"] as Level[]).map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className="px-3.5 py-1.5 rounded-full transition"
                    style={{
                      background: level === l ? B : "transparent",
                      border: `1px solid ${level === l ? B : BORDER}`,
                      color: level === l ? "#fff" : MFG,
                      fontSize: "0.75rem", fontWeight: 700,
                    }}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((m) => (
                  <div key={m.title} className="bento-card p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full" style={{ background: LEVEL_BG[m.level], border: `1px solid ${LEVEL_BORDER[m.level]}`, color: LEVEL_COLOR[m.level], fontSize: "0.625rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {m.level}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontSize: "0.6875rem", color: MFG }}>
                        <Clock className="w-3 h-3" />{m.minutes} min
                      </span>
                    </div>
                    <div>
                      <p className="card-label mb-1.5">{m.category}</p>
                      <h3 className="card-title mb-2">{m.title}</h3>
                      <p className="card-body">{m.desc}</p>
                    </div>
                    <button className="mt-auto flex items-center gap-1.5 self-start" style={{ fontSize: "0.8125rem", fontWeight: 700, color: B }}>
                      Começar <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "webinars" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WEBINARS.map((w) => (
                <div key={w.title} className="bento-card p-6 flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: BD, border: `1px solid ${BB}`, color: B }}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="card-title mb-2">{w.title}</h3>
                    <p className="card-body">{w.date} · {w.speaker}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "glossario" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GLOSSARY.map((g) => (
                <div key={g.term} className="bento-card p-5 flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: B }} />
                  <div>
                    <p className="card-title mb-1">{g.term}</p>
                    <p className="card-body">{g.def}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 text-center">
        <button onClick={() => onNavigate("planos")} className="inline-flex items-center gap-2 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
          style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
          Ver planos de participação <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </>
  );
}
