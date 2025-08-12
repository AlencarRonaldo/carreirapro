"use client"

import { useCallback, useEffect, useRef } from "react"
import { useDebounce } from "use-debounce"
import { toast } from "sonner"

interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  delay?: number
  enabled?: boolean
  key?: string
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
  key = "autosave"
}: UseAutoSaveOptions<T>) {
  const [debouncedData] = useDebounce(data, delay)
  const previousDataRef = useRef<T | undefined>()
  const isSavingRef = useRef(false)
  const hasChangesRef = useRef(false)
  const savePromiseRef = useRef<Promise<void> | null>(null)

  const saveToStorage = useCallback((data: T) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${key}_draft`, JSON.stringify(data))
      } catch (error) {
        console.warn("Failed to save draft to localStorage:", error)
      }
    }
  }, [key])

  const loadFromStorage = useCallback((): T | null => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`${key}_draft`)
        return stored ? JSON.parse(stored) : null
      } catch (error) {
        console.warn("Failed to load draft from localStorage:", error)
        return null
      }
    }
    return null
  }, [key])

  const clearStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`${key}_draft`)
      } catch (error) {
        console.warn("Failed to clear draft from localStorage:", error)
      }
    }
  }, [key])

  const autoSave = useCallback(async () => {
    if (!enabled || isSavingRef.current) return

    const savePromise = (async () => {
      try {
        isSavingRef.current = true
        await onSave(debouncedData)
        hasChangesRef.current = false
        clearStorage() // Clear draft after successful save
        
        // Show subtle success indicator
        toast.success("Alterações salvas automaticamente", {
          duration: 2000,
          style: { opacity: 0.8 }
        })
      } catch (error) {
        console.error("Auto-save failed:", error)
        
        // Save to localStorage as backup
        saveToStorage(debouncedData)
        
        toast.error("Falha no salvamento automático. Rascunho salvo localmente.", {
          duration: 4000
        })
      } finally {
        isSavingRef.current = false
        savePromiseRef.current = null
      }
    })()

    savePromiseRef.current = savePromise
    return savePromise
  }, [enabled, debouncedData, onSave, clearStorage, saveToStorage])

  // Force save function that bypasses debounce
  const forceSave = useCallback(async () => {
    if (!enabled) return
    
    // Wait for any ongoing save to complete
    if (savePromiseRef.current) {
      await savePromiseRef.current
    }
    
    // If there are unsaved changes, save immediately
    if (hasChangesRef.current && !isSavingRef.current) {
      return await autoSave()
    }
  }, [enabled, autoSave])

  // Auto-save when debounced data changes
  useEffect(() => {
    if (!enabled) return

    const hasDataChanged = JSON.stringify(debouncedData) !== JSON.stringify(previousDataRef.current)
    
    if (hasDataChanged && previousDataRef.current !== undefined) {
      hasChangesRef.current = true
      // Salva no localStorage imediatamente para não perder dados
      saveToStorage(debouncedData)
      autoSave()
    }
    
    previousDataRef.current = debouncedData
  }, [debouncedData, enabled, autoSave, saveToStorage])

  // Save draft to localStorage periodically
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      if (hasChangesRef.current) {
        saveToStorage(debouncedData)
      }
    }, 10000) // Save draft every 10 seconds

    return () => clearInterval(interval)
  }, [enabled, debouncedData, saveToStorage])

  return {
    loadDraft: loadFromStorage,
    clearDraft: clearStorage,
    isSaving: isSavingRef.current,
    hasUnsavedChanges: hasChangesRef.current,
    forceSave
  }
}