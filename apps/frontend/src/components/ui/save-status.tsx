"use client"

import { useState, useEffect } from "react"
import { Check, Clock, Wifi, WifiOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaveStatusProps {
  isSaving?: boolean
  hasUnsavedChanges?: boolean
  isOffline?: boolean
  lastSaved?: Date | null
  className?: string
}

export function SaveStatus({ 
  isSaving = false, 
  hasUnsavedChanges = false, 
  isOffline = false,
  lastSaved = null,
  className 
}: SaveStatusProps) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const getStatus = () => {
    if (!isOnline || isOffline) {
      return {
        icon: WifiOff,
        text: "Offline - Salvando localmente",
        color: "text-orange-600",
        bg: "bg-orange-50 border-orange-200"
      }
    }
    
    if (isSaving) {
      return {
        icon: Clock,
        text: "Salvando...",
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200"
      }
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: AlertCircle,
        text: "Alterações não salvas",
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200"
      }
    }
    
    return {
      icon: Check,
      text: lastSaved ? `Salvo ${formatRelativeTime(lastSaved)}` : "Todas as alterações salvas",
      color: "text-green-600",
      bg: "bg-green-50 border-green-200"
    }
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 10) return "agora"
    if (seconds < 60) return "há alguns segundos"
    if (minutes === 1) return "há 1 minuto"
    if (minutes < 60) return `há ${minutes} minutos`
    if (hours === 1) return "há 1 hora"
    if (hours < 24) return `há ${hours} horas`
    return date.toLocaleDateString()
  }

  const status = getStatus()
  const Icon = status.icon

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all duration-200",
      status.bg,
      status.color,
      className
    )}>
      <Icon className={cn(
        "h-4 w-4",
        isSaving && "animate-spin"
      )} />
      <span>{status.text}</span>
    </div>
  )
}

// Hook para rastrear status de salvamento
export function useSaveStatus() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const markSaving = () => setIsSaving(true)
  const markSaved = () => {
    setIsSaving(false)
    setHasUnsavedChanges(false)
    setLastSaved(new Date())
  }
  const markChanged = () => setHasUnsavedChanges(true)
  const markError = () => setIsSaving(false)

  return {
    lastSaved,
    isSaving,
    hasUnsavedChanges,
    markSaving,
    markSaved,
    markChanged,
    markError
  }
}