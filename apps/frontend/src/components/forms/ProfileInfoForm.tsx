"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile"
import { useProfile } from "@/hooks/useProfile"
import { useAutoSave } from "@/hooks/useAutoSave"
import { MapPin, Phone, Mail, Globe, Github, Linkedin, Loader2, Save } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface ProfileInfoFormProps {
  onSuccess?: () => void
  enableAutoSave?: boolean
}

export function ProfileInfoForm({ onSuccess, enableAutoSave = true }: ProfileInfoFormProps) {
  const { profile, loading, updateProfile, loadProfile } = useProfile()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      headline: "",
      locationCity: "",
      locationState: "",
      locationCountry: "",
      linkedin: "",
      github: "",
      website: "",
      email: "",
      phone: "",
      maritalStatus: "",
    },
  })

  const { watch, reset } = form

  // Auto-save functionality
  const { loadDraft, clearDraft, forceSave, isSaving: autoSaveInProgress, hasUnsavedChanges } = useAutoSave({
    data: watch(),
    onSave: async (data) => {
      if (!enableAutoSave) return
      const parsed = profileSchema.safeParse(data)
      if (!parsed.success) return
      setIsSaving(true)
      try {
        await updateProfile(parsed.data)
      } finally {
        setIsSaving(false)
      }
    },
    enabled: enableAutoSave,
    key: "profile_info",
    delay: 2000,
  })

  // Expose forceSave to parent components using useRef to avoid memory leaks
  const forceSaveRef = useRef(forceSave)
  useEffect(() => {
    forceSaveRef.current = forceSave
  }, [forceSave])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use a stable reference that doesn't change
      (window as any).__profileFormForceSave = () => forceSaveRef.current()
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__profileFormForceSave
      }
    }
  }, []) // Empty deps - setup once

  // Load profile data when available - SEMPRE carrega quando o perfil mudar
  useEffect(() => {
    console.log('🔍 ProfileInfoForm - Profile changed:', profile)
    console.log('🔍 ProfileInfoForm - Profile ID:', profile?.id)
    console.log('🔍 ProfileInfoForm - Profile fullName:', profile?.fullName)
    if (profile) {
      const newData = {
        fullName: profile.fullName || "",
        headline: profile.headline || "",
        locationCity: profile.locationCity || "",
        locationState: profile.locationState || "",
        locationCountry: profile.locationCountry || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        website: profile.website || "",
        email: profile.email || "",
        phone: profile.phone || "",
        maritalStatus: (profile as any).maritalStatus || "",
      }
      console.log('🔍 ProfileInfoForm - Always resetting form with profile data:', newData)
      console.log('🔍 ProfileInfoForm - Before reset - current form values:', form.getValues())
      
      // Reset immediately without timeout to avoid timing issues
      reset(newData)
      console.log('🔍 ProfileInfoForm - After reset - new form values:', form.getValues())
    } else {
      console.log('🔍 ProfileInfoForm - No profile data, not resetting form')
    }
  }, [profile, reset])

  // Garante que o formulário sempre tenha os dados mais recentes do servidor
  // mesmo se o evento de atualização ocorrer antes do componente montar
  useEffect(() => {
    // Carrega o perfil ao montar o formulário e já aplica no form
    loadProfile()
      .then((p) => {
        if (p) {
          const newData = {
            fullName: p.fullName || "",
            headline: p.headline || "",
            locationCity: p.locationCity || "",
            locationState: p.locationState || "",
            locationCountry: p.locationCountry || "",
            linkedin: p.linkedin || "",
            github: p.github || "",
            website: p.website || "",
            email: p.email || "",
            phone: p.phone || "",
            maritalStatus: (p as any).maritalStatus || "",
          }
          clearDraft()
          reset(newData)
        }
      })
      .catch(() => {})
  }, [loadProfile, reset, clearDraft])

  // Atualiza form em tempo real quando o perfil for salvo/importado em outra aba/step
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as any
      const p = detail?.profile
      console.log('🔍 ProfileInfoForm - Profile updated event received:', p)
      if (p) {
        const newData = {
          fullName: p.fullName || "",
          headline: p.headline || "",
          locationCity: p.locationCity || "",
          locationState: p.locationState || "",
          locationCountry: p.locationCountry || "",
          linkedin: p.linkedin || "",
          github: p.github || "",
          website: p.website || "",
          email: p.email || "",
          phone: p.phone || "",
          maritalStatus: (p as any).maritalStatus || "",
        }
        console.log('🔍 ProfileInfoForm - Forcing reset with updated data:', newData)
        clearDraft()
        reset(newData)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('profile-updated', handler as EventListener)
      return () => window.removeEventListener('profile-updated', handler as EventListener)
    }
  }, [reset])

  // Load draft on component mount
  useEffect(() => {
    const draft = loadDraft()
    if (draft && !profile) {
      reset(draft)
    } else if (!profile && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('profile_info_draft')
        if (raw) {
          const parsed = JSON.parse(raw)
          reset(parsed)
        }
      } catch {}
    }
  }, [loadDraft, reset, profile])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      clearDraft() // Clear draft after successful manual save
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const formatPhoneInput = (value: string) => {
    // Simple Brazilian phone formatting
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{2})(\d{0,5})(\d{0,4})$/)
    if (match) {
      const formatted = `(${match[1]}) ${match[2]}`
      return match[3] ? `${formatted}-${match[3]}` : formatted
    }
    return value
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Informações Pessoais
        </CardTitle>
        <CardDescription>
          Atualize suas informações básicas de perfil profissional
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome completo" 
                        {...field}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline profissional</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Desenvolvedor Full Stack" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Um resumo curto da sua área de atuação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <h3 className="text-lg font-medium">Localização</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="locationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="São Paulo" 
                          {...field}
                          autoComplete="address-level2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="locationState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="SP" 
                          {...field}
                          autoComplete="address-level1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="locationCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brasil" 
                          {...field}
                          autoComplete="country"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <h3 className="text-lg font-medium">Contato</h3>
              </div>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="seu@email.com" 
                          {...field}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 99999-9999" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhoneInput(e.target.value)
                            field.onChange(formatted)
                          }}
                          maxLength={15}
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado civil</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Solteiro(a), Casado(a), ..." 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            </div>

            {/* Social/Professional Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <h3 className="text-lg font-medium">Links Profissionais</h3>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://linkedin.com/in/seu-perfil" 
                          {...field}
                          autoComplete="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/seu-usuario" 
                          {...field}
                          autoComplete="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website/Portfólio</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://seu-site.com" 
                          {...field}
                          autoComplete="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Perfil"
                )}
              </Button>
            </div>

            {/* Auto-save indicator */}
            {enableAutoSave && (
              <div className="flex items-center justify-center pt-2">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  {(isSaving || autoSaveInProgress) ? (
                    <>
                      <Save className="w-3 h-3 animate-pulse" />
                      Salvando automaticamente...
                    </>
                  ) : hasUnsavedChanges ? (
                    <>
                      <Save className="w-3 h-3 text-yellow-500" />
                      Alterações pendentes...
                    </>
                  ) : (
                    <>✓ Salvamento automático ativado</>
                  )}
                </p>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}