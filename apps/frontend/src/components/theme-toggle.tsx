"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

export function ThemeToggle() {
  const mounted = useMounted()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const handleThemeChange = React.useCallback(() => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }, [theme, setTheme])

  // Add keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
  React.useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        handleThemeChange()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mounted, handleThemeChange])

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background">
        <div className="w-4 h-4 opacity-0" />
      </div>
    )
  }

  const getIcon = () => {
    const iconClass = "w-4 h-4 transition-all duration-300 ease-in-out"
    
    switch (theme) {
      case 'light':
        return <Sun className={`${iconClass} rotate-0 scale-100`} />
      case 'dark':
        return <Moon className={`${iconClass} rotate-0 scale-100`} />
      case 'system':
        return <Monitor className={`${iconClass} rotate-0 scale-100`} />
      default:
        // Fallback based on resolved theme
        return resolvedTheme === 'dark' 
          ? <Moon className={`${iconClass} rotate-0 scale-100`} />
          : <Sun className={`${iconClass} rotate-0 scale-100`} />
    }
  }

  const getTooltip = () => {
    const baseTooltip = (() => {
      switch (theme) {
        case 'light':
          return 'Mudar para tema escuro'
        case 'dark':
          return 'Usar tema do sistema'
        case 'system':
          return 'Mudar para tema claro'
        default:
          return 'Alternar tema'
      }
    })()
    return `${baseTooltip} (Ctrl+Shift+T)`
  }

  return (
    <button
      onClick={handleThemeChange}
      className="relative flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <div className="transition-transform duration-200 ease-in-out hover:scale-110">
        {getIcon()}
      </div>
      {/* Visual feedback for theme change */}
      <div className="absolute inset-0 rounded-md bg-primary/10 opacity-0 transition-opacity duration-150 group-active:opacity-100" />
    </button>
  )
}