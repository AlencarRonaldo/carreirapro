import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "pulse" | "wave" | "none"
  variant?: "text" | "rectangular" | "circular"
  width?: string | number
  height?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animation = "pulse", variant = "text", width, height, style, ...props }, ref) => {
    const animationClass = {
      pulse: "animate-pulse",
      wave: "animate-shimmer bg-gradient-to-r from-slate-200 via-slate-50 to-slate-200 bg-[length:400%_100%]",
      none: ""
    }[animation]

    const variantClass = {
      text: "h-4 rounded",
      rectangular: "rounded-md", 
      circular: "rounded-full aspect-square"
    }[variant]

    const baseClass = animation === "wave" 
      ? "bg-gradient-to-r from-slate-200 via-slate-50 to-slate-200 bg-[length:400%_100%]"
      : "bg-slate-200 dark:bg-slate-700"

    return (
      <div
        ref={ref}
        className={cn(
          baseClass,
          variantClass,
          animationClass,
          className
        )}
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style 
        }}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Specialized Skeleton Components for Common Patterns

const TextSkeleton = React.forwardRef<HTMLDivElement, { lines?: number; className?: string }>(
  ({ lines = 3, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          className={i === lines - 1 ? "w-3/4" : "w-full"} 
        />
      ))}
    </div>
  )
)
TextSkeleton.displayName = "TextSkeleton"

const AvatarSkeleton = React.forwardRef<HTMLDivElement, { size?: "sm" | "md" | "lg"; className?: string }>(
  ({ size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12", 
      lg: "w-16 h-16"
    }
    
    return (
      <Skeleton 
        ref={ref}
        variant="circular" 
        className={cn(sizeClasses[size], className)} 
        {...props}
      />
    )
  }
)
AvatarSkeleton.displayName = "AvatarSkeleton"

const CardSkeleton = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 border rounded-lg space-y-4", className)} {...props}>
      <div className="flex items-center space-x-4">
        <AvatarSkeleton size="md" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
      </div>
      <TextSkeleton lines={3} />
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" className="w-20 h-8" />
        <Skeleton variant="rectangular" className="w-16 h-8" />
      </div>
    </div>
  )
)
CardSkeleton.displayName = "CardSkeleton"

const TableSkeleton = React.forwardRef<HTMLDivElement, { 
  rows?: number; 
  columns?: number;
  className?: string 
}>(({ rows = 5, columns = 4, className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)} {...props}>
    {/* Header */}
    <div className="flex space-x-4 pb-3 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`header-${i}`} variant="text" className="flex-1 h-4" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex space-x-4 items-center py-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1">
            {colIndex === 0 ? (
              <div className="flex items-center space-x-2">
                <AvatarSkeleton size="sm" />
                <Skeleton variant="text" className="w-3/4" />
              </div>
            ) : (
              <Skeleton variant="text" className="w-full" />
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
))
TableSkeleton.displayName = "TableSkeleton"

const FormSkeleton = React.forwardRef<HTMLDivElement, { 
  fields?: number;
  className?: string 
}>(({ fields = 4, className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-6", className)} {...props}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={`field-${i}`} className="space-y-2">
        <Skeleton variant="text" className="w-1/4 h-4" />
        <Skeleton variant="rectangular" className="w-full h-10" />
      </div>
    ))}
    <div className="flex space-x-4 pt-4">
      <Skeleton variant="rectangular" className="w-24 h-10" />
      <Skeleton variant="rectangular" className="w-20 h-10" />
    </div>
  </div>
))
FormSkeleton.displayName = "FormSkeleton"

const ListSkeleton = React.forwardRef<HTMLDivElement, { 
  items?: number;
  showAvatar?: boolean;
  className?: string 
}>(({ items = 6, showAvatar = true, className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={`item-${i}`} className="flex items-center space-x-4">
        {showAvatar && <AvatarSkeleton size="md" />}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
        <Skeleton variant="rectangular" className="w-16 h-8" />
      </div>
    ))}
  </div>
))
ListSkeleton.displayName = "ListSkeleton"

export {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  TableSkeleton,
  FormSkeleton,
  ListSkeleton
}