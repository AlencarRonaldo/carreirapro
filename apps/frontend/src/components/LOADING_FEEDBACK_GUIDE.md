# Sistema de Loading States e Feedback UX

Sistema abrangente de loading states e feedback UX integrado com Radix UI, seguindo as melhores práticas de UX de 2024.

## 📋 Componentes Implementados

### 1. Skeleton Loading Components

**Localização:** `src/components/ui/skeleton.tsx`

Componentes de skeleton que imitam a estrutura do conteúdo real, reduzindo a percepção de tempo de carregamento.

```tsx
import { 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  FormSkeleton, 
  ListSkeleton,
  TextSkeleton,
  AvatarSkeleton 
} from "@/components/ui/skeleton"

// Skeleton básico
<Skeleton variant="text" className="w-1/2" />
<Skeleton variant="circular" width={40} height={40} />

// Skeletons especializados
<CardSkeleton />
<TableSkeleton rows={5} columns={4} />
<FormSkeleton fields={3} />
<ListSkeleton items={6} showAvatar={true} />
```

**Características:**
- Animações `pulse` e `wave`
- Componentes especializados para diferentes contextos
- Adapta automaticamente ao tema (light/dark)
- Responsivo e acessível

### 2. Enhanced Button States

**Localização:** `src/components/ui/button.tsx` (aprimorado)

Botões com estados de loading integrados e spinner customizável.

```tsx
import { Button } from "@/components/ui/button"

// Botão com loading
<Button loading={isLoading} loadingText="Salvando...">
  Salvar
</Button>

// Botão com ripple effect
<RippleButton variant="default">
  Clique aqui
</RippleButton>
```

**Características:**
- Spinner integrado com tamanhos automáticos
- Estado disabled automático durante loading
- Texto customizável para estado de loading
- Suporte a todos os variants existentes

### 3. Enhanced Toast System

**Localização:** `src/components/ui/enhanced-toast.tsx`

Sistema de toast aprimorado com ações, progress, undo e auto-dismiss inteligente.

```tsx
import { toast } from "@/components/ui/enhanced-toast"

// Toast com ação
toast.success("Documento salvo!", {
  description: "Suas alterações foram salvas com sucesso.",
  actions: [{
    label: "Ver documento",
    onClick: () => navigate("/document/123")
  }]
})

// Toast com undo
toast.success("Item removido", {
  description: "O documento foi movido para a lixeira.",
  undoAction: () => restoreDocument()
})

// Toast de progresso
toast.progress("upload-1", "Enviando arquivo...", 65, {
  description: "arquivo.pdf (65% concluído)"
})

// Toast promise
toast.promise(
  uploadFile(),
  {
    loading: "Enviando arquivo...",
    success: "Arquivo enviado com sucesso!",
    error: "Falha no envio do arquivo"
  }
)
```

**Características:**
- 4 tipos: success, error, warning, info, loading, progress
- Botões de ação customizáveis
- Funcionalidade undo integrada
- Auto-dismiss inteligente baseado no tipo
- Progress tracking para uploads

### 4. Loading State Hooks

**Localização:** `src/hooks/useLoadingStates.ts`

Hooks especializados para gerenciar diferentes tipos de estados de loading.

```tsx
import { 
  useAsyncState,
  useLoadingState,
  useProgressTracker,
  useRetryableAsync,
  useDebouncedAsync,
  useNetworkAwareAsync
} from "@/hooks/useLoadingStates"

// Async state simples
const [state, execute] = useAsyncState<User>()
const user = await execute(() => fetchUser(userId))

// Multiple loading states
const { setLoading, isLoading, isAnyLoading } = useLoadingState()
setLoading('saveProfile', true)

// Progress tracking
const { progress, nextStage, reset } = useProgressTracker(5, [
  "Validando dados...",
  "Enviando para servidor...",
  "Processando...",
  "Salvando...",
  "Concluído!"
])

// Retry com backoff
const { execute: executeWithRetry } = useRetryableAsync({
  maxAttempts: 3,
  delay: 1000,
  backoff: true
})

// Debounced search
const [searchState, debouncedSearch] = useDebouncedAsync<SearchResult[]>(300)
```

### 5. Error Boundary System

**Localização:** `src/components/ui/error-boundary.tsx`

Sistema de error boundary com retry, fallbacks e relatórios de erro.

