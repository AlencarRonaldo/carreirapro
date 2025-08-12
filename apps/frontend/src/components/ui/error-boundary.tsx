"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { toast } from "./enhanced-toast"

interface ErrorInfo {
  componentStack: string
  errorBoundary?: string | null
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  maxRetries?: number
  showReportButton?: boolean
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface ErrorFallbackProps {
  error: Error | null
  resetErrorBoundary: () => void
  retryCount: number
  maxRetries: number
  showReportButton: boolean
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  retryCount,
  maxRetries,
  showReportButton
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  
  const handleReportError = () => {
    // In a real app, this would send the error to your error tracking service
    toast.info("Erro reportado", {
      description: "Obrigado por reportar este problema. Nossa equipe será notificada."
    })
  }

  const canRetry = retryCount < maxRetries

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl text-destructive">
            Oops! Algo deu errado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {isDevelopment && error
              ? "Erro encontrado durante o desenvolvimento"
              : "Ocorreu um erro inesperado. Tente novamente ou reporte o problema."
            }
          </p>

          {isDevelopment && error && (
            <details className="mt-4 p-3 bg-muted rounded-md">
              <summary className="cursor-pointer font-medium text-sm mb-2">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="text-xs overflow-auto max-h-40 text-destructive">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {canRetry && (
              <Button
                onClick={resetErrorBoundary}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente {retryCount > 0 && `(${retryCount}/${maxRetries})`}
              </Button>
            )}
            
            <Button
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para início
            </Button>
            
            {showReportButton && (
              <Button
                onClick={handleReportError}
                variant="ghost"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Bug className="w-4 h-4 mr-2" />
                Reportar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for error boundary
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

// Main Error Boundary Component
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo
    })

    // Log error
    console.error("Error caught by boundary:", error, errorInfo)

    // Call onError prop if provided
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        prevProps.resetKeys?.[index] !== key
      )

      if (hasResetKeyChanged) {
        this.resetErrorBoundary()
      }
    }
  }

  resetErrorBoundary = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount >= maxRetries) {
      toast.warning("Limite de tentativas atingido", {
        description: "Recarregue a página ou entre em contato com o suporte."
      })
      return
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: retryCount + 1
    })

    // Auto-reset retry count after 30 seconds of successful operation
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({ retryCount: 0 })
    }, 30000)
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  render() {
    const { hasError, error, retryCount } = this.state
    const { 
      children, 
      fallback: Fallback = DefaultErrorFallback,
      maxRetries = 3,
      showReportButton = true
    } = this.props

    if (hasError) {
      return (
        <Fallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          retryCount={retryCount}
          maxRetries={maxRetries}
          showReportButton={showReportButton}
        />
      )
    }

    return children
  }
}

// Async Error Boundary for Suspense
interface AsyncErrorBoundaryProps extends ErrorBoundaryProps {
  pendingFallback?: React.ReactNode
}

export const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  pendingFallback = <div className="flex justify-center p-8">Carregando...</div>,
  ...errorBoundaryProps
}) => {
  return (
    <ErrorBoundary {...errorBoundaryProps}>
      <React.Suspense fallback={pendingFallback}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  )
}

// Higher-order component for error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ))

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Custom error classes for different error types
export class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = "NetworkError"
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Não autorizado") {
    super(message)
    this.name = "AuthenticationError"
  }
}

export { type ErrorBoundaryProps, type ErrorFallbackProps }