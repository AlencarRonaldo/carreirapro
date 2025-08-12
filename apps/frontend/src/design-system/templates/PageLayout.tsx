'use client'

import React from 'react'
import { cn } from '../utils'
import { Container, Stack, Flex, Section } from '../components/Layout/Layout'
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card/Card'

/**
 * Page Layout Templates
 * 
 * Features:
 * - Pre-built page layouts for common use cases
 * - Responsive design patterns
 * - Consistent spacing and structure
 * - Accessibility compliant
 * - SEO optimized structure
 */

// Base page layout wrapper
export interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  /**
   * Container size for the main content
   */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  /**
   * Whether to include default page padding
   */
  padded?: boolean
  /**
   * Background variant
   */
  background?: 'transparent' | 'primary' | 'secondary' | 'tertiary'
}

export function PageLayout({ 
  children, 
  className,
  containerSize = 'xl',
  padded = true,
  background = 'transparent'
}: PageLayoutProps) {
  return (
    <main 
      className={cn(
        'min-h-screen w-full',
        background !== 'transparent' && `bg-[var(--sys-color-bg-${background})]`,
        className
      )}
    >
      <Container size={containerSize} padding={padded ? 'md' : 'none'}>
        {children}
      </Container>
    </main>
  )
}

// Dashboard layout with sidebar
export interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  header?: React.ReactNode
  className?: string
  /**
   * Sidebar width
   */
  sidebarWidth?: 'sm' | 'md' | 'lg'
  /**
   * Whether sidebar is collapsible on mobile
   */
  collapsibleSidebar?: boolean
}

export function DashboardLayout({
  children,
  sidebar,
  header,
  className,
  sidebarWidth = 'md',
  collapsibleSidebar = true
}: DashboardLayoutProps) {
  const sidebarWidths = {
    sm: 'w-64',
    md: 'w-72',
    lg: 'w-80'
  }

  return (
    <div className={cn('flex h-screen bg-[var(--sys-color-bg-primary)]', className)}>
      {/* Sidebar */}
      <aside className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0',
        sidebarWidths[sidebarWidth],
        'bg-[var(--sys-color-bg-secondary)]',
        'border-r border-[var(--sys-color-border-primary)]'
      )}>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className={cn(
        'flex flex-col flex-1',
        'lg:pl-72', // Adjust based on sidebar width
        'min-h-0' // Allow flex children to shrink
      )}>
        {/* Header */}
        {header && (
          <header className="sticky top-0 z-40 bg-[var(--sys-color-bg-primary)] border-b border-[var(--sys-color-border-primary)]">
            {header}
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay (when collapsible) */}
      {collapsibleSidebar && (
        <div className="lg:hidden">
          {/* Mobile sidebar would go here - requires state management */}
        </div>
      )}
    </div>
  )
}

// Authentication layout (login, register, etc.)
export interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  logo?: React.ReactNode
  backgroundImage?: string
  className?: string
}

export function AuthLayout({
  children,
  title,
  description,
  logo,
  backgroundImage,
  className
}: AuthLayoutProps) {
  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center',
      'bg-[var(--sys-color-bg-secondary)]',
      className
    )}>
      {/* Background image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <Card size="lg" className="shadow-xl">
          <CardBody spacing="lg">
            {/* Logo and title */}
            <div className="text-center mb-6">
              {logo && (
                <div className="flex justify-center mb-4">
                  {logo}
                </div>
              )}
              
              {title && (
                <h1 className="text-2xl font-bold text-[var(--sys-color-text-primary)] mb-2">
                  {title}
                </h1>
              )}
              
              {description && (
                <p className="text-[var(--sys-color-text-secondary)]">
                  {description}
                </p>
              )}
            </div>

            {/* Form content */}
            {children}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

// Content layout with header and breadcrumbs
export interface ContentLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
  tabs?: React.ReactNode
  className?: string
}

export function ContentLayout({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  tabs,
  className
}: ContentLayoutProps) {
  return (
    <PageLayout className={className}>
      <Stack spacing="lg">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-[var(--sys-color-text-secondary)]">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="hover:text-[var(--sys-color-text-primary)] transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className={index === breadcrumbs.length - 1 ? 'text-[var(--sys-color-text-primary)]' : ''}>
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--sys-color-text-primary)]">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-[var(--sys-color-text-secondary)]">
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>

        {/* Tabs */}
        {tabs && (
          <div className="border-b border-[var(--sys-color-border-primary)]">
            {tabs}
          </div>
        )}

        {/* Main content */}
        <div>
          {children}
        </div>
      </Stack>
    </PageLayout>
  )
}

// Split layout (two columns)
export interface SplitLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  className?: string
  /**
   * Sidebar position
   */
  sidebarPosition?: 'left' | 'right'
  /**
   * Split ratio (sidebar:content)
   */
  split?: '1:2' | '1:3' | '2:3'
  /**
   * Whether to stack on mobile
   */
  stackOnMobile?: boolean
}

export function SplitLayout({
  children,
  sidebar,
  className,
  sidebarPosition = 'left',
  split = '1:3',
  stackOnMobile = true
}: SplitLayoutProps) {
  const splitClasses = {
    '1:2': stackOnMobile ? 'lg:grid-cols-[1fr_2fr]' : 'grid-cols-[1fr_2fr]',
    '1:3': stackOnMobile ? 'lg:grid-cols-[1fr_3fr]' : 'grid-cols-[1fr_3fr]',
    '2:3': stackOnMobile ? 'lg:grid-cols-[2fr_3fr]' : 'grid-cols-[2fr_3fr]',
  }

  return (
    <PageLayout>
      <div className={cn(
        'grid gap-8',
        stackOnMobile ? 'grid-cols-1' : '',
        splitClasses[split],
        className
      )}>
        {sidebarPosition === 'left' ? (
          <>
            <aside>{sidebar}</aside>
            <main>{children}</main>
          </>
        ) : (
          <>
            <main>{children}</main>
            <aside>{sidebar}</aside>
          </>
        )}
      </div>
    </PageLayout>
  )
}

// Settings layout with navigation
export interface SettingsLayoutProps {
  children: React.ReactNode
  navigationItems: Array<{
    id: string
    label: string
    href?: string
    active?: boolean
    icon?: React.ReactNode
  }>
  title: string
  className?: string
}

export function SettingsLayout({
  children,
  navigationItems,
  title,
  className
}: SettingsLayoutProps) {
  return (
    <ContentLayout title={title} className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Settings navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                item.active
                  ? 'bg-[var(--sys-color-interactive-primary)] text-[var(--sys-color-text-inverse)]'
                  : 'text-[var(--sys-color-text-secondary)] hover:bg-[var(--sys-color-bg-secondary)] hover:text-[var(--sys-color-text-primary)]'
              )}
            >
              {item.icon && (
                <span className="mr-3 h-4 w-4">{item.icon}</span>
              )}
              {item.label}
            </a>
          ))}
        </nav>

        {/* Settings content */}
        <main>
          {children}
        </main>
      </div>
    </ContentLayout>
  )
}

// Landing page layout
export interface LandingLayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function LandingLayout({
  children,
  header,
  footer,
  className
}: LandingLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50 bg-[var(--sys-color-bg-primary)]/95 backdrop-blur border-b border-[var(--sys-color-border-primary)]">
          {header}
        </header>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer className="border-t border-[var(--sys-color-border-primary)] bg-[var(--sys-color-bg-secondary)]">
          {footer}
        </footer>
      )}
    </div>
  )
}