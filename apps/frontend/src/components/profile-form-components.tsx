"use client"

import { useState } from "react"
import { Plus, X, Calendar, MapPin, Building, GraduationCap, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Experience Form Component
interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements: string[]
}

interface ExperienceFormProps {
  experiences: Experience[]
  onAddExperience: (experience: Experience) => void
  onEditExperience: (id: string, experience: Experience) => void
  onDeleteExperience: (id: string) => void
}

export function ExperienceForm({ 
  experiences, 
  onAddExperience, 
  onEditExperience, 
  onDeleteExperience 
}: ExperienceFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.company || !formData.position) return

    const experienceData = {
      id: editingId || crypto.randomUUID(),
      company: formData.company,
      position: formData.position,
      location: formData.location || '',
      startDate: formData.startDate || '',
      endDate: formData.current ? undefined : formData.endDate,
      current: formData.current || false,
      description: formData.description || '',
      achievements: formData.achievements || []
    } as Experience

    if (editingId) {
      onEditExperience(editingId, experienceData)
    } else {
      onAddExperience(experienceData)
    }

    resetForm()
    setIsOpen(false)
  }

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    })
    setEditingId(null)
  }

  const openEditDialog = (experience: Experience) => {
    setFormData(experience)
    setEditingId(experience.id)
    setIsOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-violet-600" />
            <CardTitle>Experiência Profissional</CardTitle>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Experiência
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Experiência' : 'Nova Experiência Profissional'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Empresa *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Ex: Google Brasil"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Cargo *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Ex: Desenvolvedor Full Stack"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: São Paulo, SP - Remoto"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data de Término</Label>
                    <Input
                      id="endDate"
                      type="month"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.current}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="current"
                        checked={formData.current}
                        onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="current" className="text-sm">Trabalho aqui atualmente</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição das Atividades</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva suas principais responsabilidades e projetos..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingId ? 'Salvar Alterações' : 'Adicionar Experiência'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma experiência adicionada ainda.</p>
              <p className="text-sm">Clique em "Adicionar Experiência" para começar.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{exp.position}</h4>
                    <p className="text-violet-600 font-medium">{exp.company}</p>
                    {exp.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(exp)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteExperience(exp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {exp.startDate && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {exp.startDate} - {exp.current ? 'Presente' : exp.endDate || 'Presente'}
                  </div>
                )}

                {exp.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Education Form Component
interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  description?: string
}

interface EducationFormProps {
  educations: Education[]
  onAddEducation: (education: Education) => void
  onEditEducation: (id: string, education: Education) => void
  onDeleteEducation: (id: string) => void
}

export function EducationForm({ 
  educations, 
  onAddEducation, 
  onEditEducation, 
  onDeleteEducation 
}: EducationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.institution || !formData.degree) return

    const educationData = {
      id: editingId || crypto.randomUUID(),
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy || '',
      startDate: formData.startDate || '',
      endDate: formData.current ? undefined : formData.endDate,
      current: formData.current || false,
      gpa: formData.gpa,
      description: formData.description
    } as Education

    if (editingId) {
      onEditEducation(editingId, educationData)
    } else {
      onAddEducation(educationData)
    }

    resetForm()
    setIsOpen(false)
  }

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: ''
    })
    setEditingId(null)
  }

  const openEditDialog = (education: Education) => {
    setFormData(education)
    setEditingId(education.id)
    setIsOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-violet-600" />
            <CardTitle>Formação Acadêmica</CardTitle>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Formação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Formação' : 'Nova Formação Acadêmica'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="institution">Instituição *</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Ex: Universidade de São Paulo"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree">Grau *</Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="Ex: Bacharelado"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldOfStudy">Área de Estudo</Label>
                    <Input
                      id="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                      placeholder="Ex: Ciência da Computação"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data de Conclusão</Label>
                    <Input
                      id="endDate"
                      type="month"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.current}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="current"
                        checked={formData.current}
                        onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="current" className="text-sm">Cursando atualmente</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="gpa">CRA/Nota (opcional)</Label>
                  <Input
                    id="gpa"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="Ex: 8.5"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingId ? 'Salvar Alterações' : 'Adicionar Formação'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {educations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma formação adicionada ainda.</p>
              <p className="text-sm">Clique em "Adicionar Formação" para começar.</p>
            </div>
          ) : (
            educations.map((edu) => (
              <div
                key={edu.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">
                      {edu.degree} {edu.fieldOfStudy && `em ${edu.fieldOfStudy}`}
                    </h4>
                    <p className="text-violet-600 font-medium">{edu.institution}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(edu)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEducation(edu.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {edu.startDate && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {edu.startDate} - {edu.current ? 'Presente' : edu.endDate || 'Presente'}
                  </div>
                )}

                {edu.gpa && (
                  <p className="text-sm text-muted-foreground">
                    <strong>CRA:</strong> {edu.gpa}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}