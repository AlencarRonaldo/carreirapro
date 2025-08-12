"use client"

import * as React from "react"
import { useState } from "react"
import { Upload, Download, RefreshCw, Plus, Search } from "lucide-react"

// Import all our new components
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { 
  Skeleton,
  CardSkeleton, 
  TableSkeleton, 
  FormSkeleton, 
  ListSkeleton,
  TextSkeleton,
  AvatarSkeleton 
} from "./ui/skeleton"
import { toast } from "./ui/enhanced-toast"
import { 
  NoDocuments,
  NoSearchResults,
  NoNotifications,
  EmptyState,
  WithEmptyState 
} from "./ui/empty-state"
import {
  StepProgress,
  FileUploadProgress,
  CircularProgress,
  ProcessTimeline,
  type Step,
  type TimelineEvent
} from "./ui/progress-indicators"
import {
  AnimatedContainer,
  InteractiveCard,
  RippleButton,
  StaggeredList,
  LoadingDots,
  AnimatedCheckmark
} from "./ui/microinteractions"
import { ErrorBoundary, useErrorBoundary } from "./ui/error-boundary"
import { 
  useAsyncState, 
  useLoadingState, 
  useProgressTracker,
  useRetryableAsync,
  useDebouncedAsync
} from "../hooks/useLoadingStates"

