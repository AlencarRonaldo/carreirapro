"use client"

import { useRouter } from "next/navigation"

const plans = [
  {
    key: 'starter' as const,
    name: 'Starter',
    price: 'Grátis',
    benefits: [
      '2 currículos completos',
      '5 templates ATS',
      '3 análises/mês',
      'PDF com marca d’água',
    ],
    cta: '/login?plan=starter',
  },
  {
    key: 'pro' as const,
    name: 'Pro',
    price: 'R$ 29,90/mês',
    highlight: true,
    benefits: [
      'Ilimitado + templates premium',
      'IA avançada e análise ATS completa',
      'Download sem marca d’água',
    ],
    cta: '/login?plan=pro',
  },
  {
    key: 'team' as const,
    name: 'Team',
    price: 'R$ 49,90/mês',
    benefits: [
      'Tudo do Pro + 5 usuários',
      'Dashboard de equipe e integrações',
    ],
    cta: '/login?plan=team',
  },
]

export default function PlansPage() {
  const router = useRouter()
  return (
    <main className="min-h-dvh p-6">
      <section className="mx-auto max-w-5xl text-center py-10 space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Escolha o plano ideal para sua carreira</h1>
        <p className="text-muted-foreground">Comece grátis e evolua para recursos profissionais quando precisar.</p>
      </section>
      <section className="mx-auto max-w-5xl grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.key} className={`rounded-lg border p-5 ${p.highlight ? 'ring-2 ring-amber-400' : ''}`}>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="text-2xl font-bold mb-2">{p.price}</div>
            <ul className="text-sm text-muted-foreground space-y-1 mb-3">
              {p.benefits.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
            <a href={p.cta} className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm w-full text-center">
              {p.key === 'starter' ? 'Começar grátis' : `Assinar ${p.name}`}
            </a>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-4xl py-10">
        <h2 className="text-xl font-semibold mb-4 text-center">Perguntas frequentes</h2>
        <div className="space-y-4 text-sm">
          <details className="rounded border p-3">
            <summary className="font-medium cursor-pointer">O plano Starter é realmente gratuito?</summary>
            <p className="mt-2 text-muted-foreground">Sim. Ele inclui 2 currículos, 5 templates ATS, 3 análises/mês e exportação com marca d’água.</p>
          </details>
          <details className="rounded border p-3">
            <summary className="font-medium cursor-pointer">Posso fazer upgrade depois?</summary>
            <p className="mt-2 text-muted-foreground">Sim. Você pode fazer upgrade para Pro/Team a qualquer momento e desbloquear templates premium e recursos de IA.</p>
          </details>
          <details className="rounded border p-3">
            <summary className="font-medium cursor-pointer">Quais métodos de pagamento são aceitos?</summary>
            <p className="mt-2 text-muted-foreground">Cartão de crédito; integrações locais (Pix/Boleto) podem ser adicionadas conforme disponibilidade.</p>
          </details>
        </div>
      </section>
    </main>
  )
}


