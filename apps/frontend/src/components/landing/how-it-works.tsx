"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  FileUser, 
  Palette, 
  BarChart3, 
  Send, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  MousePointer
} from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description: "Cadastro rápido em 30 segundos. Comece grátis, sem cartão de crédito necessário.",
    icon: UserPlus,
    action: "Criar conta grátis",
    href: "/login?mode=register",
    color: "emerald",
    features: ["Email + senha", "Verificação automática", "Acesso imediato"],
    time: "30 segundos"
  },
  {
    number: "02", 
    title: "Complete seu perfil",
    description: "Importe dados do LinkedIn ou preencha manualmente. Nossa IA organiza tudo automaticamente.",
    icon: FileUser,
    action: "Importar do LinkedIn",
    href: "/profile",
    color: "blue",
    features: ["Import automático", "Organização por IA", "Dados seguros"],
    time: "2 minutos"
  },
  {
    number: "03",
    title: "Escolha o template",
    description: "Selecione entre 50+ designs profissionais otimizados para ATS e específicos para sua área.",
    icon: Palette,
    action: "Ver templates",
    href: "/documents/templates",
    color: "purple",
    features: ["50+ templates", "Otimizado ATS", "Por setor"],
    time: "1 minuto"
  },
  {
    number: "04",
    title: "Analise a vaga",
    description: "Cole a descrição da vaga e receba score instantâneo com sugestões de melhorias personalizadas.",
    icon: BarChart3,
    action: "Analisar vaga",
    href: "/jobs",
    color: "amber",
    features: ["Score instantâneo", "Gaps identificados", "Palavras-chave"],
    time: "30 segundos"
  },
  {
    number: "05",
    title: "Envie e acompanhe",
    description: "Baixe em PDF de alta qualidade e gerencie todas suas candidaturas em um dashboard intuitivo.",
    icon: Send,
    action: "Dashboard",
    href: "/applications",
    color: "cyan",
    features: ["PDF premium", "Tracking completo", "Métricas detalhadas"],
    time: "Contínuo"
  }
]

const getColorClasses = (color: string) => {
  const colors = {
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
      gradient: "from-emerald-500 to-green-500",
      ring: "ring-emerald-500/20"
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      icon: "text-blue-600 dark:text-blue-400", 
      badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
      gradient: "from-blue-500 to-cyan-500",
      ring: "ring-blue-500/20"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      icon: "text-purple-600 dark:text-purple-400",
      badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
      gradient: "from-purple-500 to-violet-500",
      ring: "ring-purple-500/20"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      icon: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
      gradient: "from-amber-500 to-orange-500",
      ring: "ring-amber-500/20"
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
      icon: "text-cyan-600 dark:text-cyan-400",
      badge: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300",
      gradient: "from-cyan-500 to-teal-500",
      ring: "ring-cyan-500/20"
    }
  }
  return colors[color as keyof typeof colors] || colors.purple
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([])

  useEffect(() => {
    // Animate steps appearance
    const timers = steps.map((_, index) => 
      setTimeout(() => {
        setVisibleSteps(prev => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
      }, index * 300)
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
      
      <div className="mx-auto max-w-6xl px-4 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge 
            variant="outline" 
            className="bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
          >
            Como Funciona
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Do cadastro ao emprego
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              em 5 passos simples
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nossa metodologia comprovada já ajudou mais de 10.000 profissionais a conseguirem 
            suas vagas dos sonhos. Veja como é fácil começar.
          </p>
        </div>

        {/* Steps Timeline - Desktop */}
        <div className="hidden lg:block mb-16">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-200 via-purple-200 to-violet-200 dark:from-violet-800 dark:via-purple-800 dark:to-violet-800" />
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const colors = getColorClasses(step.color)
                const IconComponent = step.icon
                const isActive = index === activeStep
                
                return (
                  <div 
                    key={index}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-500 ${
                      visibleSteps[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Step Circle */}
                    <div className={`
                      relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg scale-110 ${colors.ring} ring-4` 
                        : `${colors.bg} ${colors.icon} hover:scale-105`
                      }
                    `}>
                      <IconComponent className="h-8 w-8" />
                      
                      {/* Step Number */}
                      <div className={`
                        absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
                        ${isActive 
                          ? 'bg-white text-violet-600' 
                          : 'bg-violet-600 text-white'
                        }
                      `}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Step Info */}
                    <div className="text-center mt-4 max-w-32">
                      <div className="font-semibold text-sm mb-1">{step.title}</div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${colors.badge} border-0`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {step.time}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Active Step Details - Desktop */}
        <div className="hidden lg:block mb-16">
          <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className={`bg-gradient-to-r ${getColorClasses(steps[activeStep].color).gradient} text-white border-0`}>
                        Passo {steps[activeStep].number}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {steps[activeStep].time}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold">{steps[activeStep].title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {steps[activeStep].description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {steps[activeStep].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={steps[activeStep].href}>
                    <Button variant="depth" className={`bg-gradient-to-r ${getColorClasses(steps[activeStep].color).gradient} text-white hover:scale-105 transition-all group w-full`}>
                      {steps[activeStep].action}
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                <div className="relative">
                  {/* Illustration placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getColorClasses(steps[activeStep].color).gradient} flex items-center justify-center mx-auto`}>
                        {(() => {
                          const IconComponent = steps[activeStep].icon
                          return <IconComponent className="h-12 w-12 text-white" />
                        })()}
                      </div>
                      <div className="space-y-2">
                        <div className="font-semibold">{steps[activeStep].title}</div>
                        <div className="text-sm text-muted-foreground">
                          Visualização interativa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Steps Cards - Mobile */}
        <div className="lg:hidden grid gap-6 mb-16">
          {steps.map((step, index) => {
            const colors = getColorClasses(step.color)
            const IconComponent = step.icon
            
            return (
              <Card 
                key={index}
                className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-0 hover:shadow-xl transition-all duration-500 ${
                  visibleSteps[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={`bg-gradient-to-r ${colors.gradient} text-white border-0 text-xs`}>
                          {step.number}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.time}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pl-16">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pl-16">
                    <Link href={step.href}>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="group"
                      >
                        {step.action}
                        <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              Pronto para começar sua jornada?
            </h3>
            <p className="text-muted-foreground">
              Junte-se a mais de 10.000 profissionais que já conseguiram suas vagas dos sonhos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?mode=register">
              <Button 
                size="lg"
                variant="depth"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl group"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Começar grátis agora
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Link href="/demo">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2"
              >
                <MousePointer className="h-4 w-4 mr-2" />
                Ver demonstração
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}