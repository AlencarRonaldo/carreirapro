'use client'

import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '../Spinner'

/**
 * Button component with consistent design system integration
 * 
 * Features:
 * - Multiple variants and sizes
 * - Loading states with spinner
 * - Icon support
 * - Accessibility compliant
 * - Design token integration
 */

const buttonVariants = cva(
  // Base styles using design tokens
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-colors duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--comp-button-primary-bg)] text-[var(--comp-button-primary-color)]',
          'border border-[var(--comp-button-primary-border)]',
          'hover:bg-[var(--comp-button-primary-bg-hover)]',
          'active:bg-[var(--comp-button-primary-bg-active)]',
          'focus-visible:ring-[var(--sys-interaction-focus-ring-color)]',
        ],
        secondary: [
          'bg-[var(--comp-button-secondary-bg)] text-[var(--comp-button-secondary-color)]',
          'border border-[var(--comp-button-secondary-border)]',
          'hover:bg-[var(--comp-button-secondary-bg-hover)]',
          'active:bg-[var(--comp-button-secondary-bg-active)]',
          'focus-visible:ring-[var(--sys-interaction-focus-ring-color)]',
        ],
        ghost: [
          'bg-[var(--comp-button-ghost-bg)] text-[var(--comp-button-ghost-color)]',
          'border border-[var(--comp-button-ghost-border)]',
          'hover:bg-[var(--comp-button-ghost-bg-hover)]',
          'active:bg-[var(--comp-button-ghost-bg-active)]',
          'focus-visible:ring-[var(--sys-interaction-focus-ring-color)]',
        ],
        destructive: [
          'bg-[var(--sys-color-status-error)] text-white',
          'hover:bg-[var(--ref-color-error-600)]',
          'active:bg-[var(--ref-color-error-700)]',
          'focus-visible:ring-[var(--sys-color-status-error)]',
        ],
        outline: [
          'bg-transparent text-[var(--sys-color-text-primary)]',
          'border border-[var(--sys-color-border-primary)]',
          'hover:bg-[var(--sys-color-bg-secondary)]',
          'active:bg-[var(--sys-color-bg-tertiary)]',
          'focus-visible:ring-[var(--sys-interaction-focus-ring-color)]',
        ],
        link: [
          'text-[var(--sys-color-text-brand)] underline-offset-4',
          'hover:underline hover:text-[var(--sys-color-interactive-primary-hover)]',
          'focus-visible:ring-[var(--sys-interaction-focus-ring-color)]',
        ],
      },
      size: {
        sm: [
          'h-[var(--comp-button-size-sm-height)]',
          'px-[var(--comp-button-size-sm-padding-x)]',
          'text-[var(--comp-button-size-sm-font-size)]',
          'gap-1.5',
          '[&_svg]:size-3.5',
        ],
        md: [
          'h-[var(--comp-button-size-md-height)]',
          'px-[var(--comp-button-size-md-padding-x)]',
          'text-[var(--comp-button-size-md-font-size)]',
          'gap-2',
          '[&_svg]:size-4',
        ],
        lg: [
          'h-[var(--comp-button-size-lg-height)]',
          'px-[var(--comp-button-size-lg-padding-x)]',
          'text-[var(--comp-button-size-lg-font-size)]',
          'gap-2.5',
          '[&_svg]:size-5',
        ],
        icon: [
          'h-9 w-9',
          '[&_svg]:size-4',
        ],
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as a different element (useful for Next.js Link, etc.)
   */
  asChild?: boolean
  /**
   * Loading state - shows spinner and disables interaction
   */
  loading?: boolean
  /**
   * Icon to display before the text
   */
  icon?: React.ReactNode
  /**
   * Icon to display after the text
   */
  iconAfter?: React.ReactNode
  /**
   * Full width button
   */
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    asChild = false, 
    loading = false,
    icon,
    iconAfter,
    children,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, className }),
          loading && 'cursor-wait'
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size="sm" />
          </span>
        )}
        
        {/* Content container - hidden during loading */}
        <span className={cn('flex items-center gap-inherit', loading && 'opacity-0')}>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          {children}
          {iconAfter && <span className="inline-flex shrink-0">{iconAfter}</span>}
        </span>
      </Comp>
    )
  }
)

Button.displayName = 'Button'

// Button variants for common use cases
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
)

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="secondary" {...props} />
)

export const DestructiveButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="destructive" {...props} />
)

export const GhostButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="ghost" {...props} />
)

export const OutlineButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="outline" {...props} />
)

export const LinkButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="link" {...props} />
)

PrimaryButton.displayName = 'PrimaryButton'
SecondaryButton.displayName = 'SecondaryButton'
DestructiveButton.displayName = 'DestructiveButton'
GhostButton.displayName = 'GhostButton'
OutlineButton.displayName = 'OutlineButton'
LinkButton.displayName = 'LinkButton'

export { Button, buttonVariants }
export type { VariantProps as ButtonVariantProps }