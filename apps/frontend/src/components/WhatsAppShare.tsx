"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { API_BASE, fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import { 
  MessageCircle, 
  Copy, 
  Share2, 
  Users, 
  Briefcase,
  TrendingUp,
  X
} from "lucide-react"

interface WhatsAppShareProps {
  documentId?: string
  templateKey?: string
  onClose?: () => void
}

const MESSAGE_TEMPLATES = {
  professional: {
    title: "Mensagem Profissional",
    icon: Briefcase,
    template: `Olá! 👋

Sou [SEU NOME], profissional com experiência em [SUA ÁREA].

Gostaria de compartilhar meu currículo atualizado para possíveis oportunidades na sua empresa.

📄 **Currículo anexado**

Estou disponível para uma conversa sobre como posso contribuir com a equipe.

Atenciosamente!`
  },
  networking: {
    title: "Networking",
    icon: Users,
    template: `Oi! 😊

Espero que esteja tudo bem!

Estou em transição de carreira e gostaria de compartilhar meu currículo atualizado.

Se souber de alguma oportunidade que faça sentido para meu perfil, ficarei muito grato(a)!

📄 **Currículo em anexo**

Obrigado(a) pelo apoio! 🙏`
  },
  referral: {
    title: "Indicação",
    icon: TrendingUp,
    template: `Olá! 

Como conversamos, estou enviando meu currículo para a vaga de [NOME DA VAGA].

📄 **Currículo anexado**

Qualquer dúvida, estou à disposição!

Muito obrigado(a) pela indicação! 🚀`
  },
  custom: {
    title: "Personalizada",
    icon: MessageCircle,
    template: "Olá! Gostaria de compartilhar meu currículo atualizado."
  }
}

export function WhatsAppShare({ documentId, templateKey, onClose }: WhatsAppShareProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof MESSAGE_TEMPLATES>('professional')
  const [customMessage, setCustomMessage] = useState(MESSAGE_TEMPLATES.professional.template)
  const [loading, setLoading] = useState(false)
  const [recipientNumber, setRecipientNumber] = useState('')

  const handleTemplateChange = (template: keyof typeof MESSAGE_TEMPLATES) => {
    setSelectedTemplate(template)
    setCustomMessage(MESSAGE_TEMPLATES[template].template)
  }

  const generateShareableLink = async () => {
    if (!documentId && !templateKey) {
      toast.error('Nenhum documento especificado')
      return null
    }

    try {
      // Se não tiver documentId, cria um novo
      let docId = documentId
      if (!docId && templateKey) {
        const response = await fetchWithAuth(`${API_BASE}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Meu Currículo - ${new Date().toLocaleDateString()}`
          })
        })

        if (!response.ok) throw new Error('Falha ao criar documento')
        const doc = await response.json()

        // Define o template
        await fetchWithAuth(`${API_BASE}/documents/${doc.id}/template`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateKey })
        })

        docId = doc.id
      }

      // Gera PDF temporário
      const response = await fetchWithAuth(`${API_BASE}/documents/${docId}/export.pdf`)
      if (!response.ok) throw new Error('Falha ao gerar PDF')

      const blob = await response.blob()
      return { blob, docId }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw error
    }
  }

  const handleShare = async (method: 'web_share' | 'whatsapp_web' | 'copy_message') => {
    setLoading(true)
    try {
      const result = await generateShareableLink()
      if (!result) return

      const { blob } = result
      const file = new File([blob], `curriculo-${Date.now()}.pdf`, { type: 'application/pdf' })

      if (method === 'web_share' && navigator.share && navigator.canShare?.({ files: [file] })) {
        // Web Share API (nativo mobile)
        await navigator.share({
          title: 'Meu Currículo',
          text: customMessage,
          files: [file]
        })
        toast.success('Compartilhado com sucesso!')
      } else if (method === 'whatsapp_web') {
        // WhatsApp Web (desktop/mobile)
        const encodedMessage = encodeURIComponent(
          customMessage + '\n\n📎 *Currículo em PDF anexado*'
        )
        
        const whatsappUrl = recipientNumber 
          ? `https://wa.me/${recipientNumber.replace(/\D/g, '')}?text=${encodedMessage}`
          : `https://wa.me/?text=${encodedMessage}`
        
        // Salva o PDF localmente para o usuário anexar manualmente
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `curriculo-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        // Abre WhatsApp
        window.open(whatsappUrl, '_blank')
        toast.success('WhatsApp aberto! PDF baixado - anexe na conversa.')
      } else if (method === 'copy_message') {
        // Copia apenas a mensagem
        await navigator.clipboard.writeText(customMessage)
        toast.success('Mensagem copiada! Cole no WhatsApp e anexe o PDF.')
        
        // Baixa o PDF
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `curriculo-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
      toast.error('Erro ao compartilhar currículo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Compartilhar via WhatsApp
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Escolha o tipo de mensagem:
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(MESSAGE_TEMPLATES).map(([key, template]) => {
                const Icon = template.icon
                const isSelected = selectedTemplate === key
                return (
                  <Button
                    key={key}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto p-4 justify-start"
                    onClick={() => handleTemplateChange(key as keyof typeof MESSAGE_TEMPLATES)}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{template.title}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Message Customization */}
          <div>
            <Label htmlFor="message" className="text-base font-medium mb-3 block">
              Personalize sua mensagem:
            </Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[120px] resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                {customMessage.length} caracteres
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCustomMessage(MESSAGE_TEMPLATES[selectedTemplate].template)}
              >
                Restaurar template
              </Button>
            </div>
          </div>

          {/* Recipient Number (Optional) */}
          <div>
            <Label htmlFor="number" className="text-base font-medium mb-3 block">
              Número do destinatário (opcional):
            </Label>
            <input
              id="number"
              type="tel"
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
              placeholder="Ex: +5511999999999"
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Se não informar, abrirá a lista de contatos do WhatsApp
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3">
            {/* Web Share API (Mobile Native) */}
            {navigator.share && (
              <Button
                onClick={() => handleShare('web_share')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {loading ? 'Preparando...' : 'Compartilhar (Nativo)'}
              </Button>
            )}

            {/* WhatsApp Web */}
            <Button
              onClick={() => handleShare('whatsapp_web')}
              disabled={loading}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {loading ? 'Preparando...' : 'Abrir WhatsApp Web'}
            </Button>

            {/* Copy Message */}
            <Button
              onClick={() => handleShare('copy_message')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              {loading ? 'Preparando...' : 'Copiar Mensagem + Baixar PDF'}
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para WhatsApp:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use emojis para deixar a mensagem mais amigável</li>
              <li>• Mencione o nome da empresa ou vaga específica</li>
              <li>• Seja conciso mas cordial</li>
              <li>• Inclua um CTA claro (ex: "disponível para conversar")</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}