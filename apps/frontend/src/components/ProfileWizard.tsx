"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Stepper, StepperIndicator } from "@/components/ui/steps"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProfileInfoForm } from "@/components/forms/ProfileInfoForm"
import { ExperienceForm } from "@/components/forms/ExperienceForm"
import { EducationForm } from "@/components/forms/EducationForm"
import { SkillsForm } from "@/components/forms/SkillsForm"
import { LinkedInImportForm } from "@/components/forms/LinkedInImportForm"
import { useProfile, useExperiences, useEducation, useSkills } from "@/hooks/useProfile"
import type { Profile as ProfileType, Experience as ExperienceType, Education as EducationType, Skill as SkillType } from "@/hooks/useProfile"
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Building2, 
  GraduationCap, 
  Zap, 
  Linkedin,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

const STEPS = [
  {
    id: 1,
    title: "Informações Pessoais",
    description: "Dados básicos do perfil",
    icon: User,
    component: "profile"
  },
  {
    id: 2,
    title: "Experiência Profissional", 
    description: "Histórico de trabalho",
    icon: Building2,
    component: "experience"
  },
  {
    id: 3,
    title: "Educação",
    description: "Formação acadêmica",
    icon: GraduationCap,
    component: "education"
  },
  {
    id: 4,
    title: "Skills & Competências",
    description: "Habilidades técnicas",
    icon: Zap,
    component: "skills"
  },
  {
    id: 5,
    title: "Importar do LinkedIn",
    description: "Importação automática",
    icon: Linkedin,
    component: "linkedin"
  }
] as const

interface StepCompletionStatus {
  profile: boolean
  experience: boolean
  education: boolean
  skills: boolean
  linkedin: boolean
}

function useStepCompletion(
  profile: ProfileType | null,
  experiences: ExperienceType[],
  education: EducationType[],
  skills: SkillType[]
): [StepCompletionStatus, () => void] {
  const [completion, setCompletion] = useState<StepCompletionStatus>({
    profile: false,
    experience: false,
    education: false,
    skills: false,
    linkedin: false
  })

  const checkCompletion = useCallback(() => {
    // Verifica múltiplos campos obrigatórios para marcar como completo
    const fullName = profile?.fullName?.trim() || ""
    const headline = profile?.headline?.trim() || ""
    const email = profile?.email?.trim() || ""
    const phone = profile?.phone?.trim() || ""
    const city = profile?.locationCity?.trim() || ""

    // Ignora placeholders antigos (se algum sobrou no banco)
    const isPlaceholderName = /usuário demo/i.test(fullName)
    const isPlaceholderHeadline = /profissional em transição/i.test(headline)

    const hasMinimalContact = !!(email || phone || headline || city)
    const isProfileComplete = !!(fullName && !isPlaceholderName && hasMinimalContact && !isPlaceholderHeadline)
    
    setCompletion({
      profile: isProfileComplete,
      experience: experiences.length > 0,
      education: education.length > 0,
      skills: skills.length > 0,
      // Torna o passo LinkedIn opcional
      linkedin: true,
    })
  }, [profile, experiences, education, skills])

  useEffect(() => {
    checkCompletion()
  }, [checkCompletion])

  return [completion, checkCompletion]
}

interface StepStatusBadgeProps {
  isCompleted: boolean
  isActive: boolean
  className?: string
}

