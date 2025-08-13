"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Users, 
  FileText,
  Zap,
  Play
} from "lucide-react"

interface ModernHeroProps {
  isAuthenticated?: boolean
}

export function ModernHero({ isAuthenticated = false }: ModernHeroProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    { value: "10K+", label: "Currículos criados" },
    { value: "95%", label: "Taxa de aprovação ATS" },
    { value: "4.9/5", label: "Avaliação usuários" }
  ]

  const features = [
    "Compatível com ATS",
    "Templates profissionais", 
    "Análise com IA",
    "Download sem marca d'água"
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-2xl animate-pulse [animation-delay:4s]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex">
              <Badge 
                variant="secondary" 
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 px-4 py-2 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4" />
                Plataforma #1 para currículos profissionais
              </Badge>
            </div>

            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Crie currículos
                </span>
                <br />
                <span className="text-foreground">
                  que conquistam vagas
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Construa currículos profissionais com IA, analise vagas em segundos e 
                aumente suas chances de contratação com templates aprovados por recrutadores.
              </p>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={isAuthenticated ? "/documents" : "/login"}>
                <Button 
                  size="lg"
                  variant="depth"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                >
                  {isAuthenticated ? "Criar currículo" : "Começar grátis"}
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 hover:bg-accent/50 w-full sm:w-auto"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Ver demonstração
                </Button>
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Card */}
            <Card className="relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-0 shadow-2xl">
              <div className="p-8 space-y-6">
                {/* CV Preview Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Maria Silva</div>
                      <div className="text-sm text-muted-foreground">Desenvolvedora Frontend</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    ATS ✓
                  </Badge>
                </div>

                {/* Skills Preview */}
                <div className="space-y-3">
                  <div className="text-sm font-medium">Habilidades Principais</div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Next.js", "Tailwind", "Node.js"].map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience Preview */}
                <div className="space-y-3">
                  <div className="text-sm font-medium">Experiência</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">Tech Corp</div>
                        <div className="text-xs text-muted-foreground">Desenvolvedora Senior</div>
                      </div>
                      <div className="text-xs text-muted-foreground">2022-2024</div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">StartupXYZ</div>
                        <div className="text-xs text-muted-foreground">Desenvolvedora Full Stack</div>
                      </div>
                      <div className="text-xs text-muted-foreground">2020-2022</div>
                    </div>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="flex items-center justify-center pt-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    <Zap className="h-4 w-4" />
                    Score IA: 95/100
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating Reviews */}
            <div className="absolute -top-4 -right-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/50 hidden md:block">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">4.9/5</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">+10.000 usuários</div>
            </div>

            {/* Floating Feature */}
            <div className="absolute -bottom-4 -left-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/50 hidden md:block">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-violet-600" />
                <span className="font-medium">+500</span>
              </div>
              <div className="text-xs text-muted-foreground">currículos hoje</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}