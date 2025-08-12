"use client"

import { useState, useEffect, useRef } from "react"
import { 
  ShieldCheck, 
  LineChart, 
  Sparkles, 
  MessagesSquare, 
  FileSpreadsheet, 
  LinkIcon,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Star,
  Zap
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  benefits: string[]
  cta?: {
    text: string
    href: string
  }
  badge?: string
  badgeVariant?: 'default' | 'success' | 'warning' | 'info' | 'secondary'
  gradient?: string
  rating?: number
  popularity?: 'hot' | 'trending' | 'new' | null
  interactionCount?: number
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Compatível com ATS',
    description: 'Compatível com ATS e triagens por IA: estrutura limpa, palavras‑chave e semântica alinhadas aos parsers para maximizar a aprovação nas etapas automatizadas.',
    benefits: [
      'Estrutura otimizada para sistemas ATS',
      'Palavras-chave estratégicas',
      'Formatação semântica inteligente',
      'Teste de compatibilidade automático'
    ],
    cta: {
      text: 'Ver templates ATS',
      href: '/documents/templates'
    },
    badge: 'Essencial',
    badgeVariant: 'success',
    gradient: 'from-emerald-500/20 to-green-500/20',
    rating: 4.9,
    popularity: 'hot',
    interactionCount: 2847
  },
  {
    icon: LineChart,
    title: 'Análise de vaga com IA',
    description: 'Score e sugestões de melhoria instantâneas baseadas na descrição da vaga.',
    benefits: [
      'Score de compatibilidade em tempo real',
      'Sugestões personalizadas de melhoria',
      'Análise de palavras-chave',
      'Comparação com perfil ideal'
    ],
    cta: {
      text: 'Testar análise',
      href: '/jobs'
    },
    badge: 'IA Avançada',
    badgeVariant: 'info',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    rating: 4.8,
    popularity: 'trending',
    interactionCount: 1923
  },
  {
    icon: Sparkles,
    title: 'Modelos por área',
    description: 'Templates especializados para TI, Marketing, Engenharia, Saúde, Jurídico e mais.',
    benefits: [
      'Templates especializados por área',
      'Design moderno e profissional',
      'Layouts responsivos',
      'Personalização avançada'
    ],
    cta: {
      text: 'Explorar templates',
      href: '/documents/templates'
    },
    badgeVariant: 'secondary',
    gradient: 'from-purple-500/20 to-pink-500/20',
    rating: 4.7,
    interactionCount: 3241
  },
  {
    icon: MessagesSquare,
    title: 'Carta de apresentação com IA',
    description: 'Gerada sob medida para a vaga informada e seu perfil, com linguagem e palavras‑chave da descrição.',
    benefits: [
      'Personalizada para cada vaga',
      'Tom profissional adequado',
      'Integração com currículo',
      'Otimizada para ATS'
    ],
    cta: {
      text: 'Criar carta',
      href: '/cover-letters'
    },
    badge: 'Novo',
    badgeVariant: 'warning',
    gradient: 'from-orange-500/20 to-red-500/20',
    rating: 4.6,
    popularity: 'new',
    interactionCount: 827
  },
  {
    icon: FileSpreadsheet,
    title: 'Dashboard de candidaturas',
    description: 'Status, exportação e PDFs em um clique para acompanhar todas suas aplicações.',
    benefits: [
      'Controle completo das candidaturas',
      'Status em tempo real',
      'Exportação facilitada',
      'Histórico detalhado'
    ],
    cta: {
      text: 'Ver dashboard',
      href: '/applications'
    },
    badgeVariant: 'default',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    rating: 4.5,
    interactionCount: 1534
  },
  {
    icon: LinkIcon,
    title: 'Importe do LinkedIn',
    description: 'Preencha seu perfil automaticamente importando dados do seu LinkedIn.',
    benefits: [
      'Importação em segundos',
      'Dados sempre atualizados',
      'Sincronização automática',
      'Zero trabalho manual'
    ],
    cta: {
      text: 'Conectar LinkedIn',
      href: '/profile'
    },
    badgeVariant: 'info',
    gradient: 'from-teal-500/20 to-green-500/20',
    rating: 4.4,
    interactionCount: 2156
  },
]

interface FeatureCardsProps {
  maxVisible?: number
  showAll?: boolean
}

