'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Typography component with design system integration
 * 
 * Features:
 * - Semantic heading levels (h1-h6)
 * - Body text variants
 * - Design token integration
 * - Responsive typography
 * - Color variants
 */

const typographyVariants = cva(
  'text-[var(--sys-color-text-primary)]',
  {
    variants: {
      variant: {
        h1: [
          'text-[var(--ref-font-size-5xl)]',
          'font-[var(--ref-font-weight-bold)]',
          'leading-[var(--ref-line-height-tight)]',
          'tracking-[var(--ref-letter-spacing-tight)]',
          'md:text-[var(--ref-font-size-6xl)]',
        ],
        h2: [
          'text-[var(--ref-font-size-4xl)]',
          'font-[var(--ref-font-weight-semibold)]',
          'leading-[var(--ref-line-height-tight)]',
          'tracking-[var(--ref-letter-spacing-tight)]',
          'md:text-[var(--ref-font-size-5xl)]',
        ],
        h3: [
          'text-[var(--ref-font-size-3xl)]',
          'font-[var(--ref-font-weight-semibold)]',
          'leading-[var(--ref-line-height-snug)]',
          'md:text-[var(--ref-font-size-4xl)]',
        ],
        h4: [
          'text-[var(--ref-font-size-2xl)]',
          'font-[var(--ref-font-weight-semibold)]',
          'leading-[var(--ref-line-height-snug)]',
          'md:text-[var(--ref-font-size-3xl)]',
        ],
        h5: [
          'text-[var(--ref-font-size-xl)]',
          'font-[var(--ref-font-weight-medium)]',
          'leading-[var(--ref-line-height-normal)]',
          'md:text-[var(--ref-font-size-2xl)]',
        ],
        h6: [
          'text-[var(--ref-font-size-lg)]',
          'font-[var(--ref-font-weight-medium)]',
          'leading-[var(--ref-line-height-normal)]',
          'md:text-[var(--ref-font-size-xl)]',
        ],
        'body-lg': [
          'text-[var(--ref-font-size-lg)]',
          'leading-[var(--ref-line-height-relaxed)]',
          'font-[var(--ref-font-weight-normal)]',
        ],
        body: [
          'text-[var(--ref-font-size-base)]',
          'leading-[var(--ref-line-height-relaxed)]',
          'font-[var(--ref-font-weight-normal)]',
        ],
        'body-sm': [
          'text-[var(--ref-font-size-sm)]',
          'leading-[var(--ref-line-height-normal)]',
          'font-[var(--ref-font-weight-normal)]',
        ],
        caption: [
          'text-[var(--ref-font-size-xs)]',
          'leading-[var(--ref-line-height-normal)]',
          'font-[var(--ref-font-weight-normal)]',
        ],
        lead: [
          'text-[var(--ref-font-size-xl)]',
          'leading-[var(--ref-line-height-relaxed)]',
          'font-[var(--ref-font-weight-normal)]',
          'text-[var(--sys-color-text-secondary)]',
        ],
        muted: [
          'text-[var(--ref-font-size-sm)]',
          'leading-[var(--ref-line-height-normal)]',
          'font-[var(--ref-font-weight-normal)]',
          'text-[var(--sys-color-text-tertiary)]',
        ],
        code: [
          'text-[var(--ref-font-size-sm)]',
          'font-mono',
          'font-[var(--ref-font-weight-normal)]',
          'bg-[var(--sys-color-bg-secondary)]',
          'px-1.5 py-0.5',
          'rounded-[var(--ref-border-radius-sm)]',
        ],
      },
      color: {
        default: 'text-[var(--sys-color-text-primary)]',
        secondary: 'text-[var(--sys-color-text-secondary)]',
        tertiary: 'text-[var(--sys-color-text-tertiary)]',
        brand: 'text-[var(--sys-color-text-brand)]',
        inverse: 'text-[var(--sys-color-text-inverse)]',
        success: 'text-[var(--sys-color-status-success)]',
        warning: 'text-[var(--sys-color-status-warning)]',
        error: 'text-[var(--sys-color-status-error)]',
        info: 'text-[var(--sys-color-status-info)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      transform: {
        none: 'transform-none',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
      },
    },
    defaultVariants: {
      variant: 'body',
      color: 'default',
      align: 'left',
      transform: 'none',
    },
  }
)

// Component mapping for semantic HTML
const componentMapping = {
  h1: 'h1',
  h2: 'h2', 
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  lead: 'p',
  muted: 'p',
  code: 'code',
} as const

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /**
   * Override the default HTML element
   */
  as?: keyof JSX.IntrinsicElements
  /**
   * Whether to truncate text with ellipsis
   */
  truncate?: boolean
  /**
   * Number of lines to clamp (creates line clamp)
   */
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    className, 
    variant = 'body', 
    color, 
    align, 
    transform,
    as,
    truncate,
    lineClamp,
    children, 
    ...props 
  }, ref) => {
    // Determine the HTML element
    const Component = as || (componentMapping[variant as keyof typeof componentMapping] || 'p')
    
    // Build additional classes
    const additionalClasses = cn(
      truncate && 'truncate',
      lineClamp && `line-clamp-${lineClamp}`,
      className
    )

    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({ variant, color, align, transform }),
          additionalClasses
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// Pre-configured heading components
const Heading1 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="h1" as="h1" {...props} />
)

const Heading2 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="h2" as="h2" {...props} />
)

const Heading3 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="h3" as="h3" {...props} />
)

const Heading4 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="h4" as="h4" {...props} />
)

const Heading5 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="h5" as="h5" {...props} />
)

const Heading6 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="h6" as="h6" {...props} />
)

const Text = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ color = 'default', ...props }, ref) => (
    <Typography ref={ref} variant="body" as="p" color={color} {...props} />
  )
)

const TextLarge = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="body-lg" as="p" {...props} />
)

const TextSmall = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="body-sm" as="p" {...props} />
)

const TextMuted = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="muted" as="p" {...props} />
)

const TextLead = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="lead" as="p" {...props} />
)

const Code = React.forwardRef<HTMLElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="code" as="code" {...props} />
)

const Caption = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant' | 'as'>>(
  (props, ref) => <Typography ref={ref} variant="caption" as="span" {...props} />
)

// Blockquote component
const Blockquote = React.forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement>>(
  ({ className, children, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        'mt-6 border-l-2 border-[var(--sys-color-border-primary)] pl-6 italic text-[var(--sys-color-text-secondary)]',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
)

Typography.displayName = 'Typography'
Heading1.displayName = 'Heading1'
Heading2.displayName = 'Heading2'
Heading3.displayName = 'Heading3'
Heading4.displayName = 'Heading4'
Heading5.displayName = 'Heading5'
Heading6.displayName = 'Heading6'
Text.displayName = 'Text'
TextLarge.displayName = 'TextLarge'
TextSmall.displayName = 'TextSmall'
TextMuted.displayName = 'TextMuted'
TextLead.displayName = 'TextLead'
Code.displayName = 'Code'
Caption.displayName = 'Caption'
Blockquote.displayName = 'Blockquote'

export {
  Typography,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Text,
  TextLarge,
  TextSmall,
  TextMuted,
  TextLead,
  Code,
  Caption,
  Blockquote,
  typographyVariants
}

export type { VariantProps as TypographyVariantProps }