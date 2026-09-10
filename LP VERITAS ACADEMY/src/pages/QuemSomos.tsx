import { Globe, ShieldCheck, TrendingUp, Users, Building2 } from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { navigate } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/QuemSomos (raspado em 2026-09-10).
// Mesmo tema visual aplicado em HomeOriginal.tsx — tokens locais, sem depender
// dos tokens de marca do resto do site.

const BG = "#0a0a0a";
const WHITE = "#ffffff";
const MUTED = "#9ca3af";
const BLUE_LIGHT = "#5e90ff";
const BORDER = "rgba(31,41,55,0.5)";
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
      <h2 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.15, maxWidth: "26ch" }}>
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

// ── Nossos Pilares ─────────────────────────────────────────────────────────────
const PILLARS = [
  { icon: <Globe className="w-6 h-6" />, title: "Presença Global",
    desc: "Operamos nos principais mercados financeiros internacionais, com acesso direto às bolsas americanas, europeias e asiáticas." },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Gestão Responsável",
    desc: "Cada operação é conduzida com rigorosos protocolos de gestão de risco, priorizando a proteção do capital do investidor." },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Resultados Consistentes",
    desc: "Nossa metodologia é orientada por dados e inteligência de mercado, buscando performance sustentável no longo prazo." },
  { icon: <Users className="w-6 h-6" />, title: "Pessoas em Primeiro Lugar",
    desc: "Acreditamos que o sucesso financeiro dos nossos clientes é a verdadeira medida do nosso trabalho." },
];

// ── Nossa Trajetória ───────────────────────────────────────────────────────────
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
      {/* Hero */}
      <section className="relative py-24 overflow-hidden" style={{ background: BG }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(94,144,255,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
              style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
              <Building2 className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
              <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>A Veritas Global</span>
            </div>
          </div>
          <h1 className="mx-auto" style={{ color: WHITE, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.15, maxWidth: "22ch" }}>
            <ScrollRevealText>Conectando investidores brasileiros ao mercado global</ScrollRevealText>
          </h1>
          <p className="mx-auto mt-4" style={{ color: MUTED, fontSize: "1.125rem", maxWidth: "56ch" }}>
            Somos uma gestora especializada em mercados financeiros internacionais, comprometida com a educação,
            transparência e o crescimento sustentável do patrimônio dos nossos clientes.
          </p>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-4">
          <Card className="p-8 flex flex-col gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(94,144,255,0.1)", color: BLUE_LIGHT }}>
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="mb-3" style={{ color: WHITE, fontSize: "1.25rem", fontWeight: 700 }}>Nossa Missão</h2>
              <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>
                Democratizar o acesso aos mercados financeiros internacionais para o investidor brasileiro,
                oferecendo estratégias profissionais, tecnologia de ponta e acompanhamento próximo —
                independentemente do tamanho do capital inicial.
              </p>
            </div>
          </Card>
          <Card className="p-8 flex flex-col gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="mb-3" style={{ color: WHITE, fontSize: "1.25rem", fontWeight: 700 }}>Nossa Visão</h2>
              <p style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.7 }}>
                Ser a principal referência em gestão de investimentos internacionais para o público brasileiro,
                reconhecida pela integridade operacional, transparência e pela capacidade de gerar crescimento
                real e consistente para nossos clientes.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Nossos Pilares */}
      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead eyebrow="Nossos Pilares" title="Os princípios que guiam" gradientPart="cada decisão"
            sub="E cada operação da Veritas Global." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((p) => (
              <Card key={p.title} className="p-7 flex flex-col gap-4">
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

      {/* Nossa Trajetória */}
      <section className="py-24" style={{ background: BG }}>
        <div className="max-w-3xl mx-auto px-6">
          <SectionHead eyebrow="Nossa Trajetória" title="Uma década construindo" gradientPart="expertise"
            sub="E resultados no mercado global." />
          <div className="relative pl-8">
            <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: BORDER }} />
            <div className="space-y-8">
              {TIMELINE.map((t) => (
                <div key={t.year} className="relative">
                  <span className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full" style={{ background: BLUE_LIGHT, boxShadow: "0 0 0 4px rgba(94,144,255,0.15)" }} />
                  <p style={{ fontSize: "0.8125rem", fontWeight: 800, color: BLUE_LIGHT, letterSpacing: "0.04em" }}>{t.year}</p>
                  <p className="mt-1" style={{ fontSize: "0.9375rem", fontWeight: 500, color: WHITE }}>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final: valores + link para Nossa Equipe */}
      <section className="py-16" style={{ background: BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <Card className="p-8 flex flex-wrap items-center justify-center gap-3">
            {["Presença Global", "Gestão Responsável", "Resultados Consistentes", "Pessoas em Primeiro Lugar"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full border"
                style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)", color: BLUE_LIGHT, fontSize: "0.75rem", fontWeight: 700 }}>
                {t}
              </span>
            ))}
          </Card>
          <button onClick={() => navigate("/nossa-equipe")} className="block mx-auto mt-4" style={{ fontSize: "0.75rem", fontWeight: 500, color: MUTED }}>
            Quer conhecer as pessoas por trás da Veritas Global? <span style={{ color: BLUE_LIGHT, fontWeight: 700 }}>Veja nossa equipe →</span>
          </button>
        </div>
      </section>
    </>
  );
}
