"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Sparkles, ShieldCheck, LineChart, MessagesSquare, FileSpreadsheet, Link as LinkIcon, CheckCircle2, Star } from "lucide-react"

// Usa API_BASE unificado da lib (55311 no dev por padrão via .env)

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    try { setAuthed(!!localStorage.getItem("cp_token")) } catch { setAuthed(false) }
  }, [])

  // botão de teste removido da landing

  const BannerCarousel = () => {
    const slides = [
      {
        key: 'main',
        badge: 'Compatível com ATS • Templates por área • IA integrada',
        title: 'O construtor de currículos para conseguir a próxima vaga',
        desc: 'Gere currículos profissionais, otimizados para ATS, analise vagas com IA e acompanhe suas candidaturas em um só lugar.',
        Bg: () => (
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.18),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.18),transparent_40%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.12),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.12),transparent_40%)]" />
        ),
        Icon: Star,
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
      },
    ] as const

    const [i, setI] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const [isPaused, setIsPaused] = useState(false)

    // Minimum distance for swipe detection (50px)
    const minSwipeDistance = 50

    const nextSlide = () => setI((p) => (p + 1) % slides.length)
    const prevSlide = () => setI((p) => (p - 1 + slides.length) % slides.length)
    const goToSlide = (index: number) => setI(index)

    // Auto-advance carousel (pauses on interaction)
    useEffect(() => {
      if (isPaused) return
      
      const id = setInterval(nextSlide, 6000)
      return () => clearInterval(id)
    }, [isPaused])

    // Touch handlers for swipe gestures
    const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)
      setIsPaused(true)
    }

    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return
      
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      if (isLeftSwipe) {
        nextSlide()
      } else if (isRightSwipe) {
        prevSlide()
      }
      
      // Resume auto-advance after 3 seconds
      setTimeout(() => setIsPaused(false), 3000)
    }

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 3000)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 3000)
      }
    }

    const Bg: any = slides[i].Bg as any
    const IconComp: any = slides[i].Icon as any

    return (
      <section 
        className="relative overflow-hidden touch-pan-x"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Carousel de apresentação"
        aria-live="polite"
        aria-atomic="true"
      >
        <Bg />
        <div className="mx-auto max-w-5xl text-center py-16 md:py-24 space-y-5 transition-opacity">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur px-3 py-1 text-xs border border-zinc-200 dark:border-white/10">
            {IconComp ? <IconComp className="h-3.5 w-3.5 text-amber-500" /> : null}
            <span>{slides[i].badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 via-sky-700 to-emerald-700 bg-clip-text text-transparent">
            {slides[i].title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground dark:text-zinc-300 px-4 max-w-3xl mx-auto">
            {slides[i].desc}
          </p>
          
          {/* CTA Buttons with proper touch targets */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a 
              href="/login" 
              className="inline-flex items-center justify-center rounded-md bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white px-6 py-3 min-h-[44px] text-sm shadow transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 w-full sm:w-auto"
            >
              Começar grátis
            </a>
            <a 
              href="#plans" 
              className="inline-flex items-center justify-center rounded-md border px-6 py-3 min-h-[44px] text-sm bg-white/70 dark:bg-white/10 backdrop-blur transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full sm:w-auto"
            >
              Ver planos
            </a>
          </div>
          
          {/* Carousel indicators with proper touch targets */}
          <div className="flex items-center justify-center gap-3 pt-4">
            {slides.map((slide, idx) => (
              <button 
                key={idx} 
                onClick={() => {
                  goToSlide(idx)
                  setIsPaused(true)
                  setTimeout(() => setIsPaused(false), 3000)
                }}
                aria-label={`Ir para slide ${idx + 1}: ${slide.badge}`}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 active:scale-95 ${
                  i === idx 
                    ? 'bg-violet-700 hover:bg-violet-800' 
                    : 'bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                }`}
              >
                <span 
                  className={`h-3 w-3 rounded-full transition-all ${
                    i === idx ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Swipe hint for mobile users */}
          <div className="md:hidden text-xs text-muted-foreground opacity-70 pt-2">
            👈 Deslize para ver mais 👉
          </div>
        </div>
      </section>
    )
  }

  const Features = () => (
    <section id="recursos" className="mx-auto max-w-5xl py-16">
      <h2 className="text-center text-2xl font-semibold mb-8 sr-only">Recursos da plataforma</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { t: 'Compatível com ATS', d: 'Compatível com ATS e triagens por IA: estrutura limpa, palavras‑chave e semântica alinhadas aos parsers para maximizar a aprovação nas etapas automatizadas.', Icon: ShieldCheck },
          { t: 'Análise de vaga com IA', d: 'Score e sugestões de melhoria instantâneas.', Icon: LineChart },
          { t: 'Modelos por área', d: 'TI, Marketing, Engenharia, Saúde, Jurídico e mais.', Icon: Sparkles },
          { t: 'Carta de apresentação com IA', d: 'Gerada sob medida para a vaga informada e seu perfil, com linguagem e palavras‑chave da descrição.', Icon: MessagesSquare },
          { t: 'Dashboard de candidaturas', d: 'Status, exportação e PDFs em um clique.', Icon: FileSpreadsheet },
          { t: 'Importe do LinkedIn', d: 'Preencha seu perfil automaticamente.', Icon: LinkIcon },
        ].map((f, i) => (
          <article 
            key={i} 
            className="rounded-xl border border-zinc-200 dark:border-white/10 p-5 text-left bg-white/60 dark:bg-zinc-900/60 backdrop-blur transition-all duration-200 hover:shadow-md hover:scale-[1.01] focus-within:ring-2 focus-within:ring-violet-400 focus-within:ring-offset-2"
            role="article"
            aria-labelledby={`feature-title-${i}`}
            aria-describedby={`feature-desc-${i}`}
          >
            <header className="flex items-center gap-2 mb-3">
              <f.Icon 
                className="h-5 w-5 text-violet-700 flex-shrink-0" 
                aria-hidden="true"
              />
              <h3 
                id={`feature-title-${i}`}
                className="font-semibold text-base"
              >
                {f.t}
              </h3>
            </header>
            <p 
              id={`feature-desc-${i}`}
              className="text-sm text-muted-foreground dark:text-zinc-300 leading-relaxed"
            >
              {f.d}
            </p>
          </article>
        ))}
      </div>
    </section>
  )

  const HowItWorks = () => (
    <section id="como-funciona" className="mx-auto max-w-5xl py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Como funciona</h2>
      <p className="text-center text-sm text-muted-foreground dark:text-zinc-300 mb-6">Em poucos passos, do cadastro ao envio — simples, rápido e com IA.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {[{
          n:'1', t:'Crie sua conta', d:'Comece grátis. Sem cartão no Starter.', Icon: CheckCircle2, href:'/login?mode=register'
        },{
          n:'2', t:'Complete o perfil', d:'Importe do LinkedIn ou preencha suas experiências.', Icon: LinkIcon, href:'/profile'
        },{
          n:'3', t:'Escolha o modelo', d:'Pré-visualize e gere seu currículo ATS.', Icon: FileSpreadsheet, href:'/documents/templates'
        },{
          n:'4', t:'Analise a vaga', d:'Cole a descrição/URL e receba o score da IA.', Icon: LineChart, href:'/cover-letters'
        },{
          n:'5', t:'Envie e acompanhe', d:'Baixe em PDF e acompanhe candidaturas.', Icon: ShieldCheck, href:'/applications'
        }].map((s, i) => (
          <a 
            key={i} 
            href={s.href} 
            className="rounded-xl border border-zinc-200 dark:border-white/10 p-5 bg-white/70 dark:bg-zinc-900/60 backdrop-blur transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 min-h-[120px] flex flex-col justify-between"
            aria-label={`Passo ${s.n}: ${s.t} - ${s.d}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-violet-700 dark:text-violet-300 font-bold text-xl min-h-[24px] min-w-[24px] flex items-center justify-center">{s.n}</div>
              <s.Icon className="h-5 w-5 text-violet-700 dark:text-violet-300 flex-shrink-0" />
            </div>
            <div>
              <div className="font-semibold text-base mb-2">{s.t}</div>
              <div className="text-sm text-muted-foreground dark:text-zinc-300">{s.d}</div>
            </div>
          </a>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <a 
          href="/login?mode=register" 
          className="inline-flex items-center justify-center rounded-md bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white px-6 py-3 min-h-[44px] text-sm shadow transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 w-full sm:w-auto"
        >
          Criar conta
        </a>
        <a 
          href="#plans" 
          className="inline-flex items-center justify-center rounded-md border px-6 py-3 min-h-[44px] text-sm bg-white/70 dark:bg-white/10 backdrop-blur transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full sm:w-auto"
        >
          Escolher plano
        </a>
      </div>
    </section>
  )

  const TemplateCard = ({ template, index }: { template: { name: string; key: string }; index: number }) => {
    const [imageLoading, setImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    const handleImageLoad = () => {
      setImageLoading(false)
    }

    const handleImageError = () => {
      setImageError(true)
      setImageLoading(false)
    }

    return (
      <article 
        className="rounded-xl border border-zinc-200 dark:border-white/10 p-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur transition-all duration-200 hover:shadow-md hover:scale-[1.02] focus-within:ring-2 focus-within:ring-violet-400 focus-within:ring-offset-2 group"
        role="gridcell"
        aria-labelledby={`template-name-${index}`}
        aria-describedby={`template-desc-${index}`}
      >
        <div 
          className="relative h-36 w-full rounded border mb-3 overflow-hidden bg-zinc-100 dark:bg-zinc-800"
          role="img"
          aria-label={`Preview do template ${template.name}`}
        >
          {imageLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Carregando preview do template"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
              <FileSpreadsheet className="h-12 w-12 mb-2" aria-hidden="true" />
              <span className="text-xs">Preview indisponível</span>
            </div>
          ) : (
            <Image
              src={`/templates/${template.key}.svg`}
              alt={`Template ${template.name} - Preview do design`}
              fill
              className={`object-cover transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-105`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={index < 2} // Prioritize loading for first 2 images
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        
        <header>
          <h3 
            id={`template-name-${index}`}
            className="font-medium text-base mb-1"
          >
            {template.name}
          </h3>
          <p 
            id={`template-desc-${index}`}
            className="text-xs text-muted-foreground dark:text-zinc-400"
          >
            Compatível com ATS • Pré-preenchido pelo seu perfil
          </p>
        </header>
      </article>
    )
  }

  const TemplatesShowcase = () => (
    <section 
      className="mx-auto max-w-5xl py-16"
      aria-labelledby="templates-heading"
    >
      <h2 
        id="templates-heading"
        className="text-center text-2xl font-semibold mb-6"
      >
        Modelos profissionais e aprovados por recrutadores
      </h2>
      <div 
        className="grid md:grid-cols-3 gap-4"
        role="grid"
        aria-label="Galeria de templates de currículo"
      >
        {[
          { name:'ATS Preto & Branco', key:'ats-bw' },
          { name:'Moderno 2 colunas', key:'modern-grid' },
          { name:'ABNT Clássico', key:'abnt-classic' },
        ].map((template, index) => (
          <TemplateCard key={template.key} template={template} index={index} />
        ))}
      </div>
      <div className="text-center mt-6">
        <a 
          href="/documents/templates" 
          className="inline-flex items-center justify-center min-h-[44px] px-4 text-sm underline transition-all duration-200 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 rounded"
          aria-label="Ver todos os templates disponíveis"
        >
          Ver todos os templates
        </a>
      </div>
    </section>
  )

  


  const Plans = () => (
    <section id="plans" className="mx-auto max-w-5xl py-14">
      <h2 className="text-center text-2xl font-semibold mb-6">Planos</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[{
          key:'starter', name:'Starter', price:'Grátis', benefits:[
            '2 currículos completos', '5 templates ATS', '3 análises/mês', 'PDF com marca d’água'
          ]
        },{
          key:'pro', name:'Pro', price:'R$ 29,90/mês', benefits:[
            'Ilimitado + templates premium', 'IA avançada e análise ATS completa', 'Download sem marca d’água'
          ], highlight:true
        },{
          key:'team', name:'Team', price:'R$ 49,90/mês', benefits:[
            'Tudo do Pro + 5 usuários', 'Dashboard de equipe e integrações'
          ]
        }].map((p:any,i:number)=> (
          <div key={i} className={`rounded-2xl border border-zinc-200 dark:border-white/10 p-6 bg-white/70 dark:bg-zinc-900/60 backdrop-blur ${p.highlight? 'ring-2 ring-amber-400' : ''}`}>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="text-3xl font-extrabold mb-3">{p.price}</div>
            <ul className="text-sm text-muted-foreground dark:text-zinc-300 space-y-1.5 mb-4">
              {p.benefits.map((b:string,bi:number)=>(
                <li key={bi} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {b}</li>
              ))}
            </ul>
            <a
              href={authed ? `/checkout?plan=${p.key}` : `/login?plan=${p.key}`}
              className={`inline-flex items-center justify-center rounded-md ${p.highlight? 'bg-violet-700 hover:bg-violet-800 active:bg-violet-900' : 'bg-black hover:bg-neutral-900 active:bg-neutral-800'} text-white px-4 py-3 min-h-[44px] text-sm w-full text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${p.highlight? 'focus:ring-violet-400' : 'focus:ring-gray-400'}`}
              aria-label={`${p.key==='starter'?'Começar grátis':`Assinar plano ${p.name}`} - ${p.price}`}
            >{p.key==='starter'?'Começar grátis':`Assinar ${p.name}`}</a>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <main className="min-h-dvh p-0 md:p-0">
      <BannerCarousel />
      <Features />
      <HowItWorks />
      <TemplatesShowcase />
      <Plans />
      <Toaster richColors />
    </main>
  )
}
