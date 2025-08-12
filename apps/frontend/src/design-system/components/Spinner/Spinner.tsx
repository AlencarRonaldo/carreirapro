'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Spinner component for loading states
 * 
 * Features:
 * - Multiple sizes
 * - Customizable colors
 * - Accessibility compliant with ARIA labels
 * - Smooth animation with design tokens
 */

const spinnerVariants = cva(
  [
    'animate-spin rounded-full border-2 border-current border-t-transparent',
    'motion-reduce:animate-none motion-reduce:border-t-current',
  ],
  {
    variants: {
      size: {
        xs: 'h-3 w-3 border-[1px]',
        sm: 'h-4 w-4 border-[1.5px]',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-2',
        xl: 'h-12 w-12 border-2',
      },
      variant: {
        default: 'text-[var(--sys-color-text-tertiary)]',
        primary: 'text-[var(--sys-color-interactive-primary)]',
        secondary: 'text-[var(--sys-color-text-secondary)]',
        inverse: 'text-[var(--sys-color-text-inverse)]',
        current: 'text-current',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface SpinnerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Accessible label for screen readers
   */
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = 'Loading...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={label}
        aria-live="polite"
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

// Pre-configured spinner variants
export const LoadingSpinner = React.forwardRef<HTMLDivElement, Omit<SpinnerProps, 'variant'>>(
  (props, ref) => <Spinner ref={ref} variant="primary" {...props} />
)

export const InlineSpinner = React.forwardRef<HTMLDivElement, Omit<SpinnerProps, 'variant' | 'size'>>(
  (props, ref) => <Spinner ref={ref} variant="current" size="sm" {...props} />
)

LoadingSpinner.displayName = 'LoadingSpinner'
InlineSpinner.displayName = 'InlineSpinner'

export { Spinner, spinnerVariants }
export type { VariantProps as SpinnerVariantProps }