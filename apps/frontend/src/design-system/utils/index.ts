/**
 * Design System Utilities
 * 
 * Helper functions and utilities for the design system
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Media query helpers
 */
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  'max-sm': `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  'max-md': `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  'max-lg': `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  'max-xl': `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
} as const

/**
 * Design token access helpers
 */
export const tokens = {
  /**
   * Get a CSS custom property value
   */
  getCSSVar: (name: string) => `var(--${name})`,
  
  /**
   * Get a system token
   */
  getSystemToken: (category: string, variant: string) => 
    `var(--sys-${category}-${variant})`,
  
  /**
   * Get a component token
   */
  getComponentToken: (component: string, property: string) => 
    `var(--comp-${component}-${property})`,
  
  /**
   * Get a reference token
   */
  getReferenceToken: (category: string, variant: string) => 
    `var(--ref-${category}-${variant})`,
} as const

/**
 * Spacing utilities
 */
export const spacing = {
  xs: 'var(--sys-layout-spacing-xs)',    // 4px
  sm: 'var(--sys-layout-spacing-sm)',    // 8px
  md: 'var(--sys-layout-spacing-md)',    // 16px
  lg: 'var(--sys-layout-spacing-lg)',    // 24px
  xl: 'var(--sys-layout-spacing-xl)',    // 32px
  '2xl': 'var(--sys-layout-spacing-2xl)', // 48px
  '3xl': 'var(--sys-layout-spacing-3xl)', // 64px
  '4xl': 'var(--sys-layout-spacing-4xl)', // 96px
} as const

/**
 * Color utilities
 */
export const colors = {
  // Text colors
  text: {
    primary: 'var(--sys-color-text-primary)',
    secondary: 'var(--sys-color-text-secondary)',
    tertiary: 'var(--sys-color-text-tertiary)',
    brand: 'var(--sys-color-text-brand)',
    inverse: 'var(--sys-color-text-inverse)',
  },
  
  // Background colors
  bg: {
    primary: 'var(--sys-color-bg-primary)',
    secondary: 'var(--sys-color-bg-secondary)',
    tertiary: 'var(--sys-color-bg-tertiary)',
    inverse: 'var(--sys-color-bg-inverse)',
  },
  
  // Border colors
  border: {
    primary: 'var(--sys-color-border-primary)',
    secondary: 'var(--sys-color-border-secondary)',
    focus: 'var(--sys-color-border-focus)',
    error: 'var(--sys-color-border-error)',
    success: 'var(--sys-color-border-success)',
    warning: 'var(--sys-color-border-warning)',
  },
  
  // Interactive colors
  interactive: {
    primary: 'var(--sys-color-interactive-primary)',
    'primary-hover': 'var(--sys-color-interactive-primary-hover)',
    'primary-active': 'var(--sys-color-interactive-primary-active)',
    secondary: 'var(--sys-color-interactive-secondary)',
    'secondary-hover': 'var(--sys-color-interactive-secondary-hover)',
    'secondary-active': 'var(--sys-color-interactive-secondary-active)',
  },
  
  // Status colors
  status: {
    success: 'var(--sys-color-status-success)',
    warning: 'var(--sys-color-status-warning)',
    error: 'var(--sys-color-status-error)',
    info: 'var(--sys-color-status-info)',
  },
} as const

/**
 * Animation utilities
 */
export const animations = {
  duration: {
    instant: 'var(--ref-duration-instant)',
    fast: 'var(--ref-duration-fast)',
    normal: 'var(--ref-duration-normal)',
    slow: 'var(--ref-duration-slow)',
  },
  
  easing: {
    linear: 'var(--ref-easing-linear)',
    ease: 'var(--ref-easing-ease)',
    'ease-in': 'var(--ref-easing-ease-in)',
    'ease-out': 'var(--ref-easing-ease-out)',
    'ease-in-out': 'var(--ref-easing-ease-in-out)',
    spring: 'var(--ref-easing-spring)',
    bounce: 'var(--ref-easing-bounce)',
  },
} as const

/**
 * Shadow utilities
 */
export const shadows = {
  none: 'var(--ref-box-shadow-none)',
  sm: 'var(--ref-box-shadow-sm)',
  default: 'var(--ref-box-shadow-default)',
  md: 'var(--ref-box-shadow-md)',
  lg: 'var(--ref-box-shadow-lg)',
  xl: 'var(--ref-box-shadow-xl)',
  '2xl': 'var(--ref-box-shadow-2xl)',
  inner: 'var(--ref-box-shadow-inner)',
} as const

