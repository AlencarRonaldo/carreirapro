"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PDFImportDebug, createMockPDFData, type PDFExtractedData } from "@/components/forms/PDFImportDebug"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Bug,
  Zap
} from "lucide-react"

export function PDFDebugDemo() {
  const [showDebugger, setShowDebugger] = useState(false)
  const [currentData, setCurrentData] = useState<PDFExtractedData | null>(null)

  const createHighQualityPDF = (): PDFExtractedData => {
    const data = createMockPDFData()
    data.confidence = {
      overall: 95,
      personalInfo: 98,
      experiences: 92,
      education: 96,
      skills: 94
    }
    data.issues = []
    return data
  }

  const createProblematicPDF = (): PDFExtractedData => {
    const data = createMockPDFData()
    data.confidence = {
      overall: 58,
      personalInfo: 75,
      experiences: 45,
      education: 62,
      skills: 51
    }
    data.issues = [
      {
        field: "fullName",
        type: "low_confidence",
        message: "Nome extraído com baixa confiança devido à qualidade do PDF",
        suggestion: "Verifique se o nome 'João da Silva Santos' está correto"
      },
      {
        field: "email",
        type: "invalid_format",
        message: "Email pode estar truncado ou mal formatado",
        suggestion: "Confirme se 'joao.silva@email.com' é o email completo"
      },
      {
        field: "github",
        type: "missing",
        message: "URL do GitHub não foi encontrada no PDF",
        suggestion: "Adicione seu perfil do GitHub manualmente se possuir um"
      },
      {
        field: "experiences[0].endDate",
        type: "low_confidence",
        message: "Data de término da experiência atual não está clara",
        suggestion: "Confirme se ainda trabalha na 'Tech Company'"
      },
      {
        field: "skills",
        type: "low_confidence",
        message: "Lista de competências pode estar incompleta",
        suggestion: "Revise e adicione competências que possam ter sido perdidas"
      }
    ]
    
    // Simula dados parciais ou incorretos
    data.github = ""
    data.website = ""
    data.experiences![0].endDate = "??/????"
    data.phone = "(11) 9999-????"
    
    return data
  }

  const createScannedPDF = (): PDFExtractedData => {
    const data = createMockPDFData()
    data.confidence = {
      overall: 35,
      personalInfo: 45,
      experiences: 25,
      education: 40,
      skills: 30
    }
    data.issues = [
      {
        field: "fullName",
        type: "low_confidence",
        message: "PDF escaneado com OCR de baixa qualidade",
        suggestion: "Considere recriar o PDF a partir do documento original"
      },
      {
        field: "email",
        type: "missing",
        message: "Email não foi detectado no PDF escaneado",
        suggestion: "Adicione manualmente seu endereço de email"
      },
      {
        field: "phone",
        type: "invalid_format",
        message: "Número de telefone pode conter erros de OCR",
        suggestion: "Verifique se '(11) 99999-9999' está correto"
      },
      {
        field: "experiences",
        type: "missing",
        message: "Experiências profissionais não foram detectadas",
        suggestion: "PDF escaneado requer qualidade alta para extração de dados estruturados"
      },
      {
        field: "education",
        type: "low_confidence",
        message: "Informações de educação podem estar incompletas",
        suggestion: "Revise todas as informações extraídas da seção de educação"
      }
    ]
    
    // Simula dados muito ruins de OCR
    data.fullName = "Joäo da S1lva Sant0s"
    data.email = ""
    data.phone = "(11) 9999?-999?"
    data.experiences = []
    data.skills = [
      { name: "JavaScr1pt", level: 4, confidence: 30 },
      { name: "Re@ct", level: 4, confidence: 25 }
    ]
    
    return data
  }

  const handleDataSelection = (dataType: string) => {
    let data: PDFExtractedData
    
    switch (dataType) {
      case 'high-quality':
        data = createHighQualityPDF()
        break
      case 'problematic':
        data = createProblematicPDF()
        break
      case 'scanned':
        data = createScannedPDF()
        break
      default:
        data = createMockPDFData()
    }
    
    setCurrentData(data)
    setShowDebugger(true)
  }

  const handleCorrectionsApplied = (correctedData: any) => {
    console.log('Demo: Corrections applied:', correctedData)
    setShowDebugger(false)
    // Em uma aplicação real, você enviaria os dados corrigidos para o backend
  }

  const handleRetryImport = () => {
    console.log('Demo: Retry import requested')
    setShowDebugger(false)
    // Em uma aplicação real, você reabriria o seletor de arquivos
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-purple-600" />
            Demonstração: Interface de Debug PDF
          </CardTitle>
          <CardDescription>
            Teste a interface de debugging para diferentes tipos de PDFs com problemas de extração.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PDF de Alta Qualidade */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                  <div>
                    <h3 className="font-medium text-green-800">PDF de Alta Qualidade</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Extração perfeita, sem problemas
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="default" className="bg-green-500">
                      Confiança: 95%
                    </Badge>
                    <div className="text-xs text-green-600">
                      ✅ Dados completos<br />
                      ✅ Formato válido<br />
                      ✅ Sem problemas
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDataSelection('high-quality')}
                    variant="outline"
                    size="sm"
                    className="w-full border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PDF Problemático */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto" />
                  <div>
                    <h3 className="font-medium text-yellow-800">PDF Problemático</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Alguns campos com problemas
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-yellow-500">
                      Confiança: 58%
                    </Badge>
                    <div className="text-xs text-yellow-600">
                      ⚠️ Dados parciais<br />
                      ⚠️ Formato inconsistente<br />
                      ⚠️ 5 problemas detectados
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDataSelection('problematic')}
                    variant="outline"
                    size="sm"
                    className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    <Bug className="w-4 h-4 mr-2" />
                    Depurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PDF Escaneado */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <FileText className="h-8 w-8 text-red-600 mx-auto" />
                  <div>
                    <h3 className="font-medium text-red-800">PDF Escaneado</h3>
                    <p className="text-sm text-red-700 mt-1">
                      OCR de baixa qualidade
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="destructive">
                      Confiança: 35%
                    </Badge>
                    <div className="text-xs text-red-600">
                      ❌ Dados incompletos<br />
                      ❌ Erros de OCR<br />
                      ❌ Requer correção manual
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDataSelection('scanned')}
                    variant="outline"
                    size="sm"
                    className="w-full border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Corrigir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Como usar a demonstração:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>PDF de Alta Qualidade:</strong> Mostra uma importação bem-sucedida</li>
              <li>• <strong>PDF Problemático:</strong> Demonstra problemas comuns e como corrigi-los</li>
              <li>• <strong>PDF Escaneado:</strong> Simula OCR de baixa qualidade e correção manual</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Debug Dialog */}
      {showDebugger && currentData && (
        <Dialog open={showDebugger} onOpenChange={setShowDebugger}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
            <PDFImportDebug
              data={currentData}
              onCorrectionsApplied={handleCorrectionsApplied}
              onRetryImport={handleRetryImport}
              onCancel={() => setShowDebugger(false)}
              className="h-full overflow-auto"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}