```tsx
import { 
  ErrorBoundary, 
  AsyncErrorBoundary,
  withErrorBoundary,
  useErrorBoundary 
} from "@/components/ui/error-boundary"

// Error boundary básico
<ErrorBoundary
  onError={(error, errorInfo) => logError(error, errorInfo)}
  maxRetries={3}
  showReportButton={true}
>
  <MyComponent />
</ErrorBoundary>

// Com Suspense
<AsyncErrorBoundary
  pendingFallback={<Skeleton />}
>
  <LazyComponent />
</AsyncErrorBoundary>

// HOC
const SafeComponent = withErrorBoundary(MyComponent, {
  maxRetries: 2
})

// Hook para capturar erros
const { captureError } = useErrorBoundary()
try {
  await riskyOperation()
} catch (error) {
  captureError(error)
}
```

### 6. Empty State Components

**Localização:** `src/components/ui/empty-state.tsx`

Componentes informativos para estados vazios com ações contextuais.

```tsx
import { 
  EmptyState,
  NoDocuments,
  NoSearchResults,
  NoNotifications,
  WithEmptyState
} from "@/components/ui/empty-state"

// Empty state genérico
<EmptyState
  icon={FileText}
  title="Nenhum documento"
  description="Comece criando seu primeiro documento."
  action={{
    label: "Criar documento",
    onClick: () => createDocument()
  }}
/>

// Empty states pré-definidos
<NoDocuments 
  action={{
    label: "Novo documento",
    onClick: () => navigate("/documents/new")
  }}
/>

<NoSearchResults query={searchTerm} />

// Conditional empty state
<WithEmptyState
  isEmpty={documents.length === 0}
  loading={isLoading}
  emptyStateProps={{
    icon: FileText,
    title: "Nenhum documento encontrado",
    action: { label: "Criar", onClick: createNew }
  }}
>
  <DocumentList documents={documents} />
</WithEmptyState>
```

### 7. Progress Indicators

**Localização:** `src/components/ui/progress-indicators.tsx`

Indicadores de progresso especializados para diferentes contextos.

```tsx
import {
  StepProgress,
  FileUploadProgress,
  CircularProgress,
  ProcessTimeline
} from "@/components/ui/progress-indicators"

// Step progress
const steps = [
  { id: "1", title: "Upload", status: "completed" },
  { id: "2", title: "Processing", status: "current" },
  { id: "3", title: "Complete", status: "pending" }
]
<StepProgress steps={steps} orientation="horizontal" />

// File upload
<FileUploadProgress
  files={uploadFiles}
  onCancel={(id) => cancelUpload(id)}
  onRetry={(id) => retryUpload(id)}
/>

// Circular progress
<CircularProgress
  value={progress}
  size={120}
  label="Processando..."
  color="blue"
/>

// Process timeline
<ProcessTimeline
  events={processEvents}
  showTime={true}
/>
```

### 8. Microinterações

**Localização:** `src/components/ui/microinteractions.tsx`

Componentes com animações e microinterações refinadas usando Framer Motion.

```tsx
import {
  AnimatedContainer,
  InteractiveCard,
  RippleButton,
  StaggeredList,
  LoadingDots,
  AnimatedCheckmark
} from "@/components/ui/microinteractions"

// Container animado
<AnimatedContainer animation="slideUp" delay={0.2}>
  <Card>...</Card>
</AnimatedContainer>

// Card interativo
<InteractiveCard variant="hover-lift" clickable>
  <CardContent>...</CardContent>
</InteractiveCard>

// Lista com stagger
<StaggeredList staggerDelay={0.1}>
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</StaggeredList>

// Loading dots
<LoadingDots className="text-primary" />

// Checkmark animado
<AnimatedCheckmark size={32} />
```

## 🎯 Padrões de Uso

### 1. Page Loading

```tsx
function MyPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  if (loading) {
    return (
      <AnimatedContainer>
        <div className="space-y-6">
          <CardSkeleton />
          <TableSkeleton rows={5} />
        </div>
      </AnimatedContainer>
    )
  }

  return (
    <WithEmptyState
      isEmpty={!data}
      emptyStateProps={{
        title: "Nenhum dado disponível",
        action: { label: "Recarregar", onClick: refetch }
      }}
    >
      <AnimatedContainer animation="fadeIn">
        <DataView data={data} />
      </AnimatedContainer>
    </WithEmptyState>
  )
}
```

