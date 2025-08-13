"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { API_BASE, fetchWithAuth } from "@/lib/api"

type Analysis = {
  id: string
  company: string
  title: string
  requiredSkills: string[]
  responsibilities: string[]
  keywords: string[]
}

type ScoreResult = {
  score?: number
  strengths?: string[]
  weaknesses?: string[]
  missingKeywords?: string[]
}

type DocumentItem = { id: string; title: string }

export default function JobsPage() {
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [genLoading, setGenLoading] = useState(false)
  const [tone, setTone] = useState("profissional")
  const [language, setLanguage] = useState("português")
  const [generated, setGenerated] = useState<{ content: string; qualityScore?: any } | null>(null)
  const [optLoading, setOptLoading] = useState(false)
  const [optDocId, setOptDocId] = useState<string | null>(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [score, setScore] = useState<ScoreResult | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [selectedDocId, setSelectedDocId] = useState<string>("")

  async function onAnalyze() {
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/jobs/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url || undefined, description: description || undefined }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setAnalysis(data)
      toast.success('Vaga analisada')
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha na análise')
    } finally {
      setLoading(false)
    }
  }

  async function onGenerateCoverLetter() {
    if (!analysis) return
    setGenLoading(true)
    try {
      const profileRes = await fetchWithAuth(`${API_BASE}/profile`)
      if (!profileRes.ok) throw new Error(`HTTP ${profileRes.status}`)
      const profile = await profileRes.json()
      const res = await fetchWithAuth(`${API_BASE}/cover-letters/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileData: profile, jobAnalysis: analysis, tone, language }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setGenerated({ content: data?.content ?? '', qualityScore: data?.qualityScore })
      toast.success('Carta gerada')
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao gerar carta')
    } finally {
      setGenLoading(false)
    }
  }

  async function onOptimizeResume() {
    if (!analysis) return
    setOptLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/jobs/optimize-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, documentId: selectedDocId || undefined, createIfMissing: !selectedDocId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setOptDocId(data?.documentId ?? null)
      toast.success('Currículo otimizado')
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao otimizar currículo')
    } finally {
      setOptLoading(false)
    }
  }

  async function calculateScoreAutomatically(a: Analysis) {
    setScoreLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/jobs/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: a }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setScore(data as ScoreResult)
    } catch (e: any) {
      setScore(null)
      toast.error(e?.message ?? 'Falha ao calcular score')
    } finally {
      setScoreLoading(false)
    }
  }

  async function onSaveAnalysis() {
    if (!analysis) return
    setSaveLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/jobs/save-analysis`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ analysis, url })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success('Análise salva')
    } catch (e: any) { toast.error(e?.message ?? 'Falha ao salvar análise') }
    finally { setSaveLoading(false) }
  }

  // calcula automaticamente o score quando houver uma nova análise
  useEffect(() => {
    if (analysis) {
      calculateScoreAutomatically(analysis)
    } else {
      setScore(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis])

  // carregar lista de documentos disponíveis (não arquivados)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/documents`)
        if (!res.ok) return
        const list = await res.json()
        const docs = Array.isArray(list) ? list.map((d: any) => ({ id: d.id, title: d.title })) : []
        setDocuments(docs)
      } catch {}
    })()
  }, [])

  async function onSaveAsApplication() {
    if (!analysis) return
    try {
      const payload = { company: analysis.company, title: analysis.title, jobUrl: url || undefined, status: 'saved' as const }
      const res = await fetchWithAuth(`${API_BASE}/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success('Aplicação criada a partir da análise')
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao criar aplicação')
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <Toaster />
      <h1 className="text-2xl font-semibold">Análise de Vagas</h1>

      <section className="space-y-3">
        <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="URL da vaga (opcional)" className="border rounded px-3 py-2 w-full" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Cole a descrição da vaga aqui" className="border rounded px-3 py-2 w-full min-h-[160px]" />
        <div className="flex items-center gap-3">
          <Button onClick={onAnalyze} disabled={loading}>{loading ? 'Analisando...' : 'Analisar Vaga'}</Button>
        </div>
      </section>

      {analysis && (
        <section className="space-y-2 border rounded p-3">
          <div className="text-sm text-muted-foreground">ID: {analysis.id}</div>
          <div><strong>Empresa:</strong> {analysis.company}</div>
          <div><strong>Título:</strong> {analysis.title}</div>
          <div><strong>Habilidades:</strong> {analysis.requiredSkills.join(', ')}</div>
          <div><strong>Responsabilidades:</strong> {analysis.responsibilities.join(', ')}</div>
          <div><strong>Keywords:</strong> {analysis.keywords.join(', ')}</div>
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            {documents.length > 0 && (
              <select className="border rounded px-2 py-1 text-sm" value={selectedDocId} onChange={(e)=>setSelectedDocId(e.target.value)}>
                <option value="">Selecionar currículo (opcional)</option>
                {documents.map((d)=> (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            )}
            <select className="border rounded px-2 py-1 text-sm" value={tone} onChange={(e)=>setTone(e.target.value)}>
              <option value="profissional">profissional</option>
              <option value="entusiasta">entusiasta</option>
              <option value="confiante">confiante</option>
            </select>
            <select className="border rounded px-2 py-1 text-sm" value={language} onChange={(e)=>setLanguage(e.target.value)}>
              <option value="português">português</option>
              <option value="inglês">inglês</option>
              <option value="espanhol">espanhol</option>
            </select>
            <Button onClick={onGenerateCoverLetter} disabled={genLoading}>{genLoading ? 'Gerando...' : 'Gerar Carta'}</Button>
            <Button variant="secondary" onClick={onOptimizeResume} disabled={optLoading}>{optLoading ? 'Otimizando...' : 'Otimizar Currículo'}</Button>
            {optDocId && (
              <a href={`/documents/${optDocId}`} className="text-sm underline">Abrir documento otimizado</a>
            )}
            {/* Score é calculado automaticamente ao obter a análise */}
            <Button variant="ghost" onClick={onSaveAnalysis} disabled={saveLoading}>{saveLoading ? 'Salvando...' : 'Salvar Análise'}</Button>
            <Button variant="ghost" onClick={onSaveAsApplication}>Salvar como Aplicação</Button>
          </div>
          {score && (
            <div className="mt-3 space-y-2">
              <div className="text-sm font-medium">Compatibilidade</div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-green-500 h-2 rounded" style={{ width: `${Math.max(0, Math.min(100, score.score ?? 0))}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">Score: {Math.round(score.score ?? 0)}%</div>
              {Array.isArray(score.missingKeywords) && score.missingKeywords.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium">Keywords faltantes</div>
                  <div className="flex flex-wrap gap-2">
                    {score.missingKeywords.map((k, i) => (
                      <span key={i} className="text-xs bg-amber-100 border border-amber-300 text-amber-800 rounded px-2 py-0.5">{k}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-sm">Pontos Fortes</div>
                  <ul className="list-disc pl-5 text-sm">
                    {(score.strengths ?? []).map((s, i) => <li key={i}>{s}</li>)}
                    {(!score.strengths || score.strengths.length === 0) && <li className="text-muted-foreground">—</li>}
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-sm">Pontos a Melhorar</div>
                  <ul className="list-disc pl-5 text-sm">
                    {(score.weaknesses ?? []).map((s, i) => <li key={i}>{s}</li>)}
                    {(!score.weaknesses || score.weaknesses.length === 0) && <li className="text-muted-foreground">—</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {generated && (
        <section className="space-y-2 border rounded p-3">
          <h2 className="text-sm font-medium">Carta Gerada</h2>
          <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded">{generated.content}</pre>
          {generated.qualityScore && (
            <div className="text-sm text-muted-foreground">Score: {generated.qualityScore.score}</div>
          )}
        </section>
      )}
    </main>
  )
}


