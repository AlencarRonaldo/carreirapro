"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProfileWizard, useKeyboardNavigation } from "@/components/ProfileWizard"
import { Toaster } from "@/components/ui/sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem("cp_token")
    setToken(t)
    if (!t) {
      router.push("/login")
      return
    }
  }, [router])

  const handleProfileComplete = () => {
    // Redireciona para uma rota existente após concluir o perfil
    router.push("/documents/templates")
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

  return (
    <>
      <ProfileWizard
        initialStep={1}
        enableAutoSave={true}
        onComplete={handleProfileComplete}
      />
      <Toaster richColors />
    </>
  )
}


