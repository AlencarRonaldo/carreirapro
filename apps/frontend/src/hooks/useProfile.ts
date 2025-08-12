"use client"

import { useState, useCallback } from "react"
import { API_BASE, fetchWithAuth } from "@/lib/api"
import { 
  type ProfileFormData, 
  type ExperienceFormData, 
  type EducationFormData, 
  type SkillFormData,
  type LinkedInImportData,
  transformProfileForAPI 
} from "@/lib/validations/profile"
import { toast } from "sonner"

// Types from backend
export type Experience = {
  id: string
  title: string
  company: string
  startDate?: string | null
  endDate?: string | null
  description?: string | null
}

export type Education = {
  id: string
  institution: string
  degree: string
  startDate?: string | null
  endDate?: string | null
}

export type Skill = {
  id: string
  name: string
  level: number
}

export type Profile = {
  id: string
  fullName: string
  headline: string
  locationCity: string
  locationState: string
  locationCountry: string
  linkedin: string
  github: string
  website: string
  email: string
  phone: string
  experiences?: Experience[]
  education?: Education[]
  skills?: Skill[]
}

export function useProfile() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile`, { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setProfile(data)
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Falha ao carregar perfil: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: ProfileFormData) => {
    try {
      setLoading(true)
      const payload = transformProfileForAPI(data)
      const res = await fetchWithAuth(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setProfile(updated)
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('profile-updated', { detail: { profile: updated } })) } catch {}
      toast.success("Perfil atualizado com sucesso")
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar perfil: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const importFromLinkedIn = useCallback(async (data: LinkedInImportData) => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/import/linkedin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setProfile(updated)
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('profile-updated', { detail: { profile: updated } })) } catch {}
      toast.success("Perfil importado do LinkedIn com sucesso")
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao importar do LinkedIn: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    profile,
    loading,
    loadProfile,
    updateProfile,
    importFromLinkedIn,
  }
}

export function useExperiences() {
  const [loading, setLoading] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/experiences`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setExperiences(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Falha ao carregar experiências: ${message}`)
      setExperiences([])
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createExperience = useCallback(async (data: ExperienceFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        description: data.description || undefined,
      }
      const res = await fetchWithAuth(`${API_BASE}/profile/experiences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const created = await res.json()
      setExperiences(prev => [created, ...prev])
      toast.success("Experiência adicionada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('experiences-updated')) } catch {}
      return created
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao adicionar experiência: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateExperience = useCallback(async (id: string, data: ExperienceFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        description: data.description || undefined,
      }
      const res = await fetchWithAuth(`${API_BASE}/profile/experiences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setExperiences(prev => prev.map(exp => exp.id === id ? updated : exp))
      toast.success("Experiência atualizada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('experiences-updated')) } catch {}
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar experiência: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteExperience = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/experiences/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setExperiences(prev => prev.filter(exp => exp.id !== id))
      toast.success("Experiência removida com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('experiences-updated')) } catch {}
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao remover experiência: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    experiences,
    loading,
    loadExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  }
}

export function useEducation() {
  const [loading, setLoading] = useState(false)
  const [education, setEducation] = useState<Education[]>([])

  const loadEducation = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/education`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEducation(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Falha ao carregar educação: ${message}`)
      setEducation([])
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createEducation = useCallback(async (data: EducationFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      }
      const res = await fetchWithAuth(`${API_BASE}/profile/education`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const created = await res.json()
      setEducation(prev => [created, ...prev])
      toast.success("Educação adicionada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-updated')) } catch {}
      return created
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao adicionar educação: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEducation = useCallback(async (id: string, data: EducationFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      }
      const res = await fetchWithAuth(`${API_BASE}/profile/education/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setEducation(prev => prev.map(edu => edu.id === id ? updated : edu))
      toast.success("Educação atualizada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-updated')) } catch {}
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar educação: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEducation = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/education/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setEducation(prev => prev.filter(edu => edu.id !== id))
      toast.success("Educação removida com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-updated')) } catch {}
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao remover educação: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    education,
    loading,
    loadEducation,
    createEducation,
    updateEducation,
    deleteEducation,
  }
}

export function useSkills() {
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/skills`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSkills(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Falha ao carregar skills: ${message}`)
      setSkills([])
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createSkill = useCallback(async (data: SkillFormData) => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const created = await res.json()
      setSkills(prev => [created, ...prev])
      toast.success("Skill adicionada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('skills-updated')) } catch {}
      return created
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao adicionar skill: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSkill = useCallback(async (id: string, data: SkillFormData) => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setSkills(prev => prev.map(skill => skill.id === id ? updated : skill))
      toast.success("Skill atualizada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('skills-updated')) } catch {}
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar skill: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSkill = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/profile/skills/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSkills(prev => prev.filter(skill => skill.id !== id))
      toast.success("Skill removida com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('skills-updated')) } catch {}
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao remover skill: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    skills,
    loading,
    loadSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  }
}