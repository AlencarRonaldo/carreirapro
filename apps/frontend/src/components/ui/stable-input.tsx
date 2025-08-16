"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface StableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * 🔧 STABLE INPUT: Componente de input isolado que nunca re-renderiza
 * Usa useRef e eventos nativos para evitar problemas de foco
 */
const StableInput = React.forwardRef<HTMLInputElement, StableInputProps>(
  ({ className, type, defaultValue, onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    
    // Usa useImperativeHandle para expor o ref
    React.useImperativeHandle(ref, () => inputRef.current!, [])
    
    // Handler isolado que NÃO causa re-renderização
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      // Chama onChange apenas se existir
      if (onChange) {
        onChange(e)
      }
    }, [onChange])
    
    return (
      <input
        ref={inputRef}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
StableInput.displayName = "StableInput"

export { StableInput }