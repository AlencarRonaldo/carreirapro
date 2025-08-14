"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProfileWizard } from "@/components/ProfileWizard"
import { ProfessionalOnboarding, type OnboardingData } from "@/components/ProfessionalOnboarding"
import { GamifiedOnboarding, type DataSource } from "@/components/gamification/GamifiedOnboarding"
import { SimpleProfileWizard } from "@/components/gamification/SimpleProfileWizard"
import { DebugPanel } from "@/components/gamification/DebugPanel"
import { Toaster } from "@/components/ui/sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const [dataSource, setDataSource] = useState<DataSource | null>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run localStorage operations on client
    if (!isClient) return

    try {
      const t = localStorage.getItem("cp_token")
      setToken(t)
      if (!t) {
        router.push("/login")
        return
      }
      
      // Check se usuário já completou o onboarding
      const completedOnboarding = localStorage.getItem("cp_onboarding_completed")
      const savedDataSource = localStorage.getItem("cp_data_source") as DataSource
      
      if (completedOnboarding && savedDataSource) {
        setDataSource(savedDataSource)
        setShowOnboarding(false)
        setShowWizard(true)
      }
    } catch (error) {
      console.warn("LocalStorage error:", error)
      // Fallback to login if localStorage fails
      router.push("/login")
    }
  }, [router, isClient])

  const handleOnboardingComplete = (selectedDataSource: DataSource) => {
    setDataSource(selectedDataSource)
    setShowOnboarding(false)
    setShowWizard(true)
    localStorage.setItem("cp_onboarding_completed", "true")
    localStorage.setItem("cp_data_source", selectedDataSource)
  }

  const handleProfileComplete = (profileData: any) => {
    // Salva dados completos e redireciona para templates gamificado
    localStorage.setItem("cp_profile_complete", "true")
    localStorage.setItem("cp_profile_data", JSON.stringify(profileData))
    router.push("/documents/templates/gamified")
  }

  if (!token) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Você precisa estar logado para acessar o perfil.
          </p>
          <a href="/login" className="underline">
            Ir para Login
          </a>
          <Toaster richColors />
        </div>
      </main>
    )
  }

  // Mostra onboarding gamificado primeiro
  if (showOnboarding) {
    return (
      <>
        <GamifiedOnboarding onComplete={handleOnboardingComplete} />
        <DebugPanel />
        <Toaster richColors />
      </>
    )
  }

  // Mostra wizard gamificado após onboarding
  if (showWizard && dataSource) {
    return (
      <>
        <SimpleProfileWizard 
          dataSource={dataSource}
          onComplete={handleProfileComplete}
        />
        <DebugPanel />
        <Toaster richColors />
      </>
    )
  }

  // Fallback para wizard original caso necessário
  return (
    <>
      <ProfileWizard
        initialStep={2}
        enableAutoSave={true}
        onComplete={handleProfileComplete}
      />
      <DebugPanel />
      <Toaster richColors />
    </>
  )
}


