"use client"

import { useState, useCallback, useEffect, useRef, createContext, useContext } from "react"
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

// ⚡ Performance Optimizations

// Request deduplication with AbortController
class RequestManager {
  private activeRequests = new Map<string, AbortController>()
  private cache = new Map<string, { data: any, timestamp: number, ttl: number }>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  async request<T>(
    key: string, 
    requestFn: (signal: AbortSignal) => Promise<T>,
    ttl = this.DEFAULT_TTL
  ): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`🚀 Cache HIT for ${key}`)
      return cached.data
    }

    // Cancel any existing request for this key
    const existing = this.activeRequests.get(key)
    if (existing) {
      console.log(`🔄 Aborting existing request for ${key}`)
      existing.abort()
    }

    // Create new AbortController
    const controller = new AbortController()
    this.activeRequests.set(key, controller)

    try {
      console.log(`🌐 Making request for ${key}`)
      const data = await requestFn(controller.signal)
      
      // Cache the result
      this.cache.set(key, { data, timestamp: Date.now(), ttl })
      console.log(`💾 Cached result for ${key}`)
      
      return data
    } catch (error) {
      if ((error as any)?.name === 'AbortError') {
        console.log(`🚫 Request aborted for ${key}`)
        throw new Error('Request cancelled')
      }
      throw error
    } finally {
      this.activeRequests.delete(key)
    }
  }

  invalidateCache(pattern?: string) {
    if (!pattern) {
      console.log('🗑️ Clearing all cache')
      this.cache.clear()
      return
    }
    
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern)
    )
    keysToDelete.forEach(key => {
      console.log(`🗑️ Invalidating cache for ${key}`)
      this.cache.delete(key)
    })
  }

  abortAll() {
    console.log('🛑 Aborting all active requests')
    this.activeRequests.forEach(controller => controller.abort())
    this.activeRequests.clear()
  }
}

// Singleton instance
const requestManager = new RequestManager()

// Centralized event manager to prevent duplicate listeners
class EventManager {
  private listeners = new Map<string, Set<Function>>()
  private isRegistered = new Set<string>()

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    
    this.listeners.get(event)!.add(callback)
    
    // Register global listener only once per event type
    if (!this.isRegistered.has(event) && typeof window !== 'undefined') {
      const handler = (e: CustomEvent) => {
        console.log(`📢 Event ${event} triggered`)
        this.listeners.get(event)?.forEach(cb => {
          try {
            cb(e.detail)
          } catch (error) {
            console.error(`❌ Error in event handler for ${event}:`, error)
          }
        })
      }
      
      window.addEventListener(event, handler as EventListener)
      this.isRegistered.add(event)
      console.log(`🎯 Registered global listener for ${event}`)
    }
    
    return () => this.unsubscribe(event, callback)
  }

  unsubscribe(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback)
    if (this.listeners.get(event)?.size === 0) {
      this.listeners.delete(event)
    }
  }

  emit(event: string, data?: any) {
    if (typeof window !== 'undefined') {
      console.log(`📤 Emitting event ${event}`, data)
      window.dispatchEvent(new CustomEvent(event, { detail: data }))
    }
  }

  cleanup() {
    console.log('🧹 Cleaning up event manager')
    this.listeners.clear()
    this.isRegistered.clear()
  }
}

// Singleton instance
const eventManager = new EventManager()

// Centralized state store with optimistic updates
type ProfileState = {
  profile: Profile | null
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  loading: {
    profile: boolean
    experiences: boolean
    education: boolean
    skills: boolean
  }
}

const initialState: ProfileState = {
  profile: null,
  experiences: [],
  education: [],
  skills: [],
  loading: {
    profile: false,
    experiences: false,
    education: false,
    skills: false
  }
}

// Simplified state management without context (to avoid JSX in .ts file)
// Global state for sharing between hooks
let globalState: ProfileState = initialState
const stateListeners: Set<() => void> = new Set()

function useProfileState() {
  const [state, setState] = useState<ProfileState>(globalState)
  
  useEffect(() => {
    const listener = () => setState({ ...globalState })
    stateListeners.add(listener)
    return () => stateListeners.delete(listener)
  }, [])
  
  const updateGlobalState = useCallback((newState: ProfileState) => {
    globalState = newState
    stateListeners.forEach(listener => listener())
  }, [])
  
  return { state, setState: updateGlobalState }
}