function StepStatusBadge({ isCompleted, isActive, className }: StepStatusBadgeProps) {
  if (isCompleted) {
    return (
      <Badge variant="default" className={`bg-green-100 text-green-800 border-green-200 ${className}`}>
        <CheckCircle className="w-3 h-3 mr-1" />
        Completo
      </Badge>
    )
  }

  if (isActive) {
    return (
      <Badge variant="default" className={`bg-blue-100 text-blue-800 border-blue-200 ${className}`}>
        <Clock className="w-3 h-3 mr-1" />
        Atual
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={`text-muted-foreground ${className}`}>
      <AlertCircle className="w-3 h-3 mr-1" />
      Pendente
    </Badge>
  )
}

interface ProfileWizardProps {
  initialStep?: number
  enableAutoSave?: boolean
  onComplete?: () => void
}

export function ProfileWizard({ 
  initialStep = 1, 
  enableAutoSave = true,
  onComplete 
}: ProfileWizardProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  // Hooks para dados e loaders (uma única instância)
  const { profile, loadProfile } = useProfile()
  const { experiences, loadExperiences } = useExperiences()
  const { education, loadEducation } = useEducation() 
  const { skills, loadSkills } = useSkills()
  const [stepCompletion, recheckCompletion] = useStepCompletion(profile, experiences, education, skills)
  // Rechecar conclusão quando o perfil for atualizado em qualquer step
  useEffect(() => {
    const refreshAndRecheck = async () => {
      await Promise.all([
        loadProfile().catch(() => {}),
        loadExperiences().catch(() => {}),
        loadEducation().catch(() => {}),
        loadSkills().catch(() => {}),
      ])
      recheckCompletion()
    }
    const handler = () => { void refreshAndRecheck() }
    if (typeof window !== 'undefined') {
      window.addEventListener('profile-updated', handler)
      window.addEventListener('experiences-updated', handler)
      window.addEventListener('education-updated', handler)
      window.addEventListener('skills-updated', handler)
      return () => {
        window.removeEventListener('profile-updated', handler)
        window.removeEventListener('experiences-updated', handler)
        window.removeEventListener('education-updated', handler)
        window.removeEventListener('skills-updated', handler)
      }
    }
  }, [recheckCompletion, loadProfile, loadExperiences, loadEducation, loadSkills])

  // Load all data when component mounts
  useEffect(() => {
    Promise.all([
      loadProfile().catch(() => {}),
      loadExperiences().catch(() => {}),
      loadEducation().catch(() => {}),
      loadSkills().catch(() => {})
    ])
  }, [loadProfile, loadExperiences, loadEducation, loadSkills])

  // Update completed steps based on data completion
  useEffect(() => {
    const newCompleted: number[] = []
    if (stepCompletion.profile) newCompleted.push(1)
    if (stepCompletion.experience) newCompleted.push(2)
    if (stepCompletion.education) newCompleted.push(3)
    if (stepCompletion.skills) newCompleted.push(4)
    if (stepCompletion.linkedin) newCompleted.push(5)
    
    setCompletedSteps(newCompleted)
  }, [stepCompletion])

  const currentStepData = STEPS.find(step => step.id === currentStep)
  const canGoNext = currentStep < STEPS.length
  const canGoPrevious = currentStep > 1
  const isLast = currentStep === STEPS.length
  const canFinish = completedSteps.length === STEPS.length

  const handleNext = async () => {
    // Se for o último passo e já pode finalizar, chama onComplete
    if (isLast) {
      if (canFinish && onComplete) {
        onComplete()
      }
      return
    }
    if (canGoNext) {
      // Force save current step data before navigation
      if (currentStepData?.component === "profile" && typeof window !== 'undefined') {
        const forceSave = (window as any).__profileFormForceSave
        if (forceSave) {
          try {
            await forceSave()
          } catch (error) {
            console.warn("Failed to force save before navigation:", error)
          }
        }
      }
      
      // Additional wait to ensure all saves are complete
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = async () => {
    if (canGoPrevious) {
      // Force save current step data before navigation
      if (currentStepData?.component === "profile" && typeof window !== 'undefined') {
        const forceSave = (window as any).__profileFormForceSave
        if (forceSave) {
          try {
            await forceSave()
          } catch (error) {
            console.warn("Failed to force save before navigation:", error)
          }
        }
      }
      
      // Additional wait to ensure all saves are complete
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleStepClick = async (stepId: number) => {
    // Force save current step data before navigation
    if (currentStepData?.component === "profile" && typeof window !== 'undefined') {
      const forceSave = (window as any).__profileFormForceSave
      if (forceSave) {
        try {
          await forceSave()
        } catch (error) {
          console.warn("Failed to force save before navigation:", error)
        }
      }
    }
    
    // Additional wait to ensure all saves are complete
    await new Promise(resolve => setTimeout(resolve, 300))
    setCurrentStep(stepId)
  }

  const handleStepSuccess = async () => {
    await Promise.all([
      loadProfile().catch(() => {}),
      loadExperiences().catch(() => {}),
      loadEducation().catch(() => {}),
      loadSkills().catch(() => {}),
    ])
    recheckCompletion()
  }

  const handleImportComplete = async () => {
    await Promise.all([
      loadProfile().catch(() => {}),
      loadExperiences().catch(() => {}),
      loadEducation().catch(() => {}),
      loadSkills().catch(() => {}),
    ])
    recheckCompletion()
    setCurrentStep(1)
  }

  const renderStepContent = () => {
    if (!currentStepData) return null

    switch (currentStepData.component) {
      case "profile":
        return (
          <ProfileInfoForm 
            enableAutoSave={enableAutoSave}
            onSuccess={handleStepSuccess}
          />
        )
      case "experience":
        return <ExperienceForm />
      case "education":
        return <EducationForm />
      case "skills":
        return <SkillsForm />
      case "linkedin":
        return (
          <LinkedInImportForm 
            onSuccess={handleStepSuccess}
            onImportComplete={handleImportComplete}
          />
        )
      default:
        return null
    }
  }

  const completionPercentage = (completedSteps.length / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background p-6" suppressHydrationWarning>
      {!mounted ? (
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="h-2 w-full bg-muted rounded" />
        </div>
      ) : (
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Complete seu Perfil Profissional</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha todas as seções para ter um perfil completo e aumentar suas chances 
            de encontrar oportunidades de trabalho ideais.
          </p>
          
          {/* Progress Overview */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm text-muted-foreground">
                  {completedSteps.length}/{STEPS.length} seções
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {Math.round(completionPercentage)}% completo
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Navigation */}
        <div className="space-y-6">
          {/* Desktop Stepper */}
          <div className="hidden lg:block">
            <Stepper
              steps={STEPS}
              currentStep={currentStep}
              completedSteps={completedSteps}
              className="max-w-4xl mx-auto"
            />
          </div>

          {/* Mobile/Tablet Step Indicator */}
          <div className="lg:hidden">
            <StepperIndicator
              steps={STEPS.length}
              currentStep={currentStep}
              completedSteps={completedSteps}
              className="max-w-md mx-auto"
            />
          </div>

          {/* Step Cards Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {STEPS.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = completedSteps.includes(step.id)
              
              return (
                <Card 
                  key={step.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isActive ? 'ring-2 ring-primary shadow-md' : ''
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${
                      isCompleted ? 'text-green-600' :
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <h3 className="font-medium text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <StepStatusBadge 
                      isCompleted={isCompleted}
                      isActive={isActive}
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator className="max-w-6xl mx-auto" />

        {/* Step Content */}
        <div className="space-y-6">
          {/* Current Step Header */}
          {currentStepData && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <currentStepData.icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">{currentStepData.title}</h2>
              </div>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="flex justify-center">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center max-w-4xl mx-auto pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="min-w-[100px]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <div className="text-sm text-muted-foreground">
              Passo {currentStep} de {STEPS.length}
            </div>

            <Button 
              onClick={handleNext}
              disabled={isLast ? !canFinish : !canGoNext}
              className={`min-w-[100px] ${isLast && canFinish ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
            >
              {isLast ? 'Concluir' : 'Próximo'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Completion Message */}
          {completedSteps.length === STEPS.length && (
            <Card className="max-w-2xl mx-auto border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Parabéns! Perfil Completo
                </h3>
                <p className="text-green-700 mb-4">
                  Você completou todas as seções do seu perfil profissional.
                  Agora você está pronto para aproveitar ao máximo a plataforma!
                </p>
                {onComplete && (
                  <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                    Finalizar Configuração
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="max-w-4xl mx-auto">
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Atalhos de teclado
            </summary>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>• <kbd className="px-1 py-0.5 bg-muted rounded">←</kbd> ou <kbd className="px-1 py-0.5 bg-muted rounded">Seta esquerda</kbd> - Passo anterior</p>
              <p>• <kbd className="px-1 py-0.5 bg-muted rounded">→</kbd> ou <kbd className="px-1 py-0.5 bg-muted rounded">Seta direita</kbd> - Próximo passo</p>
              <p>• <kbd className="px-1 py-0.5 bg-muted rounded">1-5</kbd> - Ir para passo específico</p>
            </div>
          </details>
        </div>
      </div>
      )}
    </div>
  )
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  currentStep: number,
  totalSteps: number,
  onNext: () => void,
  onPrevious: () => void,
  onGoToStep: (step: number) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere with form inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          onPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          onNext()
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          const stepNumber = parseInt(event.key)
          if (stepNumber <= totalSteps) {
            event.preventDefault()
            onGoToStep(stepNumber)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, totalSteps, onNext, onPrevious, onGoToStep])
}