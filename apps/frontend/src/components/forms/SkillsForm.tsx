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
import { Progress } from "@/components/ui/progress"
import { skillSchema, type SkillFormData } from "@/lib/validations/profile"
import { useSkills, type Skill } from "@/hooks/useProfile"
import { Plus, Edit, Trash2, Star, Zap, Loader2, X } from "lucide-react"


interface SkillFormDialogProps {
  skill?: Skill
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function SkillFormDialog({ 
  skill, 
  isOpen, 
  onOpenChange, 
  onSuccess 
}: SkillFormDialogProps) {
  const { createSkill, updateSkill, loading } = useSkills()
  const isEditing = !!skill

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      level: 1,
    },
  })

  useEffect(() => {
    if (skill) {
      form.reset({
        name: skill.name,
        level: skill.level,
      })
    } else {
      form.reset({
        name: "",
        level: 1,
      })
    }
  }, [skill, form])

  const onSubmit = async (data: SkillFormData) => {
    try {
      if (isEditing && skill) {
        await updateSkill(skill.id, data)
      } else {
        await createSkill(data)
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

  const levelLabels = {
    1: "Básico",
    2: "Intermediário",
    3: "Avançado",
    4: "Expert",
    5: "Master",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Skill" : "Adicionar Skill"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize o nome e nível da sua skill"
              : "Adicione uma nova skill ao seu perfil"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Skill *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: JavaScript, React, Python..." 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Proficiência *</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                      {Object.entries(levelLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label} (Nível {value})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Escolha o nível que melhor representa seu conhecimento
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

interface SkillCardProps {
  skill: Skill
  onEdit: () => void
  onDelete: () => void
  loading?: boolean
}

function SkillCard({ skill, onEdit, onDelete, loading }: SkillCardProps) {
  const levelColors = {
    1: "bg-gray-200 text-gray-800",
    2: "bg-blue-200 text-blue-800",
    3: "bg-yellow-200 text-yellow-800",
    4: "bg-orange-200 text-orange-800",
    5: "bg-red-200 text-red-800",
  }

  const levelLabels = {
    1: "Básico",
    2: "Intermediário", 
    3: "Avançado",
    4: "Expert",
    5: "Master",
  }

  const progressValue = (skill.level / 5) * 100

  return (
    <Card className="group hover:shadow-md transition-all duration-200 relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate mb-2">
              {skill.name}
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {levelLabels[skill.level as keyof typeof levelLabels]}
                </span>
                <span className="text-muted-foreground">
                  {skill.level}/5
                </span>
              </div>
              
              <Progress 
                value={progressValue} 
                className="h-2"
                style={{
                  backgroundColor: skill.level >= 4 ? '#ef444420' : 
                                   skill.level >= 3 ? '#f9731620' : 
                                   skill.level >= 2 ? '#3b82f620' : '#6b728020'
                }}
              />
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              disabled={loading}
              className="h-7 w-7 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={loading}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SkillsGridProps {
  skills: Skill[]
  onEditSkill: (skill: Skill) => void
  onDeleteSkill: (id: string) => void
  loading?: boolean
}

function SkillsGrid({ skills, onEditSkill, onDeleteSkill, loading }: SkillsGridProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Zap className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">Nenhuma skill cadastrada</p>
        <p className="text-sm">Adicione suas primeiras habilidades técnicas</p>
      </div>
    )
  }

  // Sort skills by level (descending) then by name
  const sortedSkills = [...skills].sort((a, b) => {
    if (a.level !== b.level) {
      return b.level - a.level
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedSkills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onEdit={() => onEditSkill(skill)}
          onDelete={() => onDeleteSkill(skill.id)}
          loading={loading}
        />
      ))}
    </div>
  )
}

interface SkillsStatsProps {
  skills: Skill[]
}

function SkillsStats({ skills }: SkillsStatsProps) {
  const totalSkills = skills.length
  const averageLevel = totalSkills > 0 
    ? (skills.reduce((sum, skill) => sum + skill.level, 0) / totalSkills).toFixed(1)
    : "0"
    
  const levelCounts = skills.reduce((acc, skill) => {
    acc[skill.level] = (acc[skill.level] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const expertSkills = (levelCounts[4] || 0) + (levelCounts[5] || 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalSkills}</div>
          <div className="text-sm text-muted-foreground">Total de Skills</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{averageLevel}</div>
          <div className="text-sm text-muted-foreground">Nível Médio</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{expertSkills}</div>
          <div className="text-sm text-muted-foreground">Expert/Master</div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SkillsForm() {
  const { skills, loading, loadSkills, deleteSkill } = useSkills()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>()

  useEffect(() => {
    loadSkills()
  }, [loadSkills])

  const handleAddNew = () => {
    setEditingSkill(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta skill?")) {
      await deleteSkill(id)
    }
  }

  const handleSuccess = () => {
    loadSkills() // Refresh the list
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Skills & Competências
            </CardTitle>
            <CardDescription>
              Gerencie suas habilidades técnicas e níveis de proficiência
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Skill
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && skills.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {skills.length > 0 && <SkillsStats skills={skills} />}
            <SkillsGrid
              skills={skills}
              onEditSkill={handleEdit}
              onDeleteSkill={handleDelete}
              loading={loading}
            />
          </>
        )}
      </CardContent>

      <SkillFormDialog
        skill={editingSkill}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </Card>
  )
}