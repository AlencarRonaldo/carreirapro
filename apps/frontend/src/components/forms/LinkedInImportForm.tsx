"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { linkedInImportSchema, type LinkedInImportData } from "@/lib/validations/profile"
import { useProfile } from "@/hooks/useProfile"
import { Linkedin, AlertTriangle, CheckCircle, Loader2, Info, Upload } from "lucide-react"

interface LinkedInImportFormProps {
  onSuccess?: () => void
  onImportComplete?: () => void
}

export function LinkedInImportForm({ onSuccess, onImportComplete }: LinkedInImportFormProps) {
  const { importFromLinkedIn, importFromResume, loading } = useProfile()
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importedData, setImportedData] = useState<any>(null)
  const [lastImportResult, setLastImportResult] = useState<any>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<LinkedInImportData>({
    resolver: zodResolver(linkedInImportSchema),
    defaultValues: {
      url: "",
      overwrite: true,
    },
  })

  const onSubmit = async (data: LinkedInImportData) => {
    try {
      setImportStatus('idle')
      const result = await importFromLinkedIn(data)
      console.log('🎯 LinkedInImportForm - Import result:', result)
      // CORREÇÃO: Definir importedData antes de usar no dialog
      setImportedData(result)
      setLastImportResult(result)
      console.log('🎯 LinkedInImportForm - importedData state set to:', result)
      
      // Persistir rascunho com dados importados para o formulário de Informações Pessoais
      try {
        const draft = {
          fullName: result?.fullName || "",
          headline: result?.headline || "",
          locationCity: result?.locationCity || "",
          locationState: result?.locationState || "",
          locationCountry: result?.locationCountry || "",
          linkedin: result?.linkedin || "",
          github: result?.github || "",
          website: result?.website || "",
          email: result?.email || "",
          phone: result?.phone || "",
          maritalStatus: (result as any)?.maritalStatus || "",
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('profile_info_draft', JSON.stringify(draft))
          // Dispara um evento extra (além do do hook) para garantir sincronização cruzada
          window.dispatchEvent(new CustomEvent('profile-updated', { detail: { profile: result } }))
        }
      } catch {}
      
      setImportStatus('success')
      form.reset()
      
      console.log('🎯 LinkedInImportForm - About to show dialog, result from import:', result)
      console.log('🎯 LinkedInImportForm - Setting showReviewDialog to true')
      
      // Use result diretamente para garantir que temos os dados
      setShowReviewDialog(true)
      console.log('🎯 LinkedInImportForm - showReviewDialog state updated')
      onSuccess?.()
      onImportComplete?.()
    } catch (error) {
      setImportStatus('error')
    }
  }

  const validateLinkedInUrl = (url: string) => {
    if (!url) return true
    
    try {
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`)
      return urlObj.hostname.includes('linkedin.com')
    } catch {
      return false
    }
  }

  const formatLinkedInUrl = (url: string) => {
    if (!url) return ""
    
    // Remove trailing slashes and clean up
    let cleanUrl = url.trim().replace(/\/+$/, '')
    
    // Add https if not present
    if (!cleanUrl.includes('://')) {
      cleanUrl = `https://${cleanUrl}`
    }
    
    return cleanUrl
  }

  const exampleUrls = [
    "https://linkedin.com/in/seu-perfil",
    "linkedin.com/in/seu-perfil", 
    "https://www.linkedin.com/in/seu-perfil/"
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-blue-600" />
          Importar do LinkedIn
        </CardTitle>
        <CardDescription>
          Importe suas informações profissionais diretamente do seu perfil público do LinkedIn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Como usar</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>1. Acesse seu perfil público no LinkedIn</p>
            <p>2. Copie a URL do perfil da barra de endereços</p>
            <p>3. Cole a URL no campo abaixo e clique em Importar</p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Nota:</strong> Utilizamos Apify para extrair dados públicos do LinkedIn
            </p>
          </AlertDescription>
        </Alert>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Perfil LinkedIn *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/seu-perfil"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatLinkedInUrl(e.target.value)
                        field.onChange(formatted)
                      }}
                      className={
                        field.value && !validateLinkedInUrl(field.value)
                          ? "border-destructive"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Cole aqui a URL pública do seu perfil do LinkedIn
                  </FormDescription>
                  <FormMessage />
                  
                  {field.value && !validateLinkedInUrl(field.value) && (
                    <p className="text-sm text-destructive">
                      URL deve ser um perfil válido do LinkedIn
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overwrite"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Sobrescrever dados existentes
                    </FormLabel>
                    <FormDescription>
                      Se desmarcado, apenas campos vazios serão preenchidos. Se marcado, todos os dados serão substituídos pelos do LinkedIn.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading || !form.watch("url") || !validateLinkedInUrl(form.watch("url"))}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Linkedin className="mr-2 h-4 w-4" />
                  Importar do LinkedIn
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Example URLs (moved up above resume upload) */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Exemplos de URLs válidas:</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {exampleUrls.map((url, index) => (
              <div key={index} className="font-mono bg-muted px-2 py-1 rounded">
                {url}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Importar currículo (PDF/DOCX)</h4>
          <p className="text-xs text-muted-foreground">Faça upload do seu currículo para preenchermos automaticamente seus dados básicos.</p>
          <div className="rounded-lg border bg-background p-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-muted-foreground">
              Selecione um arquivo PDF ou DOCX com seu currículo.
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  try {
                    const result = await importFromResume(f, true)
                    console.log('🎯 Resume Import - Result:', result)
                    setImportedData(result)
                    setLastImportResult(result)
                    setImportStatus('success')
                    setShowReviewDialog(true)
                    console.log('🎯 Resume Import - Dialog should show now')
                  } catch (error) {
                    console.error('🎯 Resume Import - Error:', error)
                  }
                }}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="shadow-md hover:shadow-lg transition-transform hover:-translate-y-[1px] active:translate-y-0"
              >
                <Upload className="mr-2 h-4 w-4" />
                Enviar currículo
              </Button>
            </div>
          </div>
        </div>

        

        {/* Success Message */}
        {importStatus === 'success' && importedData && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Importação concluída!</AlertTitle>
            <AlertDescription className="text-green-700">
              <div className="space-y-1">
                <p>Os seguintes dados foram importados com sucesso:</p>
                <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                  {importedData.fullName && <li>Nome: {importedData.fullName}</li>}
                  {importedData.headline && <li>Headline: {importedData.headline}</li>}
                  {importedData.locationCity && (
                    <li>Localização: {importedData.locationCity}, {importedData.locationState}, {importedData.locationCountry}</li>
                  )}
                  {importedData.email && <li>Email: {importedData.email}</li>}
                  {importedData.linkedin && <li>LinkedIn: {importedData.linkedin}</li>}
                </ul>
                <p className="text-xs mt-2">
                  Você pode editar essas informações nas abas do formulário acima.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {importStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro na importação</AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p>Não foi possível importar os dados do LinkedIn. Possíveis causas:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>URL inválida ou perfil privado</li>
                  <li>Perfil não encontrado ou inacessível</li>
                  <li>Limite de requisições atingido</li>
                  <li>Erro temporário do serviço</li>
                </ul>
                <p className="text-sm">
                  Tente novamente em alguns minutos ou preencha manualmente as informações.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Importando dados...</AlertTitle>
            <AlertDescription>
              Estamos extraindo as informações do seu perfil do LinkedIn. 
              Isso pode levar alguns segundos.
            </AlertDescription>
          </Alert>
        )}

        {/* Tips */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Dicas para uma importação bem-sucedida:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Certifique-se de que seu perfil do LinkedIn é público</li>
            <li>• Use a URL completa do seu perfil (com https://)</li>
            <li>• Aguarde o processo ser concluído sem fechar a página</li>
            <li>• Em caso de erro, você pode preencher os dados manualmente</li>
          </ul>
        </div>
        {/* Enhanced Review Dialog */}
        {console.log('🎯 LinkedInImportForm - Dialog render:', { showReviewDialog, importedData, lastImportResult })}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Importação do LinkedIn Concluída!
              </DialogTitle>
              <DialogDescription>
                Seus dados foram importados com sucesso. Revise as informações abaixo e complete os campos que estão faltando para ter um perfil completo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Imported Data Summary - usar lastImportResult como fallback */}
              <div className="rounded-lg border bg-green-50 p-4">
                <h4 className="font-medium text-green-800 mb-3">✅ Dados Importados com Sucesso:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {(importedData?.fullName || lastImportResult?.fullName) && (
                    <div>
                      <strong>Nome:</strong> {importedData?.fullName || lastImportResult?.fullName}
                    </div>
                  )}
                  {(importedData?.headline || lastImportResult?.headline) && (
                    <div>
                      <strong>Título Profissional:</strong> {importedData?.headline || lastImportResult?.headline}
                    </div>
                  )}
                  {(importedData?.linkedin || lastImportResult?.linkedin) && (
                    <div>
                      <strong>LinkedIn:</strong> {importedData?.linkedin || lastImportResult?.linkedin}
                    </div>
                  )}
                  {(importedData?.locationCity || lastImportResult?.locationCity) && (
                    <div>
                      <strong>Localização:</strong> {importedData?.locationCity || lastImportResult?.locationCity}
                      {(importedData?.locationState || lastImportResult?.locationState) && `, ${importedData?.locationState || lastImportResult?.locationState}`}
                      {(importedData?.locationCountry || lastImportResult?.locationCountry) && `, ${importedData?.locationCountry || lastImportResult?.locationCountry}`}
                    </div>
                  )}
                  {((importedData?.experiences && importedData.experiences.length > 0) || (lastImportResult?.experiences && lastImportResult.experiences.length > 0)) && (
                    <div>
                      <strong>Experiências:</strong> {(importedData?.experiences || lastImportResult?.experiences)?.length || 0} experiência(s) profissional(is)
                    </div>
                  )}
                  {((importedData?.education && importedData.education.length > 0) || (lastImportResult?.education && lastImportResult.education.length > 0)) && (
                    <div>
                      <strong>Formação:</strong> {(importedData?.education || lastImportResult?.education)?.length || 0} curso(s) acadêmico(s)
                    </div>
                  )}
                  {((importedData?.skills && importedData.skills.length > 0) || (lastImportResult?.skills && lastImportResult.skills.length > 0)) && (
                    <div>
                      <strong>Competências:</strong> {(importedData?.skills || lastImportResult?.skills)?.length || 0} habilidade(s) técnica(s)
                    </div>
                  )}
                </div>
              </div>

              {/* Action Required */}
              <div className="rounded-lg border bg-yellow-50 p-4">
                <h4 className="font-medium text-yellow-800 mb-3">⚠️ Complete seu Perfil:</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Para ter um currículo profissional completo, verifique e complete as seguintes informações:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Email e telefone</strong> para contato</li>
                  <li>• <strong>Endereço completo</strong> (cidade, estado, país)</li>
                  <li>• <strong>Links adicionais</strong> (GitHub, portfólio, website)</li>
                  <li>• <strong>Objetivo profissional</strong> personalizado</li>
                  <li>• <strong>Datas das experiências e educação</strong></li>
                  <li>• <strong>Descrições detalhadas</strong> das suas responsabilidades</li>
                </ul>
              </div>

              {/* Next Steps */}
              <div className="rounded-lg border bg-blue-50 p-4">
                <h4 className="font-medium text-blue-800 mb-3">📝 Próximos Passos:</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>1. <strong>Revise as Informações Pessoais</strong> na primeira aba</p>
                  <p>2. <strong>Confira suas Experiências</strong> e adicione detalhes se necessário</p>
                  <p>3. <strong>Verifique sua Formação Acadêmica</strong> e cursos</p>
                  <p>4. <strong>Confirme suas Competências</strong> e adicione outras relevantes</p>
                  <p>5. <strong>Gere seu currículo</strong> quando estiver satisfeito</p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                onClick={() => setShowReviewDialog(false)} 
                variant="outline"
                className="flex-1"
              >
                Revisar Depois
              </Button>
              <Button 
                onClick={() => { 
                  setShowReviewDialog(false); 
                  if (typeof window !== 'undefined') {
                    // Scroll to top and highlight the first tab
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Trigger a custom event to switch to personal info tab
                    window.dispatchEvent(new CustomEvent('switch-to-personal-info'));
                  }
                }}
                className="flex-1"
              >
                Revisar Informações Agora
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}