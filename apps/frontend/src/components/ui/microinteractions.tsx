import * as React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

// Animated Container with hover and tap effects
interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "none"
  hoverScale?: number
  tapScale?: number
  staggerChildren?: number
  delay?: number
  duration?: number
  children: React.ReactNode
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const animationVariants: { [key: string]: Variants } = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "backOut" }
    }
  }
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  animation = "fadeIn",
  hoverScale = 1.02,
  tapScale = 0.98,
  staggerChildren,
  delay = 0,
  duration,
  className,
  children,
  ...props
}) => {
  const variants = animation !== "none" ? animationVariants[animation] : {}
  
  const motionProps = {
    initial: "hidden",
    animate: "visible",
    variants: staggerChildren ? containerVariants : variants,
    transition: {
      delay,
      ...(duration && { duration }),
      ...(staggerChildren && { staggerChildren })
    },
    whileHover: hoverScale !== 1 ? { scale: hoverScale } : undefined,
    whileTap: tapScale !== 1 ? { scale: tapScale } : undefined
  }

  return (
    <motion.div 
      className={className}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Interactive Card with hover effects
interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover-lift" | "hover-glow" | "hover-border"
  clickable?: boolean
  children: React.ReactNode
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  variant = "default",
  clickable = false,
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    "default": "transition-all duration-200 ease-in-out",
    "hover-lift": "transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:shadow-black/5 dark:hover:shadow-white/5",
    "hover-glow": "transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/20 hover:ring-1 hover:ring-primary/10",
    "hover-border": "transition-all duration-200 ease-in-out border-2 border-transparent hover:border-primary/20"
  }

  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        variantClasses[variant],
        clickable && "cursor-pointer select-none",
        className
      )}
      whileHover={clickable ? { scale: 1.01 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Animated Button with ripple effect
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  showRipple?: boolean
  children: React.ReactNode
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  variant = "default",
  size = "md",
  showRipple = true,
  className,
  children,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; key: number }>>([])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (showRipple) {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setRipples(prev => [...prev, { x, y, key: Date.now() }])

      setTimeout(() => {
        setRipples(prev => prev.slice(1))
      }, 600)
    }

    onClick?.(event)
  }

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-base"
  }

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {showRipple && (
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.span
              key={ripple.key}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
              }}
              initial={{ width: 20, height: 20, opacity: 0.8 }}
              animate={{ 
                width: 300, 
                height: 300, 
                opacity: 0,
                x: -140,
                y: -140
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.button>
  )
}

// Floating Action Button with magnetic effect
interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  tooltip?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  magnetic?: boolean
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  tooltip,
  position = "bottom-right",
  magnetic = true,
  className,
  ...props
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic) return
    
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    setMousePosition({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const positionClasses = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6"
  }

  return (
    <motion.button
      className={cn(
        "w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center z-50",
        positionClasses[position],
        className
      )}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {icon}
      
      {tooltip && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {tooltip}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.button>
  )
}

// Page Transition Wrapper
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Staggered List Animation
interface StaggeredListProps {
  children: React.ReactElement[]
  staggerDelay?: number
  className?: string
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 0.1,
  className
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Loading Dots Animation
export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex space-x-1 items-center", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  )
}

// Success Checkmark Animation
export const AnimatedCheckmark: React.FC<{ 
  size?: number
  className?: string 
}> = ({ 
  size = 24, 
  className 
}) => {
  return (
    <motion.svg
      className={cn("text-green-500", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.1
      }}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="11"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      <motion.path
        d="M8 12l3 3 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    </motion.svg>
  )
}