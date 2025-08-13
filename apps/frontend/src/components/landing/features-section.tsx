"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, 
  LineChart, 
  Sparkles, 
  MessagesSquare, 
  FileSpreadsheet, 
  Link as LinkIcon,
  Zap,
  Target,
  Award,
  Download,
  Eye,
  Clock
} from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Compatível com ATS",
    description: "Templates otimizados para sistemas de triagem automática. Estrutura limpa e palavras-chave estratégicas para maximizar aprovação.",
    benefits: ["95% taxa de aprovação", "Parsers compatíveis", "SEO otimizado"],
    color: "emerald"
  },
  {
    icon: LineChart,
    title: "Análise de Vaga com IA",
    description: "Compare seu perfil com vagas reais. Receba score instantâneo e sugestões personalizadas para melhorar suas chances.",
    benefits: ["Score em tempo real", "Gaps de habilidades", "Palavras-chave sugeridas"],
    color: "blue"
  },
  {
    icon: Sparkles,
    title: "Templates por Área",
    description: "Designs profissionais para cada setor: TI, Marketing, Engenharia, Saúde, Jurídico e mais de 50 especialidades.",
    benefits: ["50+ templates", "Design responsivo", "Aprovado por RH"],
    color: "purple"
  },
  {
    icon: MessagesSquare,
    title: "Carta de Apresentação IA",
    description: "Gere cartas personalizadas automaticamente. Linguagem adaptada à vaga e cultura da empresa.",
    benefits: ["Personalização automática", "Tom profissional", "Templates flexíveis"],
    color: "amber"
  },
  {
    icon: FileSpreadsheet,
    title: "Dashboard de Candidaturas",
    description: "Acompanhe todas suas aplicações em um só lugar. Status, feedbacks e métricas de performance.",
    benefits: ["Controle centralizado", "Métricas detalhadas", "Follow-up automático"],
    color: "cyan"
  },
  {
    icon: LinkIcon,
    title: "Importação LinkedIn",
    description: "Preencha automaticamente seu perfil importando dados do LinkedIn. Rápido, seguro e preciso.",
    benefits: ["Import em 1 clique", "Dados seguros", "Sincronização fácil"],
    color: "indigo"
  }
]

const additionalFeatures = [
  { icon: Download, text: "Download sem marca d'água" },
  { icon: Eye, text: "Preview em tempo real" },
  { icon: Clock, text: "Criação em 5 minutos" },
  { icon: Target, text: "Otimização por setor" },
  { icon: Award, text: "Certificado de qualidade" },
  { icon: Zap, text: "Geração instantânea" }
]

const getColorClasses = (color: string) => {
  const colors = {
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      icon: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      icon: "text-purple-600 dark:text-purple-400",
      badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      icon: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
      icon: "text-cyan-600 dark:text-cyan-400",
      badge: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300"
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      icon: "text-indigo-600 dark:text-indigo-400",
      badge: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
    }
  }
  return colors[color as keyof typeof colors] || colors.purple
}

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge 
            variant="outline" 
            className="bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
          >
            Recursos Premium
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Tudo que você precisa para
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              conquistar sua vaga
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma completa com inteligência artificial para criar currículos profissionais, 
            analisar vagas e gerenciar candidaturas com eficiência.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color)
            const IconComponent = feature.icon
            
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-0 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2">
                      {feature.benefits.map((benefit, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className={`text-xs ${colors.badge} border-0`}
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="text-center space-y-8">
          <h3 className="text-2xl font-semibold">E muito mais...</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {additionalFeatures.map((item, index) => {
              const IconComponent = item.icon
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center leading-tight">
                    {item.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}