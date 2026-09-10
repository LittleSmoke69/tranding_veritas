import { useState } from "react";
import {
  GraduationCap, Video, HelpCircle, PlayCircle, Clock, ArrowRight, ArrowLeft, BookMarked,
  X, Check, XCircle, RotateCcw, Target,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { useCountUp, type LandingView } from "../shared";

// Reestilização visual completa para o novo tema (mesmo padrão de tokens e
// componentes auxiliares de HomeOriginal.tsx: fundo quase preto, gradiente
// azul-índigo, cards com borda sutil e fundo transparente). Toda a lógica de
// dados e do quiz interativo (perguntas, correção, navegação, resultado) foi
// 100% preservada — só a camada visual foi trocada.

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

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ borderColor: BORDER, background: "transparent", ...style }}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2.5 rounded-full hover:opacity-90 transition-all hover:scale-105"
      style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.9375rem", fontWeight: 700, padding: "1rem 1.75rem", boxShadow: "0 0 40px rgba(46,100,255,0.35)" }}>
      {children}
    </button>
  );
}

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

const LEVEL_COLOR: Record<string, string> = { Iniciante: "#22c55e", Intermediário: "#f59e0b", Avançado: "#ef4444" };
const LEVEL_BG: Record<string, string> = { Iniciante: "rgba(34,197,94,0.12)", Intermediário: "rgba(245,158,11,0.12)", Avançado: "rgba(239,68,68,0.12)" };
const LEVEL_BORDER: Record<string, string> = { Iniciante: "rgba(34,197,94,0.25)", Intermediário: "rgba(245,158,11,0.25)", Avançado: "rgba(239,68,68,0.25)" };
const LEVEL_LABEL: Record<Level, string> = { Todos: "Todos os Níveis", Iniciante: "Iniciante", Intermediário: "Intermediário", Avançado: "Avançado" };

// ── Progresso do aluno (persistido localmente no navegador) ──────────────────
type ProgressMap = Record<string, { started: boolean; completed: boolean; pct: number }>;
const PROGRESS_KEY = "veritas_edu_progress_v1";

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(p: ProgressMap) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    // localStorage indisponível — progresso segue apenas em memória nesta sessão
  }
}

function StatBlock({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { value: v, ref } = useCountUp(value);
  return (
    <div ref={ref} className="rounded-2xl border p-6 text-center" style={{ borderColor: BORDER, background: "transparent" }}>
      <p style={{ fontSize: "2rem", fontWeight: 900, color: WHITE }}>{v}{suffix}</p>
      <p style={{ color: MUTED, fontSize: "0.875rem" }}>{label}</p>
    </div>
  );
}

function ProgressStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Card className="p-6 text-center flex flex-col items-center gap-3">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>{icon}</div>
      <p style={{ fontSize: "1.5rem", fontWeight: 900, color: WHITE }}>{value}</p>
      <p style={{ color: MUTED, fontSize: "0.8125rem" }}>{label}</p>
    </Card>
  );
}