/**
 * Focus utilities
 */
export const focus = {
  ring: {
    width: 'var(--sys-interaction-focus-ring-width)',
    offset: 'var(--sys-interaction-focus-ring-offset)',
    color: 'var(--sys-interaction-focus-ring-color)',
  },
  
  /**
   * Get focus ring styles
   */
  getRingStyles: (options?: { offset?: boolean; width?: string; color?: string }) => ({
    outline: 'none',
    boxShadow: `0 0 0 ${options?.width || focus.ring.width} ${options?.color || focus.ring.color}${options?.offset ? `, 0 0 0 ${focus.ring.offset} var(--sys-color-bg-primary)` : ''}`,
  }),
} as const

/**
 * Typography utilities
 */
export const typography = {
  fontSize: {
    xs: 'var(--ref-font-size-xs)',
    sm: 'var(--ref-font-size-sm)',
    base: 'var(--ref-font-size-base)',
    lg: 'var(--ref-font-size-lg)',
    xl: 'var(--ref-font-size-xl)',
    '2xl': 'var(--ref-font-size-2xl)',
    '3xl': 'var(--ref-font-size-3xl)',
    '4xl': 'var(--ref-font-size-4xl)',
    '5xl': 'var(--ref-font-size-5xl)',
    '6xl': 'var(--ref-font-size-6xl)',
  },
  
  fontWeight: {
    thin: 'var(--ref-font-weight-thin)',
    extralight: 'var(--ref-font-weight-extralight)',
    light: 'var(--ref-font-weight-light)',
    normal: 'var(--ref-font-weight-normal)',
    medium: 'var(--ref-font-weight-medium)',
    semibold: 'var(--ref-font-weight-semibold)',
    bold: 'var(--ref-font-weight-bold)',
    extrabold: 'var(--ref-font-weight-extrabold)',
    black: 'var(--ref-font-weight-black)',
  },
  
  lineHeight: {
    none: 'var(--ref-line-height-none)',
    tight: 'var(--ref-line-height-tight)',
    snug: 'var(--ref-line-height-snug)',
    normal: 'var(--ref-line-height-normal)',
    relaxed: 'var(--ref-line-height-relaxed)',
    loose: 'var(--ref-line-height-loose)',
  },
} as const

/**
 * Accessibility utilities
 */
export const accessibility = {
  /**
   * Screen reader only styles
   */
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: '0',
  } as const,
  
  /**
   * Focus visible styles for keyboard navigation
   */
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  
  /**
   * Minimum touch target size (44x44px)
   */
  touchTarget: {
    minHeight: 'var(--sys-interaction-touch-target-min-height)',
    minWidth: 'var(--sys-interaction-touch-target-min-width)',
  },
} as const

/**
 * Responsive utilities
 */
export const responsive = {
  /**
   * Check if current viewport matches breakpoint
   */
  matchesBreakpoint: (breakpoint: Breakpoint): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`).matches
  },
  
  /**
   * Get responsive class names
   */
  getResponsiveClasses: (
    base: string,
    responsive: Partial<Record<Breakpoint, string>>
  ): string => {
    const classes = [base]
    
    Object.entries(responsive).forEach(([breakpoint, value]) => {
      if (value) {
        classes.push(`${breakpoint}:${value}`)
      }
    })
    
    return classes.join(' ')
  },
} as const

/**
 * Theme utilities
 */
export const theme = {
  /**
   * Toggle between light and dark theme
   */
  toggle: () => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    
    if (isDark) {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  },
  
  /**
   * Set specific theme
   */
  set: (themeName: 'light' | 'dark') => {
    const root = document.documentElement
    
    if (themeName === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', themeName)
  },
  
  /**
   * Get current theme
   */
  get: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },
} as const

/**
 * Performance utilities
 */
export const performance = {
  /**
   * Debounce function
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  },
  
  /**
   * Throttle function
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
} as const

/**
 * Validation utilities
 */
export const validation = {
  /**
   * Check if value is empty
   */
  isEmpty: (value: any): boolean => {
    return value == null || value === '' || value === false || 
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0)
  },
  
  /**
   * Email validation
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  /**
   * URL validation
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
} as const