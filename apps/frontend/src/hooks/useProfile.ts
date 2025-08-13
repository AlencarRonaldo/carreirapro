"use client"

import { useState, useCallback, useEffect } from "react"
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
  maritalStatus?: string
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
      console.log('🔍 useProfile - Loading profile from API...')
      const res = await fetchWithAuth(`${API_BASE}/profile`, { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('🔍 useProfile - Profile loaded:', data)
      setProfile(data)
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 useProfile - Error loading profile:', error)
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
      console.log('🔍 useProfile - Importing from LinkedIn...', data)
      const res = await fetchWithAuth(`${API_BASE}/profile/import/linkedin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      console.log('🔍 useProfile - LinkedIn import successful:', updated)
      console.log('🔍 useProfile - Setting profile in state:', updated)
      
      // Atualiza o perfil principal
      setProfile(updated)
      
      // Dispara eventos para recarregar dados nas abas separadas
      if (updated.experiences && Array.isArray(updated.experiences) && updated.experiences.length > 0) {
        console.log('🔍 LinkedIn Import - Found experiences, triggering reload:', updated.experiences.length)
        try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('experiences-reload')) } catch {}
      }
      
      if (updated.education && Array.isArray(updated.education) && updated.education.length > 0) {
        console.log('🔍 LinkedIn Import - Found education, triggering reload:', updated.education.length)
        try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-reload')) } catch {}
      }
      
      if (updated.skills && Array.isArray(updated.skills) && updated.skills.length > 0) {
        console.log('🔍 LinkedIn Import - Found skills, triggering reload:', updated.skills.length)
        try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('skills-reload')) } catch {}
      }
      
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('profile-updated', { detail: { profile: updated } })) } catch {}
      toast.success("Perfil importado do LinkedIn com sucesso")
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 useProfile - LinkedIn import error:', error)
      toast.error(`Erro ao importar do LinkedIn: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const importFromResume = useCallback(async (file: File, overwrite: boolean = true) => {
    try {
      setLoading(true)
      const form = new FormData()
      form.append('file', file)
      form.append('overwrite', String(overwrite))
      const res = await fetchWithAuth(`${API_BASE}/profile/import/resume`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      console.log('📄 Resume Import - Response from API:', updated)
      
      // Atualiza o perfil principal
      setProfile(updated)
      
      // Dispara eventos para recarregar dados nas abas separadas
      if (updated.experiences && Array.isArray(updated.experiences) && updated.experiences.length > 0) {
        console.log('📄 Resume Import - Found experiences, triggering reload:', updated.experiences.length)
        try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('experiences-reload')) } catch {}
      }
      
      if (updated.education && Array.isArray(updated.education) && updated.education.length > 0) {
        console.log('📄 Resume Import - Found education, triggering reload:', updated.education.length)
        try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-reload')) } catch {}
      }
      
      if (updated.skills && Array.isArray(updated.skills) && updated.skills.length > 0) {
        console.log('📄 Resume Import - Found skills, triggering reload:', updated.skills.length)
        try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('skills-reload')) } catch {}
      }
      
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('profile-updated', { detail: { profile: updated } })) } catch {}
      toast.success('Currículo importado com sucesso')
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('📄 Resume Import - Error:', error)
      toast.error(`Erro ao importar currículo: ${message}`)
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
    importFromResume,
  }
}

export function useExperiences() {
  const [loading, setLoading] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔍 useExperiences - Loading experiences from API...')
      const res = await fetchWithAuth(`${API_BASE}/profile/experiences`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('🔍 useExperiences - Data loaded:', data)
      setExperiences(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 useExperiences - Error loading:', error)
      toast.error(`Falha ao carregar experiências: ${message}`)
      setExperiences([])
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Event listener para reload após importação - Removendo dependência problemática
  useEffect(() => {
    const handleReload = async () => {
      console.log('📄 Experiences - Reloading after import...')
      try {
        const res = await fetchWithAuth(`${API_BASE}/profile/experiences`)
        if (res.ok) {
          const data = await res.json()
          console.log('📄 Experiences - Reload successful:', data)
          setExperiences(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('📄 Experiences - Reload failed:', error)
      }
    }
    
    if (typeof window !== 'undefined') {
      console.log('📄 Experiences - Registering reload listener')
      window.addEventListener('experiences-reload', handleReload)
      return () => {
        console.log('📄 Experiences - Removing reload listener')
        window.removeEventListener('experiences-reload', handleReload)
      }
    }
  }, []) // ✅ CORREÇÃO: Sem dependências para evitar re-registro

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
      console.log('🔍 useEducation - Loading education from API...')
      const res = await fetchWithAuth(`${API_BASE}/profile/education`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('🔍 useEducation - Data loaded:', data)
      setEducation(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 useEducation - Error loading:', error)
      toast.error(`Falha ao carregar escolaridade: ${message}`)
      setEducation([])
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Event listener para reload após importação - Removendo dependência problemática
  useEffect(() => {
    const handleReload = async () => {
      console.log('📄 Education - Reloading after import...')
      try {
        const res = await fetchWithAuth(`${API_BASE}/profile/education`)
        if (res.ok) {
          const data = await res.json()
          console.log('📄 Education - Reload successful:', data)
          setEducation(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('📄 Education - Reload failed:', error)
      }
    }
    
    if (typeof window !== 'undefined') {
      console.log('📄 Education - Registering reload listener')
      window.addEventListener('education-reload', handleReload)
      return () => {
        console.log('📄 Education - Removing reload listener')
        window.removeEventListener('education-reload', handleReload)
      }
    }
  }, []) // ✅ CORREÇÃO: Sem dependências para evitar re-registro

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
      toast.success("Escolaridade adicionada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-updated')) } catch {}
      return created
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao adicionar escolaridade: ${message}`)
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
      toast.success("Escolaridade atualizada com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-updated')) } catch {}
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar escolaridade: ${message}`)
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
      toast.success("Escolaridade removida com sucesso")
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('education-updated')) } catch {}
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao remover escolaridade: ${message}`)
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
      console.log('🔍 useSkills - Loading skills from API...')
      const res = await fetchWithAuth(`${API_BASE}/profile/skills`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('🔍 useSkills - Data loaded:', data)
      setSkills(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 useSkills - Error loading:', error)
      toast.error(`Falha ao carregar skills: ${message}`)
      setSkills([])
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Event listener para reload após importação - Removendo dependência problemática
  useEffect(() => {
    const handleReload = async () => {
      console.log('📄 Skills - Reloading after import...')
      try {
        const res = await fetchWithAuth(`${API_BASE}/profile/skills`)
        if (res.ok) {
          const data = await res.json()
          console.log('📄 Skills - Reload successful:', data)
          setSkills(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('📄 Skills - Reload failed:', error)
      }
    }
    
    if (typeof window !== 'undefined') {
      console.log('📄 Skills - Registering reload listener')
      window.addEventListener('skills-reload', handleReload)
      return () => {
        console.log('📄 Skills - Removing reload listener')
        window.removeEventListener('skills-reload', handleReload)
      }
    }
  }, []) // ✅ CORREÇÃO: Sem dependências para evitar re-registro

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