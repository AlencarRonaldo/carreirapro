import * as React from "react"
import { 
  FileText, 
  Search, 
  Inbox, 
  Users, 
  Settings, 
  Plus, 
  Wifi,
  AlertCircle,
  Database,
  Mail,
  Calendar,
  Bookmark,
  Image,
  LucideIcon
} from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
    loading?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "card" | "inline"
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
  variant = "default"
}) => {
  const sizeConfig = {
    sm: {
      iconSize: "w-12 h-12",
      iconPadding: "p-2",
      titleSize: "text-lg",
      descriptionSize: "text-sm",
      spacing: "space-y-3",
      containerPadding: "p-6"
    },
    md: {
      iconSize: "w-16 h-16", 
      iconPadding: "p-3",
      titleSize: "text-xl",
      descriptionSize: "text-sm",
      spacing: "space-y-4",
      containerPadding: "p-8"
    },
    lg: {
      iconSize: "w-20 h-20",
      iconPadding: "p-4", 
      titleSize: "text-2xl",
      descriptionSize: "text-base",
      spacing: "space-y-6",
      containerPadding: "p-12"
    }
  }

  const config = sizeConfig[size]

  const content = (
    <div className={cn(
      "text-center",
      config.spacing,
      variant === "card" ? config.containerPadding : "py-8",
      className
    )}>
      {Icon && (
        <div className="flex justify-center">
          <div className={cn(
            "bg-muted rounded-full",
            config.iconPadding
          )}>
            <Icon className={cn(
              "text-muted-foreground",
              config.iconSize
            )} />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className={cn(
          "font-semibold text-foreground",
          config.titleSize
        )}>
          {title}
        </h3>
        
        {description && (
          <p className={cn(
            "text-muted-foreground max-w-sm mx-auto leading-relaxed",
            config.descriptionSize
          )}>
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              loading={action.loading}
              className="w-full sm:w-auto"
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
              className="w-full sm:w-auto"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )

  if (variant === "card") {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  if (variant === "inline") {
    return (
      <div className={cn("text-center py-6", className)}>
        {content}
      </div>
    )
  }

  return content
}

// Predefined empty states for common scenarios
export const NoDocuments: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={FileText}
    title="Nenhum documento encontrado"
    description="Comece criando seu primeiro documento ou importe um existente."
    {...props}
  />
)

export const NoSearchResults: React.FC<Omit<EmptyStateProps, "icon" | "title"> & { query?: string }> = ({ 
  query, 
  ...props 
}) => (
  <EmptyState
    icon={Search}
    title="Nenhum resultado encontrado"
    description={query 
      ? `Não encontramos resultados para "${query}". Tente usar termos diferentes.`
      : "Não encontramos resultados para sua busca. Tente usar termos diferentes."
    }
    {...props}
  />
)

export const NoNotifications: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Inbox}
    title="Nenhuma notificação"
    description="Quando houver atualizações, você verá as notificações aqui."
    size="sm"
    variant="inline"
    {...props}
  />
)

export const NoUsers: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Users}
    title="Nenhum usuário encontrado"
    description="Convide pessoas para colaborar em seus projetos."
    {...props}
  />
)

export const NoConnection: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Wifi}
    title="Sem conexão"
    description="Verifique sua conexão com a internet e tente novamente."
    {...props}
  />
)

export const ServerError: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={AlertCircle}
    title="Erro no servidor"
    description="Algo deu errado em nossos servidores. Tente novamente em alguns minutos."
    {...props}
  />
)

export const NoData: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Database}
    title="Nenhum dado disponível"
    description="Não há dados para exibir no momento."
    {...props}
  />
)

export const NoMessages: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Mail}
    title="Nenhuma mensagem"
    description="Quando você receber mensagens, elas aparecerão aqui."
    {...props}
  />
)

export const NoEvents: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Calendar}
    title="Nenhum evento agendado"
    description="Seus próximos eventos aparecerão aqui."
    {...props}
  />
)

export const NoBookmarks: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Bookmark}
    title="Nenhum item salvo"
    description="Salve itens importantes para acessá-los rapidamente aqui."
    {...props}
  />
)

export const NoImages: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Image}
    title="Nenhuma imagem"
    description="Faça upload de imagens para começar."
    {...props}
  />
)

export const UnderConstruction: React.FC<Omit<EmptyStateProps, "icon" | "title">> = (props) => (
  <EmptyState
    icon={Settings}
    title="Em construção"
    description="Esta funcionalidade está sendo desenvolvida. Volte em breve!"
    {...props}
  />
)

// Higher-order component for conditional empty states
interface WithEmptyStateProps {
  isEmpty: boolean
  loading?: boolean
  error?: boolean
  emptyStateProps?: EmptyStateProps
  errorStateProps?: EmptyStateProps
  loadingComponent?: React.ReactNode
  children: React.ReactNode
}

export const WithEmptyState: React.FC<WithEmptyStateProps> = ({
  isEmpty,
  loading = false,
  error = false,
  emptyStateProps,
  errorStateProps,
  loadingComponent,
  children
}) => {
  if (loading && loadingComponent) {
    return <>{loadingComponent}</>
  }

  if (error && errorStateProps) {
    return <EmptyState {...errorStateProps} />
  }

  if (isEmpty && emptyStateProps) {
    return <EmptyState {...emptyStateProps} />
  }

  return <>{children}</>
}

export { EmptyState }