const LoadingFeedbackShowcase: React.FC = () => {
  // Demo states
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasData, setHasData] = useState(true)
  const [uploadFiles, setUploadFiles] = useState<any[]>([])
  
  // Loading state hooks demo
  const [asyncState, executeAsync] = useAsyncState<string>()
  const { setLoading, isLoading } = useLoadingState()
  const { progress: processProgress, nextStage, reset: resetProgress } = useProgressTracker(4, [
    "Iniciando...",
    "Processando dados...",
    "Validando...",
    "Finalizando..."
  ])
  
  // Error boundary demo
  const { captureError } = useErrorBoundary()

  // Demo data
  const steps: Step[] = [
    { id: "1", title: "Upload", status: "completed" },
    { id: "2", title: "Processing", status: "current" },
    { id: "3", title: "Review", status: "pending" },
    { id: "4", title: "Complete", status: "pending" }
  ]

  const timelineEvents: TimelineEvent[] = [
    { 
      id: "1", 
      timestamp: new Date(Date.now() - 300000), 
      title: "Processo iniciado", 
      status: "completed",
      duration: 1200
    },
    { 
      id: "2", 
      timestamp: new Date(Date.now() - 180000), 
      title: "Dados carregados", 
      status: "completed",
      duration: 850
    },
    { 
      id: "3", 
      timestamp: new Date(), 
      title: "Processando...", 
      status: "current" 
    }
  ]

  // Demo functions
  const handleAsyncOperation = async () => {
    await executeAsync(async () => {
      setLoading("demo", true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLoading("demo", false)
      return "Operação concluída com sucesso!"
    })
  }

  const handleProgressDemo = () => {
    resetProgress()
    const interval = setInterval(() => {
      nextStage()
    }, 1500)
    setTimeout(() => clearInterval(interval), 6000)
  }

  const handleToastDemo = (type: string) => {
    switch (type) {
      case "success":
        toast.success("Sucesso!", {
          description: "Sua ação foi executada com sucesso.",
          actions: [{
            label: "Ver detalhes",
            onClick: () => console.log("View details clicked")
          }]
        })
        break
      case "error":
        toast.error("Erro!", {
          description: "Algo deu errado. Tente novamente.",
          actions: [{
            label: "Tentar novamente",
            onClick: () => console.log("Retry clicked"),
            variant: "destructive"
          }]
        })
        break
      case "progress":
        let progress = 0
        const interval = setInterval(() => {
          progress += 20
          toast.progress("upload-demo", "Fazendo upload...", progress, {
            description: `${progress}% concluído`
          })
          if (progress >= 100) clearInterval(interval)
        }, 500)
        break
      case "undo":
        toast.success("Item removido", {
          description: "O documento foi movido para a lixeira.",
          undoAction: () => {
            toast.success("Ação desfeita", {
              description: "O documento foi restaurado."
            })
          }
        })
        break
    }
  }

  const triggerError = () => {
    captureError(new Error("Erro de demonstração"))
  }

  const mockFiles = [
    {
      id: "1",
      name: "documento.pdf",
      size: 2048576,
      progress: 65,
      status: "uploading" as const
    },
    {
      id: "2", 
      name: "imagem.jpg",
      size: 1024000,
      progress: 100,
      status: "completed" as const
    },
    {
      id: "3",
      name: "arquivo.docx",
      size: 512000,
      progress: 0,
      status: "error" as const,
      error: "Formato não suportado"
    }
  ]

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Sistema de Loading States e Feedback UX</h1>
        <p className="text-muted-foreground">
          Demonstração completa dos componentes de carregamento e feedback integrados com Radix UI
        </p>
      </div>

      {/* Button Loading States */}
      <AnimatedContainer animation="slideUp">
        <Card>
          <CardHeader>
            <CardTitle>Button Loading States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button loading={isLoading("demo")} onClick={handleAsyncOperation}>
                {isLoading("demo") ? "Processando..." : "Executar Ação"}
              </Button>
              
              <Button variant="outline" loading loadingText="Salvando...">
                Salvar
              </Button>
              
              <RippleButton variant="default">
                <Upload className="w-4 h-4 mr-2" />
                Com Ripple Effect
              </RippleButton>
              
              <Button disabled>
                Botão Desabilitado
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* Skeleton Loading */}
      <AnimatedContainer animation="slideUp" delay={0.1}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Skeleton Loading States</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setShowSkeleton(!showSkeleton)}
            >
              {showSkeleton ? "Mostrar Conteúdo" : "Mostrar Skeleton"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Card Skeleton</h4>
                {showSkeleton ? <CardSkeleton /> : (
                  <InteractiveCard variant="hover-lift" className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">JD</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">João Silva</h3>
                        <p className="text-sm text-muted-foreground">Desenvolvedor Frontend</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Especialista em React e TypeScript com 5 anos de experiência.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm">Contatar</Button>
                      <Button variant="outline" size="sm">Ver Perfil</Button>
                    </div>
                  </InteractiveCard>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-4">Table Skeleton</h4>
                {showSkeleton ? <TableSkeleton rows={3} columns={3} /> : (
                  <div className="space-y-3">
                    <div className="flex space-x-4 pb-3 border-b font-medium">
                      <span className="flex-1">Nome</span>
                      <span className="flex-1">Cargo</span>
                      <span className="flex-1">Status</span>
                    </div>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex space-x-4 items-center py-2">
                        <span className="flex-1">Usuário {i}</span>
                        <span className="flex-1">Desenvolvedor</span>
                        <span className="flex-1">Ativo</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* Toast System */}
      <AnimatedContainer animation="slideUp" delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Toast System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => handleToastDemo("success")} variant="default">
                Success Toast
              </Button>
              <Button onClick={() => handleToastDemo("error")} variant="destructive">
                Error Toast
              </Button>
              <Button onClick={() => handleToastDemo("progress")} variant="outline">
                Progress Toast
              </Button>
              <Button onClick={() => handleToastDemo("undo")} variant="secondary">
                Undo Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* Progress Indicators */}
      <AnimatedContainer animation="slideUp" delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>Progress Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Step Progress</h4>
                <Button variant="outline" size="sm" onClick={handleProgressDemo}>
                  Demo Process
                </Button>
              </div>
              <StepProgress steps={steps} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">File Upload Progress</h4>
                <FileUploadProgress
                  files={mockFiles}
                  onCancel={(id) => console.log("Cancel", id)}
                  onRetry={(id) => console.log("Retry", id)}
                />
              </div>

              <div className="text-center">
                <h4 className="font-medium mb-4">Circular Progress</h4>
                <CircularProgress
                  value={processProgress.progress}
                  label={processProgress.stage}
                  color="blue"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Process Timeline</h4>
              <ProcessTimeline events={timelineEvents} />
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* Empty States */}
      <AnimatedContainer animation="slideUp" delay={0.4}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Empty States</CardTitle>
            <Button 
              variant="outline"
              onClick={() => setHasData(!hasData)}
            >
              {hasData ? "Simular Vazio" : "Mostrar Dados"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WithEmptyState
                isEmpty={!hasData}
                emptyStateProps={{
                  icon: Search,
                  title: "Nenhum documento encontrado",
                  description: "Comece criando seu primeiro documento.",
                  action: {
                    label: "Criar Documento",
                    onClick: () => setHasData(true)
                  }
                }}
              >
                <div className="space-y-4">
                  <h4 className="font-medium">Documentos Recentes</h4>
                  <StaggeredList>
                    {[1, 2, 3].map(i => (
                      <InteractiveCard key={i} variant="hover-lift" className="p-4">
                        <h5 className="font-medium">Documento {i}</h5>
                        <p className="text-sm text-muted-foreground">
                          Atualizado há {i} hora{i > 1 ? "s" : ""}
                        </p>
                      </InteractiveCard>
                    ))}
                  </StaggeredList>
                </div>
              </WithEmptyState>

              <div>
                <Input
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
                {searchQuery && (
                  <NoSearchResults query={searchQuery} />
                )}
                {!searchQuery && (
                  <NoNotifications />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* Microinteractions */}
      <AnimatedContainer animation="slideUp" delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>Microinterações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Loading Animations</h4>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <LoadingDots />
                  <span className="text-sm">Carregando</span>
                </div>
                <AnimatedCheckmark />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Interactive Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InteractiveCard variant="hover-lift" className="p-4">
                  <h5 className="font-medium">Hover Lift</h5>
                  <p className="text-sm text-muted-foreground">Eleva no hover</p>
                </InteractiveCard>
                <InteractiveCard variant="hover-glow" className="p-4">
                  <h5 className="font-medium">Hover Glow</h5>
                  <p className="text-sm text-muted-foreground">Brilha no hover</p>
                </InteractiveCard>
                <InteractiveCard variant="hover-border" className="p-4">
                  <h5 className="font-medium">Hover Border</h5>
                  <p className="text-sm text-muted-foreground">Borda no hover</p>
                </InteractiveCard>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* Error Boundary Demo */}
      <AnimatedContainer animation="slideUp" delay={0.6}>
        <Card>
          <CardHeader>
            <CardTitle>Error Boundary</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Este componente está protegido por um Error Boundary.
                </p>
                <Button variant="destructive" onClick={triggerError}>
                  Simular Erro
                </Button>
              </div>
            </ErrorBoundary>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* Async State Demo */}
      <AnimatedContainer animation="slideUp" delay={0.7}>
        <Card>
          <CardHeader>
            <CardTitle>Hooks de Loading State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleAsyncOperation}
                loading={asyncState.loading}
                disabled={asyncState.loading}
              >
                Teste useAsyncState
              </Button>
              {asyncState.data && (
                <p className="text-green-600 dark:text-green-400">
                  {asyncState.data}
                </p>
              )}
              {asyncState.error && (
                <p className="text-red-600 dark:text-red-400">
                  {asyncState.error}
                </p>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <strong>Estados disponíveis:</strong> useAsyncState, useLoadingState, useProgressTracker, 
              useRetryableAsync, useDebouncedAsync, useNetworkAwareAsync
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>
    </div>
  )
}

export default LoadingFeedbackShowcase