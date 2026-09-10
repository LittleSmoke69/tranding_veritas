import { useState } from "react";
import {
  GraduationCap, Video, HelpCircle, PlayCircle, Clock, ArrowRight, ArrowLeft, BookMarked,
  X, Check, XCircle, RotateCcw,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { B, BD, BB, G, GD, RED, RD, RB, GOLD, MFG, FG, BORDER, Badge, useCountUp, navigate } from "../shared";

type Level = "Todos" | "Iniciante" | "Intermediário" | "Avançado";

type QuizQuestion = { question: string; options: string[]; correct: number };

const STATS = [
  { value: 50,  suffix: "+", label: "Módulos" },
  { value: 100, suffix: "+", label: "Webinars" },
  { value: 10,  suffix: "k+", label: "Alunos" },
  { value: 95,  suffix: "%", label: "Satisfação" },
];

const QUIZ_MERCADOS: QuizQuestion[] = [
  { question: "O que determina o preço de um ativo no mercado?", options: ["O governo", "Oferta e demanda", "Bancos centrais", "Inflação"], correct: 1 },
  { question: "Qual mercado negocia ações de empresas?", options: ["Forex", "Mercado de Ações", "Commodities", "Cripto"], correct: 1 },
  { question: "O que é liquidez?", options: ["Lucro obtido", "Facilidade de comprar/vender", "Risco do ativo", "Taxa de juros"], correct: 1 },
  { question: "Qual é o objetivo principal de diversificar investimentos?", options: ["Aumentar lucros rapidamente", "Reduzir riscos", "Pagar menos impostos", "Ter mais trabalho"], correct: 1 },
  { question: "O que significa 'Bear Market'?", options: ["Mercado em alta", "Mercado em baixa prolongada", "Mercado estável", "Mercado fechado"], correct: 1 },
  { question: "Qual a diferença entre ativo e passivo?", options: ["Ativo gera renda, passivo gera despesa", "Ativo é caro, passivo é barato", "Não há diferença", "Ativo é ilegal"], correct: 0 },
  { question: "O que é um ETF?", options: ["Uma criptomoeda", "Fundo negociado em bolsa", "Taxa de câmbio", "Empréstimo bancário"], correct: 1 },
  { question: "Qual o principal risco de operar com alavancagem?", options: ["Ganhar muito rápido", "Perder mais do que investiu", "Pagar taxas altas", "Não conseguir vender"], correct: 1 },
];

const QUIZ_CANDLESTICKS: QuizQuestion[] = [
  { question: "O que o corpo do candlestick representa?", options: ["Volume negociado", "Diferença entre abertura e fechamento", "Número de trades", "Volatilidade"], correct: 1 },
  { question: "Um candlestick verde indica que:", options: ["Preço caiu", "Preço subiu", "Mercado fechou", "Alta volatilidade"], correct: 1 },
  { question: "O que é um padrão Doji?", options: ["Forte alta", "Indecisão do mercado", "Forte baixa", "Volume alto"], correct: 1 },
  { question: "A sombra superior do candlestick representa:", options: ["Preço mínimo", "Preço máximo do período", "Preço de abertura", "Volume"], correct: 1 },
  { question: "Qual padrão indica possível reversão de baixa para alta?", options: ["Estrela Cadente", "Martelo", "Marubozu de baixa", "Spinning Top"], correct: 1 },
  { question: "O que um candlestick com corpo pequeno e sombras longas indica?", options: ["Forte tendência", "Alta volatilidade e indecisão", "Mercado fechado", "Volume baixo"], correct: 1 },
  { question: "O padrão Engolfo de Alta significa:", options: ["Possível reversão de alta para baixa", "Possível reversão de baixa para alta", "Continuação de baixa", "Mercado lateral"], correct: 1 },
  { question: "Qual a importância do volume nos candlesticks?", options: ["Não tem importância", "Confirma a força do movimento", "Define o preço", "Indica horário"], correct: 1 },
  { question: "O que é um Marubozu?", options: ["Candlestick com corpo longo sem sombras", "Doji grande", "Padrão de reversão", "Erro no gráfico"], correct: 0 },
  { question: "Em qual timeframe os candlesticks são mais confiáveis?", options: ["1 minuto", "Timeframes maiores (diário/semanal)", "Não importa", "Apenas mensal"], correct: 1 },
];

const QUIZ_RISCO: QuizQuestion[] = [
  { question: "Qual o risco máximo recomendado por operação?", options: ["5%", "10%", "2%", "1%"], correct: 2 },
  { question: "O que é Risk-Reward Ratio?", options: ["Taxa de acerto", "Relação entre risco e ganho potencial", "Número de trades", "Volatilidade"], correct: 1 },
  { question: "Por que diversificar ativos é importante?", options: ["Para ter mais trabalho", "Para reduzir risco total da carteira", "Para pagar mais taxas", "Não é importante"], correct: 1 },
  { question: "O que é Position Sizing?", options: ["Tamanho do monitor", "Cálculo do tamanho correto da posição", "Número de ativos", "Taxa de corretagem"], correct: 1 },
  { question: "Qual o Risk-Reward mínimo recomendado?", options: ["1:1", "1:2", "2:1", "1:5"], correct: 1 },
  { question: "O que é Drawdown?", options: ["Lucro acumulado", "Perda máxima da carteira", "Gráfico de linha", "Stop loss"], correct: 1 },
  { question: "Qual estratégia usar após sequência de perdas?", options: ["Aumentar posições para recuperar", "Reduzir tamanho das posições", "Parar de operar", "Mudar de mercado"], correct: 1 },
  { question: "O que são ativos correlacionados?", options: ["Ativos caros", "Ativos que se movem de forma similar", "Ativos estrangeiros", "Ativos líquidos"], correct: 1 },
  { question: "Por que evitar posições correlacionadas?", options: ["São ilegais", "Aumentam o risco concentrado", "São menos lucrativas", "Não devem ser evitadas"], correct: 1 },
  { question: "Qual a fórmula básica de Position Sizing?", options: ["Capital total / Número de trades", "Risco em $ / Distância do stop loss", "Preço do ativo x 2", "Volume diário / 10"], correct: 1 },
  { question: "O que fazer quando o drawdown atinge 10%?", options: ["Continuar normalmente", "Revisar estratégia e reduzir risco", "Aumentar alavancagem", "Desistir"], correct: 1 },
  { question: "Qual a importância do Stop Loss?", options: ["Garantir lucros", "Limitar perdas e proteger capital", "Aumentar ganhos", "Nenhuma"], correct: 1 },
];

const MODULES: { title: string; desc: string; level: Level; category: string; minutes: number; quiz?: QuizQuestion[] }[] = [
  { title: "Introdução aos Mercados Financeiros", desc: "Aprenda os fundamentos dos mercados financeiros e como começar a investir.", level: "Iniciante", category: "Mercados Financeiros", minutes: 45, quiz: QUIZ_MERCADOS },
  { title: "Mentalidade para Prosperar", desc: "Construa uma base sólida de disciplina e psicologia para o seu sucesso financeiro.", level: "Iniciante", category: "Psicologia", minutes: 35 },
  { title: "Renda Fixa Internacional", desc: "Segurança e previsibilidade para sua carteira com ativos de renda fixa global.", level: "Iniciante", category: "Renda Fixa", minutes: 40 },
  { title: "Análise Técnica: Candlesticks", desc: "Domine a leitura de gráficos de candlestick para identificar padrões.", level: "Intermediário", category: "Análise Técnica", minutes: 60, quiz: QUIZ_CANDLESTICKS },
  { title: "Renda Variável e Diversificação", desc: "Potencial de crescimento com gestão de risco em ações e ETFs internacionais.", level: "Intermediário", category: "Renda Variável", minutes: 55 },
  { title: "Investimento no Exterior", desc: "Dolarize seu patrimônio e diversifique globalmente com segurança.", level: "Intermediário", category: "Câmbio", minutes: 50 },
  { title: "Gestão de Risco Avançada", desc: "Técnicas profissionais de gestão de risco e preservação de capital.", level: "Avançado", category: "Gestão de Risco", minutes: 90, quiz: QUIZ_RISCO },
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

// ── Modal de Quiz ────────────────────────────────────────────────────────────
function QuizModal({ moduleTitle, quiz, onClose }: { moduleTitle: string; quiz: QuizQuestion[]; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.length).fill(null));
  const [finished, setFinished] = useState(false);

  const pick = (i: number) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
  };

  const restart = () => {
    setStep(0);
    setAnswers(Array(quiz.length).fill(null));
    setFinished(false);
  };

  const score = answers.reduce((acc: number, a, i) => acc + (a === quiz[i].correct ? 1 : 0), 0);
  const pct = Math.round((score / quiz.length) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto u-scroll bento-card p-8" style={{ background: "#0b0f1c" }}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="card-title text-xl">{moduleTitle}</h2>
          <button onClick={onClose} className="shrink-0 p-1 rounded-lg hover:bg-white/5" style={{ color: MFG }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {!finished ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontSize: "0.8125rem", color: MFG }}>Questão {step + 1} de {quiz.length}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: BORDER }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((step + 1) / quiz.length) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, #f5d78e)` }} />
            </div>

            <h3 className="mb-5" style={{ fontSize: "1.375rem", fontWeight: 700, color: FG }}>{quiz[step].question}</h3>

            <div className="space-y-3 mb-6">
              {quiz[step].options.map((opt, i) => {
                const selected = answers[step] === i;
                return (
                  <button key={i} onClick={() => pick(i)}
                    className="w-full text-left p-4 rounded-lg border-2 transition-all"
                    style={{ borderColor: selected ? GOLD : BORDER, background: selected ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: selected ? GOLD : BORDER, background: selected ? GOLD : "transparent" }}>
                        {selected && <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#000" }} />}
                      </span>
                      <span style={{ color: FG, fontSize: "0.9375rem" }}>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
                className="flex items-center gap-1.5 disabled:opacity-30" style={{ fontSize: "0.8125rem", fontWeight: 600, color: MFG }}>
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                onClick={() => (step === quiz.length - 1 ? setFinished(true) : setStep((s) => s + 1))}
                disabled={answers[step] === null}
                className="px-6 py-2.5 rounded-xl disabled:opacity-40"
                style={{ background: GOLD, color: "#1a1204", fontSize: "0.875rem", fontWeight: 700 }}>
                {step === quiz.length - 1 ? "Ver Resultado" : "Próxima"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <p style={{ fontSize: "0.875rem", fontWeight: 700, color: score / quiz.length >= 0.6 ? G : RED }}>
                {score / quiz.length >= 0.6 ? "Parabéns!" : "Continue tentando!"}
              </p>
              <p className="mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.125rem", fontWeight: 700, color: FG }}>
                Você acertou {score} de {quiz.length} questões
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.5rem", fontWeight: 900, color: score / quiz.length >= 0.6 ? G : RED }}>
                {pct}%
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {quiz.map((q, i) => {
                const ok = answers[i] === q.correct;
                return (
                  <div key={i} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
                    <div className="flex items-start gap-2">
                      {ok ? <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: G }} /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: RED }} />}
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: FG }}>{q.question}</p>
                        {!ok && (
                          <p className="mt-1" style={{ fontSize: "0.8125rem", color: G }}>
                            Resposta correta: {q.options[q.correct]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={restart} className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl" style={{ border: `1px solid ${BORDER}`, color: FG, fontSize: "0.875rem", fontWeight: 700 }}>
                <RotateCcw className="w-4 h-4" /> Tentar novamente
              </button>
              <button onClick={onClose} className="flex-1 py-3 rounded-xl" style={{ background: GOLD, color: "#1a1204", fontSize: "0.875rem", fontWeight: 700 }}>
                Concluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Educacao() {
  const [tab, setTab] = useState<"modulos" | "webinars" | "glossario">("modulos");
  const [level, setLevel] = useState<Level>("Todos");
  const [activeQuiz, setActiveQuiz] = useState<{ title: string; quiz: QuizQuestion[] } | null>(null);

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
                    <button
                      onClick={() => m.quiz && setActiveQuiz({ title: m.title, quiz: m.quiz })}
                      disabled={!m.quiz}
                      className="mt-auto flex items-center gap-1.5 self-start disabled:opacity-40"
                      style={{ fontSize: "0.8125rem", fontWeight: 700, color: B }}>
                      {m.quiz ? "Fazer quiz" : "Em breve"} <ArrowRight className="w-3.5 h-3.5" />
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
        <button onClick={() => navigate("/planos")} className="inline-flex items-center gap-2 px-7 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105"
          style={{ background: B, color: "#fff", fontSize: "0.9375rem", fontWeight: 700, boxShadow: "0 0 40px var(--primary-glow)" }}>
          Ver planos de participação <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {activeQuiz && (
        <QuizModal moduleTitle={activeQuiz.title} quiz={activeQuiz.quiz} onClose={() => setActiveQuiz(null)} />
      )}
    </>
  );
}
