'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Layout components with responsive grid system
 * 
 * Features:
 * - Container with max-widths and responsive padding
 * - Flexible Grid system with auto columns
 * - Stack component for vertical spacing
 * - Responsive utilities
 * - Design token integration
 */

// Container component
const containerVariants = cva(
  [
    'mx-auto w-full',
    'px-[var(--sys-layout-spacing-md)]',
    'md:px-[var(--sys-layout-spacing-lg)]',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-[var(--sys-layout-container-sm)]',
        md: 'max-w-[var(--sys-layout-container-md)]',
        lg: 'max-w-[var(--sys-layout-container-lg)]',
        xl: 'max-w-[var(--sys-layout-container-xl)]',
        '2xl': 'max-w-[var(--sys-layout-container-2xl)]',
        full: 'max-w-full',
      },
      padding: {
        none: 'px-0',
        sm: 'px-[var(--sys-layout-spacing-sm)] md:px-[var(--sys-layout-spacing-md)]',
        md: 'px-[var(--sys-layout-spacing-md)] md:px-[var(--sys-layout-spacing-lg)]',
        lg: 'px-[var(--sys-layout-spacing-lg)] md:px-[var(--sys-layout-spacing-xl)]',
      },
    },
    defaultVariants: {
      size: 'xl',
      padding: 'md',
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /**
   * Render as different element
   */
  as?: keyof JSX.IntrinsicElements
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, padding }), className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// Grid component
const gridVariants = cva(
  'grid w-full',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        12: 'grid-cols-12',
        auto: 'grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
        'auto-sm': 'grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
        'auto-lg': 'grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]',
      },
      gap: {
        none: 'gap-0',
        xs: 'gap-[var(--sys-layout-spacing-xs)]',
        sm: 'gap-[var(--sys-layout-spacing-sm)]',
        md: 'gap-[var(--sys-layout-spacing-md)]',
        lg: 'gap-[var(--sys-layout-spacing-lg)]',
        xl: 'gap-[var(--sys-layout-spacing-xl)]',
        '2xl': 'gap-[var(--sys-layout-spacing-2xl)]',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
      justify: {
        start: 'justify-items-start',
        center: 'justify-items-center',
        end: 'justify-items-end',
        stretch: 'justify-items-stretch',
      },
    },
    defaultVariants: {
      cols: 'auto',
      gap: 'md',
      align: 'start',
      justify: 'stretch',
    },
  }
)

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  /**
   * Render as different element
   */
  as?: keyof JSX.IntrinsicElements
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, justify, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(gridVariants({ cols, gap, align, justify }), className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// Grid Item component
const gridItemVariants = cva(
  '',
  {
    variants: {
      colSpan: {
        1: 'col-span-1',
        2: 'col-span-2',
        3: 'col-span-3',
        4: 'col-span-4',
        5: 'col-span-5',
        6: 'col-span-6',
        7: 'col-span-7',
        8: 'col-span-8',
        9: 'col-span-9',
        10: 'col-span-10',
        11: 'col-span-11',
        12: 'col-span-12',
        full: 'col-span-full',
        auto: 'col-auto',
      },
      rowSpan: {
        1: 'row-span-1',
        2: 'row-span-2',
        3: 'row-span-3',
        4: 'row-span-4',
        5: 'row-span-5',
        6: 'row-span-6',
        full: 'row-span-full',
        auto: 'row-auto',
      },
    },
    defaultVariants: {
      colSpan: 'auto',
    },
  }
)

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  /**
   * Render as different element
   */
  as?: keyof JSX.IntrinsicElements
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, rowSpan, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(gridItemVariants({ colSpan, rowSpan }), className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// Flex component
const flexVariants = cva(
  'flex',
  {
    variants: {
      direction: {
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        col: 'flex-col',
        'col-reverse': 'flex-col-reverse',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      wrap: {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
      },
      gap: {
        none: 'gap-0',
        xs: 'gap-[var(--sys-layout-spacing-xs)]',
        sm: 'gap-[var(--sys-layout-spacing-sm)]',
        md: 'gap-[var(--sys-layout-spacing-md)]',
        lg: 'gap-[var(--sys-layout-spacing-lg)]',
        xl: 'gap-[var(--sys-layout-spacing-xl)]',
        '2xl': 'gap-[var(--sys-layout-spacing-2xl)]',
      },
    },
    defaultVariants: {
      direction: 'row',
      align: 'center',
      justify: 'start',
      wrap: 'nowrap',
      gap: 'md',
    },
  }
)

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  /**
   * Render as different element
   */
  as?: keyof JSX.IntrinsicElements
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, align, justify, wrap, gap, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(flexVariants({ direction, align, justify, wrap, gap }), className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// Stack component for consistent vertical spacing
const stackVariants = cva(
  'flex flex-col',
  {
    variants: {
      spacing: {
        none: 'gap-0',
        xs: 'gap-[var(--sys-layout-spacing-xs)]',
        sm: 'gap-[var(--sys-layout-spacing-sm)]',
        md: 'gap-[var(--sys-layout-spacing-md)]',
        lg: 'gap-[var(--sys-layout-spacing-lg)]',
        xl: 'gap-[var(--sys-layout-spacing-xl)]',
        '2xl': 'gap-[var(--sys-layout-spacing-2xl)]',
        '3xl': 'gap-[var(--sys-layout-spacing-3xl)]',
        '4xl': 'gap-[var(--sys-layout-spacing-4xl)]',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
    },
    defaultVariants: {
      spacing: 'md',
      align: 'stretch',
    },
  }
)

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  /**
   * Render as different element
   */
  as?: keyof JSX.IntrinsicElements
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing, align, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(stackVariants({ spacing, align }), className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// Section component for semantic page structure
const sectionVariants = cva(
  'w-full',
  {
    variants: {
      spacing: {
        none: 'py-0',
        sm: 'py-[var(--sys-layout-spacing-lg)]',
        md: 'py-[var(--sys-layout-spacing-xl)]',
        lg: 'py-[var(--sys-layout-spacing-2xl)]',
        xl: 'py-[var(--sys-layout-spacing-3xl)]',
        '2xl': 'py-[var(--sys-layout-spacing-4xl)]',
      },
      bg: {
        transparent: 'bg-transparent',
        primary: 'bg-[var(--sys-color-bg-primary)]',
        secondary: 'bg-[var(--sys-color-bg-secondary)]',
        tertiary: 'bg-[var(--sys-color-bg-tertiary)]',
      },
    },
    defaultVariants: {
      spacing: 'md',
      bg: 'transparent',
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /**
   * Container size for content
   */
  containerSize?: VariantProps<typeof containerVariants>['size']
  /**
   * Whether to include a container
   */
  contained?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, bg, containerSize = 'xl', contained = true, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ spacing, bg }), className)}
        {...props}
      >
        {contained ? (
          <Container size={containerSize}>
            {children}
          </Container>
        ) : (
          children
        )}
      </section>
    )
  }
)

Container.displayName = 'Container'
Grid.displayName = 'Grid'
GridItem.displayName = 'GridItem'
Flex.displayName = 'Flex'
Stack.displayName = 'Stack'
Section.displayName = 'Section'

export {
  Container,
  Grid,
  GridItem,
  Flex,
  Stack,
  Section,
  containerVariants,
  gridVariants,
  gridItemVariants,
  flexVariants,
  stackVariants,
  sectionVariants
}

export type {
  VariantProps as ContainerVariantProps,
  VariantProps as GridVariantProps,
  VariantProps as FlexVariantProps,
  VariantProps as StackVariantProps,
  VariantProps as SectionVariantProps
}