export default function FeatureCards({ maxVisible = 6, showAll = false }: FeatureCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const observerRef = useRef<IntersectionObserver>()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const visibleFeatures = showAll ? features : features.slice(0, maxVisible)

  // Intersection observer for animations on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, index]))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -10% 0px'
      }
    )

    cardRefs.current.forEach((card, index) => {
      if (card) {
        card.setAttribute('data-index', index.toString())
        observerRef.current?.observe(card)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [visibleFeatures.length])

  const toggleCardExpansion = (index: number) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCards(newExpanded)
  }

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const getPopularityIcon = (popularity: string | null) => {
    switch (popularity) {
      case 'hot':
        return <Zap className="h-3 w-3 text-orange-500" />
      case 'trending':
        return <Star className="h-3 w-3 text-blue-500" />
      case 'new':
        return <Sparkles className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  return (
    <section id="recursos" className="mx-auto max-w-7xl py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Recursos que fazem a diferença
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ferramentas profissionais para maximizar suas chances de conseguir a vaga dos sonhos
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleFeatures.map((feature, index) => {
          const isExpanded = expandedCards.has(index)
          const isHovered = hoveredIndex === index
          const isVisible = visibleCards.has(index)

          return (
            <Card
              key={index}
              ref={el => { cardRefs.current[index] = el; }}
              className={cn(
                "group relative overflow-hidden transition-all duration-500 border-0 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm",
                "transform-gpu will-change-transform",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8",
                isHovered && "scale-[1.02] shadow-2xl shadow-black/15 dark:shadow-white/5",
                !isHovered && "hover:shadow-xl hover:shadow-black/10",
                feature.gradient && `bg-gradient-to-br ${feature.gradient}`,
                "hover:border-violet-200/50 dark:hover:border-violet-800/50"
              )}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Badge and Popularity Indicator */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                {feature.popularity && (
                  <div className="flex items-center gap-1 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur px-2 py-1">
                    {getPopularityIcon(feature.popularity)}
                    <span className="text-xs font-medium capitalize text-foreground/80">
                      {feature.popularity}
                    </span>
                  </div>
                )}
                {feature.badge && (
                  <Badge variant={feature.badgeVariant || 'default'} className="text-xs">
                    {feature.badge}
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-4 space-y-3">
                {/* Icon and Rating */}
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-200/20 dark:border-violet-800/20 transition-all duration-300",
                    isHovered && "scale-110 rotate-3 shadow-lg shadow-violet-500/25"
                  )}>
                    <feature.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>

                  {feature.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-foreground/80">
                        {feature.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <CardTitle className={cn(
                    "text-xl transition-all duration-300",
                    isHovered && "text-violet-700 dark:text-violet-300"
                  )}>
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>

                  {/* Interaction Count */}
                  {feature.interactionCount && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3" />
                      <span>{formatCount(feature.interactionCount)} usuários</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Benefits List - Show on expand */}
                <div className={cn(
                  "space-y-3 overflow-hidden transition-all duration-500",
                  isExpanded ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                )}>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div 
                        key={benefitIndex} 
                        className={cn(
                          "flex items-center gap-3 text-sm transform transition-all duration-300",
                          isExpanded 
                            ? "translate-x-0 opacity-100" 
                            : "-translate-x-4 opacity-0"
                        )}
                        style={{
                          transitionDelay: isExpanded ? `${benefitIndex * 50}ms` : '0ms'
                        }}
                      >
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCardExpansion(index)}
                    className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 p-0 h-auto font-medium group/expand"
                  >
                    {isExpanded ? 'Ver menos' : 'Ver detalhes'}
                    <ArrowRight className={cn(
                      "ml-2 h-4 w-4 transition-transform duration-300 group-hover/expand:translate-x-1",
                      isExpanded && "rotate-90"
                    )} />
                  </Button>

                  {feature.cta && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className={cn(
                        "border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/50 transition-all duration-300 group/cta",
                        isHovered && "scale-105 shadow-md"
                      )}
                    >
                      <a href={feature.cta.href} className="flex items-center gap-2">
                        {feature.cta.text}
                        <ExternalLink className="h-3 w-3 transition-transform duration-200 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Hover Effect Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 pointer-events-none",
                isHovered && "opacity-100"
              )} />
            </Card>
          )
        })}
      </div>

      {!showAll && features.length > maxVisible && (
        <div className="text-center mt-8">
          <a href="#recursos-completos" className="inline-flex">
            <Button variant="outline" size="lg">
              Ver todos os recursos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      )}
    </section>
  )
}