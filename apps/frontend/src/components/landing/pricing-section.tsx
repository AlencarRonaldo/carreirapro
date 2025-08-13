"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Sparkles, 
  Crown, 
  Users,
  ArrowRight,
  Zap,
  Star,
  X
} from "lucide-react"

interface PricingSectionProps {
  isAuthenticated?: boolean
}

const plans = [
  {
    key: "starter",
    name: "Starter",
    description: "Perfeito para começar",
    price: "Grátis",
    priceSubtext: "Para sempre",
    popular: false,
    color: "default",
    icon: Sparkles,
    features: [
      { text: "2 currículos completos", included: true },
      { text: "5 templates básicos", included: true },
      { text: "3 análises de vaga/mês", included: true },
      { text: "Importação LinkedIn", included: true },
      { text: "PDF com marca d'água", included: true },
      { text: "Suporte por email", included: true },
      { text: "Templates premium", included: false },
      { text: "Análises ilimitadas", included: false },
      { text: "Dashboard avançado", included: false }
    ],
    cta: "Começar grátis",
    benefits: [
      "Sem cartão de crédito",
      "Ativação instantânea",
      "Acesso a comunidade"
    ]
  },
  {
    key: "premium",
    name: "Premium",
    description: "Para profissionais ambiciosos",
    price: "R$ 49,90",
    priceSubtext: "por mês",
    popular: true,
    color: "primary",
    icon: Crown,
    features: [
      { text: "Currículos ilimitados", included: true },
      { text: "50+ templates premium", included: true },
      { text: "Análises ilimitadas", included: true },
      { text: "IA avançada", included: true },
      { text: "PDF sem marca d'água", included: true },
      { text: "Cartas de apresentação IA", included: true },
      { text: "Dashboard de candidaturas", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Integração Slack", included: false }
    ],
    cta: "Assinar Premium",
    benefits: [
      "Cancelamento a qualquer momento",
      "7 dias de garantia",
      "Acesso a novos recursos"
    ]
  },
  {
    key: "pro",
    name: "Pro",
    description: "Para equipes e recrutadores",
    price: "R$ 99,90",
    priceSubtext: "por mês",
    popular: false,
    color: "secondary",
    icon: Users,
    features: [
      { text: "Tudo do Premium", included: true },
      { text: "5 usuários inclusos", included: true },
      { text: "Dashboard de equipe", included: true },
      { text: "Relatórios avançados", included: true },
      { text: "API de integração", included: true },
      { text: "White-label", included: true },
      { text: "Integração Slack/Teams", included: true },
      { text: "Suporte dedicado", included: true },
      { text: "Onboarding personalizado", included: true }
    ],
    cta: "Falar com vendas",
    benefits: [
      "Configuração personalizada",
      "Treinamento incluído",
      "Success manager dedicado"
    ]
  }
]

const faqs = [
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas."
  },
  {
    question: "Como funciona a garantia de 7 dias?",
    answer: "Se não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do valor pago."
  },
  {
    question: "Os templates são realmente aprovados por RH?",
    answer: "Sim! Todos nossos templates são validados por recrutadores de empresas top como iFood, Nubank e Stone."
  },
  {
    question: "A IA realmente funciona?",
    answer: "Nossa IA tem 95% de precisão e já ajudou mais de 10.000 profissionais a conseguirem suas vagas."
  }
]

export function PricingSection({ isAuthenticated = false }: PricingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const getCardClasses = (plan: typeof plans[0]) => {
    if (plan.popular) {
      return "relative border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 shadow-xl scale-105"
    }
    return "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
  }

  const getIconClasses = (plan: typeof plans[0]) => {
    if (plan.popular) {
      return "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
    }
    return "bg-muted text-muted-foreground"
  }

  const getButtonClasses = (plan: typeof plans[0]) => {
    if (plan.popular) {
      return "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
    }
    if (plan.key === "starter") {
      return "bg-background text-foreground border-2 hover:bg-accent"
    }
    return "bg-foreground text-background hover:bg-foreground/90"
  }

  return (
    <section id="plans" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="mx-auto max-w-6xl px-4 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge 
            variant="outline" 
            className="bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
          >
            Planos e Preços
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Escolha o plano ideal
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              para sua carreira
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comece grátis e evolua conforme suas necessidades. Todos os planos incluem 
            templates profissionais e análise com IA.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            
            return (
              <Card key={plan.key} className={getCardClasses(plan)}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${getIconClasses(plan)} flex items-center justify-center mx-auto`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  {/* Plan Info */}
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.priceSubtext}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href={
                    plan.key === "pro" 
                      ? "/contact" 
                      : isAuthenticated 
                        ? `/checkout?plan=${plan.key}` 
                        : `/login?plan=${plan.key}`
                  }>
                    <Button 
                      className={`w-full ${getButtonClasses(plan)} group`}
                    >
                      {plan.cta}
                      {plan.key !== "pro" && (
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      )}
                    </Button>
                  </Link>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div className="pt-4 border-t border-border/50 space-y-2">
                    {plan.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap className="h-3 w-3 text-amber-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Perguntas Frequentes</h3>
            <p className="text-muted-foreground">
              Tire suas dúvidas sobre nossos planos e funcionalidades
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm cursor-pointer hover:shadow-md transition-all duration-300"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{faq.question}</h4>
                    <div className={`transform transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                      <div className="w-4 h-4 relative">
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-foreground transform -translate-x-1/2" />
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-foreground transform -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                  
                  {openFaq === index && (
                    <div className="mt-4 pt-4 border-t border-border/50 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}