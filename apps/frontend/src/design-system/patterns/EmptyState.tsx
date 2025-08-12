'use client'

import React from 'react'
import { cn } from '../utils'
import { Stack } from '../components/Layout/Layout'
import { Heading3, Text } from '../components/Typography/Typography'
import { Button } from '../components/Button/Button'

/**
 * Empty State Pattern
 * 
 * Consistent pattern for displaying empty states across the application
 * Supports different contexts and provides clear guidance to users
 */

export interface EmptyStateProps {
  /**
   * Empty state variant
   */
  variant?: 'default' | 'search' | 'filter' | 'error' | 'success' | 'loading'
  /**
   * Icon or illustration
   */
  icon?: React.ReactNode
  /**
   * Title text
   */
  title: string
  /**
   * Description text
   */
  description?: string
  /**
   * Primary action button
   */
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  /**
   * Additional content to display
   */
  children?: React.ReactNode
  /**
   * Custom CSS classes
   */
  className?: string
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  action,
  secondaryAction,
  children,
  className,
  size = 'md'
}: EmptyStateProps) {
  // Default icons for variants
  const defaultIcons = {
    default: <DefaultEmptyIcon />,
    search: <SearchEmptyIcon />,
    filter: <FilterEmptyIcon />,
    error: <ErrorEmptyIcon />,
    success: <SuccessEmptyIcon />,
    loading: <LoadingEmptyIcon />,
  }

  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  }

  const iconSizes = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16', 
    lg: 'h-20 w-20'
  }

  const displayIcon = icon || defaultIcons[variant]

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizeClasses[size],
      className
    )}>
      <Stack spacing="lg" align="center">
        {/* Icon */}
        <div className={cn(
          'text-[var(--sys-color-text-tertiary)] mb-2',
          iconSizes[size]
        )}>
          {displayIcon}
        </div>

        {/* Title and description */}
        <Stack spacing="sm" align="center">
          <Heading3 className="text-[var(--sys-color-text-primary)]">
            {title}
          </Heading3>
          
          {description && (
            <Text 
              className="text-[var(--sys-color-text-secondary)] max-w-md"
              variant="body"
            >
              {description}
            </Text>
          )}
        </Stack>

        {/* Actions */}
        {(action || secondaryAction) && (
          <Stack spacing="sm" align="center">
            {action && (
              <Button
                onClick={action.onClick}
                icon={action.icon}
                size="lg"
              >
                {action.label}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                variant="ghost"
                onClick={secondaryAction.onClick}
                icon={secondaryAction.icon}
                size="md"
              >
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        )}

        {/* Additional content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </Stack>
    </div>
  )
}

// Pre-configured empty state variants
export function SearchEmptyState({
  query,
  onClearSearch,
  ...props
}: Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & {
  query?: string
  onClearSearch?: () => void
}) {
  return (
    <EmptyState
      variant="search"
      title={`No results found${query ? ` for "${query}"` : ''}`}
      description="Try adjusting your search terms or clearing the search to see all items."
      action={onClearSearch ? {
        label: 'Clear search',
        onClick: onClearSearch
      } : undefined}
      {...props}
    />
  )
}

export function FilterEmptyState({
  onClearFilters,
  ...props
}: Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & {
  onClearFilters?: () => void
}) {
  return (
    <EmptyState
      variant="filter"
      title="No items match your filters"
      description="Try adjusting or clearing your filters to see more results."
      action={onClearFilters ? {
        label: 'Clear filters',
        onClick: onClearFilters
      } : undefined}
      {...props}
    />
  )
}

export function ErrorEmptyState({
  onRetry,
  ...props
}: Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & {
  onRetry?: () => void
}) {
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description="We couldn't load the data. Please try again or contact support if the problem persists."
      action={onRetry ? {
        label: 'Try again',
        onClick: onRetry
      } : undefined}
      {...props}
    />
  )
}

// Default empty state icons
function DefaultEmptyIcon() {
  return (
    <svg
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function SearchEmptyIcon() {
  return (
    <svg
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

function FilterEmptyIcon() {
  return (
    <svg
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  )
}

function ErrorEmptyIcon() {
  return (
    <svg
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )
}

function SuccessEmptyIcon() {
  return (
    <svg
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function LoadingEmptyIcon() {
  return (
    <svg
      className="w-full h-full animate-spin"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}