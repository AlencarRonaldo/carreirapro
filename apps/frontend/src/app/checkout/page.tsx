"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { API_BASE, fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

function CheckoutContent() {
  const sp = useSearchParams()
  const router = useRouter()
  const plan = (sp.get("plan") as 'starter'|'pro'|'team') || 'pro'
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        // Se não houver token, redireciona para login
        const token = typeof window !== 'undefined' ? localStorage.getItem('cp_token') : null
        if (!token) {
          router.replace(`/login?plan=${plan}`)
          return
        }
        const res = await fetchWithAuth(`${API_BASE}/billing/checkout-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, billingCycle: 'monthly' }) })
        if (res.status === 401) {
          router.replace(`/login?plan=${plan}`)
          return
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data.checkoutUrl) {
          const url: string = typeof data.checkoutUrl === 'string' && data.checkoutUrl.startsWith('/')
            ? `${API_BASE}${data.checkoutUrl}`
            : data.checkoutUrl
          // Se for mock e estamos em navegador com token, o GET exigirá Authorization. Use POST /billing/mock/activate.
          if (url.includes('/billing/mock/success')) {
            const activate = await fetchWithAuth(`${API_BASE}/billing/mock/activate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, billingCycle: 'monthly' }) })
            if (activate.ok) {
              toast.success('Assinatura ativada (mock).')
              router.push('/')
              return
            }
          }
          window.location.href = url
        } else {
          toast.success('Plano grátis ativo. Redirecionando...')
          router.push('/')
        }
      } catch (e: any) {
        toast.error(e?.message ?? 'Falha ao iniciar checkout')
      } finally {
        setLoading(false)
      }
    })()
  }, [plan])

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Processando checkout do plano {plan.toUpperCase()}...</h1>
        <p className="text-sm text-muted-foreground">Aguarde, você será redirecionado.</p>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-dvh flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Carregando checkout...</h1>
        </div>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

