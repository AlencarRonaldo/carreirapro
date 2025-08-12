"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { API_BASE, fetchWithAuth } from "@/lib/api"

type Doc = { id: string; title: string; createdAt?: string; updatedAt?: string; isArchived?: boolean }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [title, setTitle] = useState("")
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")
  const [includeArchived, setIncludeArchived] = useState(false)
  const [sort, setSort] = useState<"updated"|"title">("updated")

  async function load() {
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents?all=${includeArchived}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Falha ao listar documentos")
      setDocs(await res.json())
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao carregar documentos")
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeArchived])

  async function onCreate() {
    if (!title.trim()) return
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error("Falha ao criar documento")
      setTitle("")
      await load()
      toast.success("Documento criado")
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao criar")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir este documento?")) return
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Falha ao excluir")
      await load()
      toast.success("Documento excluído")
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao excluir")
    } finally {
      setLoading(false)
    }
  }

  async function onRename(id: string) {
    if (!renameTitle.trim()) return
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renameTitle }),
      })
      if (!res.ok) throw new Error("Falha ao renomear")
      setRenamingId(null)
      setRenameTitle("")
      await load()
      toast.success("Documento renomeado")
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao renomear")
    } finally {
      setLoading(false)
    }
  }

  async function onArchive(id: string, archived: boolean) {
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}/${archived ? 'archive' : 'unarchive'}`, { method: 'POST' })
      if (!res.ok) throw new Error("Falha ao alterar status")
      await load()
      toast.success(archived ? "Documento arquivado" : "Documento restaurado")
    } catch (e: any) {
      toast.error(e.message ?? "Erro")
    } finally {
      setLoading(false)
    }
  }

  async function onDuplicate(id: string) {
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error("Falha ao duplicar")
      await load()
      toast.success("Documento duplicado")
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao duplicar")
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let list = [...docs]
    if (q.trim()) {
      const needle = q.toLowerCase()
      list = list.filter(d => d.title.toLowerCase().includes(needle))
    }
    if (sort === 'title') list.sort((a,b)=> (a.title||'').localeCompare(b.title||''))
    else list.sort((a,b)=> (b.updatedAt||'').localeCompare(a.updatedAt||''))
    return list
  }, [docs, q, sort])

  useEffect(() => {
    const saved = localStorage.getItem('cp_docs_prefs')
    if (saved) {
      try {
        const prefs = JSON.parse(saved)
        if (typeof prefs.q === 'string') setQ(prefs.q)
        if (typeof prefs.includeArchived === 'boolean') setIncludeArchived(prefs.includeArchived)
        if (prefs.sort === 'title' || prefs.sort === 'updated') setSort(prefs.sort)
      } catch {}
    }
  }, [])

  useEffect(() => {
    const prefs = { q, includeArchived, sort }
    localStorage.setItem('cp_docs_prefs', JSON.stringify(prefs))
  }, [q, includeArchived, sort])

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <Toaster />
      <h1 className="text-2xl font-semibold">Meus Currículos</h1>
      <p className="text-sm text-muted-foreground">Aqui ficam os currículos que você gerou. Você pode baixar em PDF novamente a qualquer momento.</p>

      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por título" className="border rounded px-3 py-2" />
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={includeArchived} onChange={(e)=>setIncludeArchived(e.target.checked)} /> Incluir arquivados</label>
        <select className="border rounded px-2 py-2 text-sm" value={sort} onChange={(e)=>setSort(e.target.value as any)}>
          <option value="updated">Atualizados recentemente</option>
          <option value="title">Título (A→Z)</option>
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome do currículo (ex.: Currículo TI 2025)" className="border rounded px-3 py-2 w-full max-w-md" />
        <Button onClick={onCreate} disabled={loading}>Criar currículo</Button>
      </div>

      <ul className="space-y-2">
        {filtered.map((d) => (
          <li key={d.id} className="border rounded p-3 flex items-center gap-3">
            {renamingId === d.id ? (
              <>
                <input
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                />
                <Button variant="secondary" onClick={() => setRenamingId(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => onRename(d.id)} disabled={loading}>
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <a href={`/documents/${d.id}`} className="flex-1">
                  <div className="font-medium hover:underline">{d.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.updatedAt ? new Date(d.updatedAt).toLocaleString() : ""}
                    {d.isArchived ? " • Arquivado" : ""}
                  </div>
                </a>
                <Button variant="secondary" onClick={() => { setRenamingId(d.id); setRenameTitle(d.title) }}>
                  Renomear
                </Button>
                <Button variant="secondary" onClick={()=>onDuplicate(d.id)}>
                  Duplicar
                </Button>
                <a href="#" onClick={async (ev)=>{ ev.preventDefault(); try{ const r = await fetchWithAuth(`${API_BASE}/documents/${d.id}/export.pdf`); if(!r.ok) throw new Error(`HTTP ${r.status}`); const b=await r.blob(); const url=URL.createObjectURL(b); const a=document.createElement('a'); a.href=url; a.download=`${d.title||'curriculo'}.pdf`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 15000);} catch(e:any){ toast.error(e?.message||'Falha ao baixar'); } }} className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm">Baixar PDF</a>
                <Button variant="secondary" onClick={()=>onArchive(d.id, !d.isArchived)}>
                  {d.isArchived ? "Desarquivar" : "Arquivar"}
                </Button>
                <Button variant="destructive" onClick={() => onDelete(d.id)} disabled={loading}>
                  Excluir
                </Button>
              </>
            )}
          </li>
        ))}
        {docs.length === 0 && <div className="text-sm text-muted-foreground">Nenhum documento ainda.</div>}
      </ul>
    </main>
  )
}


