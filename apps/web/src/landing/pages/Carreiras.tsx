import {
  Briefcase, TrendingUp, Globe, Sparkles, HeartPulse, Users, Handshake,
  MapPin, Building, Laptop, ArrowRight, Mail,
} from "lucide-react";
import ScrollRevealText from "../components/ScrollRevealText";
import { B, BD, BB, MFG, FG, BORDER, IBox, Badge, SectionHeader } from "../shared";

const BENEFITS = [
  { icon: <TrendingUp className="w-5 h-5" />, label: "Participação nos resultados" },
  { icon: <Globe className="w-5 h-5" />, label: "Acesso a mercados globais" },
  { icon: <Sparkles className="w-5 h-5" />, label: "Ambiente inovador e dinâmico" },
  { icon: <HeartPulse className="w-5 h-5" />, label: "Plano de saúde completo" },
  { icon: <Users className="w-5 h-5" />, label: "Cultura de colaboração" },
  { icon: <Handshake className="w-5 h-5" />, label: "Desenvolvimento contínuo" },
];

const JOBS = [
  { dept: "Investimentos", title: "Analista de Mercados Financeiros", city: "São Paulo, SP", mode: "Presencial / Híbrido" },
  { dept: "Tecnologia", title: "Desenvolvedor FinTech (Full Stack)", city: "Qualquer lugar do Brasil", mode: "Remoto" },
  { dept: "Relacionamento", title: "Consultor de Investimentos", city: "São Paulo, SP", mode: "Híbrido" },
];

export default function Carreiras() {
  return (
    <>
      <section className="relative py-24 overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,172,254,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-5 flex justify-center"><Badge color="blue"><Briefcase className="w-3 h-3" />Trabalhe Conosco</Badge></div>
          <h1 className="section-heading-xl mx-auto" style={{ maxWidth: "22ch" }}>
            <ScrollRevealText>Construa sua carreira no mercado global</ScrollRevealText>
          </h1>
          <p className="section-body-center mt-4">
            Na Veritas Global, você trabalhará com profissionais de alto nível, tecnologia de ponta e um ambiente que valoriza resultado, transparência e crescimento contínuo.
          </p>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader center badge="Benefícios" heading="O que oferecemos" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.label} className="bento-card p-6 flex flex-col items-center text-center gap-3">
                <IBox color="green">{b.icon}</IBox>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: FG }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--muted)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader center badge="Oportunidades" heading="Vagas abertas" />
          <div className="space-y-3">
            {JOBS.map((j) => (
              <div key={j.title} className="bento-card p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <span className="px-3 py-1 rounded-full self-start" style={{ background: BD, border: `1px solid ${BB}`, color: B, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {j.dept}
                </span>
                <div className="flex-1">
                  <h3 className="card-title mb-1.5">{j.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1" style={{ fontSize: "0.75rem", color: MFG }}>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{j.city}</span>
                    <span className="flex items-center gap-1">
                      {j.mode === "Remoto" ? <Laptop className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                      {j.mode}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl shrink-0" style={{ border: `1px solid ${BORDER}`, color: FG, fontSize: "0.8125rem", fontWeight: 700 }}>
                  Ver vaga <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bento-card p-10">
            <div className="mb-4 flex justify-center"><IBox color="gold"><Mail className="w-5 h-5" /></IBox></div>
            <h2 className="card-title text-xl mb-3">Não encontrou a vaga ideal?</h2>
            <p className="card-body mb-6 mx-auto" style={{ maxWidth: "48ch" }}>
              Envie seu currículo para <strong style={{ color: FG }}>carreiras@veritasglobal.com</strong> e entraremos em contato quando surgir uma oportunidade alinhada ao seu perfil.
            </p>
            <a href="mailto:carreiras@veritasglobal.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:opacity-90"
              style={{ background: B, color: "#fff", fontSize: "0.875rem", fontWeight: 700, boxShadow: "0 0 24px var(--primary-glow)" }}>
              <Mail className="w-4 h-4" /> Enviar currículo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
