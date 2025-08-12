/**
 * Carreira Pro Design System - Design Tokens
 * 
 * Three-layer token architecture:
 * 1. Reference tokens (primitive values)
 * 2. System tokens (semantic meanings)
 * 3. Component tokens (component-specific)
 */

// Reference Tokens - Primitive values
export const referenceTokens = {
  colors: {
    // Brand colors
    brand: {
      50: 'oklch(0.985 0.001 106.423)',
      100: 'oklch(0.97 0.001 106.424)',
      200: 'oklch(0.923 0.003 48.717)',
      300: 'oklch(0.709 0.01 56.259)',
      400: 'oklch(0.553 0.013 58.071)',
      500: 'oklch(0.216 0.006 56.043)',
      600: 'oklch(0.268 0.007 34.298)',
      700: 'oklch(0.147 0.004 49.25)',
      800: 'oklch(0.147 0.004 49.25)',
      900: 'oklch(0.147 0.004 49.25)',
    },
    
    // Grayscale
    neutral: {
      0: 'oklch(1 0 0)',
      50: 'oklch(0.985 0.001 106.423)',
      100: 'oklch(0.97 0.001 106.424)',
      200: 'oklch(0.923 0.003 48.717)',
      300: 'oklch(0.709 0.01 56.259)',
      400: 'oklch(0.553 0.013 58.071)',
      500: 'oklch(0.368 0.009 34.298)',
      600: 'oklch(0.268 0.007 34.298)',
      700: 'oklch(0.216 0.006 56.043)',
      800: 'oklch(0.147 0.004 49.25)',
      900: 'oklch(0.098 0.003 49.25)',
      1000: 'oklch(0 0 0)',
    },

    // Functional colors
    success: {
      50: 'oklch(0.95 0.02 142)',
      100: 'oklch(0.9 0.04 142)',
      500: 'oklch(0.6 0.15 142)',
      600: 'oklch(0.5 0.18 142)',
      900: 'oklch(0.3 0.12 142)',
    },
    
    warning: {
      50: 'oklch(0.95 0.02 90)',
      100: 'oklch(0.9 0.04 90)',
      500: 'oklch(0.7 0.15 90)',
      600: 'oklch(0.6 0.18 90)',
      900: 'oklch(0.4 0.12 90)',
    },
    
    error: {
      50: 'oklch(0.95 0.02 27)',
      100: 'oklch(0.9 0.04 27)',
      500: 'oklch(0.577 0.245 27.325)',
      600: 'oklch(0.5 0.28 27)',
      900: 'oklch(0.3 0.2 27)',
    },
    
    info: {
      50: 'oklch(0.95 0.02 240)',
      100: 'oklch(0.9 0.04 240)',
      500: 'oklch(0.6 0.15 240)',
      600: 'oklch(0.5 0.18 240)',
      900: 'oklch(0.3 0.12 240)',
    },
  },

  // Typography scales
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Spacing scale (rem based)
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadow scales
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Animation durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },

  // Animation easing
  easing: {
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// System Tokens - Semantic meanings
export const systemTokens = {
  // Color semantics
  color: {
    // Background colors
    bg: {
      primary: referenceTokens.colors.neutral[0],
      secondary: referenceTokens.colors.neutral[50],
      tertiary: referenceTokens.colors.neutral[100],
      inverse: referenceTokens.colors.neutral[900],
    },
    
    // Text colors
    text: {
      primary: referenceTokens.colors.neutral[900],
      secondary: referenceTokens.colors.neutral[600],
      tertiary: referenceTokens.colors.neutral[400],
      inverse: referenceTokens.colors.neutral[0],
      brand: referenceTokens.colors.brand[500],
    },
    
    // Border colors
    border: {
      primary: referenceTokens.colors.neutral[200],
      secondary: referenceTokens.colors.neutral[100],
      focus: referenceTokens.colors.brand[500],
      error: referenceTokens.colors.error[500],
      success: referenceTokens.colors.success[500],
      warning: referenceTokens.colors.warning[500],
    },
    
    // Interactive colors
    interactive: {
      primary: referenceTokens.colors.brand[500],
      'primary-hover': referenceTokens.colors.brand[600],
      'primary-active': referenceTokens.colors.brand[700],
      secondary: referenceTokens.colors.neutral[100],
      'secondary-hover': referenceTokens.colors.neutral[200],
      'secondary-active': referenceTokens.colors.neutral[300],
    },
    
    // Status colors
    status: {
      success: referenceTokens.colors.success[500],
      warning: referenceTokens.colors.warning[500],
      error: referenceTokens.colors.error[500],
      info: referenceTokens.colors.info[500],
    },
  },

  // Typography semantics
  typography: {
    // Headings
    heading: {
      h1: {
        fontSize: referenceTokens.fontSize['5xl'],
        fontWeight: referenceTokens.fontWeight.bold,
        lineHeight: referenceTokens.lineHeight.tight,
        letterSpacing: referenceTokens.letterSpacing.tight,
      },
      h2: {
        fontSize: referenceTokens.fontSize['4xl'],
        fontWeight: referenceTokens.fontWeight.semibold,
        lineHeight: referenceTokens.lineHeight.tight,
        letterSpacing: referenceTokens.letterSpacing.tight,
      },
      h3: {
        fontSize: referenceTokens.fontSize['3xl'],
        fontWeight: referenceTokens.fontWeight.semibold,
        lineHeight: referenceTokens.lineHeight.snug,
      },
      h4: {
        fontSize: referenceTokens.fontSize['2xl'],
        fontWeight: referenceTokens.fontWeight.semibold,
        lineHeight: referenceTokens.lineHeight.snug,
      },
      h5: {
        fontSize: referenceTokens.fontSize.xl,
        fontWeight: referenceTokens.fontWeight.medium,
        lineHeight: referenceTokens.lineHeight.normal,
      },
      h6: {
        fontSize: referenceTokens.fontSize.lg,
        fontWeight: referenceTokens.fontWeight.medium,
        lineHeight: referenceTokens.lineHeight.normal,
      },
    },
    
    // Body text
    body: {
      sm: {
        fontSize: referenceTokens.fontSize.sm,
        lineHeight: referenceTokens.lineHeight.normal,
      },
      base: {
        fontSize: referenceTokens.fontSize.base,
        lineHeight: referenceTokens.lineHeight.relaxed,
      },
      lg: {
        fontSize: referenceTokens.fontSize.lg,
        lineHeight: referenceTokens.lineHeight.relaxed,
      },
    },
    
    // Code/monospace
    code: {
      sm: {
        fontSize: referenceTokens.fontSize.xs,
        fontWeight: referenceTokens.fontWeight.normal,
        lineHeight: referenceTokens.lineHeight.normal,
      },
      base: {
        fontSize: referenceTokens.fontSize.sm,
        fontWeight: referenceTokens.fontWeight.normal,
        lineHeight: referenceTokens.lineHeight.normal,
      },
    },
  },

  // Layout semantics
  layout: {
    spacing: {
      xs: referenceTokens.spacing[1],    // 4px
      sm: referenceTokens.spacing[2],    // 8px
      md: referenceTokens.spacing[4],    // 16px
      lg: referenceTokens.spacing[6],    // 24px
      xl: referenceTokens.spacing[8],    // 32px
      '2xl': referenceTokens.spacing[12], // 48px
      '3xl': referenceTokens.spacing[16], // 64px
      '4xl': referenceTokens.spacing[24], // 96px
    },
    
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },

  // Interactive semantics
  interaction: {
    // Animation
    duration: {
      instant: referenceTokens.duration.instant,
      fast: referenceTokens.duration.fast,
      normal: referenceTokens.duration.normal,
      slow: referenceTokens.duration.slow,
    },
    
    // Focus ring
    focusRing: {
      width: '2px',
      offset: '2px',
      color: referenceTokens.colors.brand[500],
    },
    
    // Touch targets
    touchTarget: {
      minHeight: '44px',
      minWidth: '44px',
    },
  },
} as const;

// Component Tokens - Component-specific
export const componentTokens = {
  button: {
    // Sizing
    size: {
      sm: {
        height: '32px',
        paddingX: systemTokens.layout.spacing.sm,
        fontSize: referenceTokens.fontSize.sm,
      },
      md: {
        height: '40px',
        paddingX: systemTokens.layout.spacing.md,
        fontSize: referenceTokens.fontSize.base,
      },
      lg: {
        height: '48px',
        paddingX: systemTokens.layout.spacing.lg,
        fontSize: referenceTokens.fontSize.lg,
      },
    },
    
    // Variants
    variant: {
      primary: {
        bg: systemTokens.color.interactive.primary,
        color: systemTokens.color.text.inverse,
        border: 'transparent',
        'bg-hover': systemTokens.color.interactive['primary-hover'],
        'bg-active': systemTokens.color.interactive['primary-active'],
      },
      secondary: {
        bg: systemTokens.color.interactive.secondary,
        color: systemTokens.color.text.primary,
        border: systemTokens.color.border.primary,
        'bg-hover': systemTokens.color.interactive['secondary-hover'],
        'bg-active': systemTokens.color.interactive['secondary-active'],
      },
      ghost: {
        bg: 'transparent',
        color: systemTokens.color.text.primary,
        border: 'transparent',
        'bg-hover': systemTokens.color.interactive.secondary,
        'bg-active': systemTokens.color.interactive['secondary-hover'],
      },
    },
    
    borderRadius: referenceTokens.borderRadius.md,
    fontWeight: referenceTokens.fontWeight.medium,
  },

  input: {
    size: {
      sm: {
        height: '32px',
        paddingX: systemTokens.layout.spacing.sm,
        fontSize: referenceTokens.fontSize.sm,
      },
      md: {
        height: '40px',
        paddingX: systemTokens.layout.spacing.md,
        fontSize: referenceTokens.fontSize.base,
      },
      lg: {
        height: '48px',
        paddingX: systemTokens.layout.spacing.lg,
        fontSize: referenceTokens.fontSize.lg,
      },
    },
    
    bg: systemTokens.color.bg.primary,
    border: systemTokens.color.border.primary,
    'border-focus': systemTokens.color.border.focus,
    'border-error': systemTokens.color.border.error,
    color: systemTokens.color.text.primary,
    placeholder: systemTokens.color.text.tertiary,
    borderRadius: referenceTokens.borderRadius.md,
  },

  card: {
    bg: systemTokens.color.bg.primary,
    border: systemTokens.color.border.primary,
    borderRadius: referenceTokens.borderRadius.lg,
    shadow: referenceTokens.boxShadow.sm,
    padding: systemTokens.layout.spacing.lg,
  },

  modal: {
    overlay: {
      bg: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
    },
    content: {
      bg: systemTokens.color.bg.primary,
      borderRadius: referenceTokens.borderRadius.xl,
      shadow: referenceTokens.boxShadow['2xl'],
      maxWidth: '500px',
    },
  },
} as const;

// Dark theme overrides
export const darkThemeTokens = {
  color: {
    bg: {
      primary: referenceTokens.colors.neutral[900],
      secondary: referenceTokens.colors.neutral[800],
      tertiary: referenceTokens.colors.neutral[700],
      inverse: referenceTokens.colors.neutral[0],
    },
    
    text: {
      primary: referenceTokens.colors.neutral[50],
      secondary: referenceTokens.colors.neutral[300],
      tertiary: referenceTokens.colors.neutral[400],
      inverse: referenceTokens.colors.neutral[900],
      brand: referenceTokens.colors.brand[200],
    },
    
    border: {
      primary: 'oklch(1 0 0 / 10%)',
      secondary: 'oklch(1 0 0 / 5%)',
      focus: referenceTokens.colors.brand[400],
      error: referenceTokens.colors.error[400],
      success: referenceTokens.colors.success[400],
      warning: referenceTokens.colors.warning[400],
    },
    
    interactive: {
      primary: referenceTokens.colors.brand[400],
      'primary-hover': referenceTokens.colors.brand[300],
      'primary-active': referenceTokens.colors.brand[200],
      secondary: referenceTokens.colors.neutral[700],
      'secondary-hover': referenceTokens.colors.neutral[600],
      'secondary-active': referenceTokens.colors.neutral[500],
    },
  },
} as const;

// Type definitions for better TypeScript support
export type ReferenceTokens = typeof referenceTokens;
export type SystemTokens = typeof systemTokens;
export type ComponentTokens = typeof componentTokens;
export type DarkThemeTokens = typeof darkThemeTokens;

// Utility functions for token access
export const getToken = {
  color: (path: string) => {
    const keys = path.split('.');
    let value: any = systemTokens.color;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  },
  
  spacing: (size: keyof typeof systemTokens.layout.spacing) => {
    return systemTokens.layout.spacing[size];
  },
  
  typography: (variant: string, property?: string) => {
    const keys = variant.split('.');
    let value: any = systemTokens.typography;
    for (const key of keys) {
      value = value?.[key];
    }
    return property ? value?.[property] : value;
  },
} as const;