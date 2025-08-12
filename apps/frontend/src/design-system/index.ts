/**
 * Carreira Pro Design System
 * 
 * Complete design system with tokens, components, and utilities
 * Built for scalability, accessibility, and consistency
 */

// Design Tokens
export * from './tokens'

// Core Components
export * from './components/Button/Button'
export * from './components/Input/Input'
export * from './components/Card/Card'
export * from './components/Spinner/Spinner'
export * from './components/Layout/Layout'

// Typography Components
export * from './components/Typography/Typography'

// Feedback Components
export * from './components/Toast/Toast'
export * from './components/Alert/Alert'

// Navigation Components
export * from './components/Navigation/Navigation'

// Utilities and Hooks
export * from './utils'
export * from './hooks'

// CSS Variables (should be imported in your main CSS)
// import './tokens/css-variables.css'

/**
 * Design System Configuration
 */
export const designSystemConfig = {
  version: '1.0.0',
  tokens: {
    breakpoints: {
      sm: '640px',
      md: '768px', 
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      primary: 'var(--sys-color-interactive-primary)',
      secondary: 'var(--sys-color-interactive-secondary)',
      success: 'var(--sys-color-status-success)',
      warning: 'var(--sys-color-status-warning)',
      error: 'var(--sys-color-status-error)',
      info: 'var(--sys-color-status-info)',
    },
    spacing: {
      xs: 'var(--sys-layout-spacing-xs)',
      sm: 'var(--sys-layout-spacing-sm)', 
      md: 'var(--sys-layout-spacing-md)',
      lg: 'var(--sys-layout-spacing-lg)',
      xl: 'var(--sys-layout-spacing-xl)',
      '2xl': 'var(--sys-layout-spacing-2xl)',
      '3xl': 'var(--sys-layout-spacing-3xl)',
      '4xl': 'var(--sys-layout-spacing-4xl)',
    },
  },
  components: {
    defaultSizes: {
      button: 'md',
      input: 'md',
      card: 'md',
      container: 'xl',
    },
  },
} as const

/**
 * Theme Provider Configuration
 */
export const themeConfig = {
  defaultTheme: 'light',
  storageKey: 'carreira-pro-theme',
  themes: ['light', 'dark'],
  cssVariables: true,
} as const