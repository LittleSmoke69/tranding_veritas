import {
  TrendingUp, Search, Globe, BarChart3, Check, ArrowRight, FileText, Bell, FileSearch, Users,
} from "lucide-react";
import { navigate } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/Analises (raspado em 2026-09-10).
// Segue o novo tema visual introduzido em HomeOriginal.tsx (tokens locais próprios,
// sem os tokens de marca bento-card/B/BD/etc do restante do site).

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

function SectionHead({ eyebrow, title, gradientPart, sub }: { eyebrow?: string; title: string; gradientPart?: string; sub?: string }) {
  return (
    <div className="text-center mb-14">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
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

function PrimaryButton({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const cls = "inline-flex items-center gap-2.5 rounded-full hover:opacity-90 transition-opacity";
  const style: React.CSSProperties = { backgroundImage: BTN_GRADIENT, color: WHITE, fontSize: "0.875rem", fontWeight: 600, padding: "1rem 2rem" };
  return href
    ? <a href={href} className={cls} style={style}>{children}</a>
    : <button onClick={onClick} className={cls} style={style}>{children}</button>;
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroAnalises() {
  return (
    <section className="relative py-28 overflow-hidden" style={{ background: BG }}>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Eyebrow>Análises de Mercado</Eyebrow>
        <h1 className="mx-auto mb-6" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(2rem, 5.5vw, 3.5rem)", lineHeight: 1.1, maxWidth: "20ch" }}>
          Inteligência de mercado para{" "}
          <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>decisões precisas</span>
        </h1>
        <p className="mx-auto" style={{ color: MUTED, fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "56ch" }}>
          Nossa equipe de analistas combina técnicas avançadas de análise para entregar visões claras e
          acionáveis sobre os mercados globais.
        </p>
      </div>
    </section>
  );
}

// ── Nossas abordagens analíticas ──────────────────────────────────────────────
const ABORDAGENS = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Análise Técnica",
    desc: "Utilizamos padrões gráficos, indicadores avançados (RSI, MACD, Bandas de Bollinger) e price action para identificar pontos de entrada e saída com alta precisão.",
    items: [
      "Leitura de gráficos em múltiplos timeframes",
      "Identificação de suportes e resistências",
      "Padrões de candlestick e formações clássicas",
      "Volume e fluxo de ordens institucional",
    ],
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Análise Fundamentalista",
    desc: "Avaliamos os fundamentos das empresas e economias globais — balanços, fluxo de caixa, valuation, ciclos macroeconômicos e política monetária — para decisões de longo prazo.",
    items: [
      "Análise de demonstrações financeiras",
      "Valuation por múltiplos e DCF",
      "Cenários macroeconômicos globais",
      "Calendário de resultados corporativos",
    ],
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Análise Macroeconômica",
    desc: "Monitoramos indicadores econômicos globais, decisões de bancos centrais, dados de emprego, inflação e ciclos de mercado para antecipar movimentos de grande magnitude.",
    items: [
      "Fed, BCE e política monetária global",
      "Dados de inflação e emprego (NFP, CPI)",
      "Mercado de títulos e curvas de juros",
      "Correlação entre classes de ativos",
    ],
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Análise Quantitativa",
    desc: "Nossos modelos quantitativos processam milhares de dados em tempo real, identificando padrões estatísticos e oportunidades que seriam impossíveis de detectar manualmente.",
    items: [
      "Backtesting de estratégias históricas",
      "Modelos estatísticos de previsão",
      "Algoritmos de detecção de anomalias",
      "Análise de correlação entre ativos",
    ],
  },
];

function AbordagensAnaliticas() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead title="Nossas abordagens analíticas" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ABORDAGENS.map((a) => (
            <Card key={a.title} className="p-8 flex flex-col gap-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                {a.icon}
              </div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.25rem", fontWeight: 700 }}>{a.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>{a.desc}</p>
              </div>
              <ul className="space-y-2.5 mt-auto pt-2">
                {a.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: BLUE_LIGHT }} />
                    <span style={{ fontSize: "0.875rem", color: MUTED }}>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── O que você recebe ─────────────────────────────────────────────────────────
const ENTREGAS = [
  { icon: <FileText className="w-5 h-5" />, title: "Relatório Semanal de Mercado", desc: "Panorama completo dos principais movimentos da semana com perspectivas para os próximos dias." },
  { icon: <Bell className="w-5 h-5" />, title: "Alertas em Tempo Real", desc: "Notificações imediatas sobre eventos relevantes, rompimentos técnicos e oportunidades identificadas." },
  { icon: <FileSearch className="w-5 h-5" />, title: "Análise de Ativos sob Demanda", desc: "Análise detalhada de qualquer ativo de interesse do cliente mediante solicitação." },
  { icon: <Users className="w-5 h-5" />, title: "Reuniões de Estratégia", desc: "Apresentação periódica dos resultados e alinhamento das estratégias conforme o plano contratado." },
];

function OQueVoceRecebe() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead title="O que você recebe" sub="Entregas concretas incluídas em todos os planos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ENTREGAS.map((e) => (
            <Card key={e.title} className="p-7 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
                {e.icon}
              </div>
              <div>
                <h3 className="mb-2" style={{ color: WHITE, fontSize: "1.0625rem", fontWeight: 700 }}>{e.title}</h3>
                <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>{e.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA final ──────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG }}>
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="mx-auto mb-5" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, maxWidth: "24ch" }}>
          Acesse análises profissionais agora
        </h2>
        <p className="mx-auto mb-10" style={{ color: MUTED, fontSize: "1.125rem" }}>
          Escolha um plano e tenha acesso imediato à nossa inteligência de mercado.
        </p>
        <PrimaryButton onClick={() => navigate("/planos")}>Ver planos disponíveis <ArrowRight className="w-4 h-4" /></PrimaryButton>
      </div>
    </section>
  );
}

// ── Página completa ────────────────────────────────────────────────────────────
export default function Analises() {
  return (
    <>
      <HeroAnalises />
      <AbordagensAnaliticas />
      <OQueVoceRecebe />
      <CTAFinal />
    </>
  );
}
