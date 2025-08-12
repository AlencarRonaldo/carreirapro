import { useState, useCallback, useEffect, useRef } from "react"

// Generic async state hook
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAsyncState<T>(
  initialData: T | null = null
): [
  AsyncState<T>,
  (asyncFn: () => Promise<T>) => Promise<T | null>,
  () => void
] {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null
  })

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await asyncFn()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro"
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null })
  }, [initialData])

  return [state, execute, reset]
}

// Multiple loading states manager
export interface LoadingStates {
  [key: string]: boolean
}

export function useLoadingState(initialStates: LoadingStates = {}) {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialStates)

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return Boolean(loadingStates[key])
  }, [loadingStates])

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean)
  }, [loadingStates])

  const clearAll = useCallback(() => {
    setLoadingStates({})
  }, [])

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    clearAll
  }
}

// Progress tracking hook
export interface ProgressState {
  progress: number
  stage: string
  message?: string
  completed: boolean
}

export function useProgressTracker(
  totalStages: number,
  stageLabels?: string[]
) {
  const [progress, setProgress] = useState<ProgressState>({
    progress: 0,
    stage: stageLabels?.[0] || "Iniciando...",
    completed: false
  })

  const nextStage = useCallback((message?: string) => {
    setProgress(prev => {
      const currentStageIndex = Math.floor((prev.progress / 100) * totalStages)
      const nextStageIndex = Math.min(currentStageIndex + 1, totalStages)
      const newProgress = Math.floor((nextStageIndex / totalStages) * 100)
      const isCompleted = nextStageIndex >= totalStages

      return {
        progress: isCompleted ? 100 : newProgress,
        stage: isCompleted 
          ? "Concluído!" 
          : stageLabels?.[nextStageIndex] || `Etapa ${nextStageIndex + 1}`,
        message,
        completed: isCompleted
      }
    })
  }, [totalStages, stageLabels])

  const setStage = useCallback((stageIndex: number, message?: string) => {
    if (stageIndex < 0 || stageIndex > totalStages) return

    setProgress({
      progress: Math.floor((stageIndex / totalStages) * 100),
      stage: stageLabels?.[stageIndex] || `Etapa ${stageIndex + 1}`,
      message,
      completed: stageIndex >= totalStages
    })
  }, [totalStages, stageLabels])

  const reset = useCallback((message?: string) => {
    setProgress({
      progress: 0,
      stage: stageLabels?.[0] || "Iniciando...",
      message,
      completed: false
    })
  }, [stageLabels])

  return {
    progress,
    nextStage,
    setStage,
    reset
  }
}

// Retry mechanism hook
export interface RetryConfig {
  maxAttempts?: number
  delay?: number
  backoff?: boolean
}

export function useRetryableAsync<T>(
  config: RetryConfig = {}
) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = config
  const [state, setState] = useState<AsyncState<T> & { attempt: number }>({
    data: null,
    loading: false,
    error: null,
    attempt: 0
  })

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await asyncFn()
        setState({ 
          data: result, 
          loading: false, 
          error: null, 
          attempt 
        })
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro"
        
        if (attempt === maxAttempts) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: `${errorMessage} (${attempt} tentativas)`,
            attempt
          }))
          throw error
        }

        setState(prev => ({ ...prev, attempt, error: errorMessage }))

        // Wait before retry with optional exponential backoff
        const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    return null
  }, [maxAttempts, delay, backoff])

  const retry = useCallback(async () => {
    if (state.error) {
      setState(prev => ({ ...prev, attempt: 0, error: null }))
    }
  }, [state.error])

  return {
    ...state,
    execute,
    retry
  }
}

// Debounced async operation hook
export function useDebouncedAsync<T>(
  delay: number = 300
): [
  AsyncState<T> & { isDebouncing: boolean },
  (asyncFn: () => Promise<T>) => Promise<T | null>,
  () => void
] {
  const [state, setState] = useState<AsyncState<T> & { isDebouncing: boolean }>({
    data: null,
    loading: false,
    error: null,
    isDebouncing: false
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setState(prev => ({ ...prev, isDebouncing: true, error: null }))

    return new Promise<T | null>((resolve) => {
      timeoutRef.current = setTimeout(async () => {
        if (!mountedRef.current) {
          resolve(null)
          return
        }

        setState(prev => ({ ...prev, loading: true, isDebouncing: false }))

        try {
          const result = await asyncFn()
          if (mountedRef.current) {
            setState({ 
              data: result, 
              loading: false, 
              error: null, 
              isDebouncing: false 
            })
            resolve(result)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro"
          if (mountedRef.current) {
            setState(prev => ({ 
              ...prev, 
              loading: false, 
              error: errorMessage,
              isDebouncing: false 
            }))
          }
          resolve(null)
        }
      }, delay)
    })
  }, [delay])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      setState(prev => ({ ...prev, isDebouncing: false, loading: false }))
    }
  }, [])

  return [state, execute, cancel]
}

// Network status aware hook
export function useNetworkAwareAsync<T>(): [
  AsyncState<T> & { isOnline: boolean; networkError: boolean },
  (asyncFn: () => Promise<T>) => Promise<T | null>
] {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [state, setState] = useState<AsyncState<T> & { networkError: boolean }>({
    data: null,
    loading: false,
    error: null,
    networkError: false
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    if (!isOnline) {
      setState(prev => ({ 
        ...prev, 
        error: "Sem conexão com a internet", 
        networkError: true 
      }))
      return null
    }

    setState(prev => ({ ...prev, loading: true, error: null, networkError: false }))

    try {
      const result = await asyncFn()
      setState({ 
        data: result, 
        loading: false, 
        error: null, 
        networkError: false 
      })
      return result
    } catch (error) {
      const isNetworkError = error instanceof Error && 
        (error.message.includes('fetch') || error.message.includes('network'))
      
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro"
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        networkError: isNetworkError
      }))
      return null
    }
  }, [isOnline])

  return [{ ...state, isOnline }, execute]
}