"use client"

import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StableInput } from '@/components/ui/stable-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Zap,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react'
import { useXPSystem } from '@/hooks/useXPSystem'
import { XPDisplay } from './XPDisplay'
import { toast } from "sonner"
import { DataSource } from './GamifiedOnboarding'
import { useProfile, useExperiences, useEducation, useSkills } from '@/hooks/useProfile'
import type { Experience, Education, Skill } from '@/hooks/useProfile'

// 🔧 FIXED: Usando StableInput que nunca re-renderiza
const MemoizedInput = StableInput

// Use the same form data types as existing forms
export interface ProfileData {
  personal: {
    fullName: string
    headline?: string
    locationCity?: string
    locationState?: string
    locationCountry?: string
    linkedin?: string
    github?: string
    website?: string
    email?: string
    phone?: string
  }
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
}

interface SimpleProfileWizardProps {
  dataSource: DataSource
  importedData?: Partial<ProfileData>
  onComplete: (data: ProfileData) => void
}

interface WizardStep {
  id: number
  name: string
  icon: typeof User
  xp: number
  completed: boolean
}

const WIZARD_STEPS: WizardStep[] = [
  { id: 1, name: 'Verificar', icon: FileText, xp: 100, completed: false },
  { id: 2, name: 'Pessoal', icon: User, xp: 50, completed: false },
  { id: 3, name: 'Experiência', icon: Briefcase, xp: 75, completed: false },
  { id: 4, name: 'Educação', icon: GraduationCap, xp: 60, completed: false },
  { id: 5, name: 'Skills', icon: Zap, xp: 80, completed: false }
]

const COMMON_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript',
  'HTML', 'CSS', 'Git', 'Docker', 'AWS',
  'SQL', 'MongoDB', 'Express', 'Next.js', 'Vue.js',
  'Angular', 'PHP', 'Laravel', 'WordPress', 'Figma',
  'Photoshop', 'Illustrator', 'Marketing Digital', 'SEO', 'Google Analytics'
]

