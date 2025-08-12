# Carreira Pro Design System - Integration Guide

## Overview

The Carreira Pro Design System is a comprehensive, production-ready design system built for scalability, accessibility, and consistency. It provides a unified foundation for building user interfaces across the entire platform.

## 🎯 Key Features

- **Design Tokens**: Three-layer token architecture (Reference → System → Component)
- **Component Library**: 15+ production-ready components with consistent APIs
- **Advanced Theme System**: Light/dark mode with system preference detection
- **Responsive Layout**: Flexible grid system and layout components  
- **Accessibility First**: WCAG 2.1 AA compliance with comprehensive testing
- **TypeScript**: Fully typed with excellent developer experience
- **Performance Optimized**: Tree-shakeable, minimal bundle impact

## 📦 Installation & Setup

### 1. Import Design System CSS Variables

Add the design system CSS variables to your main CSS file:

```css
/* In src/app/globals.css */
@import "../design-system/tokens/css-variables.css";
```

### 2. Set up Theme Provider

Wrap your application with the ThemeProvider:

```tsx
// In src/app/layout.tsx
import { ThemeProvider } from '@/design-system/theme/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          defaultTheme="system"
          storageKey="carreira-pro-theme"
          enableTransitions
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3. Import Components

Import components from the design system:

```tsx
import { 
  Button, 
  Input, 
  Card, 
  Container, 
  Stack,
  Heading1,
  Text 
} from '@/design-system'
```

## 🎨 Design Tokens

### Token Architecture

The design system uses a three-layer token architecture:

```
Reference Tokens (Primitive values)
    ↓
System Tokens (Semantic meanings)  
    ↓
Component Tokens (Component-specific)
```

### Using Tokens

#### In CSS
```css
.my-component {
  background-color: var(--sys-color-bg-primary);
  color: var(--sys-color-text-primary);
  padding: var(--sys-layout-spacing-md);
  border-radius: var(--ref-border-radius-lg);
}
```

#### In JavaScript/TypeScript
```tsx
import { colors, spacing, typography } from '@/design-system/utils'

const styles = {
  backgroundColor: colors.bg.primary,
  color: colors.text.primary,
  padding: spacing.md,
  fontSize: typography.fontSize.lg,
}
```

## 🧩 Core Components

### Button

Comprehensive button component with multiple variants and states:

```tsx
import { Button, PrimaryButton, SecondaryButton } from '@/design-system'

// Basic usage
<Button>Click me</Button>

// With variants and props
<Button 
  variant="primary" 
  size="lg" 
  loading={isLoading}
  icon={<PlusIcon />}
  fullWidth
>
  Create Account
</Button>

// Pre-configured variants
<PrimaryButton>Save</PrimaryButton>
<SecondaryButton>Cancel</SecondaryButton>
```

### Input

Form input with validation states and icons:

```tsx
import { Input, Textarea } from '@/design-system'

// Basic input
<Input 
  label="Email"
  placeholder="Enter your email"
  required
/>

// With validation
<Input
  label="Password"
  type="password"
  error={!!errors.password}
  helperText={errors.password?.message}
  iconLeft={<LockIcon />}
/>

// Textarea
<Textarea
  label="Description"
  rows={4}
  helperText="Optional description"
/>
```

### Card

Flexible card component with compound pattern:

```tsx
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  CardTitle,
  CardDescription 
} from '@/design-system'

<Card variant="elevated" size="lg">
  <CardHeader
    title="Project Details"
    description="Manage your project settings"
    actions={<Button variant="ghost">Edit</Button>}
  />
  <CardBody>
    <p>Card content goes here...</p>
  </CardBody>
  <CardFooter justify="between">
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

### Layout System

Responsive layout components:

```tsx
import { 
  Container, 
  Grid, 
  GridItem, 
  Stack, 
  Flex,
  Section 
} from '@/design-system'

// Container with responsive sizing
<Container size="xl">
  <Stack spacing="lg">
    <Heading1>Page Title</Heading1>
    
    {/* Responsive grid */}
    <Grid cols="auto" gap="lg">
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
    </Grid>
    
    {/* Flex layout */}
    <Flex justify="between" align="center">
      <Text>Status: Active</Text>
      <Button>Action</Button>
    </Flex>
  </Stack>
</Container>
```

### Typography

Semantic typography components:

