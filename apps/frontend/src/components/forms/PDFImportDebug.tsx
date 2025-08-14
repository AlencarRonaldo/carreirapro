"use client"

import { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  CircularProgress,
  StepProgress,
  type Step
} from "@/components/ui/progress-indicators"
import { toast } from "@/components/ui/enhanced-toast"
import {
  FileText,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Lightbulb,
  RotateCcw,
  Save,
  ArrowRight,
  Info,
  Target,
  Zap,
  Settings,
  HelpCircle
} from "lucide-react"

// Interface para dados extraídos do PDF
export interface PDFExtractedData {
  // Informações pessoais
  fullName?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  website?: string
  locationCity?: string
  locationState?: string
  locationCountry?: string
  headline?: string
  
  // Experiências
  experiences?: Array<{
    title?: string
    company?: string
    startDate?: string
    endDate?: string
    description?: string
    confidence?: number
  }>
  
  // Educação
  education?: Array<{
    institution?: string
    degree?: string
    startDate?: string
    endDate?: string
    confidence?: number
  }>
  
  // Competências
  skills?: Array<{
    name?: string
    level?: number
    confidence?: number
  }>
  
  // Metadados de confiança
  confidence?: {
    overall: number
    personalInfo: number
    experiences: number
    education: number
    skills: number
  }
  
  // Problemas encontrados
  issues?: Array<{
    field: string
    type: "missing" | "low_confidence" | "invalid_format" | "duplicate"
    message: string
    suggestion?: string
  }>
  
  // Texto original extraído
  rawText?: string
}

// Schema de validação para dados corrigidos
const correctedDataSchema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL inválida").optional().or(z.literal("")),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  locationCity: z.string().optional().or(z.literal("")),
  locationState: z.string().optional().or(z.literal("")),
  locationCountry: z.string().optional().or(z.literal("")),
  headline: z.string().optional().or(z.literal("")),
})

type CorrectedDataType = z.infer<typeof correctedDataSchema>

interface PDFImportDebugProps {
  data: PDFExtractedData
  onCorrectionsApplied?: (correctedData: any) => void
  onRetryImport?: () => void
  onCancel?: () => void
  className?: string
}

