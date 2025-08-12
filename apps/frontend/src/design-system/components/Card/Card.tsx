'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Card component with design system integration
 * 
 * Features:
 * - Multiple variants and sizes
 * - Compound component pattern (Header, Body, Footer)
 * - Hover and interactive states
 * - Design token integration
 * - Accessibility compliant
 */

const cardVariants = cva(
  [
    'rounded-[var(--comp-card-border-radius)]',
    'bg-[var(--comp-card-bg)]',
    'border border-[var(--comp-card-border)]',
    'transition-all duration-150 ease-out',
  ],
  {
    variants: {
      variant: {
        default: 'shadow-[var(--comp-card-shadow)]',
        outlined: 'shadow-none',
        elevated: 'shadow-[var(--ref-box-shadow-md)]',
        interactive: [
          'shadow-[var(--comp-card-shadow)] cursor-pointer',
          'hover:shadow-[var(--ref-box-shadow-md)]',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--sys-interaction-focus-ring-color)]',
          'focus-visible:ring-offset-2',
        ],
      },
      size: {
        sm: 'p-[var(--sys-layout-spacing-md)]',
        md: 'p-[var(--comp-card-padding)]',
        lg: 'p-[var(--sys-layout-spacing-xl)]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const cardHeaderVariants = cva(
  [
    'flex flex-col space-y-1.5',
    'pb-[var(--sys-layout-spacing-md)]',
  ],
  {
    variants: {
      withBorder: {
        true: 'border-b border-[var(--sys-color-border-secondary)]',
        false: '',
      },
    },
    defaultVariants: {
      withBorder: false,
    },
  }
)

const cardBodyVariants = cva(
  'flex-1',
  {
    variants: {
      spacing: {
        none: '',
        sm: 'space-y-[var(--sys-layout-spacing-sm)]',
        md: 'space-y-[var(--sys-layout-spacing-md)]',
        lg: 'space-y-[var(--sys-layout-spacing-lg)]',
      },
    },
    defaultVariants: {
      spacing: 'sm',
    },
  }
)

const cardFooterVariants = cva(
  [
    'flex items-center',
    'pt-[var(--sys-layout-spacing-md)]',
  ],
  {
    variants: {
      withBorder: {
        true: 'border-t border-[var(--sys-color-border-secondary)]',
        false: '',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      withBorder: false,
      justify: 'start',
    },
  }
)

// Main Card component
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Make card interactive (clickable)
   */
  interactive?: boolean
  /**
   * Click handler for interactive cards
   */
  onCardClick?: () => void
  /**
   * Render as different element (for semantic HTML)
   */
  as?: keyof JSX.IntrinsicElements
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    interactive,
    onCardClick,
    as: Component = 'div',
    children,
    onClick,
    ...props 
  }, ref) => {
    const computedVariant = interactive ? 'interactive' : variant
    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && onCardClick) {
        onCardClick()
      }
      onClick?.(event)
    }

    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant: computedVariant, size, fullWidth }), className)}
        onClick={interactive ? handleClick : onClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={interactive ? (e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onCardClick) {
            e.preventDefault()
            onCardClick()
          }
        } : undefined}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// Card Header component
export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  /**
   * Header title
   */
  title?: React.ReactNode
  /**
   * Header description/subtitle
   */
  description?: React.ReactNode
  /**
   * Actions to display on the right side
   */
  actions?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder, title, description, actions, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardHeaderVariants({ withBorder }), className)} {...props}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            {title && (
              <div className="font-semibold leading-none tracking-tight text-[var(--sys-color-text-primary)]">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm text-[var(--sys-color-text-secondary)]">
                {description}
              </div>
            )}
            {children && <div>{children}</div>}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    )
  }
)

// Card Body component
export interface CardBodyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardBodyVariants> {}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, spacing, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardBodyVariants({ spacing }), className)} {...props}>
        {children}
      </div>
    )
  }
)

// Card Footer component
export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withBorder, justify, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardFooterVariants({ withBorder, justify }), className)} {...props}>
        {children}
      </div>
    )
  }
)

// Card Title component (for semantic HTML)
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-semibold leading-none tracking-tight text-[var(--sys-color-text-primary)]',
      className
    )}
    {...props}
  >
    {children}
  </h3>
))

// Card Description component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[var(--sys-color-text-secondary)]', className)}
    {...props}
  >
    {children}
  </p>
))

// Card Content (alias for CardBody for backward compatibility)
const CardContent = CardBody

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardBody.displayName = 'CardBody'
CardFooter.displayName = 'CardFooter'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'
CardContent.displayName = 'CardContent'

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants
}

export type { VariantProps as CardVariantProps }