// ⚡ Optimized useProfile hook
export function useProfile() {
  const { state, setState } = useProfileState()
  const { profile, loading } = state

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, profile: isLoading }
    }))
  }, [setState])

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true)
      
      const data = await requestManager.request(
        'profile',
        async (signal) => {
          console.log('🔍 Loading profile from API...')
          const res = await fetchWithAuth(`${API_BASE}/profile`, { 
            cache: "no-store",
            signal 
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        }
      )
      
      console.log('🔍 Profile loaded:', data)
      setState(prev => ({ ...prev, profile: data }))
      return data
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 Error loading profile:', error)
      toast.error(`Falha ao carregar perfil: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading])

  const updateProfile = useCallback(async (data: ProfileFormData) => {
    try {
      setLoading(true)
      const payload = transformProfileForAPI(data)
      
      // Optimistic update
      const optimisticProfile = { ...profile, ...payload } as Profile
      setState(prev => ({ ...prev, profile: optimisticProfile }))
      
      const updated = await requestManager.request(
        'profile-update',
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for mutations
      )

      setState(prev => ({ ...prev, profile: updated }))
      requestManager.invalidateCache('profile')
      eventManager.emit('profile-updated', { profile: updated })
      toast.success("Perfil atualizado com sucesso")
      return updated
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      await loadProfile()
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar perfil: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [profile, setState, setLoading, loadProfile])

  const importFromLinkedIn = useCallback(async (data: LinkedInImportData) => {
    try {
      setLoading(true)
      console.log('🔍 Importing from LinkedIn...', data)
      
      const updated = await requestManager.request(
        'linkedin-import',
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/import/linkedin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for imports
      )
      
      console.log('🔍 LinkedIn import successful:', updated)
      setState(prev => ({ 
        ...prev, 
        profile: updated,
        experiences: updated.experiences || prev.experiences,
        education: updated.education || prev.education,
        skills: updated.skills || prev.skills
      }))
      
      // Clear all related cache and emit events
      requestManager.invalidateCache()
      eventManager.emit('profile-updated', { profile: updated })
      eventManager.emit('data-imported', { source: 'linkedin', profile: updated })
      
      toast.success("Perfil importado do LinkedIn com sucesso")
      return updated
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 LinkedIn import error:', error)
      toast.error(`Erro ao importar do LinkedIn: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading])

  const importFromResume = useCallback(async (file: File, overwrite: boolean = true) => {
    try {
      setLoading(true)
      
      const updated = await requestManager.request(
        `resume-import-${file.name}`,
        async (signal) => {
          const form = new FormData()
          form.append('file', file)
          form.append('overwrite', String(overwrite))
          
          const res = await fetchWithAuth(`${API_BASE}/profile/import/resume`, {
            method: 'POST',
            body: form,
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for imports
      )
      
      console.log('📄 Resume import successful:', updated)
      setState(prev => ({ 
        ...prev, 
        profile: updated,
        experiences: updated.experiences || prev.experiences,
        education: updated.education || prev.education,
        skills: updated.skills || prev.skills
      }))
      
      // Clear all related cache and emit events
      requestManager.invalidateCache()
      eventManager.emit('profile-updated', { profile: updated })
      eventManager.emit('data-imported', { source: 'resume', profile: updated })
      
      toast.success('Currículo importado com sucesso')
      return updated
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      const message = error instanceof Error ? error.message : String(error)
      console.error('📄 Resume import error:', error)
      toast.error(`Erro ao importar currículo: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading])

  return {
    profile,
    loading: loading.profile,
    loadProfile,
    updateProfile,
    importFromLinkedIn,
    importFromResume,
  }
}

// ⚡ Optimized useExperiences hook
export function useExperiences() {
  const { state, setState } = useProfileState()
  const { experiences, loading } = state

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, experiences: isLoading }
    }))
  }, [setState])

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true)
      
      const data = await requestManager.request(
        'experiences',
        async (signal) => {
          console.log('🔍 Loading experiences from API...')
          const res = await fetchWithAuth(`${API_BASE}/profile/experiences`, { signal })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        }
      )
      
      console.log('🔍 Experiences loaded:', data)
      const experienceList = Array.isArray(data) ? data : []
      setState(prev => ({ ...prev, experiences: experienceList }))
      return data
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 Error loading experiences:', error)
      toast.error(`Falha ao carregar experiências: ${message}`)
      setState(prev => ({ ...prev, experiences: [] }))
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading])

  // Single event listener for data import events
  useEffect(() => {
    const unsubscribe = eventManager.subscribe('data-imported', () => {
      console.log('📄 Experiences - Reloading after import...')
      loadExperiences().catch(console.error)
    })
    
    return unsubscribe
  }, [loadExperiences])

  const createExperience = useCallback(async (data: ExperienceFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        description: data.description || undefined,
      }
      
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticExp = { ...payload, id: tempId } as Experience
      setState(prev => ({ 
        ...prev, 
        experiences: [optimisticExp, ...prev.experiences] 
      }))
      
      const created = await requestManager.request(
        'experience-create',
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/experiences`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for mutations
      )
      
      setState(prev => ({ 
        ...prev, 
        experiences: [created, ...prev.experiences.filter(exp => exp.id !== tempId)] 
      }))
      requestManager.invalidateCache('experiences')
      eventManager.emit('experiences-updated')
      toast.success("Experiência adicionada com sucesso")
      return created
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      await loadExperiences()
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao adicionar experiência: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading, loadExperiences])

  const updateExperience = useCallback(async (id: string, data: ExperienceFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        description: data.description || undefined,
      }
      
      // Optimistic update
      const optimisticExp = { ...payload, id } as Experience
      setState(prev => ({ 
        ...prev, 
        experiences: prev.experiences.map(exp => exp.id === id ? optimisticExp : exp) 
      }))
      
      const updated = await requestManager.request(
        `experience-update-${id}`,
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/experiences/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for mutations
      )
      
      setState(prev => ({ 
        ...prev, 
        experiences: prev.experiences.map(exp => exp.id === id ? updated : exp) 
      }))
      requestManager.invalidateCache('experiences')
      eventManager.emit('experiences-updated')
      toast.success("Experiência atualizada com sucesso")
      return updated
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      await loadExperiences()
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar experiência: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading, loadExperiences])

  const deleteExperience = useCallback(async (id: string) => {
    try {
      setLoading(true)
      
      // Optimistic update
      const originalExperiences = experiences
      setState(prev => ({ 
        ...prev, 
        experiences: prev.experiences.filter(exp => exp.id !== id) 
      }))
      
      await requestManager.request(
        `experience-delete-${id}`,
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/experiences/${id}`, {
            method: "DELETE",
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return true
        },
        0 // No cache for mutations
      )
      
      requestManager.invalidateCache('experiences')
      eventManager.emit('experiences-updated')
      toast.success("Experiência removida com sucesso")
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      setState(prev => ({ ...prev, experiences: originalExperiences }))
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao remover experiência: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [experiences, setState, setLoading])

  return {
    experiences,
    loading: loading.experiences,
    loadExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  }
}

// ⚡ Optimized useEducation hook
export function useEducation() {
  const { state, setState } = useProfileState()
  const { education, loading } = state

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, education: isLoading }
    }))
  }, [setState])

  const loadEducation = useCallback(async () => {
    try {
      setLoading(true)
      
      const data = await requestManager.request(
        'education',
        async (signal) => {
          console.log('🔍 Loading education from API...')
          const res = await fetchWithAuth(`${API_BASE}/profile/education`, { signal })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        }
      )
      
      console.log('🔍 Education loaded:', data)
      const educationList = Array.isArray(data) ? data : []
      setState(prev => ({ ...prev, education: educationList }))
      return data
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 Error loading education:', error)
      toast.error(`Falha ao carregar escolaridade: ${message}`)
      setState(prev => ({ ...prev, education: [] }))
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading])

  // Single event listener for data import events
  useEffect(() => {
    const unsubscribe = eventManager.subscribe('data-imported', () => {
      console.log('📄 Education - Reloading after import...')
      loadEducation().catch(console.error)
    })
    
    return unsubscribe
  }, [loadEducation])

  const createEducation = useCallback(async (data: EducationFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      }
      
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticEdu = { ...payload, id: tempId } as Education
      setState(prev => ({ 
        ...prev, 
        education: [optimisticEdu, ...prev.education] 
      }))
      
      const created = await requestManager.request(
        'education-create',
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/education`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for mutations
      )
      
      setState(prev => ({ 
        ...prev, 
        education: [created, ...prev.education.filter(edu => edu.id !== tempId)] 
      }))
      requestManager.invalidateCache('education')
      eventManager.emit('education-updated')
      toast.success("Escolaridade adicionada com sucesso")
      return created
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      await loadEducation()
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao adicionar escolaridade: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading, loadEducation])

  const updateEducation = useCallback(async (id: string, data: EducationFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      }
      
      // Optimistic update
      const optimisticEdu = { ...payload, id } as Education
      setState(prev => ({ 
        ...prev, 
        education: prev.education.map(edu => edu.id === id ? optimisticEdu : edu) 
      }))
      
      const updated = await requestManager.request(
        `education-update-${id}`,
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/education/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for mutations
      )
      
      setState(prev => ({ 
        ...prev, 
        education: prev.education.map(edu => edu.id === id ? updated : edu) 
      }))
      requestManager.invalidateCache('education')
      eventManager.emit('education-updated')
      toast.success("Escolaridade atualizada com sucesso")
      return updated
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      await loadEducation()
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar escolaridade: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading, loadEducation])

  const deleteEducation = useCallback(async (id: string) => {
    try {
      setLoading(true)
      
      // Optimistic update
      const originalEducation = education
      setState(prev => ({ 
        ...prev, 
        education: prev.education.filter(edu => edu.id !== id) 
      }))
      
      await requestManager.request(
        `education-delete-${id}`,
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/education/${id}`, {
            method: "DELETE",
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return true
        },
        0 // No cache for mutations
      )
      
      requestManager.invalidateCache('education')
      eventManager.emit('education-updated')
      toast.success("Escolaridade removida com sucesso")
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      setState(prev => ({ ...prev, education: originalEducation }))
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao remover escolaridade: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [education, setState, setLoading])

  return {
    education,
    loading: loading.education,
    loadEducation,
    createEducation,
    updateEducation,
    deleteEducation,
  }
}

// ⚡ Optimized useSkills hook
export function useSkills() {
  const { state, setState } = useProfileState()
  const { skills, loading } = state

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, skills: isLoading }
    }))
  }, [setState])

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true)
      
      const data = await requestManager.request(
        'skills',
        async (signal) => {
          console.log('🔍 Loading skills from API...')
          const res = await fetchWithAuth(`${API_BASE}/profile/skills`, { signal })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        }
      )
      
      console.log('🔍 Skills loaded:', data)
      const skillsList = Array.isArray(data) ? data : []
      setState(prev => ({ ...prev, skills: skillsList }))
      return data
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      const message = error instanceof Error ? error.message : String(error)
      console.error('🔍 Error loading skills:', error)
      toast.error(`Falha ao carregar skills: ${message}`)
      setState(prev => ({ ...prev, skills: [] }))
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading])

  // Single event listener for data import events
  useEffect(() => {
    const unsubscribe = eventManager.subscribe('data-imported', () => {
      console.log('📄 Skills - Reloading after import...')
      loadSkills().catch(console.error)
    })
    
    return unsubscribe
  }, [loadSkills])

  const createSkill = useCallback(async (data: SkillFormData) => {
    try {
      setLoading(true)
      
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticSkill = { ...data, id: tempId } as Skill
      setState(prev => ({ 
        ...prev, 
        skills: [optimisticSkill, ...prev.skills] 
      }))
      
      const created = await requestManager.request(
        'skill-create',
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/skills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for mutations
      )
      
      setState(prev => ({ 
        ...prev, 
        skills: [created, ...prev.skills.filter(skill => skill.id !== tempId)] 
      }))
      requestManager.invalidateCache('skills')
      eventManager.emit('skills-updated')
      toast.success("Skill adicionada com sucesso")
      return created
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      await loadSkills()
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao adicionar skill: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading, loadSkills])

  const updateSkill = useCallback(async (id: string, data: SkillFormData) => {
    try {
      setLoading(true)
      
      // Optimistic update
      const optimisticSkill = { ...data, id } as Skill
      setState(prev => ({ 
        ...prev, 
        skills: prev.skills.map(skill => skill.id === id ? optimisticSkill : skill) 
      }))
      
      const updated = await requestManager.request(
        `skill-update-${id}`,
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/skills/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return await res.json()
        },
        0 // No cache for mutations
      )
      
      setState(prev => ({ 
        ...prev, 
        skills: prev.skills.map(skill => skill.id === id ? updated : skill) 
      }))
      requestManager.invalidateCache('skills')
      eventManager.emit('skills-updated')
      toast.success("Skill atualizada com sucesso")
      return updated
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      await loadSkills()
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao atualizar skill: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setState, setLoading, loadSkills])

  const deleteSkill = useCallback(async (id: string) => {
    try {
      setLoading(true)
      
      // Optimistic update
      const originalSkills = skills
      setState(prev => ({ 
        ...prev, 
        skills: prev.skills.filter(skill => skill.id !== id) 
      }))
      
      await requestManager.request(
        `skill-delete-${id}`,
        async (signal) => {
          const res = await fetchWithAuth(`${API_BASE}/profile/skills/${id}`, {
            method: "DELETE",
            signal
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return true
        },
        0 // No cache for mutations
      )
      
      requestManager.invalidateCache('skills')
      eventManager.emit('skills-updated')
      toast.success("Skill removida com sucesso")
    } catch (error) {
      if ((error as Error).message === 'Request cancelled') return
      
      // Revert optimistic update on error
      setState(prev => ({ ...prev, skills: originalSkills }))
      
      const message = error instanceof Error ? error.message : String(error)
      toast.error(`Erro ao remover skill: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [skills, setState, setLoading])

  return {
    skills,
    loading: loading.skills,
    loadSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  }
}