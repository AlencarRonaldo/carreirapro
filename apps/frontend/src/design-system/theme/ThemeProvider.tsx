'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Advanced Theme System
 * 
 * Features:
 * - Light/Dark theme switching
 * - System preference detection
 * - Persistent theme storage
 * - Theme transition animations
 * - CSS custom property integration
 * - Theme change callbacks
 */

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  systemTheme: ResolvedTheme
  isClient: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  /**
   * Default theme to use
   */
  defaultTheme?: Theme
  /**
   * Storage key for persisting theme preference
   */
  storageKey?: string
  /**
   * Whether to force a theme (useful for testing)
   */
  forcedTheme?: Theme
  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: Theme) => void
  /**
   * Custom themes configuration
   */
  themes?: string[]
  /**
   * Whether to apply theme transitions
   */
  enableTransitions?: boolean
  /**
   * Children components
   */
  children: React.ReactNode
}

export function ThemeProvider({
  defaultTheme = 'system',
  storageKey = 'carreira-pro-theme',
  forcedTheme,
  onThemeChange,
  themes = ['light', 'dark'],
  enableTransitions = true,
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light')
  const [isClient, setIsClient] = useState(false)

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    setIsClient(true)
    
    // Get system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme = mediaQuery.matches ? 'dark' : 'light'
    setSystemTheme(systemTheme)
    
    // Get stored theme or use default
    const storedTheme = localStorage.getItem(storageKey) as Theme
    const initialTheme = storedTheme && themes.includes(storedTheme) ? storedTheme : defaultTheme
    
    setThemeState(initialTheme)
    
    // Resolve theme (system -> actual theme)
    const resolved = initialTheme === 'system' ? systemTheme : initialTheme as ResolvedTheme
    setResolvedTheme(resolved)
    
    // Apply theme to document
    applyTheme(resolved)
    
    // Listen for system theme changes
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
      
      // If current theme is system, update resolved theme
      setThemeState(currentTheme => {
        if (currentTheme === 'system') {
          setResolvedTheme(newSystemTheme)
          applyTheme(newSystemTheme)
        }
        return currentTheme
      })
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [defaultTheme, storageKey, themes])

  // Apply theme to document
  const applyTheme = (theme: ResolvedTheme) => {
    const root = document.documentElement
    const isDark = theme === 'dark'
    
    // Add/remove theme classes
    themes.forEach(t => {
      if (t === theme) {
        root.classList.add(t)
      } else {
        root.classList.remove(t)
      }
    })
    
    // Update color-scheme for browser UI
    root.style.colorScheme = theme
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      const color = isDark 
        ? 'oklch(0.147 0.004 49.25)' // dark background
        : 'oklch(1 0 0)' // light background
      metaThemeColor.setAttribute('content', color)
    }
  }

  const setTheme = (newTheme: Theme) => {
    if (forcedTheme) return
    
    setThemeState(newTheme)
    
    // Resolve theme
    const resolved = newTheme === 'system' ? systemTheme : newTheme as ResolvedTheme
    setResolvedTheme(resolved)
    
    // Apply theme
    if (enableTransitions) {
      // Add transition class temporarily
      document.documentElement.classList.add('theme-transitioning')
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning')
      }, 300)
    }
    
    applyTheme(resolved)
    
    // Persist theme
    localStorage.setItem(storageKey, newTheme)
    
    // Callback
    onThemeChange?.(newTheme)
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const value: ThemeContextValue = {
    theme: forcedTheme || theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme,
    isClient,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {enableTransitions && isClient && (
        <ThemeTransitions />
      )}
    </ThemeContext.Provider>
  )
}

// Theme transition styles component
function ThemeTransitions() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <style jsx>{`
      .theme-transitioning,
      .theme-transitioning *,
      .theme-transitioning *:before,
      .theme-transitioning *:after {
        transition: 
          background-color 300ms ease,
          border-color 300ms ease,
          color 300ms ease,
          fill 300ms ease,
          stroke 300ms ease,
          opacity 300ms ease,
          box-shadow 300ms ease !important;
      }
      
      .theme-transitioning img,
      .theme-transitioning video,
      .theme-transitioning iframe {
        transition: opacity 300ms ease !important;
      }
    `}</style>,
    document.head
  )
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme toggle button component
export interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'switch' | 'dropdown'
  showLabel?: boolean
}

export function ThemeToggle({
  className = '',
  size = 'md',
  variant = 'button',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, resolvedTheme, isClient } = useTheme()

  if (!isClient) {
    // Render placeholder during SSR
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md border border-[var(--sys-color-border-primary)] bg-[var(--sys-color-bg-primary)] h-9 w-9 ${className}`}
        disabled
      >
        <span className="sr-only">Toggle theme</span>
        <div className="h-4 w-4" />
      </button>
    )
  }

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-9 w-9 text-base', 
    lg: 'h-10 w-10 text-lg',
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative inline-block text-left">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className={`
            appearance-none bg-[var(--sys-color-bg-primary)] 
            border border-[var(--sys-color-border-primary)]
            text-[var(--sys-color-text-primary)]
            rounded-md px-3 py-1.5 pr-8
            focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-interactive-primary)]
            ${className}
          `}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-[var(--sys-color-text-tertiary)]" />
        </div>
      </div>
    )
  }

  if (variant === 'switch') {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={`
          relative inline-flex ${sizeClasses[size]} items-center justify-center
          bg-[var(--sys-color-bg-secondary)] 
          border border-[var(--sys-color-border-primary)]
          rounded-full transition-colors
          hover:bg-[var(--sys-color-bg-tertiary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-interactive-primary)]
          ${className}
        `}
        title="Toggle theme"
      >
        <span className="sr-only">Toggle theme</span>
        {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
        {showLabel && (
          <span className="ml-2 text-sm capitalize">{resolvedTheme}</span>
        )}
      </button>
    )
  }

  // Default button variant
  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex ${sizeClasses[size]} items-center justify-center
        bg-[var(--sys-color-bg-primary)] 
        border border-[var(--sys-color-border-primary)]
        rounded-md transition-colors
        hover:bg-[var(--sys-color-bg-secondary)]
        focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-interactive-primary)]
        ${className}
      `}
      title={`Current theme: ${theme}. Click to toggle`}
    >
      <span className="sr-only">Toggle theme (current: {theme})</span>
      {theme === 'system' ? (
        <SystemIcon />
      ) : resolvedTheme === 'dark' ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}
      {showLabel && (
        <span className="ml-2 text-sm capitalize">{theme}</span>
      )}
    </button>
  )
}

// Theme icons
function SunIcon() {
  return (
    <svg
      className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}