### 2. Form Submission

```tsx
function MyForm() {
  const [state, execute] = useAsyncState()
  
  const handleSubmit = async (data: FormData) => {
    const result = await execute(async () => {
      const response = await api.post('/submit', data)
      return response.data
    })
    
    if (result) {
      toast.success("Formulário enviado!", {
        description: "Seus dados foram salvos com sucesso.",
        actions: [{
          label: "Ver resultado",
          onClick: () => navigate(`/result/${result.id}`)
        }]
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button 
        type="submit" 
        loading={state.loading}
        disabled={state.loading}
      >
        {state.loading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  )
}
```

### 3. File Upload com Progress

```tsx
function FileUploader() {
  const [files, setFiles] = useState([])
  
  const handleUpload = async (file: File) => {
    const fileId = generateId()
    
    // Add to files list
    setFiles(prev => [...prev, {
      id: fileId,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    }])
    
    // Upload with progress
    try {
      await uploadWithProgress(file, (progress) => {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ))
        
        // Update toast progress
        toast.progress(fileId, `Uploading ${file.name}`, progress)
      })
      
      // Mark as completed
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
      ))
      
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error', error: error.message } : f
      ))
    }
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      <FileUploadProgress
        files={files}
        onRetry={handleUpload}
        onCancel={(id) => cancelUpload(id)}
      />
    </div>
  )
}
```

## 🚀 Integração com Projeto Existente

### 1. Substitua imports de toast:
```tsx
// Antes
import { toast } from "sonner"

// Depois  
import { toast } from "@/components/ui/enhanced-toast"
```

### 2. Adicione loading states a botões existentes:
```tsx
// Antes
<Button onClick={handleSubmit}>Salvar</Button>

// Depois
<Button loading={isSubmitting} onClick={handleSubmit}>
  {isSubmitting ? "Salvando..." : "Salvar"}
</Button>
```

### 3. Substitua spinners por skeletons:
```tsx
// Antes
{loading && <div>Carregando...</div>}

// Depois
{loading ? <CardSkeleton /> : <DataCard data={data} />}
```

### 4. Adicione error boundaries:
```tsx
// No layout ou páginas principais
<ErrorBoundary maxRetries={3}>
  <Router />
</ErrorBoundary>
```

## 📱 Responsividade e Acessibilidade

Todos os componentes são:
- ✅ **Responsivos**: Adaptam-se a diferentes tamanhos de tela
- ✅ **Acessíveis**: Seguem padrões WCAG 2.1 AA
- ✅ **Teclado navegável**: Suporte completo a navegação por teclado
- ✅ **Screen reader friendly**: Labels e ARIA apropriados
- ✅ **High contrast**: Funcionam com modo de alto contraste
- ✅ **Reduced motion**: Respeitam preferências de movimento reduzido

## 🎨 Personalização

### Temas e Cores

Os componentes seguem o sistema de design tokens do projeto:
- Cores primárias, secondary, accent
- Modos light/dark automáticos
- Variantes de componentes consistentes

### Animações

Controle via CSS custom properties:
```css
:root {
  --animation-duration-fast: 150ms;
  --animation-duration-normal: 300ms;
  --animation-duration-slow: 500ms;
}
```

## 🧪 Testing

Para testar os componentes:

```tsx
// Teste básico de loading state
const { getByRole } = render(
  <Button loading>Save</Button>
)
expect(getByRole('button')).toBeDisabled()
expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

// Teste de empty state
const { getByText } = render(
  <WithEmptyState isEmpty={true} emptyStateProps={{ title: "No data" }}>
    <div>Content</div>
  </WithEmptyState>
)
expect(getByText("No data")).toBeInTheDocument()
```

## 🔧 Troubleshooting

### Problemas Comuns:

1. **Framer Motion não funciona**: Certifique-se de que `framer-motion` está instalado
2. **Animações muito lentas**: Ajuste as durações em `globals.css`
3. **Skeletons não aparecem**: Verifique se o tema está configurado corretamente
4. **Toast não mostra**: Verifique se `<Toaster />` está no layout

### Performance:

- Use `React.memo()` para componentes pesados
- Lazy loading para componentes de animação
- Debounce para operações de busca
- Virtualization para listas grandes

## 📚 Exemplos Avançados

Veja `src/components/loading-feedback-showcase.tsx` para exemplos completos de todas as funcionalidades integradas.