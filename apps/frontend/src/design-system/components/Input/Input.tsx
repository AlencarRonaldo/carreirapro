'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Input component with design system integration
 * 
 * Features:
 * - Multiple sizes and states
 * - Icon support (left and right)
 * - Error and success states
 * - Accessibility compliant
 * - Design token integration
 */

const inputVariants = cva(
  [
    'flex w-full border transition-colors duration-150 ease-out',
    'bg-[var(--comp-input-bg)] text-[var(--comp-input-color)]',
    'border-[var(--comp-input-border)] rounded-[var(--comp-input-border-radius)]',
    'placeholder:text-[var(--comp-input-placeholder)]',
    'focus-visible:outline-none focus-visible:border-[var(--comp-input-border-focus)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--sys-interaction-focus-ring-color)]/20',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-[invalid=true]:border-[var(--comp-input-border-error)]',
    'aria-[invalid=true]:focus-visible:border-[var(--comp-input-border-error)]',
    'aria-[invalid=true]:focus-visible:ring-[var(--sys-color-status-error)]/20',
  ],
  {
    variants: {
      size: {
        sm: [
          'h-[var(--comp-input-size-sm-height)]',
          'px-[var(--comp-input-size-sm-padding-x)]',
          'text-[var(--comp-input-size-sm-font-size)]',
        ],
        md: [
          'h-[var(--comp-input-size-md-height)]',
          'px-[var(--comp-input-size-md-padding-x)]',
          'text-[var(--comp-input-size-md-font-size)]',
        ],
        lg: [
          'h-[var(--comp-input-size-lg-height)]',
          'px-[var(--comp-input-size-lg-padding-x)]',
          'text-[var(--comp-input-size-lg-font-size)]',
        ],
      },
      state: {
        default: '',
        error: [
          'border-[var(--comp-input-border-error)]',
          'focus-visible:border-[var(--comp-input-border-error)]',
          'focus-visible:ring-[var(--sys-color-status-error)]/20',
        ],
        success: [
          'border-[var(--sys-color-status-success)]',
          'focus-visible:border-[var(--sys-color-status-success)]',
          'focus-visible:ring-[var(--sys-color-status-success)]/20',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
)

const inputWrapperVariants = cva(
  'relative flex items-center',
  {
    variants: {
      size: {
        sm: 'gap-2',
        md: 'gap-2.5',
        lg: 'gap-3',
      },
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Icon to display on the left side
   */
  iconLeft?: React.ReactNode
  /**
   * Icon to display on the right side
   */
  iconRight?: React.ReactNode
  /**
   * Error state
   */
  error?: boolean
  /**
   * Success state
   */
  success?: boolean
  /**
   * Helper text or error message
   */
  helperText?: string
  /**
   * Label for the input
   */
  label?: string
  /**
   * Required field indicator
   */
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    size = 'md',
    state,
    iconLeft,
    iconRight,
    error,
    success,
    helperText,
    label,
    required,
    disabled,
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...props 
  }, ref) => {
    // Auto-determine state based on props
    const computedState = error ? 'error' : success ? 'success' : state || 'default'
    
    // Generate unique IDs if not provided
    const inputId = id || React.useId()
    const helperTextId = helperText ? `${inputId}-helper` : undefined
    const describedBy = [ariaDescribedBy, helperTextId].filter(Boolean).join(' ') || undefined

    // Icon sizing based on input size
    const iconSize = {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }[size]

    const paddingAdjustment = {
      sm: iconLeft ? 'pl-8' : iconRight ? 'pr-8' : '',
      md: iconLeft ? 'pl-10' : iconRight ? 'pr-10' : '',
      lg: iconLeft ? 'pl-12' : iconRight ? 'pr-12' : '',
    }[size]

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-[var(--sys-color-text-primary)] mb-1.5',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
            {required && (
              <span className="text-[var(--sys-color-status-error)] ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className={inputWrapperVariants({ size })}>
          <div className="relative flex-1">
            {/* Left icon */}
            {iconLeft && (
              <div className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sys-color-text-tertiary)]',
                disabled && 'opacity-50',
                iconSize
              )}>
                {iconLeft}
              </div>
            )}

            {/* Input element */}
            <input
              ref={ref}
              id={inputId}
              className={cn(
                inputVariants({ size, state: computedState }),
                paddingAdjustment,
                className
              )}
              disabled={disabled}
              required={required}
              aria-invalid={error || ariaInvalid}
              aria-describedby={describedBy}
              {...props}
            />

            {/* Right icon */}
            {iconRight && (
              <div className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sys-color-text-tertiary)]',
                disabled && 'opacity-50',
                iconSize
              )}>
                {iconRight}
              </div>
            )}
          </div>
        </div>

        {/* Helper text */}
        {helperText && (
          <p
            id={helperTextId}
            className={cn(
              'mt-1.5 text-sm',
              computedState === 'error' && 'text-[var(--sys-color-status-error)]',
              computedState === 'success' && 'text-[var(--sys-color-status-success)]',
              computedState === 'default' && 'text-[var(--sys-color-text-secondary)]',
              disabled && 'opacity-50'
            )}
            role={computedState === 'error' ? 'alert' : undefined}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea variant
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    Pick<InputProps, 'size' | 'state' | 'error' | 'success' | 'helperText' | 'label' | 'required'> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    size = 'md',
    state,
    error,
    success,
    helperText,
    label,
    required,
    disabled,
    id,
    rows = 3,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...props 
  }, ref) => {
    // Auto-determine state based on props
    const computedState = error ? 'error' : success ? 'success' : state || 'default'
    
    // Generate unique IDs if not provided
    const textareaId = id || React.useId()
    const helperTextId = helperText ? `${textareaId}-helper` : undefined
    const describedBy = [ariaDescribedBy, helperTextId].filter(Boolean).join(' ') || undefined

    const textareaVariants = cva(
      [
        'flex min-h-[80px] w-full resize-y border py-2 transition-colors duration-150 ease-out',
        'bg-[var(--comp-input-bg)] text-[var(--comp-input-color)]',
        'border-[var(--comp-input-border)] rounded-[var(--comp-input-border-radius)]',
        'placeholder:text-[var(--comp-input-placeholder)]',
        'focus-visible:outline-none focus-visible:border-[var(--comp-input-border-focus)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--sys-interaction-focus-ring-color)]/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-[var(--comp-input-border-error)]',
        'aria-[invalid=true]:focus-visible:border-[var(--comp-input-border-error)]',
        'aria-[invalid=true]:focus-visible:ring-[var(--sys-color-status-error)]/20',
      ],
      {
        variants: {
          size: {
            sm: [
              'px-[var(--comp-input-size-sm-padding-x)]',
              'text-[var(--comp-input-size-sm-font-size)]',
            ],
            md: [
              'px-[var(--comp-input-size-md-padding-x)]',
              'text-[var(--comp-input-size-md-font-size)]',
            ],
            lg: [
              'px-[var(--comp-input-size-lg-padding-x)]',
              'text-[var(--comp-input-size-lg-font-size)]',
            ],
          },
          state: {
            default: '',
            error: [
              'border-[var(--comp-input-border-error)]',
              'focus-visible:border-[var(--comp-input-border-error)]',
              'focus-visible:ring-[var(--sys-color-status-error)]/20',
            ],
            success: [
              'border-[var(--sys-color-status-success)]',
              'focus-visible:border-[var(--sys-color-status-success)]',
              'focus-visible:ring-[var(--sys-color-status-success)]/20',
            ],
          },
        },
        defaultVariants: {
          size: 'md',
          state: 'default',
        },
      }
    )

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium text-[var(--sys-color-text-primary)] mb-1.5',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
            {required && (
              <span className="text-[var(--sys-color-status-error)] ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea element */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(textareaVariants({ size, state: computedState }), className)}
          disabled={disabled}
          required={required}
          aria-invalid={error || ariaInvalid}
          aria-describedby={describedBy}
          {...props}
        />

        {/* Helper text */}
        {helperText && (
          <p
            id={helperTextId}
            className={cn(
              'mt-1.5 text-sm',
              computedState === 'error' && 'text-[var(--sys-color-status-error)]',
              computedState === 'success' && 'text-[var(--sys-color-status-success)]',
              computedState === 'default' && 'text-[var(--sys-color-text-secondary)]',
              disabled && 'opacity-50'
            )}
            role={computedState === 'error' ? 'alert' : undefined}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Input, Textarea, inputVariants }
export type { VariantProps as InputVariantProps }