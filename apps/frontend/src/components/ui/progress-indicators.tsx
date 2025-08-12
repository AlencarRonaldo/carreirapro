import * as React from "react"
import { Check, X, Clock, Upload, Download, AlertCircle, Pause, Play } from "lucide-react"
import { Progress } from "./progress"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { cn } from "@/lib/utils"

// Step Progress Indicator
export interface Step {
  id: string
  title: string
  description?: string
  status: "pending" | "current" | "completed" | "error"
}

interface StepProgressProps {
  steps: Step[]
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
  className?: string
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  orientation = "horizontal",
  size = "md",
  className
}) => {
  const sizeConfig = {
    sm: {
      iconSize: "w-6 h-6",
      titleSize: "text-sm",
      descSize: "text-xs",
      spacing: orientation === "horizontal" ? "space-x-4" : "space-y-3"
    },
    md: {
      iconSize: "w-8 h-8",
      titleSize: "text-sm",
      descSize: "text-xs",
      spacing: orientation === "horizontal" ? "space-x-6" : "space-y-4"
    },
    lg: {
      iconSize: "w-10 h-10",
      titleSize: "text-base",
      descSize: "text-sm",
      spacing: orientation === "horizontal" ? "space-x-8" : "space-y-6"
    }
  }

  const config = sizeConfig[size]

  const getStepIcon = (step: Step, index: number) => {
    switch (step.status) {
      case "completed":
        return <Check className="w-4 h-4 text-white" />
      case "error":
        return <X className="w-4 h-4 text-white" />
      case "current":
        return <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      default:
        return <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
    }
  }

  const getStepColor = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 border-green-500"
      case "error":
        return "bg-red-500 border-red-500"
      case "current":
        return "bg-blue-500 border-blue-500"
      default:
        return "bg-muted border-border"
    }
  }

  const containerClass = cn(
    "flex",
    orientation === "horizontal" ? "items-center" : "flex-col items-start",
    config.spacing,
    className
  )

  const stepClass = cn(
    "flex items-center",
    orientation === "horizontal" ? "flex-col text-center" : "flex-row text-left space-x-3"
  )

  return (
    <div className={containerClass}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={stepClass}>
            <div className={cn(
              "rounded-full border-2 flex items-center justify-center transition-colors",
              config.iconSize,
              getStepColor(step.status)
            )}>
              {getStepIcon(step, index)}
            </div>
            
            <div className={orientation === "horizontal" ? "mt-2" : ""}>
              <div className={cn(
                "font-medium",
                config.titleSize,
                step.status === "current" ? "text-foreground" : 
                step.status === "completed" ? "text-green-700 dark:text-green-400" :
                step.status === "error" ? "text-red-700 dark:text-red-400" :
                "text-muted-foreground"
              )}>
                {step.title}
              </div>
              
              {step.description && (
                <div className={cn(
                  "text-muted-foreground",
                  config.descSize,
                  orientation === "horizontal" ? "mt-1" : "mt-0.5"
                )}>
                  {step.description}
                </div>
              )}
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div className={cn(
              "transition-colors",
              orientation === "horizontal" 
                ? "h-px flex-1 bg-border" 
                : `w-px h-8 bg-border ml-4`,
              steps[index + 1]?.status === "completed" ? "bg-green-500" : ""
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// File Upload Progress
interface FileUploadProgressProps {
  files: Array<{
    id: string
    name: string
    size: number
    progress: number
    status: "uploading" | "completed" | "error" | "paused"
    error?: string
  }>
  onCancel?: (fileId: string) => void
  onRetry?: (fileId: string) => void
  onPause?: (fileId: string) => void
  onResume?: (fileId: string) => void
  className?: string
}

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  files,
  onCancel,
  onRetry,
  onPause,
  onResume,
  className
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "paused":
        return <Pause className="w-4 h-4 text-orange-500" />
      default:
        return <Upload className="w-4 h-4 text-blue-500" />
    }
  }

  if (files.length === 0) return null

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  {getStatusIcon(file.status)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                      {file.status === "uploading" && ` • ${Math.round(file.progress)}%`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === "uploading" && (
                    <>
                      {onPause && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPause(file.id)}
                        >
                          <Pause className="w-3 h-3" />
                        </Button>
                      )}
                      {onCancel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancel(file.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </>
                  )}
                  
                  {file.status === "paused" && onResume && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResume(file.id)}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  )}
                  
                  {file.status === "error" && onRetry && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRetry(file.id)}
                    >
                      Tentar novamente
                    </Button>
                  )}
                </div>
              </div>

              {file.status === "uploading" && (
                <Progress 
                  value={file.progress} 
                  className="h-2"
                />
              )}

              {file.status === "error" && file.error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {file.error}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Circular Progress with Label
interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  label?: string
  color?: "blue" | "green" | "orange" | "red"
  className?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  label,
  color = "blue",
  className
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const colorMap = {
    blue: "text-blue-600 stroke-blue-600",
    green: "text-green-600 stroke-green-600", 
    orange: "text-orange-600 stroke-orange-600",
    red: "text-red-600 stroke-red-600"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-300 ease-in-out", colorMap[color])}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className={cn("text-2xl font-bold", colorMap[color])}>
            {Math.round(value)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-muted-foreground mt-1 text-center">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// Process Timeline
export interface TimelineEvent {
  id: string
  timestamp: Date
  title: string
  description?: string
  status: "completed" | "current" | "pending" | "error"
  duration?: number
}

interface ProcessTimelineProps {
  events: TimelineEvent[]
  showTime?: boolean
  className?: string
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  events,
  showTime = true,
  className
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return ""
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="flex">
          <div className="flex flex-col items-center mr-4">
            <div className={cn(
              "w-3 h-3 rounded-full border-2",
              event.status === "completed" ? "bg-green-500 border-green-500" :
              event.status === "current" ? "bg-blue-500 border-blue-500 animate-pulse" :
              event.status === "error" ? "bg-red-500 border-red-500" :
              "bg-muted border-border"
            )} />
            
            {index < events.length - 1 && (
              <div className="w-px h-8 bg-border mt-2" />
            )}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <h4 className={cn(
                "font-medium text-sm",
                event.status === "error" ? "text-red-700 dark:text-red-400" :
                event.status === "current" ? "text-blue-700 dark:text-blue-400" :
                "text-foreground"
              )}>
                {event.title}
              </h4>
              
              {showTime && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {event.duration && (
                    <span>({formatDuration(event.duration)})</span>
                  )}
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(event.timestamp)}</span>
                </div>
              )}
            </div>
            
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}