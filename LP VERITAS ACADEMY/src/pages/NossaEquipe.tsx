import { Users, ArrowRight } from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { navigate } from "../shared";

// Réplica visual fiel de https://veritasacademy.base44.app/NossaEquipe (raspado em 2026-09-10).
// Mesmo tema visual aplicado em HomeOriginal.tsx: fundo quase preto, gradiente azul-índigo,
// cards com borda sutil sem fundo colorido.

const BG = "#0a0a0a";
const WHITE = "#ffffff";
const MUTED = "#9ca3af";
const BLUE_LIGHT = "#5e90ff";
const BORDER = "rgba(31,41,55,0.5)";
const BTN_GRADIENT = "linear-gradient(to right, #2e64ff, #1f4ee6)";
const TEXT_GRADIENT = "linear-gradient(to right, #5e90ff, #1f4ee6)";

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

const TEAM = [
  { name: "Ricardo Almeida", role: "CEO & Fundador", tags: "Estratégia Corporativa · Mercados Internacionais",
    bio: "Mais de 15 anos de experiência em gestão de ativos nos mercados americano e europeu. Formado em Economia pela FGV com MBA em Finanças pela London Business School." },
  { name: "Camila Torres", role: "Chief Investment Officer", tags: "Gestão de Portfólio · Derivativos",
    bio: "Especialista em estratégias quantitativas e gestão de risco, com passagem por fundos de hedge em Nova York. Certificada CFA e com especialização em derivativos pelo MIT." },
  { name: "Gustavo Mendes", role: "Head de Tecnologia", tags: "FinTech · Automação · IA Financeira",
    bio: "Engenheiro de software com foco em sistemas financeiros de alta performance. Desenvolveu plataformas de trading algorítmico para bancos de investimento em São Paulo e Chicago." },
  { name: "Ana Beatriz Lopes", role: "Head de Compliance e Risco", tags: "Gestão de Risco · Regulação Internacional",
    bio: "Advogada especializada em direito financeiro internacional, com expertise em compliance para corretoras regulamentadas. Atua há 12 anos em auditoria de operações de mercado." },
  { name: "Felipe Rocha", role: "Analista Sênior de Mercados", tags: "Análise Técnica · Macro Global",
    bio: "Analista com foco em mercados americanos e europeus, especializado em análise macro e técnica avançada. Com mais de 10 anos de experiência operacional em renda variável internacional." },
  { name: "Mariana Vieira", role: "Head de Relacionamento com Clientes", tags: "CX · Educação Financeira · Onboarding",
    bio: "Responsável pela jornada completa do investidor na Veritas Global, do primeiro contato ao acompanhamento estratégico. Especialista em educação financeira com mais de 8 anos de experiência." },
];

function initialsOf(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default function NossaEquipe() {
  return (
    <>
      <section className="relative py-24 overflow-hidden" style={{ background: BG }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(94,144,255,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: "rgba(94,144,255,0.3)", background: "rgba(94,144,255,0.06)" }}>
            <Users className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
            <span style={{ color: BLUE_LIGHT, fontSize: "0.8125rem", fontWeight: 600 }}>Nossa Equipe</span>
          </div>
          <h1 className="mx-auto" style={{ maxWidth: "22ch", color: WHITE, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
            <ScrollRevealText>Os profissionais por trás da </ScrollRevealText>
            <span style={{ backgroundImage: TEXT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Veritas Global
            </span>
          </h1>
          <p className="mx-auto mt-5" style={{ color: MUTED, fontSize: "1.125rem", maxWidth: "56ch" }}>
            Uma equipe multidisciplinar com décadas de experiência combinada em mercados financeiros
            internacionais, tecnologia e gestão de risco.
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ background: BG, borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM.map((m) => (
              <Card key={m.name} className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(94,144,255,0.1)", border: "1px solid rgba(94,144,255,0.25)" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 900, color: BLUE_LIGHT }}>
                      {initialsOf(m.name)}
                    </span>
                  </div>
                  <div>
                    <p style={{ color: WHITE, fontSize: "0.9375rem", fontWeight: 700 }}>{m.name}</p>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: BLUE_LIGHT }}>{m.role}</p>
                  </div>
                </div>
                <p style={{ color: MUTED, fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{m.tags}</p>
                <p style={{ color: MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>{m.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: BG }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Card className="p-10">
            <h2 className="mb-3" style={{ color: WHITE, fontSize: "1.375rem", fontWeight: 700 }}>Quer fazer parte do nosso time?</h2>
            <p className="mb-6" style={{ color: MUTED, fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Buscamos profissionais apaixonados por mercados financeiros e inovação.
            </p>
            <PrimaryButton onClick={() => navigate("/carreiras")}>
              Ver vagas abertas <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </Card>
        </div>
      </section>
    </>
  );
}