export function PDFImportDebug({
  data,
  onCorrectionsApplied,
  onRetryImport,
  onCancel,
  className
}: PDFImportDebugProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [showTips, setShowTips] = useState(false)
  const [processing, setProcessing] = useState(false)
  
  const form = useForm<CorrectedDataType>({
    resolver: zodResolver(correctedDataSchema),
    defaultValues: {
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      website: data.website || "",
      locationCity: data.locationCity || "",
      locationState: data.locationState || "",
      locationCountry: data.locationCountry || "",
      headline: data.headline || "",
    }
  })

  // Calcula estatísticas de confiança
  const getConfidenceStats = () => {
    const overall = data.confidence?.overall || 0
    const personalInfo = data.confidence?.personalInfo || 0
    const experiences = data.confidence?.experiences || 0
    const education = data.confidence?.education || 0
    const skills = data.confidence?.skills || 0
    
    return { overall, personalInfo, experiences, education, skills }
  }

  // Conta problemas por categoria
  const getIssueStats = () => {
    const issues = data.issues || []
    return {
      total: issues.length,
      missing: issues.filter(i => i.type === "missing").length,
      lowConfidence: issues.filter(i => i.type === "low_confidence").length,
      invalidFormat: issues.filter(i => i.type === "invalid_format").length,
      duplicate: issues.filter(i => i.type === "duplicate").length
    }
  }

  // Gera o badge de confiança
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge variant="default" className="bg-green-500">Alta ({confidence}%)</Badge>
    } else if (confidence >= 70) {
      return <Badge variant="secondary" className="bg-yellow-500">Média ({confidence}%)</Badge>
    } else {
      return <Badge variant="destructive">Baixa ({confidence}%)</Badge>
    }
  }

  // Steps do processo de correção
  const processingSteps: Step[] = [
    {
      id: "1",
      title: "Análise do PDF",
      description: "Extração de texto e dados",
      status: "completed"
    },
    {
      id: "2", 
      title: "Identificação de Campos",
      description: "Reconhecimento de informações",
      status: "completed"
    },
    {
      id: "3",
      title: "Validação de Confiança", 
      description: "Análise da qualidade dos dados",
      status: "current"
    },
    {
      id: "4",
      title: "Correções Manuais",
      description: "Ajustes e validações",
      status: "pending"
    }
  ]

  const handleApplyCorrections = async (formData: CorrectedDataType) => {
    setProcessing(true)
    
    try {
      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Combina dados originais com correções
      const correctedData = {
        ...data,
        ...formData,
        // Mantém arrays originais se existirem
        experiences: data.experiences || [],
        education: data.education || [],
        skills: data.skills || [],
        // Marca como corrigido
        corrected: true,
        correctionTimestamp: new Date().toISOString()
      }
      
      toast.success("Correções aplicadas com sucesso!", {
        description: "Os dados foram validados e estão prontos para uso."
      })
      
      onCorrectionsApplied?.(correctedData)
    } catch (error) {
      toast.error("Erro ao aplicar correções", {
        description: "Tente novamente ou contate o suporte."
      })
    } finally {
      setProcessing(false)
    }
  }

  const stats = getConfidenceStats()
  const issues = getIssueStats()

  return (
    <div className={className}>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Depuração de Importação PDF
          </CardTitle>
          <CardDescription>
            Revise e corrija os dados extraídos do seu PDF para garantir a máxima precisão
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Confiança Geral</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.overall}%</p>
                  </div>
                  <CircularProgress 
                    value={stats.overall} 
                    size={50} 
                    color="blue" 
                    className="text-blue-600" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Campos Válidos</p>
                    <p className="text-2xl font-bold text-green-900">
                      {Object.values(data).filter(v => v && v !== "").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Problemas</p>
                    <p className="text-2xl font-bold text-yellow-900">{issues.total}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Experiências</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {data.experiences?.length || 0}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="mb-6">
            <StepProgress 
              steps={processingSteps} 
              orientation="horizontal" 
              size="sm"
            />
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Edit className="w-4 h-4 mr-2" />
                Corrigir
              </TabsTrigger>
              <TabsTrigger value="issues">
                <AlertCircle className="w-4 h-4 mr-2" />
                Problemas ({issues.total})
              </TabsTrigger>
              <TabsTrigger value="tips">
                <Lightbulb className="w-4 h-4 mr-2" />
                Dicas
              </TabsTrigger>
            </TabsList>

            {/* Tab: Preview */}
            <TabsContent value="preview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações Pessoais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Informações Pessoais
                      {getConfidenceBadge(stats.personalInfo)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong>Nome:</strong> {data.fullName || "—"}
                      </div>
                      <div>
                        <strong>Email:</strong> {data.email || "—"}
                      </div>
                      <div>
                        <strong>Telefone:</strong> {data.phone || "—"}
                      </div>
                      <div>
                        <strong>LinkedIn:</strong> {data.linkedin ? "✓" : "—"}
                      </div>
                      <div>
                        <strong>Localização:</strong> 
                        {data.locationCity || data.locationState || data.locationCountry ? 
                          `${data.locationCity || ""} ${data.locationState || ""} ${data.locationCountry || ""}`.trim() : "—"
                        }
                      </div>
                      <div>
                        <strong>Headline:</strong> {data.headline || "—"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estatísticas de Confiança */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Níveis de Confiança
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Informações Pessoais</span>
                          <span>{stats.personalInfo}%</span>
                        </div>
                        <Progress value={stats.personalInfo} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Experiências</span>
                          <span>{stats.experiences}%</span>
                        </div>
                        <Progress value={stats.experiences} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Educação</span>
                          <span>{stats.education}%</span>
                        </div>
                        <Progress value={stats.education} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Competências</span>
                          <span>{stats.skills}%</span>
                        </div>
                        <Progress value={stats.skills} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Experiências e Educação */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Experiências ({data.experiences?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.experiences && data.experiences.length > 0 ? (
                      <div className="space-y-3">
                        {data.experiences.slice(0, 3).map((exp, index) => (
                          <div key={index} className="border-l-2 border-blue-200 pl-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{exp.title || "Cargo não especificado"}</h4>
                              {exp.confidence && getConfidenceBadge(exp.confidence)}
                            </div>
                            <p className="text-sm text-muted-foreground">{exp.company || "Empresa não especificada"}</p>
                            <p className="text-xs text-muted-foreground">
                              {exp.startDate || "—"} até {exp.endDate || "—"}
                            </p>
                          </div>
                        ))}
                        {data.experiences.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{data.experiences.length - 3} experiência(s) adicional(is)
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma experiência encontrada</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Educação ({data.education?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.education && data.education.length > 0 ? (
                      <div className="space-y-3">
                        {data.education.slice(0, 3).map((edu, index) => (
                          <div key={index} className="border-l-2 border-green-200 pl-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{edu.degree || "Curso não especificado"}</h4>
                              {edu.confidence && getConfidenceBadge(edu.confidence)}
                            </div>
                            <p className="text-sm text-muted-foreground">{edu.institution || "Instituição não especificada"}</p>
                            <p className="text-xs text-muted-foreground">
                              {edu.startDate || "—"} até {edu.endDate || "—"}
                            </p>
                          </div>
                        ))}
                        {data.education.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{data.education.length - 3} curso(s) adicional(is)
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma educação encontrada</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Edit */}
            <TabsContent value="edit" className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Correções Manuais</AlertTitle>
                <AlertDescription>
                  Revise e corrija os campos abaixo. Campos com baixa confiança são destacados.
                </AlertDescription>
              </Alert>

              <form onSubmit={form.handleSubmit(handleApplyCorrections)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Completo *</label>
                      <Controller
                        name="fullName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div>
                            <Input 
                              {...field} 
                              placeholder="Digite seu nome completo"
                              className={fieldState.error ? "border-red-500" : ""}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div>
                            <Input 
                              {...field} 
                              type="email"
                              placeholder="seu.email@exemplo.com"
                              className={fieldState.error ? "border-red-500" : ""}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Telefone</label>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            placeholder="(11) 99999-9999"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">LinkedIn</label>
                      <Controller
                        name="linkedin"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div>
                            <Input 
                              {...field} 
                              placeholder="https://linkedin.com/in/seu-perfil"
                              className={fieldState.error ? "border-red-500" : ""}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">GitHub</label>
                      <Controller
                        name="github"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div>
                            <Input 
                              {...field} 
                              placeholder="https://github.com/seu-usuario"
                              className={fieldState.error ? "border-red-500" : ""}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Website</label>
                      <Controller
                        name="website"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div>
                            <Input 
                              {...field} 
                              placeholder="https://seu-site.com"
                              className={fieldState.error ? "border-red-500" : ""}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Cidade</label>
                      <Controller
                        name="locationCity"
                        control={form.control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            placeholder="São Paulo"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Estado</label>
                      <Controller
                        name="locationState"
                        control={form.control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            placeholder="SP"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">País</label>
                      <Controller
                        name="locationCountry"
                        control={form.control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            placeholder="Brasil"
                          />
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Título Profissional</label>
                      <Controller
                        name="headline"
                        control={form.control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            placeholder="Desenvolvedor Full-Stack | React | Node.js"
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Aplicando Correções...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Aplicar Correções
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Tab: Issues */}
            <TabsContent value="issues" className="space-y-4">
              {data.issues && data.issues.length > 0 ? (
                <div className="space-y-3">
                  {data.issues.map((issue, index) => (
                    <Alert key={index} variant={issue.type === "missing" ? "destructive" : "default"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="flex items-center gap-2">
                        Campo: {issue.field}
                        <Badge variant={
                          issue.type === "missing" ? "destructive" :
                          issue.type === "low_confidence" ? "secondary" :
                          issue.type === "invalid_format" ? "destructive" : "default"
                        }>
                          {issue.type === "missing" ? "Ausente" :
                           issue.type === "low_confidence" ? "Baixa Confiança" :
                           issue.type === "invalid_format" ? "Formato Inválido" : "Duplicado"}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <p>{issue.message}</p>
                        {issue.suggestion && (
                          <p className="mt-2 font-medium text-blue-600">
                            💡 Sugestão: {issue.suggestion}
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Nenhum problema encontrado!</AlertTitle>
                  <AlertDescription>
                    Todos os dados foram extraídos com sucesso e estão dentro dos parâmetros de qualidade.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Tab: Tips */}
            <TabsContent value="tips" className="space-y-4">
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Dicas para Melhorar a Importação de PDFs</AlertTitle>
                <AlertDescription>
                  Siga essas recomendações para obter melhores resultados na extração de dados.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Formato do PDF
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>✅ Use PDFs com texto selecionável (não imagens)</p>
                    <p>✅ Mantenha formatação clara e consistente</p>
                    <p>✅ Use fontes padrão e tamanhos legíveis</p>
                    <p>❌ Evite PDFs escaneados de má qualidade</p>
                    <p>❌ Não use fundos coloridos ou texturas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      Estrutura do Conteúdo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>✅ Use seções claramente definidas</p>
                    <p>✅ Inclua títulos para experiências e educação</p>
                    <p>✅ Mantenha datas em formato padrão (MM/YYYY)</p>
                    <p>✅ Liste competências de forma organizada</p>
                    <p>❌ Evite layouts muito criativos ou complexos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-500" />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>✅ Coloque nome e contato no topo</p>
                    <p>✅ Use formato padrão para telefone</p>
                    <p>✅ Inclua links completos (https://)</p>
                    <p>✅ Mantenha endereço de email visível</p>
                    <p>❌ Não use abreviações excessivas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-orange-500" />
                      Solução de Problemas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>🔄 Tente recriar o PDF se a qualidade estiver baixa</p>
                    <p>🎯 Use templates de currículo padronizados</p>
                    <p>📝 Corrija manualmente campos com baixa confiança</p>
                    <p>💡 Considere usar formatos .docx como alternativa</p>
                    <p>🔍 Verifique se todas as informações estão visíveis</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={onRetryImport}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button 
              onClick={() => setActiveTab("edit")}
              className="flex-1"
              disabled={activeTab === "edit"}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Prosseguir com Correções
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Dialog */}
      <Dialog open={showTips} onOpenChange={setShowTips}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Dicas para PDF Perfeito
            </DialogTitle>
            <DialogDescription>
              Como criar um PDF que será importado com 100% de precisão
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📄 Formato Ideal</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• PDF gerado diretamente do Word/Google Docs</li>
                <li>• Texto selecionável (não imagem escaneada)</li>
                <li>• Fonte padrão (Arial, Calibri, Times New Roman)</li>
                <li>• Tamanho mínimo de 10pt para o texto</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🎯 Estrutura Recomendada</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Nome e contato no topo</li>
                <li>• Seções claramente separadas</li>
                <li>• Títulos de cargo e empresa em destaque</li>
                <li>• Datas no formato MM/YYYY ou DD/MM/YYYY</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowTips(false)}>Entendi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Função utilitária para simular dados de exemplo
export function createMockPDFData(): PDFExtractedData {
  return {
    fullName: "João da Silva Santos",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    linkedin: "https://linkedin.com/in/joao-silva",
    github: "",
    website: "",
    locationCity: "São Paulo",
    locationState: "SP", 
    locationCountry: "Brasil",
    headline: "Desenvolvedor Full-Stack",
    experiences: [
      {
        title: "Desenvolvedor Senior",
        company: "Tech Company",
        startDate: "01/2022",
        endDate: "atual",
        description: "Desenvolvimento de aplicações web...",
        confidence: 85
      },
      {
        title: "Desenvolvedor Pleno",
        company: "Startup XYZ",
        startDate: "06/2020",
        endDate: "12/2021",
        description: "Trabalho com React e Node.js...",
        confidence: 78
      }
    ],
    education: [
      {
        institution: "Universidade de São Paulo",
        degree: "Bacharelado em Ciência da Computação",
        startDate: "02/2016",
        endDate: "12/2019",
        confidence: 92
      }
    ],
    skills: [
      { name: "JavaScript", level: 4, confidence: 95 },
      { name: "React", level: 4, confidence: 90 },
      { name: "Node.js", level: 3, confidence: 88 },
      { name: "Python", level: 3, confidence: 75 }
    ],
    confidence: {
      overall: 82,
      personalInfo: 95,
      experiences: 78,
      education: 92,
      skills: 87
    },
    issues: [
      {
        field: "github",
        type: "missing",
        message: "URL do GitHub não foi encontrada no PDF",
        suggestion: "Adicione seu perfil do GitHub para mostrar seus projetos"
      },
      {
        field: "experiences[1].endDate",
        type: "low_confidence",
        message: "Data de término da segunda experiência tem baixa confiança",
        suggestion: "Verifique se a data 12/2021 está correta"
      }
    ],
    rawText: "João da Silva Santos\nDesenvolvedor Full-Stack\n(11) 99999-9999 | joao.silva@email.com..."
  }
}