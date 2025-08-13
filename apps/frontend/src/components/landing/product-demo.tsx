"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Eye, 
  Download, 
  Share2, 
  BarChart3, 
  CheckCircle2,
  Star,
  ArrowRight,
  Zap,
  Target,
  Calendar
} from "lucide-react"
import Link from "next/link"

const demoData = {
  profile: {
    name: "Ana Silva",
    role: "Desenvolvedora Frontend Senior",
    location: "São Paulo, SP",
    email: "ana.silva@email.com",
    phone: "(11) 99999-9999"
  },
  skills: [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Next.js", level: 88 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 }
  ],
  experience: [
    {
      company: "Tech Corp",
      role: "Senior Frontend Developer",
      period: "2022 - Atual",
      description: "Liderança técnica em projetos React, otimização de performance"
    },
    {
      company: "StartupXYZ", 
      role: "Full Stack Developer",
      period: "2020 - 2022",
      description: "Desenvolvimento full stack com React e Node.js"
    }
  ],
  analysis: {
    score: 92,
    matches: 8,
    gaps: 2,
    keywords: ["React", "TypeScript", "Agile", "Git"]
  }
}

const features = [
  {
    icon: Eye,
    title: "Preview em Tempo Real",
    description: "Veja como seu currículo fica enquanto edita"
  },
  {
    icon: BarChart3,
    title: "Análise com IA",
    description: "Score instantâneo e sugestões de melhoria"
  },
  {
    icon: Download,
    title: "Download Premium",
    description: "PDF de alta qualidade sem marca d'água"
  },
  {
    icon: Share2,
    title: "Compartilhamento",
    description: "Link direto para recrutadores"
  }
]

export function ProductDemoSection() {
  const [activeTab, setActiveTab] = useState<'editor' | 'analysis' | 'export'>('editor')

  const tabs = [
    { id: 'editor' as const, label: 'Editor', icon: FileText },
    { id: 'analysis' as const, label: 'Análise IA', icon: BarChart3 },
    { id: 'export' as const, label: 'Exportar', icon: Download }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20" />
      
      <div className="mx-auto max-w-6xl px-4 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge 
            variant="outline" 
            className="bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
          >
            Demonstração do Produto
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Veja a plataforma
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              em ação
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Interface intuitiva, análise inteligente e resultados profissionais. 
            Descubra como é fácil criar currículos que conquistam vagas.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-border/50">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Demo Content */}
          <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              {activeTab === 'editor' && (
                <div className="grid lg:grid-cols-2 min-h-[600px]">
                  {/* Editor Panel */}
                  <div className="p-8 space-y-6 border-r border-border/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Editor de Currículo</h3>
                      <Badge variant="secondary" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Auto-save
                      </Badge>
                    </div>

                    {/* Profile Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Informações Pessoais
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Nome</label>
                            <div className="h-9 bg-muted/50 rounded border px-3 flex items-center text-sm">
                              {demoData.profile.name}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Cargo</label>
                            <div className="h-9 bg-muted/50 rounded border px-3 flex items-center text-sm">
                              {demoData.profile.role}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Email</label>
                          <div className="h-9 bg-muted/50 rounded border px-3 flex items-center text-sm">
                            {demoData.profile.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Habilidades
                      </h4>
                      <div className="space-y-3">
                        {demoData.skills.map((skill, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{skill.name}</span>
                              <span className="text-muted-foreground">{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-1000"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview Panel */}
                  <div className="p-8 bg-gradient-to-br from-muted/20 to-muted/10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Preview</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* CV Preview */}
                      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-xl min-h-[500px] space-y-4">
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold">{demoData.profile.name}</h2>
                          <p className="text-muted-foreground">{demoData.profile.role}</p>
                          <p className="text-sm text-muted-foreground">
                            {demoData.profile.location} • {demoData.profile.email}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-sm mb-2 border-b pb-1">HABILIDADES</h3>
                            <div className="flex flex-wrap gap-2">
                              {demoData.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill.name}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm mb-2 border-b pb-1">EXPERIÊNCIA</h3>
                            <div className="space-y-3">
                              {demoData.experience.map((exp, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium text-sm">{exp.role}</h4>
                                      <p className="text-xs text-muted-foreground">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{exp.period}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="p-8 space-y-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-semibold">Análise com IA</h3>
                    <p className="text-muted-foreground">
                      Nossa IA analisa seu currículo e a vaga para maximizar suas chances
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
                      <CardContent className="p-0 space-y-2">
                        <div className="text-3xl font-bold text-emerald-600">
                          {demoData.analysis.score}
                        </div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300">
                          Score da Vaga
                        </div>
                        <div className="flex justify-center">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                      <CardContent className="p-0 space-y-2">
                        <div className="text-3xl font-bold text-blue-600">
                          {demoData.analysis.matches}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          Requisitos Atendidos
                        </div>
                        <div className="flex justify-center">
                          <Target className="h-4 w-4 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                      <CardContent className="p-0 space-y-2">
                        <div className="text-3xl font-bold text-amber-600">
                          {demoData.analysis.gaps}
                        </div>
                        <div className="text-sm text-amber-700 dark:text-amber-300">
                          Gaps Identificados
                        </div>
                        <div className="flex justify-center">
                          <Zap className="h-4 w-4 text-amber-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
                      <CardContent className="p-0 space-y-2">
                        <div className="text-3xl font-bold text-purple-600">
                          {demoData.analysis.keywords.length}
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">
                          Palavras-chave
                        </div>
                        <div className="flex justify-center">
                          <CheckCircle2 className="h-4 w-4 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Palavras-chave Encontradas</h4>
                      <div className="flex flex-wrap gap-2">
                        {demoData.analysis.keywords.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Sugestões de Melhoria</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                          Adicione experiência com Docker para aumentar o score
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                          Inclua certificações AWS mencionadas na vaga
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                          Destaque experiência com metodologias ágeis
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="p-8 space-y-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-semibold">Exportar e Compartilhar</h3>
                    <p className="text-muted-foreground">
                      Baixe em alta qualidade ou compartilhe diretamente com recrutadores
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="font-semibold">Opções de Download</h4>
                      
                      <div className="space-y-4">
                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">PDF Premium</h5>
                              <p className="text-sm text-muted-foreground">
                                Alta qualidade, sem marca d'água
                              </p>
                            </div>
                            <Badge variant="secondary">Recomendado</Badge>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <Share2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">Link Compartilhável</h5>
                              <p className="text-sm text-muted-foreground">
                                URL direta para recrutadores
                              </p>
                            </div>
                            <Badge variant="secondary">Pro</Badge>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">Agendar Envio</h5>
                              <p className="text-sm text-muted-foreground">
                                Envio automático por email
                              </p>
                            </div>
                            <Badge variant="secondary">Novo</Badge>
                          </div>
                        </Card>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-semibold">Estatísticas</h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">Downloads realizados</span>
                          <span className="font-semibold">23</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">Visualizações do link</span>
                          <span className="font-semibold">47</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">Taxa de abertura</span>
                          <span className="font-semibold text-emerald-600">89%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">Última atualização</span>
                          <span className="font-semibold">Hoje</span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF Premium
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="text-center p-6 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0 space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 mt-16">
          <h3 className="text-2xl font-bold">
            Pronto para criar seu currículo profissional?
          </h3>
          <Link href="/login?mode=register">
            <Button 
              size="lg"
              variant="depth"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl group"
            >
              Começar agora gratuitamente
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}