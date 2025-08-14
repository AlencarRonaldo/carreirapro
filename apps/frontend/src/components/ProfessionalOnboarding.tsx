"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  TrendingUp, 
  Briefcase, 
  GraduationCap,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react"

interface ProfessionalOnboardingProps {
  onComplete: (data: OnboardingData) => void
}

export interface OnboardingData {
  goal: 'new_job' | 'promotion' | 'career_change' | 'freelance' | 'first_job'
  experience_level: 'student' | 'entry' | 'mid' | 'senior' | 'executive'
  industry: string
  data_source: 'linkedin' | 'pdf' | 'manual'
  urgency: 'asap' | 'month' | 'quarter' | 'exploring'
}

const GOALS = [
  {
    id: 'new_job' as const,
    title: 'Novo Emprego',
    description: 'Procurando uma nova oportunidade na mesma área',
    icon: Briefcase,
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    badge: 'Mais Popular'
  },
  {
    id: 'promotion' as const,
    title: 'Promoção Interna',
    description: 'Crescimento na empresa atual ou mudança de cargo',
    icon: TrendingUp,
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  {
    id: 'career_change' as const,
    title: 'Mudança de Carreira',
    description: 'Transição para uma nova área profissional',
    icon: Target,
    color: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  {
    id: 'freelance' as const,
    title: 'Trabalho Freelance',
    description: 'Projetos independentes ou consultoria',
    icon: Users,
    color: 'bg-orange-50 border-orange-200 text-orange-800'
  },
  {
    id: 'first_job' as const,
    title: 'Primeiro Emprego',
    description: 'Estudante ou recém-formado buscando experiência',
    icon: GraduationCap,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    badge: 'Estudante'
  }
]

const EXPERIENCE_LEVELS = [
  { id: 'student', label: 'Estudante', description: 'Ainda estudando, sem experiência profissional' },
  { id: 'entry', label: 'Iniciante', description: '0-2 anos de experiência' },
  { id: 'mid', label: 'Pleno', description: '3-5 anos de experiência' },
  { id: 'senior', label: 'Sênior', description: '5+ anos de experiência' },
  { id: 'executive', label: 'Executivo', description: 'Liderança/Gestão de equipes' }
]

const DATA_SOURCES = [
  {
    id: 'linkedin' as const,
    title: 'Importar do LinkedIn',
    description: 'Rápido e automático',
    icon: '🔗',
    time: '30 segundos',
    recommended: true
  },
  {
    id: 'pdf' as const,
    title: 'Upload de PDF',
    description: 'Currículo existente',
    icon: '📄',
    time: '1 minuto'
  },
  {
    id: 'manual' as const,
    title: 'Preenchimento Manual',
    description: 'Começar do zero',
    icon: '✏️',
    time: '5-10 minutos'
  }
]

const INDUSTRIES = [
  'Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Marketing',
  'Vendas', 'Recursos Humanos', 'Engenharia', 'Design',
  'Administração', 'Jurídico', 'Logística', 'Outro'
]

export function ProfessionalOnboarding({ onComplete }: ProfessionalOnboardingProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<OnboardingData>>({})

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(data as OnboardingData)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!data.goal
      case 2: return !!data.experience_level
      case 3: return !!data.industry
      case 4: return !!data.data_source
      default: return false
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Qual é seu objetivo?"
      case 2: return "Qual seu nível de experiência?"
      case 3: return "Em qual área você atua?"
      case 4: return "Como prefere começar?"
      default: return ""
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Vamos personalizar sua experiência com base no seu objetivo profissional"
      case 2: return "Isso nos ajuda a sugerir o template e conteúdo mais adequados"
      case 3: return "Vamos otimizar seu currículo para sua área de atuação"
      case 4: return "Escolha a forma mais conveniente para você"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">CarreiraPro</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Vamos criar o currículo perfeito para você em alguns passos
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Passo {step} de 4</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl mb-2">{getStepTitle()}</CardTitle>
            <p className="text-muted-foreground">{getStepDescription()}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Goal Selection */}
            {step === 1 && (
              <div className="grid gap-4">
                {GOALS.map((goal) => {
                  const Icon = goal.icon
                  const isSelected = data.goal === goal.id
                  return (
                    <Card
                      key={goal.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => updateData('goal', goal.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${goal.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{goal.title}</h3>
                            {goal.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {goal.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Step 2: Experience Level */}
            {step === 2 && (
              <RadioGroup 
                value={data.experience_level || ''} 
                onValueChange={(value) => updateData('experience_level', value)}
                className="space-y-3"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <div key={level.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={level.id} id={level.id} />
                    <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-muted-foreground">{level.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Step 3: Industry */}
            {step === 3 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INDUSTRIES.map((industry) => (
                  <Button
                    key={industry}
                    variant={data.industry === industry ? "default" : "outline"}
                    className="h-12 text-sm"
                    onClick={() => updateData('industry', industry)}
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            )}

            {/* Step 4: Data Source */}
            {step === 4 && (
              <div className="grid gap-4">
                {DATA_SOURCES.map((source) => {
                  const isSelected = data.data_source === source.id
                  return (
                    <Card
                      key={source.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => updateData('data_source', source.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-2xl">{source.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{source.title}</h3>
                            {source.recommended && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Recomendado
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{source.description}</p>
                          <p className="text-xs text-blue-600">⏱️ {source.time}</p>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Voltar
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="min-w-[120px]"
              >
                {step === 4 ? 'Começar' : 'Próximo'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          ✨ Criando currículos profissionais desde 2024
        </div>
      </div>
    </div>
  )
}