```tsx
import { 
  Heading1, 
  Heading2, 
  Text, 
  TextLarge, 
  TextMuted,
  Code 
} from '@/design-system'

<Stack spacing="md">
  <Heading1>Main Title</Heading1>
  <Heading2 color="secondary">Subtitle</Heading2>
  <TextLarge>Lead paragraph text</TextLarge>
  <Text>Regular body text</Text>
  <TextMuted>Secondary information</TextMuted>
  <Code>const example = 'code';</Code>
</Stack>
```

## 📱 Page Templates

Pre-built page layouts for common use cases:

### Dashboard Layout
```tsx
import { DashboardLayout } from '@/design-system/templates/PageLayout'

<DashboardLayout
  sidebar={<Navigation />}
  header={<Header />}
>
  <div>Dashboard content</div>
</DashboardLayout>
```

### Content Layout
```tsx
import { ContentLayout } from '@/design-system/templates/PageLayout'

<ContentLayout
  title="Settings"
  description="Manage your account settings"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Settings' }
  ]}
  actions={<Button>Save Changes</Button>}
>
  <div>Page content</div>
</ContentLayout>
```

### Authentication Layout
```tsx
import { AuthLayout } from '@/design-system/templates/PageLayout'

<AuthLayout
  title="Welcome Back"
  description="Sign in to your account"
  logo={<Logo />}
>
  <LoginForm />
</AuthLayout>
```

## 🎭 Theme System

### Theme Toggle
```tsx
import { ThemeToggle } from '@/design-system/theme/ThemeProvider'

// Button variant (cycles through light → dark → system)
<ThemeToggle variant="button" showLabel />

// Switch variant (toggles between light/dark)
<ThemeToggle variant="switch" />

// Dropdown variant (shows all options)
<ThemeToggle variant="dropdown" />
```

### Using Theme Context
```tsx
import { useTheme } from '@/design-system/theme/ThemeProvider'

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <Button onClick={toggleTheme}>Toggle Theme</Button>
      <Button onClick={() => setTheme('dark')}>Force Dark</Button>
    </div>
  )
}
```

## 🎯 Composition Patterns

### Empty States
```tsx
import { 
  EmptyState, 
  SearchEmptyState, 
  ErrorEmptyState 
} from '@/design-system/patterns'

// Generic empty state
<EmptyState
  title="No items found"
  description="Get started by creating your first item"
  action={{
    label: 'Create Item',
    onClick: handleCreate
  }}
/>

// Search-specific empty state
<SearchEmptyState
  query={searchQuery}
  onClearSearch={() => setSearchQuery('')}
/>

// Error state
<ErrorEmptyState onRetry={handleRetry} />
```

## 📱 Responsive Design

### Breakpoints
```tsx
// Available breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

### Responsive Utilities
```tsx
import { responsive, mediaQueries } from '@/design-system/utils'

// Check current breakpoint
if (responsive.matchesBreakpoint('lg')) {
  // Desktop view
}

// Responsive classes
const classes = responsive.getResponsiveClasses('text-sm', {
  md: 'text-base',
  lg: 'text-lg'
})
```

## ♿ Accessibility

### Built-in Accessibility Features

- **WCAG 2.1 AA Compliance**: All components meet accessibility standards
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: All color combinations tested for sufficient contrast
- **Touch Targets**: Minimum 44x44px touch targets (some components need updates)

### Best Practices

```tsx
// Proper labeling
<Input
  label="Email Address"
  required
  aria-describedby="email-help"
  helperText="We'll never share your email"
/>

// Loading states
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</Button>

// Focus management
<Card interactive onCardClick={handleClick}>
  <CardBody>Clickable card content</CardBody>
</Card>
```

## 🚀 Performance

### Bundle Size Optimization

```tsx
// Tree-shake unused components
import { Button } from '@/design-system/components/Button/Button'
// Instead of: import { Button } from '@/design-system'

// Dynamic imports for large components
const DataTable = lazy(() => 
  import('@/design-system/patterns/DataTable')
)
```

### CSS Custom Properties

The design system uses CSS custom properties for theming, which provides:
- Near-zero runtime cost
- Instant theme switching
- Better browser compatibility
- Easy customization

## 🔧 Customization

### Extending Components

```tsx
// Create custom button variant
import { Button, buttonVariants } from '@/design-system'
import { cva } from 'class-variance-authority'

const customButtonVariants = cva(
  buttonVariants.base,
  {
    variants: {
      ...buttonVariants.variants,
      variant: {
        ...buttonVariants.variants.variant,
        custom: 'bg-purple-500 text-white hover:bg-purple-600'
      }
    }
  }
)

