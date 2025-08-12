"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { setAuthenticationState, getRedirectUrl } from "@/lib/auth-utils"
import { useAuthRedirect } from "@/lib/use-auth"


export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const { isAuthenticated } = useAuthRedirect() // Handle redirects after login
  const [email, setEmail] = useState("demo@carreirapro.app")
  const [password, setPassword] = useState("demo123")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login'|'register'|'forgot'|'reset'>(()=>{
    const m = (sp.get('mode') as any) || 'login'
    return m==='register'||m==='forgot'||m==='reset'?'register': 'login'
  })
  const [selectedPlan, setSelectedPlan] = useState<'starter'|'pro'|'team'>(()=>{
    const q = (sp.get('plan') as any) || 'starter'
    return q==='pro'||q==='team'||q==='starter'?q:'starter'
  })
  const [resetToken, setResetToken] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}`
          try {
            const errorData = await res.json()
            errorMessage = errorData.message || errorMessage
          } catch {
            // If can't parse error JSON, use default message
          }
          throw new Error(errorMessage)
        }
        
        const data: { accessToken: string; refreshToken?: string } = await res.json()
        
        // Use new authentication utilities
        setAuthenticationState(data.accessToken, data.refreshToken)
        
        toast.success("Login realizado com sucesso")
        
        // Check for redirect URL from middleware
        const redirectUrl = getRedirectUrl() || "/profile"
        router.push(redirectUrl)
      } else if (mode === 'register') {
        const res = await fetch(`${API_BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, selectedPlan }) })
        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}`
          try {
            const errorData = await res.json()
            errorMessage = errorData.message || errorMessage
          } catch {
            // If can't parse error JSON, use default message
          }
          throw new Error(errorMessage)
        }
        
        const data: { accessToken: string; refreshToken?: string; requiresPayment?: boolean } = await res.json()
        
        // Use new authentication utilities
        setAuthenticationState(data.accessToken, data.refreshToken)
        if (data.requiresPayment) {
          toast.success("Conta criada. Complete o pagamento para ativar seu plano.")
          // redirecionar para uma rota de checkout (placeholder)
          router.push(`/checkout?plan=${selectedPlan}`)
        } else {
          toast.success("Conta criada e login realizado")
          router.push("/profile")
        }
      } else if (mode === 'forgot') {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        toast.success("Se o e-mail existir, enviamos instruções (token mostrado em dev)")
        if (data?.token) setResetToken(data.token)
      } else if (mode === 'reset') {
        const res = await fetch(`${API_BASE}/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, token: resetToken, newPassword: password }) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        toast.success("Senha redefinida. Faça login.")
        setMode('login')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(`Erro: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border p-6"
      >
        <h1 className="text-2xl font-semibold">
          {mode === 'login' && 'Entrar'}
          {mode === 'register' && 'Criar conta'}
          {mode === 'forgot' && 'Esqueci minha senha'}
          {mode === 'reset' && 'Redefinir senha'}
        </h1>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="voce@exemplo.com"
            required
          />
        </div>
        {(mode === 'login' || mode === 'register' || mode === 'reset') && (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
            required={mode !== 'forgot'}
          />
        </div>
        )}
        {mode === 'reset' && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="token">Token</label>
            <input id="token" value={resetToken} onChange={(e)=>setResetToken(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Código recebido" />
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processando..." : (
            mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : mode === 'forgot' ? 'Enviar instruções' : 'Redefinir senha'
          )}
        </Button>
        <div className="text-xs text-muted-foreground flex items-center justify-between">
          {mode !== 'login' && <button type="button" className="underline" onClick={()=>setMode('login')}>Ir para login</button>}
          {mode !== 'register' && <button type="button" className="underline" onClick={()=>setMode('register')}>Criar conta</button>}
          {mode !== 'forgot' && <button type="button" className="underline" onClick={()=>setMode('forgot')}>Esqueci a senha</button>}
          {mode === 'forgot' && <button type="button" className="underline" onClick={()=>setMode('reset')}>Já tenho o token</button>}
        </div>
        <Toaster richColors />
      </form>
    </main>
  )
}