export function SimpleProfileWizard({ 
  dataSource, 
  importedData,
  onComplete 
}: SimpleProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(dataSource === 'manual' ? 2 : 1)
  const [steps, setSteps] = useState(WIZARD_STEPS)

  const { addXP, unlockAchievement } = useXPSystem()
  
  // Use existing hooks but with refs to prevent re-renders
  const { profile, updateProfile, loading: profileLoading } = useProfile()
  const { experiences, createExperience } = useExperiences()
  const { education, createEducation } = useEducation() 
  const { skills, createSkill } = useSkills()
  
  // 🔧 FIXED: Use refs to track if initial data load happened
  const initialLoadRef = useRef(false)

  // Local state for wizard-specific data using same structure as existing forms
  const [tempPersonalData, setTempPersonalData] = useState({
    fullName: '',
    headline: '',
    locationCity: '',
    locationState: '',
    locationCountry: '',
    linkedin: '',
    github: '',
    website: '',
    email: '',
    phone: ''
  })

  const [tempSkills, setTempSkills] = useState<string[]>([])
  const [tempExperiences, setTempExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ])
  const [tempEducation, setTempEducation] = useState<Education[]>([
    {
      id: '1',
      institution: '',
      degree: '',
      startDate: '',
      endDate: ''
    }
  ])

  // 🔧 FIXED: Use refs para todos os dados e evitar re-renderizações
  const personalDataRef = useRef(tempPersonalData)
  const experiencesRef = useRef(tempExperiences)
  const educationRef = useRef(tempEducation)
  const skillsRef = useRef(tempSkills)
  
  // 🔧 FIXED: Sincronizar refs com dados carregados
  useEffect(() => {
    personalDataRef.current = tempPersonalData
    experiencesRef.current = tempExperiences
    educationRef.current = tempEducation
    skillsRef.current = tempSkills
  }, [tempPersonalData, tempExperiences, tempEducation, tempSkills])
  
  const handlePersonalDataChange = useCallback((field: keyof typeof tempPersonalData, value: string) => {
    // 🔧 FIXED: Apenas atualiza ref, NUNCA atualiza estado durante digitação
    console.log(`🔧 Handler chamado - Campo: ${field}, Valor: "${value}"`)
    
    personalDataRef.current = {
      ...personalDataRef.current,
      [field]: value
    }
    
    console.log('🔧 Ref atualizado:', personalDataRef.current)
    
    // Limpa timeout anterior se existir
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    // NÃO atualiza estado - mantém apenas no ref para evitar re-renderizações
    console.log(`Campo ${field} atualizado:`, value)
  }, [])
  
  const updateTimeoutRef = useRef<NodeJS.Timeout>()

  // 🔧 FIXED: Handlers estáveis para experiências
  const handleExperienceChange = useCallback((id: string, field: string, value: string) => {
    experiencesRef.current = experiencesRef.current.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    )
    console.log(`Experiência ${id} campo ${field} atualizado:`, value)
  }, [])

  const handleAddExperience = useCallback(() => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    experiencesRef.current = [...experiencesRef.current, newExperience]
    setTempExperiences([...experiencesRef.current])
  }, [])

  const handleRemoveExperience = useCallback((id: string) => {
    experiencesRef.current = experiencesRef.current.filter(exp => exp.id !== id)
    setTempExperiences([...experiencesRef.current])
  }, [])

  // 🔧 FIXED: Handlers estáveis para educação
  const handleEducationChange = useCallback((id: string, field: string, value: string) => {
    educationRef.current = educationRef.current.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    )
    console.log(`Educação ${id} campo ${field} atualizado:`, value)
  }, [])

  const handleAddEducation = useCallback(() => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: ''
    }
    educationRef.current = [...educationRef.current, newEducation]
    setTempEducation([...educationRef.current])
  }, [])

  const handleRemoveEducation = useCallback((id: string) => {
    educationRef.current = educationRef.current.filter(edu => edu.id !== id)
    setTempEducation([...educationRef.current])
  }, [])

  // 🔧 FIXED: Handlers estáveis para skills
  const customSkillRef = useRef('')
  
  const handleSkillInputChange = useCallback((value: string) => {
    customSkillRef.current = value
    console.log(`Skill personalizada digitada:`, value)
  }, [])
  
  const handleAddSkill = useCallback((skill: string) => {
    if (!skillsRef.current.includes(skill)) {
      skillsRef.current = [...skillsRef.current, skill]
      setTempSkills([...skillsRef.current])
      console.log(`Skill adicionada:`, skill)
    }
  }, [])
  
  const handleRemoveSkill = useCallback((skill: string) => {
    skillsRef.current = skillsRef.current.filter(s => s !== skill)
    setTempSkills([...skillsRef.current])
    console.log(`Skill removida:`, skill)
  }, [])
  
  const handleAddCustomSkill = useCallback(() => {
    const skill = customSkillRef.current.trim()
    if (skill && !skillsRef.current.includes(skill)) {
      skillsRef.current = [...skillsRef.current, skill]
      setTempSkills([...skillsRef.current])
      customSkillRef.current = ''
      // Limpar o input visualmente
      const input = document.getElementById('custom-skill') as HTMLInputElement
      if (input) input.value = ''
      console.log(`Skill personalizada adicionada:`, skill)
    }
  }, [])

  // 🔧 FIXED: Use ref to prevent re-execution of data initialization
  useEffect(() => {
    if (!initialLoadRef.current && profile && !profileLoading) {
      setTempPersonalData(prev => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        headline: profile.headline || prev.headline,
        locationCity: profile.locationCity || prev.locationCity,
        locationState: profile.locationState || prev.locationState,
        locationCountry: profile.locationCountry || prev.locationCountry,
        linkedin: profile.linkedin || prev.linkedin,
        github: profile.github || prev.github,
        website: profile.website || prev.website,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone
      }))
      
      if (skills.length > 0) {
        setTempSkills(prev => prev.length > 0 ? prev : skills.map(skill => skill.name))
      }
      
      if (experiences.length > 0) {
        setTempExperiences(prev => prev.length > 1 ? prev : experiences)
      }
      
      if (education.length > 0) {
        setTempEducation(prev => prev.length > 1 ? prev : education)
      }
      
      initialLoadRef.current = true
    }
  }, [profile, skills, experiences, education, profileLoading])

  // Handle initial data import based on dataSource
  useEffect(() => {
    const handleImport = async () => {
      if (dataSource === 'linkedin') {
        // For now, simulate LinkedIn import
        console.log('LinkedIn import selected - would trigger LinkedIn import flow')
        // TODO: Implement actual LinkedIn import
      } else if (dataSource === 'pdf') {
        // For now, simulate PDF import
        console.log('PDF import selected - would trigger PDF upload flow')
        // TODO: Implement actual PDF upload flow
      }
      // For manual, no import needed - user will fill everything manually
    }
    
    handleImport()
  }, [dataSource])

  // Load imported data
  useEffect(() => {
    if (importedData?.personal) {
      setTempPersonalData(prev => ({
        ...prev,
        ...importedData.personal
      }))
    }
    if (importedData?.skills) {
      setTempSkills(importedData.skills.map(skill => skill.name))
    }
    if (importedData?.experiences) {
      setTempExperiences(importedData.experiences)
    }
    if (importedData?.education) {
      setTempEducation(importedData.education)
    }
  }, [importedData])

  const completeStep = (stepId: number, xpReward: number, reason: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ))
    addXP(xpReward, reason)
  }

  const nextStep = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Wizard complete - SAVE DATA TO DATABASE FIRST
      try {
        console.log('🔄 Salvando dados finais no banco...')
        
        // Save experiences to database
        for (const exp of experiencesRef.current) {
          if (exp.title && exp.company) {
            console.log('💾 Salvando experiência:', exp)
            await createExperience({
              title: exp.title,
              company: exp.company,
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || ''
            })
          }
        }
        
        // Save education to database
        for (const edu of educationRef.current) {
          if (edu.institution && edu.degree) {
            console.log('💾 Salvando educação:', edu)
            await createEducation({
              institution: edu.institution,
              degree: edu.degree,
              startDate: edu.startDate || '',
              endDate: edu.endDate || ''
            })
          }
        }
        
        // Save skills to database
        for (const skillName of skillsRef.current) {
          if (skillName) {
            console.log('💾 Salvando skill:', skillName)
            await createSkill({
              name: skillName,
              level: 1
            })
          }
        }
        
        console.log('✅ Todos os dados salvos no banco!')
        
        unlockAchievement('profile_complete')
        addXP(200, 'Perfil 100% preenchido!')
        
        // Create final data from current state
        const finalData: ProfileData = {
          personal: personalDataRef.current,
          experiences: experiencesRef.current,
          education: educationRef.current,
          skills: skillsRef.current.map(name => ({ id: '', name, level: 1 }))
        }
        
        toast.success('Perfil salvo com sucesso! 🎉')
        onComplete(finalData)
      } catch (error) {
        console.error('❌ Erro ao salvar dados:', error)
        toast.error('Erro ao salvar dados. Tente novamente.')
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Step 1: Import/Setup based on dataSource
  const Step1Setup = () => {
    if (dataSource === 'manual') {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="w-6 h-6 text-blue-500" />
              Preenchimento Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-700 dark:text-blue-300 font-medium">
                ✏️ Vamos preencher seu perfil passo a passo!
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Não se preocupe, você ganhará XP a cada seção completada.
              </p>
            </div>
            <Button onClick={nextStep} className="w-full" size="lg">
              Começar Preenchimento <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (dataSource === 'linkedin') {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Briefcase className="w-6 h-6 text-blue-500" />
              Importar do LinkedIn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                🔗 Em desenvolvimento: Importação do LinkedIn
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Por enquanto, vamos preencher manualmente. Em breve você poderá importar direto do LinkedIn!
              </p>
            </div>
            <Button onClick={nextStep} className="w-full" size="lg">
              Preencher Manualmente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (dataSource === 'pdf') {
      return <PDFUploadStep />
    }

    return null
  }

  // PDF Upload Component
  const PDFUploadStep = () => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { importFromResume } = useProfile()

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      
      const files = e.dataTransfer.files
      if (files && files[0]) {
        handleFileSelect(files[0])
      }
    }

    const handleFileSelect = (selectedFile: File) => {
      // Validar tipo de arquivo
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Por favor, selecione um arquivo PDF ou Word (.pdf, .docx, .doc)')
        return
      }

      // Validar tamanho (máx 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 10MB')
        return
      }

      setFile(selectedFile)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFileSelect(selectedFile)
      }
    }

    const handleUpload = async () => {
      if (!file) return

      try {
        setUploading(true)
        await importFromResume(file, true)
        
        // Adicionar XP pela importação
        addXP(100, 'Upload de PDF realizado')
        completeStep(1, 100, 'PDF importado com sucesso')
        
        toast.success('Currículo importado com sucesso! 🎉')
        nextStep()
      } catch (error) {
        toast.error('Erro ao importar currículo. Tente novamente.')
        console.error('Upload error:', error)
      } finally {
        setUploading(false)
      }
    }

    const resetFile = () => {
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Upload className="w-6 h-6 text-purple-500" />
            Upload de Currículo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <>
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arraste seu currículo aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Formatos aceitos: PDF, DOCX, DOC (máx. 10MB)
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={nextStep}
                  className="text-gray-600"
                >
                  Pular e preencher manualmente
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* File Selected */}
              <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800 dark:text-purple-200">
                        {file.name}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFile}
                    disabled={uploading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={resetFile}
                  disabled={uploading}
                  className="flex-1"
                >
                  Escolher Outro
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Currículo
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  // Step 2: Personal Information
  const Step2Personal = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="w-6 h-6 text-blue-500" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="fullName">Nome Completo *</Label>
            <MemoizedInput
              id="fullName"
              defaultValue={tempPersonalData.fullName}
              onChange={(e) => handlePersonalDataChange('fullName', e.target.value)}
              placeholder="Seu nome completo"
              className="text-lg h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <MemoizedInput
                id="email"
                type="email"
                defaultValue={tempPersonalData.email}
                onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                placeholder="seu@email.com"
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="phone">WhatsApp</Label>
              <MemoizedInput
                id="phone"
                defaultValue={tempPersonalData.phone}
                onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="locationCity">Cidade</Label>
              <MemoizedInput
                id="locationCity"
                defaultValue={tempPersonalData.locationCity}
                onChange={(e) => handlePersonalDataChange('locationCity', e.target.value)}
                placeholder="São Paulo"
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="locationState">Estado</Label>
              <MemoizedInput
                id="locationState"
                defaultValue={tempPersonalData.locationState}
                onChange={(e) => handlePersonalDataChange('locationState', e.target.value)}
                placeholder="SP"
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="locationCountry">País</Label>
              <MemoizedInput
                id="locationCountry"
                defaultValue={tempPersonalData.locationCountry}
                onChange={(e) => handlePersonalDataChange('locationCountry', e.target.value)}
                placeholder="Brasil"
                className="h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headline">Título Profissional</Label>
            <MemoizedInput
              id="headline"
              defaultValue={tempPersonalData.headline}
              onChange={(e) => handlePersonalDataChange('headline', e.target.value)}
              placeholder="Ex: Desenvolvedor Full Stack"
              className="h-12"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <MemoizedInput
              id="linkedin"
              defaultValue={tempPersonalData.linkedin}
              onChange={(e) => handlePersonalDataChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/seuperfil"
              className="h-12"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          <Button 
            className="flex-1"
            disabled={profileLoading}
            onClick={async () => {
              // 🔧 FIXED: Validar usando ref ao invés de estado + DEBUG
              const currentData = personalDataRef.current
              console.log('🔍 Dados no ref durante validação:', currentData)
              console.log('🔍 Dados no estado durante validação:', tempPersonalData)
              
              const isValid = currentData.fullName && currentData.fullName.trim()
              console.log('🔍 Validação - fullName no ref:', currentData.fullName)
              console.log('🔍 Validação - isValid:', isValid)
              
              if (!isValid) {
                console.log('❌ Validação falhou - alertando usuário')
                alert('Por favor, preencha pelo menos o nome completo.')
                return
              }
              
              console.log('✅ Validação passou - prosseguindo')

              try {
                // 🔧 FIXED: Converter dados para o formato esperado pela API
                const profileFormData = {
                  fullName: personalDataRef.current.fullName || tempPersonalData.fullName,
                  headline: personalDataRef.current.headline || tempPersonalData.headline,
                  locationCity: personalDataRef.current.locationCity || tempPersonalData.locationCity,
                  locationState: personalDataRef.current.locationState || tempPersonalData.locationState,
                  locationCountry: personalDataRef.current.locationCountry || tempPersonalData.locationCountry,
                  linkedin: personalDataRef.current.linkedin || tempPersonalData.linkedin,
                  github: personalDataRef.current.github || tempPersonalData.github,
                  website: personalDataRef.current.website || tempPersonalData.website,
                  email: personalDataRef.current.email || tempPersonalData.email,
                  phone: personalDataRef.current.phone || tempPersonalData.phone,
                  maritalStatus: '' // Campo opcional
                }
                
                await updateProfile(profileFormData)
                completeStep(2, 50, 'Informações pessoais')
                nextStep()
              } catch (error) {
                console.error('Error saving profile:', error)
                toast.error('Erro ao salvar perfil. Tente novamente.')
              }
            }}
          >
            {profileLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Step 3: Experience - 🔧 FIXED com handlers estáveis
  const Step3Experience = () => {

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="w-6 h-6 text-green-500" />
            Experiência Profissional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tempExperiences.map((exp, index) => (
            <div key={exp.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-lg">Experiência {index + 1}</h4>
                {tempExperiences.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExperience(exp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cargo</Label>
                  <MemoizedInput
                    defaultValue={exp.title}
                    onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                    placeholder="Ex: Desenvolvedor Frontend"
                  />
                </div>
                <div>
                  <Label>Empresa</Label>
                  <MemoizedInput
                    defaultValue={exp.company}
                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                    placeholder="Ex: Tech Company"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <MemoizedInput
                    type="month"
                    defaultValue={exp.startDate || ''}
                    onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Data de Fim</Label>
                  <MemoizedInput
                    type="month"
                    defaultValue={exp.endDate || ''}
                    onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                    placeholder="Deixe vazio se atual"
                  />
                </div>
              </div>

              <div>
                <Label>Descrição das Atividades</Label>
                <Textarea
                  defaultValue={exp.description || ''}
                  onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                  placeholder="Descreva suas principais responsabilidades..."
                  rows={3}
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={handleAddExperience}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Experiência
          </Button>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                completeStep(3, 75, 'Experiências adicionadas')
                nextStep()
              }}
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Step 4: Education
  const Step4Education = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="w-6 h-6 text-purple-500" />
            Formação Acadêmica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tempEducation.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-lg">Formação {index + 1}</h4>
                {tempEducation.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEducation(edu.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Instituição</Label>
                  <MemoizedInput
                    defaultValue={edu.institution}
                    onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                    placeholder="Ex: Universidade de São Paulo"
                  />
                </div>
                <div>
                  <Label>Curso/Grau</Label>
                  <MemoizedInput
                    defaultValue={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    placeholder="Ex: Bacharelado em Ciência da Computação"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <MemoizedInput
                    type="month"
                    defaultValue={edu.startDate || ''}
                    onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Data de Conclusão</Label>
                  <MemoizedInput
                    type="month"
                    defaultValue={edu.endDate || ''}
                    onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                    placeholder="Deixe vazio se em andamento"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={handleAddEducation}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Formação
          </Button>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                completeStep(4, 60, 'Educação adicionada')
                nextStep()
              }}
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Step 5: Skills
  const Step5Skills = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-6 h-6 text-yellow-500" />
            Habilidades e Competências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Skills */}
          {tempSkills.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Suas Skills:</Label>
              <div className="flex flex-wrap gap-2">
                {tempSkills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Skill */}
          <div>
            <Label htmlFor="custom-skill">Adicionar Skill Personalizada</Label>
            <div className="flex gap-2">
              <MemoizedInput
                id="custom-skill"
                onChange={(e) => handleSkillInputChange(e.target.value)}
                placeholder="Digite uma habilidade..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
              />
              <Button onClick={handleAddCustomSkill}>Adicionar</Button>
            </div>
          </div>

          {/* Common Skills */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Ou escolha das mais comuns:</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.filter(skill => !tempSkills.includes(skill)).map(skill => (
                <Badge 
                  key={skill} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => handleAddSkill(skill)}
                >
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                completeStep(5, 80, 'Skills adicionadas')
                nextStep()
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Finalizar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = (currentStep / 5) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 p-4">
      {/* XP Display */}
      <div className="fixed top-4 right-4 z-10">
        <XPDisplay compact />
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto pt-8 pb-4">
        <div className="flex justify-center items-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${
                currentStep >= step.id ? 'opacity-100' : 'opacity-50'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  step.completed 
                    ? 'bg-green-500'
                    : currentStep === step.id
                    ? 'bg-blue-500'
                    : 'bg-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{step.name}</span>
                {step.completed && (
                  <Badge className="mt-1 bg-green-500">+{step.xp} XP</Badge>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso do Perfil</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </div>

      {/* Step Content - 🔧 FIXED: Removidas animações que causam re-renderização */}
      <div className="max-w-4xl mx-auto pb-8">
        <div>
          {currentStep === 1 && <Step1Setup />}
          {currentStep === 2 && <Step2Personal />}
          {currentStep === 3 && <Step3Experience />}
          {currentStep === 4 && <Step4Education />}
          {currentStep === 5 && <Step5Skills />}
        </div>
      </div>
    </div>
  )
}