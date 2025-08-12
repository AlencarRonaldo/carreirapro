"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Star, ShieldCheck, LineChart, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Slide {
  key: string
  badge: string
  title: string
  desc: string
  Bg: () => React.JSX.Element
  Icon: React.ComponentType<{ className?: string }>
  cta: {
    primary: { text: string; href: string }
    secondary: { text: string; href: string }
  }
}

const slides: Slide[] = [
  {
    key: 'main',
    badge: 'Compatível com ATS • Templates por área • IA integrada',
    title: 'O construtor de currículos para conseguir a próxima vaga',
    desc: 'Gere currículos profissionais, otimizados para ATS, analise vagas com IA e acompanhe suas candidaturas em um só lugar.',
    Bg: () => (
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.18),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.18),transparent_40%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.12),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.12),transparent_40%)]" />
    ),
    Icon: Star,
    cta: {
      primary: { text: 'Começar grátis', href: '/login' },
      secondary: { text: 'Ver planos', href: '#plans' }
    }
  },
  {
    key: 'ats',
    badge: 'Compatível com ATS',
    title: 'Compatível com ATS e triagens por IA',
    desc: 'Por que é essencial: recrutadores e sistemas usam filtros automáticos. Estrutura limpa e palavras‑chave certas aumentam a aprovação e o ranking.',
    Bg: () => (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-zinc-900 dark:to-emerald-950/30" />
    ),
    Icon: ShieldCheck,
    cta: {
      primary: { text: 'Ver templates ATS', href: '/documents/templates' },
      secondary: { text: 'Saiba mais', href: '#recursos' }
    }
  },
  {
    key: 'ai',
    badge: 'Análise de vaga com IA',
    title: 'Análise de vaga com IA: foco no que importa',
    desc: 'Compare seu perfil com a vaga, descubra gaps de habilidades, receba palavras‑chave e aumente seu score antes de enviar.',
    Bg: () => (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 to-violet-50 dark:from-zinc-900 dark:to-violet-950/30" />
    ),
    Icon: LineChart,
    cta: {
      primary: { text: 'Testar análise IA', href: '/jobs' },
      secondary: { text: 'Como funciona', href: '#como-funciona' }
    }
  },
]

interface ModernHeroCarouselProps {
  autoPlay?: boolean
  interval?: number
}

export default function ModernHeroCarousel({ 
  autoPlay = true, 
  interval = 6000 
}: ModernHeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | undefined>()
  const progressRef = useRef<NodeJS.Timeout | undefined>()

  const resetProgress = useCallback(() => {
    setProgress(0)
    if (progressRef.current) {
      clearInterval(progressRef.current)
    }
    
    if (isPlaying && !isHovered) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + (100 / (interval / 100))
        })
      }, 100)
    }
  }, [isPlaying, isHovered, interval])

  useEffect(() => {
    resetProgress()
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current)
      }
    }
  }, [resetProgress])

  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (progressRef.current) {
        clearInterval(progressRef.current)
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsTransitioning(false)
        resetProgress()
      }, 150)
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isHovered, interval, resetProgress])

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
      resetProgress()
    }, 150)
  }, [currentSlide, resetProgress])

  const nextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % slides.length
    goToSlide(nextIndex)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length
    goToSlide(prevIndex)
  }, [currentSlide, goToSlide])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const currentSlideData = slides[currentSlide]
  const { Bg, Icon } = currentSlideData

  return (
    <section 
      className="relative overflow-hidden min-h-[600px] flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background with smooth transition */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <Bg />
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-300"
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-300"
        onClick={nextSlide}
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Play/Pause Control */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-300"
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pausar carrossel" : "Reproduzir carrossel"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Content */}
      <div className={cn(
        "mx-auto max-w-5xl text-center py-16 md:py-24 space-y-6 px-4 relative z-10 transition-all duration-300",
        isTransitioning && "opacity-80 scale-[0.98]"
      )}>
        {/* Badge with Icon */}
        <div className={cn(
          "inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur px-4 py-2 text-sm border border-zinc-200 dark:border-white/10 transition-all duration-500",
          isTransitioning && "opacity-50"
        )}>
          <Icon className="h-4 w-4 text-amber-500 transition-all duration-300" />
          <span className="transition-all duration-500">{currentSlideData.badge}</span>
        </div>

        {/* Title with gradient */}
        <h1 className={cn(
          "text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 via-sky-700 to-emerald-700 bg-clip-text text-transparent transition-all duration-500 leading-tight",
          isTransitioning && "blur-[1px]"
        )}>
          {currentSlideData.title}
        </h1>

        {/* Description */}
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground dark:text-zinc-300 px-4 max-w-3xl mx-auto transition-all duration-500 leading-relaxed",
          isTransitioning && "opacity-70"
        )}>
          {currentSlideData.desc}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="bg-violet-700 hover:bg-violet-800 text-white px-8 py-3 text-base shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            asChild
          >
            <a href={currentSlideData.cta.primary.href}>
              {currentSlideData.cta.primary.text}
            </a>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-base bg-white/70 dark:bg-white/10 backdrop-blur border-zinc-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-300 hover:scale-105"
            asChild
          >
            <a href={currentSlideData.cta.secondary.href}>
              {currentSlideData.cta.secondary.text}
            </a>
          </Button>
        </div>

        {/* Slide Indicators with Progress */}
        <div className="flex items-center justify-center gap-3 pt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
              className={cn(
                "relative h-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
                index === currentSlide
                  ? "w-12 bg-violet-200 dark:bg-violet-800"
                  : "w-3 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"
              )}
            >
              {/* Active slide progress indicator */}
              {index === currentSlide && isPlaying && !isHovered && (
                <div 
                  className="absolute inset-0 bg-violet-700 dark:bg-violet-400 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Slide {currentSlide + 1} de {slides.length}</span>
            <span>{isPlaying ? (isHovered ? 'Pausado' : 'Reproduzindo') : 'Pausado'}</span>
          </div>
          <Progress 
            value={((currentSlide + 1) / slides.length) * 100} 
            className="h-1" 
          />
        </div>
      </div>
    </section>
  )
}