// ── Modal de Quiz ────────────────────────────────────────────────────────────
function QuizModal({ moduleTitle, quiz, onClose, onFinish }: { moduleTitle: string; quiz: QuizQuestion[]; onClose: () => void; onFinish: (pct: number) => void }) {
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
  const passed = score / quiz.length >= 0.6;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-8" style={{ borderColor: BORDER, background: BG }}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-xl" style={{ color: WHITE, fontWeight: 700 }}>{moduleTitle}</h2>
          <button onClick={onClose} className="shrink-0 p-1 rounded-lg hover:bg-white/5" style={{ color: MUTED }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {!finished ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontSize: "0.8125rem", color: MUTED }}>Questão {step + 1} de {quiz.length}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: BORDER }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((step + 1) / quiz.length) * 100}%`, backgroundImage: TEXT_GRADIENT }} />
            </div>

            <h3 className="mb-5" style={{ fontSize: "1.375rem", fontWeight: 700, color: WHITE }}>{quiz[step].question}</h3>

            <div className="space-y-3 mb-6">
              {quiz[step].options.map((opt, i) => {
                const selected = answers[step] === i;
                return (
                  <button key={i} onClick={() => pick(i)}
                    className="w-full text-left p-4 rounded-lg border-2 transition-all"
                    style={{ borderColor: selected ? BLUE_LIGHT : BORDER, background: selected ? "rgba(94,144,255,0.1)" : "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: selected ? BLUE_LIGHT : BORDER, background: selected ? BLUE_LIGHT : "transparent" }}>
                        {selected && <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fff" }} />}
                      </span>
                      <span style={{ color: WHITE, fontSize: "0.9375rem" }}>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
                className="flex items-center gap-1.5 disabled:opacity-30" style={{ fontSize: "0.8125rem", fontWeight: 600, color: MUTED }}>
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                onClick={() => {
                  if (step === quiz.length - 1) {
                    setFinished(true);
                    onFinish(pct);
                  } else {
                    setStep((s) => s + 1);
                  }
                }}
                disabled={answers[step] === null}
                className="px-6 py-2.5 rounded-xl disabled:opacity-40"
                style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.875rem", fontWeight: 700 }}>
                {step === quiz.length - 1 ? "Ver Resultado" : "Próxima"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <p style={{ fontSize: "0.875rem", fontWeight: 700, color: passed ? "#22c55e" : "#ef4444" }}>
                {passed ? "Parabéns!" : "Continue tentando!"}
              </p>
              <p className="mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.125rem", fontWeight: 700, color: WHITE }}>
                Você acertou {score} de {quiz.length} questões
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.5rem", fontWeight: 900, color: passed ? "#22c55e" : "#ef4444" }}>
                {pct}%
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {quiz.map((q, i) => {
                const ok = answers[i] === q.correct;
                return (
                  <div key={i} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
                    <div className="flex items-start gap-2">
                      {ok ? <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22c55e" }} /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#ef4444" }} />}
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: WHITE }}>{q.question}</p>
                        {!ok && (
                          <p className="mt-1" style={{ fontSize: "0.8125rem", color: "#22c55e" }}>
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
              <button onClick={restart} className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl border" style={{ borderColor: BORDER, color: WHITE, fontSize: "0.875rem", fontWeight: 700 }}>
                <RotateCcw className="w-4 h-4" /> Tentar novamente
              </button>
              <button onClick={onClose} className="flex-1 py-3 rounded-xl" style={{ backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.875rem", fontWeight: 700 }}>
                Concluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Educacao({ onNavigate }: { onNavigate: (v: LandingView) => void }) {
  const [tab, setTab] = useState<"modulos" | "webinars" | "glossario">("modulos");
  const [level, setLevel] = useState<Level>("Todos");
  const [activeQuiz, setActiveQuiz] = useState<{ title: string; quiz: QuizQuestion[] } | null>(null);
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  const filtered = level === "Todos" ? MODULES : MODULES.filter((m) => m.level === level);

  const startQuiz = (m: (typeof MODULES)[number]) => {
    if (!m.quiz) return;
    setProgress((prev) => {
      if (prev[m.title]?.started) return prev;
      const next: ProgressMap = { ...prev, [m.title]: { started: true, completed: prev[m.title]?.completed ?? false, pct: prev[m.title]?.pct ?? 0 } };
      saveProgress(next);
      return next;
    });
    setActiveQuiz({ title: m.title, quiz: m.quiz });
  };

  const finishQuiz = (title: string, pct: number) => {
    setProgress((prev) => {
      const next: ProgressMap = { ...prev, [title]: { started: true, completed: true, pct: Math.max(prev[title]?.pct ?? 0, pct) } };
      saveProgress(next);
      return next;
    });
  };

  const completedModules = MODULES.filter((m) => progress[m.title]?.completed);
  const startedModules = MODULES.filter((m) => progress[m.title]?.started);
  const horasEstudo = Math.round(completedModules.reduce((acc, m) => acc + m.minutes, 0) / 60);
  const mediaQuizzes = completedModules.length
    ? Math.round(completedModules.reduce((acc, m) => acc + (progress[m.title]?.pct ?? 0), 0) / completedModules.length)
    : 0;

  const PROGRESSO = [
    { icon: <Check className="w-5 h-5" />, value: `${completedModules.length}`, label: "Módulos Concluídos" },
    { icon: <Clock className="w-5 h-5" />, value: `${horasEstudo}h`, label: "Tempo de Estudo" },
    { icon: <Target className="w-5 h-5" />, value: `${mediaQuizzes}%`, label: "Média nos Quizzes" },
    { icon: <PlayCircle className="w-5 h-5" />, value: `${startedModules.length}`, label: "Total Iniciados" },
  ];

  return (
    <>
      <section className="relative py-24 overflow-hidden" style={{ background: BG }}>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2" style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
              <GraduationCap className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
              <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Portal Educacional</span>
            </div>
          </div>
          <h1 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.15, maxWidth: "20ch" }}>
            <ScrollRevealText>Aprenda a investir com os </ScrollRevealText>
            <ScrollRevealText style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>melhores especialistas</ScrollRevealText>
          </h1>
          <p className="mx-auto mt-4" style={{ color: MUTED, fontSize: "1.125rem", maxWidth: "56ch" }}>
            Cursos completos, webinars ao vivo, glossário interativo e muito mais para transformar você em um investidor de sucesso.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => <StatBlock key={s.label} {...s} />)}
          </div>

          <div className="mt-14">
            <Eyebrow>Seu Progresso</Eyebrow>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PROGRESSO.map((p) => <ProgressStat key={p.label} {...p} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER, background: BG }}>
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
                  background: tab === t.id ? "rgba(94,144,255,0.1)" : "transparent",
                  border: `1px solid ${tab === t.id ? "rgba(94,144,255,0.3)" : BORDER}`,
                  color: tab === t.id ? BLUE_LIGHT : MUTED,
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
                    style={level === l
                      ? { backgroundImage: BTN_GRADIENT, border: "1px solid transparent", color: WHITE, fontSize: "0.75rem", fontWeight: 700 }
                      : { background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, fontSize: "0.75rem", fontWeight: 700 }}>
                    {LEVEL_LABEL[l]}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((m) => (
                  <Card key={m.title} className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full" style={{ background: LEVEL_BG[m.level], border: `1px solid ${LEVEL_BORDER[m.level]}`, color: LEVEL_COLOR[m.level], fontSize: "0.625rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {m.level}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontSize: "0.6875rem", color: MUTED }}>
                        <Clock className="w-3 h-3" />{m.minutes} min
                      </span>
                    </div>
                    <div>
                      <p className="mb-1.5" style={{ color: BLUE_LIGHT, fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.category}</p>
                      <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{m.title}</h3>
                      <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{m.desc}</p>
                    </div>
                    <button
                      onClick={() => startQuiz(m)}
                      disabled={!m.quiz}
                      className="mt-auto flex items-center gap-1.5 self-start disabled:opacity-40"
                      style={{ fontSize: "0.8125rem", fontWeight: 700, color: BLUE_LIGHT }}>
                      {m.quiz ? "Fazer quiz" : "Em breve"} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Card>
                ))}
              </div>
            </>
          )}

          {tab === "webinars" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WEBINARS.map((w) => (
                <Card key={w.title} className="p-6 flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{w.title}</h3>
                    <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{w.date} · {w.speaker}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab === "glossario" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GLOSSARY.map((g) => (
                <Card key={g.term} className="p-5 flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: BLUE_LIGHT }} />
                  <div>
                    <p className="mb-1" style={{ color: WHITE, fontSize: "0.9375rem", fontWeight: 700 }}>{g.term}</p>
                    <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{g.def}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 text-center" style={{ background: BG }}>
        <PrimaryButton onClick={() => onNavigate("planos")}>
          Ver planos de participação <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </section>

      {activeQuiz && (
        <QuizModal
          moduleTitle={activeQuiz.title}
          quiz={activeQuiz.quiz}
          onClose={() => setActiveQuiz(null)}
          onFinish={(pct) => finishQuiz(activeQuiz.title, pct)}
        />
      )}
    </>
  );
}
