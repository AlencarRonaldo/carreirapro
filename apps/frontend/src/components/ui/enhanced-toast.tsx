import * as React from "react"
import { toast as sonnerToast, type ExternalToast } from "sonner"
import { CheckCircle, XCircle, AlertTriangle, Info, X, Undo, Download, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { Progress } from "./progress"

export interface ToastAction {
  label: string
  onClick: () => void
  variant?: "default" | "secondary" | "destructive"
}

export interface ToastOptions extends ExternalToast {
  variant?: "success" | "error" | "warning" | "info" | "loading" | "progress"
  actions?: ToastAction[]
  progress?: number
  undoAction?: () => void
  autoClose?: boolean
  closeAfter?: number
}

const getToastIcon = (variant: ToastOptions["variant"]) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case "error":
      return <XCircle className="w-5 h-5 text-red-500" />
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case "info":
      return <Info className="w-5 h-5 text-blue-500" />
    case "loading":
      return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
    case "progress":
      return <Download className="w-5 h-5 text-blue-500" />
    default:
      return null
  }
}

const ToastContent: React.FC<{
  title: string
  description?: string
  variant?: ToastOptions["variant"]
  actions?: ToastAction[]
  progress?: number
  undoAction?: () => void
  onClose?: () => void
}> = ({ title, description, variant, actions, progress, undoAction, onClose }) => {
  return (
    <div className="flex items-start gap-3 min-w-0 flex-1">
      {getToastIcon(variant)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground truncate">
            {title}
          </h4>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        )}
        
        {variant === "progress" && typeof progress === "number" && (
          <div className="mt-3">
            <Progress value={progress} className="h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progress)}% concluído
            </p>
          </div>
        )}
        
        {(actions || undoAction) && (
          <div className="flex items-center gap-2 mt-3">
            {undoAction && (
              <Button
                variant="ghost"
                size="sm"
                onClick={undoAction}
                className="h-7 px-2"
              >
                <Undo className="w-3 h-3 mr-1" />
                Desfazer
              </Button>
            )}
            
            {actions?.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "ghost"}
                size="sm"
                onClick={action.onClick}
                className="h-7 px-2"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

class EnhancedToast {
  private static progressToasts = new Map<string, string>()
  
  static success(title: string, options?: ToastOptions) {
    return sonnerToast.custom(
      (t) => (
        <ToastContent
          title={title}
          description={options?.description}
          variant="success"
          actions={options?.actions}
          undoAction={options?.undoAction}
          onClose={() => sonnerToast.dismiss(t)}
        />
      ),
      {
        duration: options?.autoClose !== false ? (options?.closeAfter ?? 4000) : Infinity,
        ...options
      }
    )
  }

  static error(title: string, options?: ToastOptions) {
    return sonnerToast.custom(
      (t) => (
        <ToastContent
          title={title}
          description={options?.description}
          variant="error"
          actions={options?.actions}
          undoAction={options?.undoAction}
          onClose={() => sonnerToast.dismiss(t)}
        />
      ),
      {
        duration: options?.autoClose !== false ? (options?.closeAfter ?? 6000) : Infinity,
        ...options
      }
    )
  }

  static warning(title: string, options?: ToastOptions) {
    return sonnerToast.custom(
      (t) => (
        <ToastContent
          title={title}
          description={options?.description}
          variant="warning"
          actions={options?.actions}
          undoAction={options?.undoAction}
          onClose={() => sonnerToast.dismiss(t)}
        />
      ),
      {
        duration: options?.autoClose !== false ? (options?.closeAfter ?? 5000) : Infinity,
        ...options
      }
    )
  }

  static info(title: string, options?: ToastOptions) {
    return sonnerToast.custom(
      (t) => (
        <ToastContent
          title={title}
          description={options?.description}
          variant="info"
          actions={options?.actions}
          undoAction={options?.undoAction}
          onClose={() => sonnerToast.dismiss(t)}
        />
      ),
      {
        duration: options?.autoClose !== false ? (options?.closeAfter ?? 4000) : Infinity,
        ...options
      }
    )
  }

  static loading(title: string, options?: ToastOptions) {
    return sonnerToast.custom(
      (t) => (
        <ToastContent
          title={title}
          description={options?.description}
          variant="loading"
          onClose={() => sonnerToast.dismiss(t)}
        />
      ),
      {
        duration: Infinity,
        ...options
      }
    )
  }

  static progress(
    id: string, 
    title: string, 
    progress: number, 
    options?: ToastOptions
  ) {
    const existingToastId = this.progressToasts.get(id)
    
    if (existingToastId) {
      // Update existing toast
      return sonnerToast.custom(
        (t) => (
          <ToastContent
            title={title}
            description={options?.description}
            variant="progress"
            progress={progress}
            actions={options?.actions}
            onClose={() => {
              sonnerToast.dismiss(t)
              this.progressToasts.delete(id)
            }}
          />
        ),
        {
          id: existingToastId,
          duration: progress >= 100 ? (options?.closeAfter ?? 2000) : Infinity,
          ...options
        }
      )
    } else {
      // Create new toast
      const toastId = sonnerToast.custom(
        (t) => (
          <ToastContent
            title={title}
            description={options?.description}
            variant="progress"
            progress={progress}
            actions={options?.actions}
            onClose={() => {
              sonnerToast.dismiss(t)
              this.progressToasts.delete(id)
            }}
          />
        ),
        {
          duration: progress >= 100 ? (options?.closeAfter ?? 2000) : Infinity,
          ...options
        }
      )
      
      this.progressToasts.set(id, toastId)
      return toastId
    }
  }

  static promise<T>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: ToastOptions
  ) {
    return sonnerToast.promise(promise, {
      loading: loadingMessage,
      success: (data) => {
        const message = typeof successMessage === "function" ? successMessage(data) : successMessage
        return {
          title: message,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        }
      },
      error: (error) => {
        const message = typeof errorMessage === "function" ? errorMessage(error) : errorMessage
        return {
          title: message,
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        }
      },
      ...options
    })
  }

  static dismiss(toastId?: string | number) {
    if (toastId) {
      // Clean up progress toast tracking
      for (const [id, tId] of this.progressToasts.entries()) {
        if (tId === toastId) {
          this.progressToasts.delete(id)
          break
        }
      }
    }
    
    return sonnerToast.dismiss(toastId)
  }

  static dismissAll() {
    this.progressToasts.clear()
    return sonnerToast.dismiss()
  }
}

// Convenience functions for backwards compatibility
export const toast = {
  success: EnhancedToast.success,
  error: EnhancedToast.error,
  warning: EnhancedToast.warning,
  info: EnhancedToast.info,
  loading: EnhancedToast.loading,
  progress: EnhancedToast.progress,
  promise: EnhancedToast.promise,
  dismiss: EnhancedToast.dismiss,
  dismissAll: EnhancedToast.dismissAll,
}

export { EnhancedToast }