function CustomButton(props) {
  return (
    <Button 
      className={customButtonVariants({ variant: 'custom' })}
      {...props} 
    />
  )
}
```

### Custom Tokens

```css
/* Add your custom tokens */
:root {
  --my-custom-color: oklch(0.5 0.2 180);
  --my-custom-spacing: 2.5rem;
}

.dark {
  --my-custom-color: oklch(0.7 0.2 180);
}
```

## 🧪 Testing

### Component Testing

```tsx
// Example with React Testing Library
import { render, screen } from '@testing-library/react'
import { Button } from '@/design-system'
import { ThemeProvider } from '@/design-system/theme/ThemeProvider'

test('button renders with correct text', () => {
  render(
    <ThemeProvider>
      <Button>Click me</Button>
    </ThemeProvider>
  )
  
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})
```

### Accessibility Testing

```tsx
// With @testing-library/jest-dom and axe
import { axe } from '@axe-core/react'

test('button has no accessibility violations', async () => {
  const { container } = render(
    <ThemeProvider>
      <Button>Accessible Button</Button>
    </ThemeProvider>
  )
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## 🔄 Migration Guide

### From Existing Components

#### Before (existing button)
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

#### After (design system button)
```tsx
import { Button } from '@/design-system'

<Button variant="primary">
  Click me
</Button>
```

### Step-by-step Migration

1. **Install Design System**: Import CSS variables and ThemeProvider
2. **Replace Simple Components**: Start with buttons, inputs, and text
3. **Update Layouts**: Replace custom layouts with design system layouts
4. **Add Theme Support**: Implement theme toggle and dark mode
5. **Enhance Accessibility**: Use design system accessibility features
6. **Optimize Performance**: Tree-shake unused components

## 📚 Component Reference

### Available Components

- **Button**: Primary, secondary, ghost, destructive, outline, link variants
- **Input**: Text, email, password, number inputs with validation
- **Textarea**: Multi-line text input
- **Card**: Flexible card with header, body, footer
- **Typography**: Heading1-6, Text, TextLarge, TextSmall, Code
- **Layout**: Container, Grid, Stack, Flex, Section
- **Spinner**: Loading indicators
- **ThemeToggle**: Theme switching controls

### Planned Components

- Alert/Toast notifications
- Modal dialogs
- Dropdown menus
- Navigation components
- Data tables
- Form components
- Progress indicators

## 🎨 Design Tokens Reference

### Colors
- **Text**: primary, secondary, tertiary, brand, inverse
- **Background**: primary, secondary, tertiary, inverse
- **Border**: primary, secondary, focus, error, success, warning
- **Interactive**: primary, secondary with hover/active states
- **Status**: success, warning, error, info

### Spacing
- **xs**: 4px, **sm**: 8px, **md**: 16px, **lg**: 24px
- **xl**: 32px, **2xl**: 48px, **3xl**: 64px, **4xl**: 96px

### Typography
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- **Font Weights**: thin, light, normal, medium, semibold, bold, black
- **Line Heights**: tight, snug, normal, relaxed, loose

## 🆘 Troubleshooting

### Common Issues

#### CSS Variables Not Working
```tsx
// Make sure CSS variables are imported
import '@/design-system/tokens/css-variables.css'

// Check ThemeProvider is wrapping your app
<ThemeProvider>
  <App />
</ThemeProvider>
```

#### TypeScript Errors
```tsx
// Use proper imports for types
import type { ButtonProps } from '@/design-system'
```

#### Dark Mode Not Working
```tsx
// Check theme is properly set
const { resolvedTheme } = useTheme()
console.log('Current theme:', resolvedTheme)

// Verify CSS classes are applied
document.documentElement.classList.contains('dark')
```

## 🔗 Resources

- **Design Tokens**: `/src/design-system/tokens/`
- **Components**: `/src/design-system/components/`
- **Templates**: `/src/design-system/templates/`
- **Utilities**: `/src/design-system/utils/`
- **QA Documentation**: `/src/design-system/qa/`

## 📈 Roadmap

### Version 1.1 (Next)
- [ ] Modal dialog component
- [ ] Dropdown menu component  
- [ ] Navigation components
- [ ] Toast notifications
- [ ] Form validation helpers

### Version 1.2 (Future)
- [ ] Data table component
- [ ] Advanced form components
- [ ] Animation utilities
- [ ] Additional layout patterns
- [ ] Storybook integration

---

**Need Help?** Check the troubleshooting section or reach out to the frontend team for assistance with design system implementation.