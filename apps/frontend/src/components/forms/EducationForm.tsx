"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { educationSchema, type EducationFormData } from "@/lib/validations/profile"
import { useEducation, type Education } from "@/hooks/useProfile"
import { Plus, Edit, Trash2, Calendar, GraduationCap, Loader2 } from "lucide-react"

interface EducationFormDialogProps {
  education?: Education
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EducationFormDialog({ 
  education, 
  isOpen, 
  onOpenChange, 
  onSuccess 
}: EducationFormDialogProps) {
  const { createEducation, updateEducation, loading } = useEducation()
  const isEditing = !!education

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    },
  })

  useEffect(() => {
    if (education) {
      form.reset({
        institution: education.institution,
        degree: education.degree,
        startDate: education.startDate || "",
        endDate: education.endDate || "",
      })
    } else {
      form.reset({
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
      })
    }
  }, [education, form])

  const onSubmit = async (data: EducationFormData) => {
    try {
      if (isEditing && education) {
        await updateEducation(education.id, data)
      } else {
        await createEducation(data)
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Escolaridade" : "Adicionar Escolaridade"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações da sua formação acadêmica"
              : "Adicione uma nova formação ao seu perfil educacional"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instituição *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Universidade de São Paulo" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso/Graduação *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Bacharelado em Ciência da Computação" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel>Data de conclusão</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Deixe em branco se ainda está cursando
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

interface EducationListProps {
  education: Education[]
  onEditEducation: (education: Education) => void
  onDeleteEducation: (id: string) => void
  loading?: boolean
}

function EducationList({ 
  education, 
  onEditEducation, 
  onDeleteEducation, 
  loading 
}: EducationListProps) {
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
    } else if (months > 0) {
      return `${months} m${months > 1 ? 'eses' : 'ês'}`
    }
    return ""
  }

  if (education.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Nenhuma formação cadastrada</p>
        <p className="text-sm">Adicione sua primeira formação acadêmica</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <Card key={edu.id} className="relative group hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {edu.degree}
                  </h3>
                  <Badge variant="secondary" className="shrink-0">
                    {edu.institution}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.startDate && (
                    <span>• {calculateDuration(edu.startDate, edu.endDate)}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditEducation(edu)}
                  disabled={loading}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteEducation(edu.id)}
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

export function EducationForm() {
  const { education, loading, loadEducation, deleteEducation } = useEducation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | undefined>()

  useEffect(() => {
    loadEducation()
  }, [loadEducation])

  const handleAddNew = () => {
    setEditingEducation(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (education: Education) => {
    setEditingEducation(education)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta formação?")) {
      await deleteEducation(id)
    }
  }

  const handleSuccess = () => {
    loadEducation() // Refresh the list
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Escolaridade
            </CardTitle>
            <CardDescription>
              Gerencie sua formação acadêmica
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} disabled={loading} className="bg-violet-700 text-white hover:bg-violet-800 dark:bg-violet-600 dark:hover:bg-violet-700">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && education.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <EducationList
            education={education}
            onEditEducation={handleEdit}
            onDeleteEducation={handleDelete}
            loading={loading}
          />
        )}
      </CardContent>

      <EducationFormDialog
        education={editingEducation}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </Card>
  )
}