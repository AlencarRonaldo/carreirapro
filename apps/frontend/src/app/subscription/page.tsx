"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth, API_BASE } from "@/lib/api"
import { toast } from "sonner"

type Me = { id: string; email: string; plan?: 'starter'|'pro'|'team'; subscriptionStatus?: string }

export default function SubscriptionPage() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await fetchWithAuth(`${API_BASE}/auth/me`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setMe(data)
      } catch (e: any) {
        toast.error(e?.message ?? 'Falha ao carregar assinatura')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function openPortal() {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/billing/portal`, { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data?.url) window.location.href = data.url
      else toast.error('Portal indisponível')
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao abrir portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh p-6">
      <section className="mx-auto max-w-2xl rounded-lg border p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Minha assinatura</h1>
        <div className="text-sm text-muted-foreground">
          <div>Plano: <span className="font-medium text-foreground">{me?.plan ?? 'starter'}</span></div>
          <div>Status: <span className="font-medium text-foreground">{me?.subscriptionStatus ?? (me?.plan==='starter'?'active':'pending')}</span></div>
          <div>E-mail: {me?.email}</div>
        </div>
        <div className="flex gap-3">
          <button onClick={openPortal} disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm">Gerenciar assinatura</button>
          <a href="/plans" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">Ver planos</a>
        </div>
      </section>
    </main>
  )
}


