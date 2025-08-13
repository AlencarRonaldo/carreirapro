"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth, API_BASE } from "@/lib/api"
import { toast } from "sonner"

type Analysis = { id?: string; company?: string; title?: string; requiredSkills?: string[]; responsibilities?: string[]; keywords?: string[] }

export default function CoverLettersPage() {
  const [plan, setPlan] = useState<'starter'|'pro'|'team'|'unknown'>('unknown')
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [tone, setTone] = useState<'profissional'|'entusiasta'|'confiante'>('profissional')
  const [language, setLanguage] = useState<'português'|'inglês'|'espanhol'>('português')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [content, setContent] = useState<string>("")
  const [score, setScore] = useState<number | null>(null)

  // Utils: escape and linkify text safely for preview
  const escapeHtml = (s: string) => s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

  const linkifyText = (s: string) => {
    const escaped = escapeHtml(s)
    // URLs com protocolo
    const withProto = escaped.replace(/(https?:\/\/[^\s)]+)(?![^<]*>|[^&]*;)/gi, (m) => {
      const href = m
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`
    })
    // URLs tipo www.
    const withWww = withProto.replace(/(^|\s)(www\.[^\s)]+)(?![^<]*>|[^&]*;)/gi, (_m, p1, p2) => {
      const href = `https://${p2}`
      return `${p1}<a href="${href}" target="_blank" rel="noopener noreferrer">${p2}</a>`
    })
    // Emails simples
    const withEmails = withWww.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (m) => {
      const href = `mailto:${m}`
      return `<a href="${href}">${m}</a>`
    })
    // Quebras de linha
    return withEmails.replace(/\n/g, '<br/>')
  }

  async function doAnalyze() {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/jobs/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url || undefined, description: description || undefined }) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const a = await res.json()
      if ((a as any)?.error === 'limit') throw new Error('Limite mensal atingido no plano Starter. Faça upgrade para continuar.')
      setAnalysis(a)
      toast.success('Vaga analisada')
    } catch (e: any) { toast.error(e?.message || 'Falha ao analisar') } finally { setLoading(false) }
  }

  async function doGenerate() {
    try {
      if (plan === 'starter') { toast.error('Disponível no plano Pro/Team. Faça upgrade para gerar cartas.'); return }
      if (!analysis) { toast.error('Analise uma vaga primeiro'); return }
      setLoading(true)
      // Busca o perfil antes de gerar para enviar dados reais
      const profileRes = await fetchWithAuth(`${API_BASE}/profile`)
      if (!profileRes.ok) throw new Error(`HTTP ${profileRes.status}`)
      const profile = await profileRes.json()
      const res = await fetchWithAuth(`${API_BASE}/cover-letters/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profileData: profile, jobAnalysis: analysis, tone, language }) })
      if (res.status === 403) throw new Error('Recurso Pro/Team. Faça upgrade para gerar cartas.')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setContent(data?.content || '')
      setScore(data?.qualityScore?.score ?? null)
      toast.success('Carta gerada')
    } catch (e: any) { toast.error(e?.message || 'Falha ao gerar') } finally { setLoading(false) }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Cartas de Apresentação</h1>
      <p className="text-sm text-muted-foreground">Gere cartas com IA a partir da descrição/URL da vaga.</p>
      <PlanNotice setPlan={(p)=>setPlan(p)} />

      <section className="rounded-lg border p-4 grid gap-3">
        <input className="border rounded px-3 py-2 text-sm" placeholder="URL da vaga (opcional)" value={url} onChange={(e)=>setUrl(e.target.value)} />
        <textarea className="border rounded px-3 py-2 text-sm min-h-24" placeholder="Cole aqui a descrição da vaga (se preferir)" value={description} onChange={(e)=>setDescription(e.target.value)} />
        {description && (
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Prévia da descrição (links clicáveis)</div>
            <div className="border rounded p-2 bg-white/60" dangerouslySetInnerHTML={{ __html: linkifyText(description) }} />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label>Tom:</label>
          <select className="border rounded px-2 py-1" value={tone} onChange={(e)=>setTone(e.target.value as any)}>
            <option value="profissional">Profissional</option>
            <option value="entusiasta">Entusiasta</option>
            <option value="confiante">Confiante</option>
          </select>
          <label>Idioma:</label>
          <select className="border rounded px-2 py-1" value={language} onChange={(e)=>setLanguage(e.target.value as any)}>
            <option value="português">Português</option>
            <option value="inglês">Inglês</option>
            <option value="espanhol">Espanhol</option>
          </select>
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm" onClick={doAnalyze} disabled={loading}>Analisar vaga</button>
          <button className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm" onClick={doGenerate} disabled={loading || !analysis}>Gerar carta</button>
        </div>
      </section>

      {analysis && (
        <section className="rounded-lg border p-4">
          <h2 className="text-sm font-medium">Resumo da vaga</h2>
          <div className="text-xs text-muted-foreground">{analysis.title} • {analysis.company}</div>
          <div className="text-xs mt-2">Keywords: {(analysis.keywords||[]).join(', ')}</div>
        </section>
      )}

      <section className="rounded-lg border p-4">
        <h2 className="text-sm font-medium">Carta</h2>
        {score !== null && <div className="text-xs text-muted-foreground mb-2">Score de qualidade: {score}</div>}
        <textarea className="border rounded w-full px-3 py-2 min-h-64 text-sm" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Sua carta aparecerá aqui..." />
        {content && (
          <div className="mt-3 text-xs text-muted-foreground">
            <div className="font-medium mb-1">Prévia da carta (links clicáveis)</div>
            <div className="border rounded p-3 bg-white" dangerouslySetInnerHTML={{ __html: linkifyText(content) }} />
          </div>
        )}
      </section>
    </main>
  )
}

function PlanNotice({ setPlan }: { setPlan: (p: 'starter'|'pro'|'team')=>void }) {
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState<'starter'|'pro'|'team'>('starter')
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/subscription`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          const p = (data?.plan as 'starter'|'pro'|'team') || 'starter'
          setUserPlan(p)
          setPlan(p)
        } else {
          setUserPlan('starter')
          setPlan('starter')
        }
      } catch {
        setUserPlan('starter')
        setPlan('starter')
      } finally {
        setLoading(false)
      }
    })()
  }, [setPlan])

  if (loading) return null
  if (userPlan !== 'starter') return null

  return (
    <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
      Recurso disponível no plano Pro/Team. Faça upgrade para gerar cartas de apresentação com IA.
    </div>
  )
}


