"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { API_BASE, fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import { WhatsAppShare } from "@/components/WhatsAppShare"
import { 
  Download, 
  MessageCircle, 
  FileText, 
  Eye, 
  Sparkles,
  CheckCircle,
  Crown
} from "lucide-react"

interface Template {
  key: string
  name: string
  description: string
  category: string
  preview?: string
}

interface ResumeCompletionProps {
  onClose?: () => void
  onBackToProfile?: () => void
}

export function ResumeCompletion({ onClose, onBackToProfile }: ResumeCompletionProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState<'templates' | 'actions'>('templates')
  const [showWhatsAppShare, setShowWhatsAppShare] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      const response = await fetchWithAuth(`${API_BASE}/documents/templates/list`)
      if (!response.ok) throw new Error('Falha ao carregar templates')
      const data = await response.json()
      setTemplates(data)
      // Auto-select primeiro template
      if (data.length > 0) {
        setSelectedTemplate(data[0].key)
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
      toast.error('Erro ao carregar templates')
    }
  }

  async function createResumeDocument() {
    if (!selectedTemplate) return null

    try {
      const response = await fetchWithAuth(`${API_BASE}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Meu Currículo - ${new Date().toLocaleDateString()}`
        })
      })

      if (!response.ok) throw new Error('Falha ao criar documento')
      const doc = await response.json()

      // Define o template do documento
      await fetchWithAuth(`${API_BASE}/documents/${doc.id}/template`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateKey: selectedTemplate })
      })

      return doc.id
    } catch (error) {
      console.error('Erro ao criar documento:', error)
      throw error
    }
  }

  async function handleDownloadPDF() {
    if (!selectedTemplate) {
      toast.error('Selecione um template primeiro')
      return
    }

    setLoading(true)
    try {
      const docId = await createResumeDocument()
      if (!docId) throw new Error('Falha ao criar documento')

      // Download direto do PDF
      const response = await fetchWithAuth(`${API_BASE}/documents/${docId}/export.pdf`)
      if (!response.ok) throw new Error('Falha ao gerar PDF')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `curriculo-${new Date().getTime()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar PDF:', error)
      toast.error('Erro ao baixar PDF')
    } finally {
      setLoading(false)
    }
  }

  function handleShareWhatsApp() {
    if (!selectedTemplate) {
      toast.error('Selecione um template primeiro')
      return
    }
    setShowWhatsAppShare(true)
  }

  async function handleGenerateCoverLetter() {
    setGenerating(true)
    try {
      // Cria uma carta de apresentação automática baseada no currículo
      const response = await fetchWithAuth(`${API_BASE}/cover-letters/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: 'Posição Desejada',
          companyName: 'Empresa dos Sonhos',
          jobDescription: 'Baseado no meu perfil profissional, crie uma carta de apresentação genérica mas personalizada.',
          tone: 'professional',
          length: 'medium'
        })
      })

      if (!response.ok) {
        if (response.status === 403) {
          toast.error('Recurso disponível apenas no plano PRO')
          return
        }
        throw new Error('Falha ao gerar carta')
      }

      const coverLetter = await response.json()
      toast.success('Carta de apresentação gerada com sucesso!')
      
      // Redireciona para a página de cartas
      window.location.href = '/cover-letters'
    } catch (error) {
      console.error('Erro ao gerar carta:', error)
      toast.error('Erro ao gerar carta de apresentação')
    } finally {
      setGenerating(false)
    }
  }

  const selectedTemplateData = templates.find(t => t.key === selectedTemplate)

  if (currentStep === 'templates') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Perfil Completo!</h1>
          <p className="text-muted-foreground text-lg">
            Agora escolha um template para o seu currículo
          </p>
        </div>

        <Separator />

        {/* Template Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Escolha seu Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.key}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.key ? 'ring-2 ring-primary shadow-md' : ''
                }`}
                onClick={() => setSelectedTemplate(template.key)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {template.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  {template.preview && (
                    <div className="bg-gray-100 rounded-md h-32 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={onBackToProfile}>
            Voltar ao Perfil
          </Button>
          
          <Button 
            onClick={() => setCurrentStep('actions')}
            disabled={!selectedTemplate}
            className="bg-green-600 hover:bg-green-700"
          >
            Continuar com {selectedTemplateData?.name}
          </Button>
        </div>
      </div>
    )
  }

  // Step 2: Actions
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Seu Currículo Está Pronto!</h1>
        <p className="text-muted-foreground text-lg">
          Template: <span className="font-medium">{selectedTemplateData?.name}</span>
        </p>
      </div>

      <Separator />

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Download PDF */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Baixe seu currículo em formato PDF profissional para enviar por email ou imprimir.
            </p>
            <Button 
              onClick={handleDownloadPDF}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Gerando PDF...' : 'Baixar PDF'}
            </Button>
          </CardContent>
        </Card>

        {/* Share WhatsApp */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Compartilhar WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Compartilhe seu currículo diretamente pelo WhatsApp com recrutadores ou contatos.
            </p>
            <Button 
              onClick={handleShareWhatsApp}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Preparando...' : 'Compartilhar'}
            </Button>
          </CardContent>
        </Card>

        {/* Generate Cover Letter (PRO) */}
        <Card className="hover:shadow-md transition-shadow border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              Carta de Apresentação
              <Crown className="h-4 w-4 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Gere uma carta de apresentação personalizada automaticamente baseada no seu perfil.
            </p>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Plano PRO
            </Badge>
            <Button 
              onClick={handleGenerateCoverLetter}
              disabled={generating}
              variant="outline"
              className="w-full border-amber-300 hover:bg-amber-50"
            >
              {generating ? 'Gerando com IA...' : 'Gerar Carta'}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Cover Letter */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Criar Carta Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Acesse o editor de cartas para criar cartas personalizadas para vagas específicas.
            </p>
            <Button 
              onClick={() => window.location.href = '/cover-letters'}
              variant="outline"
              className="w-full"
            >
              Ir para Cartas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => setCurrentStep('templates')}>
          Voltar aos Templates
        </Button>
        
        <Button onClick={onClose} variant="outline">
          Finalizar
        </Button>
      </div>

      {/* WhatsApp Share Modal */}
      {showWhatsAppShare && (
        <WhatsAppShare
          templateKey={selectedTemplate || undefined}
          onClose={() => setShowWhatsAppShare(false)}
        />
      )}
    </div>
  )
}