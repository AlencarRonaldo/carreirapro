"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { API_BASE, fetchWithAuth } from "@/lib/api"

type AppItem = {
  id: string
  company: string
  title: string
  jobUrl?: string | null
  notes?: string | null
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected'
}

export default function ApplicationsPage() {
  const [items, setItems] = useState<AppItem[]>([])
  const [summary, setSummary] = useState<{ total: number; saved: number; applied: number; interview: number; offer: number; rejected: number } | null>(null)
  const [filter, setFilter] = useState<AppItem['status'] | 'all'>('all')
  const [company, setCompany] = useState("")
  const [title, setTitle] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [status, setStatus] = useState<AppItem['status']>('saved')
  const [loading, setLoading] = useState(false)

  async function load() {
    try {
      const res = await fetchWithAuth(`${API_BASE}/applications${filter==='all' ? '' : `?status=${filter}`}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao listar')
      setItems(await res.json())
      const m = await fetchWithAuth(`${API_BASE}/applications/metrics/summary`).then(r=>r.ok?r.json():null)
      if (m) setSummary(m)
    } catch (e: any) {
      toast.error(e?.message ?? 'Erro ao carregar')
    }
  }

  useEffect(() => { load() }, [filter])

  async function onCreate() {
    if (!company.trim() || !title.trim()) return
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, title, jobUrl: jobUrl || undefined, status }),
      })
      if (!res.ok) throw new Error('Falha ao criar')
      setCompany("")
      setTitle("")
      setJobUrl("")
      setStatus('saved')
      await load()
      toast.success('Aplicação criada')
    } catch (e: any) {
      toast.error(e?.message ?? 'Erro ao criar')
    } finally { setLoading(false) }
  }

  async function onUpdate(id: string, data: Partial<AppItem>) {
    try {
      const res = await fetchWithAuth(`${API_BASE}/applications/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Falha ao atualizar')
      await load()
    } catch (e: any) { toast.error(e?.message ?? 'Erro ao atualizar') }
  }

  async function onDelete(id: string) {
    if (!confirm('Excluir esta aplicação?')) return
    try {
      const res = await fetchWithAuth(`${API_BASE}/applications/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir')
      await load()
      toast.success('Excluída')
    } catch (e: any) { toast.error(e?.message ?? 'Erro ao excluir') }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <Toaster />
      <h1 className="text-2xl font-semibold">Minhas Aplicações</h1>

      {summary && (
        <section className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-sm">
          <div className="border rounded p-2"><div className="text-xs text-muted-foreground">Total</div><div className="font-semibold">{summary.total}</div></div>
          <div className="border rounded p-2"><div className="text-xs text-muted-foreground">Salva</div><div className="font-semibold">{summary.saved}</div></div>
          <div className="border rounded p-2"><div className="text-xs text-muted-foreground">Aplicada</div><div className="font-semibold">{summary.applied}</div></div>
          <div className="border rounded p-2"><div className="text-xs text-muted-foreground">Entrevista</div><div className="font-semibold">{summary.interview}</div></div>
          <div className="border rounded p-2"><div className="text-xs text-muted-foreground">Oferta</div><div className="font-semibold">{summary.offer}</div></div>
          <div className="border rounded p-2"><div className="text-xs text-muted-foreground">Recusada</div><div className="font-semibold">{summary.rejected}</div></div>
        </section>
      )}

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e)=>setFilter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
            <option value="all">Todas</option>
            <option value="saved">Salvas</option>
            <option value="applied">Aplicadas</option>
            <option value="interview">Entrevistas</option>
            <option value="offer">Ofertas</option>
            <option value="rejected">Recusadas</option>
          </select>
          <a href={`${API_BASE}/applications/export.csv${filter==='all' ? '' : `?status=${filter}`}`} className="text-sm underline">Exportar CSV</a>
          <a href={`${API_BASE}/applications/export.pdf${filter==='all' ? '' : `?status=${filter}`}`} className="text-sm underline">Exportar PDF</a>
        </div>
        <div className="grid md:grid-cols-4 gap-2">
          <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Empresa" className="border rounded px-3 py-2" />
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Título" className="border rounded px-3 py-2" />
          <input value={jobUrl} onChange={(e)=>setJobUrl(e.target.value)} placeholder="URL da vaga (opcional)" className="border rounded px-3 py-2" />
          <select value={status} onChange={(e)=>setStatus(e.target.value as any)} className="border rounded px-3 py-2">
            <option value="saved">Salva</option>
            <option value="applied">Aplicada</option>
            <option value="interview">Entrevista</option>
            <option value="offer">Oferta</option>
            <option value="rejected">Recusada</option>
          </select>
        </div>
        <Button onClick={onCreate} disabled={loading}>{loading ? 'Adicionando...' : 'Adicionar'}</Button>
      </section>

      <section>
        <ul className="space-y-2">
          {items.map(i => (
            <li key={i.id} className="border rounded p-3 flex flex-col gap-2 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="font-medium">{i.company} — {i.title}</div>
                {i.jobUrl && <a className="text-sm text-blue-600 underline" href={i.jobUrl} target="_blank" rel="noreferrer">Abrir vaga</a>}
                {i.notes && <div className="text-xs text-muted-foreground">{i.notes}</div>}
              </div>
              <select value={i.status} onChange={(e)=>onUpdate(i.id, { status: e.target.value as any })} className="border rounded px-2 py-1 text-sm">
                <option value="saved">Salva</option>
                <option value="applied">Aplicada</option>
                <option value="interview">Entrevista</option>
                <option value="offer">Oferta</option>
                <option value="rejected">Recusada</option>
              </select>
              <Button variant="destructive" onClick={()=>onDelete(i.id)}>Excluir</Button>
            </li>
          ))}
          {items.length === 0 && <li className="text-sm text-muted-foreground">Sem aplicações ainda.</li>}
        </ul>
      </section>
    </main>
  )
}


