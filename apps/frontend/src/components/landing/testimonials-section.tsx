"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, CheckCircle2, TrendingUp } from "lucide-react"

const testimonials = [
  {
    name: "Ana Paula",
    role: "Desenvolvedora Frontend",
    company: "iFood",
    avatar: "/api/placeholder/100/100",
    rating: 5,
    text: "Consegui minha vaga dos sonhos na iFood em 2 semanas! O template ATS e a análise de vaga com IA fizeram toda diferença. Recomendo demais!",
    result: "Contratada em 2 semanas",
    color: "emerald"
  },
  {
    name: "Carlos Mendes",
    role: "Product Manager",
    company: "Nubank",
    avatar: "/api/placeholder/100/100",
    rating: 5,
    text: "A funcionalidade de análise de vaga é impressionante. Recebi um score de 89% e seguindo as sugestões, consegui 3 entrevistas na mesma semana.",
    result: "Score 89% → 3 entrevistas",
    color: "blue"
  },
  {
    name: "Mariana Silva",
    role: "UX Designer",
    company: "Stone",
    avatar: "/api/placeholder/100/100",
    rating: 5,
    text: "Os templates são lindos e super profissionais. Passei em várias triagens automáticas que antes não passava. Vale cada centavo!",
    result: "100% aprovação ATS",
    color: "purple"
  },
  {
    name: "João Santos",
    role: "Data Scientist",
    company: "Magazine Luiza",
    avatar: "/api/placeholder/100/100",
    rating: 5,
    text: "Importei meu LinkedIn e em 5 minutos tinha um currículo perfeito. A IA sugeriu melhorias que nem imaginei. Ferramenta incrível!",
    result: "Currículo em 5 minutos",
    color: "amber"
  },
  {
    name: "Fernanda Costa",
    role: "Marketing Manager",
    company: "Shopee",
    avatar: "/api/placeholder/100/100",
    rating: 5,
    text: "O dashboard de candidaturas organizou toda minha busca por emprego. Consegui acompanhar 15 processos simultâneos sem perder nada.",
    result: "15 processos organizados",
    color: "cyan"
  },
  {
    name: "Roberto Lima",
    role: "Engenheiro de Software",
    company: "Mercado Livre",
    avatar: "/api/placeholder/100/100",
    rating: 5,
    text: "A carta de apresentação gerada pela IA me diferenciou dos outros candidatos. Recebi feedback positivo em todas as aplicações.",
    result: "Feedback 100% positivo",
    color: "indigo"
  }
]

const companies = [
  { name: "iFood", logo: "🍕" },
  { name: "Nubank", logo: "💜" },
  { name: "Stone", logo: "💚" },
  { name: "Magazine Luiza", logo: "🛍️" },
  { name: "Shopee", logo: "🛒" },
  { name: "Mercado Livre", logo: "🏪" },
  { name: "Uber", logo: "🚗" },
  { name: "99", logo: "🚖" }
]

const stats = [
  { number: "10.847", label: "Currículos criados", trend: "+23%" },
  { number: "95%", label: "Taxa aprovação ATS", trend: "+15%" },
  { number: "2.3x", label: "Mais entrevistas", trend: "+45%" },
  { number: "4.9/5", label: "Avaliação média", trend: "⭐" }
]

const getColorClasses = (color: string) => {
  const colors = {
    emerald: "from-emerald-500 to-green-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-violet-500",
    amber: "from-amber-500 to-orange-500",
    cyan: "from-cyan-500 to-teal-500",
    indigo: "from-indigo-500 to-purple-500"
  }
  return colors[color as keyof typeof colors] || colors.purple
}

export function TestimonialsSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([])

  useEffect(() => {
    // Animate cards appearance
    const timers = testimonials.map((_, index) => 
      setTimeout(() => {
        setVisibleCards(prev => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
      }, index * 200)
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-emerald-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20" />
      
      <div className="mx-auto max-w-6xl px-4 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge 
            variant="outline" 
            className="bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
          >
            Histórias de Sucesso
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Mais de 10.000 profissionais
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              já conquistaram suas vagas
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Veja como o CarreiraPro transformou a busca por emprego de centenas de profissionais 
            em empresas top de tecnologia e inovação.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border-0 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0 space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className={`group relative overflow-hidden border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-between items-start">
                  <Quote className="h-8 w-8 text-violet-400 opacity-50" />
                  <div className="flex text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Result Badge */}
                <Badge 
                  className={`bg-gradient-to-r ${getColorClasses(testimonial.color)} text-white border-0`}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {testimonial.result}
                </Badge>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Companies */}
        <div className="text-center space-y-6">
          <p className="text-sm text-muted-foreground font-medium">
            Nossos usuários trabalham nas melhores empresas do Brasil
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-100"
              >
                <span className="text-lg">{company.logo}</span>
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}