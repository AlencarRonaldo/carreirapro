"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { experienceSchema, type ExperienceFormData } from "@/lib/validations/profile"
import { useExperiences, type Experience } from "@/hooks/useProfile"
import { Plus, Edit, Trash2, Calendar, Building2, Loader2 } from "lucide-react"

interface ExperienceFormDialogProps {
  experience?: Experience
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function ExperienceFormDialog({ 
  experience, 
  isOpen, 
  onOpenChange, 
  onSuccess 
}: ExperienceFormDialogProps) {
  const { createExperience, updateExperience, loading } = useExperiences()
  const isEditing = !!experience

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  })

  useEffect(() => {
    if (experience) {
      form.reset({
        title: experience.title,
        company: experience.company,
        startDate: experience.startDate || "",
        endDate: experience.endDate || "",
        description: experience.description || "",
      })
    } else {
      form.reset({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      })
    }
  }, [experience, form])

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      if (isEditing && experience) {
        await updateExperience(experience.id, data)
      } else {
        await createExperience(data)
      }
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Experiência" : "Adicionar Experiência"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações da sua experiência profissional"
              : "Adicione uma nova experiência à sua trajetória profissional"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Desenvolvedor Full Stack" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Tech Company Inc." 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de início</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de fim</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Deixe em branco se ainda trabalha aqui
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva suas responsabilidades, conquistas e tecnologias utilizadas..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional: Destaque suas principais responsabilidades e conquistas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Atualizando..." : "Adicionando..."}
                  </>
                ) : (
                  isEditing ? "Atualizar" : "Adicionar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

interface ExperienceListProps {
  experiences: Experience[]
  onEditExperience: (experience: Experience) => void
  onDeleteExperience: (id: string) => void
  loading?: boolean
}

function ExperienceList({ 
  experiences, 
  onEditExperience, 
  onDeleteExperience, 
  loading 
}: ExperienceListProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Atual"
    
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("pt-BR", {
        month: "short",
        year: "numeric"
      }).format(date)
    } catch {
      return dateString
    }
  }

  const calculateDuration = (startDate?: string | null, endDate?: string | null) => {
    if (!startDate) return ""

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    
    const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0 && remainingMonths > 0) {
      return `${years} ano${years > 1 ? 's' : ''} e ${remainingMonths} m${remainingMonths > 1 ? 'eses' : 'ês'}`
    } else if (years > 0) {
      return `${years} ano${years > 1 ? 's' : ''}`
    } else {
      return `${months} m${months > 1 ? 'eses' : 'ês'}`
    }
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Nenhuma experiência cadastrada</p>
        <p className="text-sm">Adicione sua primeira experiência profissional</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <Card key={experience.id} className="relative group hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {experience.title}
                  </h3>
                  <Badge variant="secondary" className="shrink-0">
                    {experience.company}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </span>
                  </div>
                  {experience.startDate && (
                    <span>• {calculateDuration(experience.startDate, experience.endDate)}</span>
                  )}
                </div>

                {experience.description && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {experience.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditExperience(experience)}
                  disabled={loading}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExperience(experience.id)}
                  disabled={loading}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ExperienceForm() {
  const { experiences, loading, loadExperiences, deleteExperience } = useExperiences()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>()

  useEffect(() => {
    loadExperiences()
  }, [loadExperiences])

  const handleAddNew = () => {
    setEditingExperience(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta experiência?")) {
      await deleteExperience(id)
    }
  }

  const handleSuccess = () => {
    loadExperiences() // Refresh the list
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Experiência Profissional
            </CardTitle>
            <CardDescription>
              Gerencie sua trajetória profissional
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} disabled={loading} className="bg-violet-700 text-white hover:bg-violet-800 dark:bg-violet-600 dark:hover:bg-violet-700">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && experiences.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ExperienceList
            experiences={experiences}
            onEditExperience={handleEdit}
            onDeleteExperience={handleDelete}
            loading={loading}
          />
        )}
      </CardContent>

      <ExperienceFormDialog
        experience={editingExperience}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </Card>
  )
}