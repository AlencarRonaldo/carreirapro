"use client"

import { useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { linkedInImportSchema, type LinkedInImportData } from "@/lib/validations/profile"
import { useProfile } from "@/hooks/useProfile"
import { Linkedin, AlertTriangle, CheckCircle, Loader2, Info } from "lucide-react"

interface LinkedInImportFormProps {
  onSuccess?: () => void
  onImportComplete?: () => void
}

export function LinkedInImportForm({ onSuccess, onImportComplete }: LinkedInImportFormProps) {
  const { importFromLinkedIn, loading } = useProfile()
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importedData, setImportedData] = useState<any>(null)

  const form = useForm<LinkedInImportData>({
    resolver: zodResolver(linkedInImportSchema),
    defaultValues: {
      url: "",
      overwrite: false,
    },
  })

  const onSubmit = async (data: LinkedInImportData) => {
    try {
      setImportStatus('idle')
      const result = await importFromLinkedIn(data)
      setImportedData(result)
      setImportStatus('success')
      form.reset()
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
              <strong>Nota:</strong> Utilizamos Proxycurl quando disponível para extrair dados públicos do LinkedIn
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
                      Se marcado, os dados importados substituirão as informações já cadastradas
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

        {/* Example URLs */}
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
      </CardContent>
    </Card>
  )
}