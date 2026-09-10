import { Users, ArrowRight } from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { B, BD, BB, BORDER, Badge, navigate } from "../shared";

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
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><Users className="w-3 h-3" />Nossa Equipe</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "22ch" }}>
            <ScrollRevealText>Os profissionais por trás da Veritas Global</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Uma equipe multidisciplinar com décadas de experiência combinada em mercados financeiros internacionais, tecnologia e gestão de risco.
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM.map((m) => (
              <div key={m.name} className="bento-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: BD, border: `1px solid ${BB}` }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 900, color: B }}>{initialsOf(m.name)}</span>
                  </div>
                  <div>
                    <p className="card-title" style={{ fontSize: "0.9375rem" }}>{m.name}</p>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: B }}>{m.role}</p>
                  </div>
                </div>
                <p className="card-label" style={{ fontSize: "0.625rem" }}>{m.tags}</p>
                <p className="card-body">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bento-card p-10">
            <h2 className="card-title text-xl mb-3">Quer fazer parte do nosso time?</h2>
            <p className="card-body mb-6">Buscamos profissionais apaixonados por mercados financeiros e inovação.</p>
            <button onClick={() => navigate("/carreiras")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:opacity-90"
              style={{ background: B, color: "#fff", fontSize: "0.875rem", fontWeight: 700, boxShadow: "0 0 24px var(--primary-glow)" }}>
              Ver vagas abertas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
