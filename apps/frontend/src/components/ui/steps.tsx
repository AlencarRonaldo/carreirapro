"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  steps: ReadonlyArray<{
    id: number
    title: string
    description?: string
  }>
  currentStep: number
  completedSteps: number[]
  className?: string
}

export function Stepper({ steps, currentStep, completedSteps, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="md:flex-1">
              {completedSteps.includes(step.id) ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-primary transition-colors">
                    {step.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{step.description}</span>
                </div>
              ) : currentStep === step.id ? (
                <div
                  className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-primary">{step.title}</span>
                  <span className="text-sm text-muted-foreground">{step.description}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-muted py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-muted-foreground transition-colors">
                    {step.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{step.description}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

interface StepperIndicatorProps {
  steps: number
  currentStep: number
  completedSteps: number[]
  className?: string
}

export function StepperIndicator({ steps, currentStep, completedSteps, className }: StepperIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {Array.from({ length: steps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = completedSteps.includes(stepNum)
        const isCurrent = currentStep === stepNum
        const isActive = isCurrent || isCompleted
        
        return (
          <React.Fragment key={stepNum}>
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                isCompleted && "border-primary bg-primary text-primary-foreground",
                isCurrent && !isCompleted && "border-primary bg-background text-primary",
                !isActive && "border-muted bg-background text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{stepNum}</span>
              )}
            </div>
            {stepNum < steps && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  completedSteps.includes(stepNum) ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}