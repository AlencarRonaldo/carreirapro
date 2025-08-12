"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { API_BASE, fetchWithAuth } from "@/lib/api"

export default function DocumentEditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [versions, setVersions] = useState<{ id: string; createdAt: string }[]>([])
  const [templates, setTemplates] = useState<{ key: string; name: string; atsReady?: boolean }[]>([])
  const [templateKey, setTemplateKey] = useState("plain-default")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [tplPreviewHtml, setTplPreviewHtml] = useState<string | null>(null)
  const [tplPreviewWarnings, setTplPreviewWarnings] = useState<string[]>([])
  const [tplPreviewLoading, setTplPreviewLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/documents/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const d = await res.json()
        setTitle(d.title ?? "")
        setContent(d.content ?? "")
        setTemplateKey(d.templateKey ?? 'plain-default')
        // load versions
        const v = await fetchWithAuth(`${API_BASE}/documents/${id}/versions`).then(r=>r.ok?r.json():[])
        setVersions(Array.isArray(v) ? v : [])
        const [t, c] = await Promise.all([
          fetchWithAuth(`${API_BASE}/documents/templates/list`).then(r=>r.ok?r.json():[]),
          fetchWithAuth(`${API_BASE}/documents/templates/custom`).then(r=>r.ok?r.json():[]),
        ])
        const simple = Array.isArray(t) ? t : []
        const custom = Array.isArray(c) ? c.map((x:any)=>({ key: x.key, name: `${x.name ?? x.key} (Custom)` })) : []
        setTemplates([...simple, ...custom])
      } catch (e: any) {
        toast.error(e?.message ?? "Erro ao carregar documento")
      }
    })()
  }, [id])

  async function onSave() {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success("Conteúdo salvo")
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao salvar")
    } finally {
      setLoading(false)
    }
  }

  // autosave a cada 2s após pausa de digitação
  useEffect(() => {
    if (!id) return
    const h = setTimeout(async ()=>{
      try {
        setSaving(true)
        await fetchWithAuth(`${API_BASE}/documents/${id}/content`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        })
      } catch {}
      finally { setSaving(false) }
    }, 2000)
    return () => clearTimeout(h)
  }, [id, content])

  async function onRestore(versionId: string) {
    if (!id) return
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}/versions/${versionId}/restore`, { method: "POST" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      setContent(d.content ?? "")
      toast.success("Versão restaurada")
      const v = await fetchWithAuth(`${API_BASE}/documents/${id}/versions`).then(r=>r.ok?r.json():[])
      setVersions(Array.isArray(v) ? v : [])
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao restaurar")
    }
  }

  async function onExport() {
    if (!id) return
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}/export.pdf`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      if (!blob || (blob as any).size === 0) {
        throw new Error('PDF vazio')
      }
      const url = URL.createObjectURL(blob)
      const win = window.open(url, '_blank')
      if (!win) {
        const a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.rel = 'noopener'
        a.download = `${title || 'documento'}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
      setTimeout(() => URL.revokeObjectURL(url), 15000)
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao exportar PDF')
    }
  }

  async function onPreview() {
    if (!id) return
    try {
      const res = await fetchWithAuth(`${API_BASE}/documents/${id}/export.pdf`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      if (!blob || (blob as any).size === 0) throw new Error('PDF vazio')
      const url = URL.createObjectURL(blob)
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      setPdfUrl(url)
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao gerar preview')
    }
  }

  async function onAiSuggest() {
    try {
      setAiLoading(true)
      const res = await fetchWithAuth(`${API_BASE}/ai/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Desenvolvedor', context: content?.slice(0, 300) }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : [])
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao obter sugestões')
    } finally {
      setAiLoading(false)
    }
  }

  async function onTemplatePreview() {
    if (!id) return
    try {
      setTplPreviewLoading(true)
      setTplPreviewWarnings([])
      setTplPreviewHtml(null)
      const res = await fetchWithAuth(`${API_BASE}/documents/templates/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, templateKey, contentOverride: content }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setTplPreviewHtml(data?.html ?? null)
      setTplPreviewWarnings(Array.isArray(data?.warnings) ? data.warnings : [])
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao gerar preview do template')
    } finally {
      setTplPreviewLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      <Toaster />
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => router.push('/documents')}>Voltar</Button>
        <h1 className="text-xl font-semibold truncate">{title || "Documento"}</h1>
        <div className="ml-auto flex gap-2">
          <select className="border rounded px-2 py-2 text-sm" value={templateKey} onChange={async (e)=>{
            const key = e.target.value
            setTemplateKey(key)
            await fetchWithAuth(`${API_BASE}/documents/${id}/template`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateKey: key }) })
          }}>
            {templates.map(t => (
              <option key={t.key} value={t.key}>{t.name}{t.atsReady ? ' • ATS' : ''}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={onTemplatePreview} disabled={tplPreviewLoading}>{tplPreviewLoading ? 'Gerando preview...' : 'Preview do Template'}</Button>
          <Button variant="outline" onClick={onExport}>Exportar PDF</Button>
          <Button onClick={onSave} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </div>
      <section className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground leading-relaxed space-y-2">
        <p><strong className="text-foreground">Como aproveitar melhor:</strong> escreva o texto base e escolha um template para aplicar um layout pronto. Ao exportar/preview, as chaves do template serão trocadas pelos seus dados.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-foreground">Exportar</strong>: baixe o PDF; <strong className="text-foreground">Preview</strong>: visualize aqui na página.</li>
          <li><strong className="text-foreground">Autosave</strong>: salva após ~2s sem digitar; use “Salvar” para gravar na hora.</li>
          <li><strong className="text-foreground">Versões</strong>: cada atualização cria uma versão; restaure quando quiser.</li>
          <li><strong className="text-foreground">Sugestões (IA)</strong>: gere frases de impacto e insira no texto com um clique.</li>
        </ul>
      </section>
      <div className="text-xs text-muted-foreground">{saving ? "Salvando..." : ""}</div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[65vh] rounded-md border px-3 py-2"
        placeholder="Escreva o conteúdo do documento aqui..."
      />

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Preview do PDF</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={onPreview}>Atualizar preview</Button>
          <Button size="sm" onClick={onExport}>Abrir em nova guia</Button>
        </div>
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-[600px] border rounded" />
        ) : (
          <div className="text-sm text-muted-foreground">Gere o preview para visualizar aqui.</div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Preview do Template (HTML)</h2>
        {tplPreviewWarnings.length > 0 && (
          <div className="text-xs text-amber-600">Placeholders desconhecidos: {tplPreviewWarnings.join(', ')}</div>
        )}
        {tplPreviewHtml ? (
          <iframe className="w-full h-[480px] border rounded" srcDoc={tplPreviewHtml} />
        ) : (
          <div className="text-sm text-muted-foreground">Clique em "Preview do Template" para ver o layout HTML renderizado com seus dados.</div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Sugestões de Escrita (IA)</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onAiSuggest} disabled={aiLoading}>{aiLoading ? 'Gerando...' : 'Gerar sugestões'}</Button>
        </div>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="border rounded p-2 text-sm flex items-start gap-2">
              <span className="flex-1">{s}</span>
              <Button size="sm" variant="secondary" onClick={()=> setContent(prev => (prev ? (prev + '\n' + s) : s))}>Inserir</Button>
            </li>
          ))}
          {suggestions.length === 0 && <li className="text-sm text-muted-foreground">Nenhuma sugestão ainda.</li>}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Versões anteriores</h2>
        <ul className="space-y-1">
          {versions.map(v => (
            <li key={v.id} className="flex items-center justify-between border rounded p-2 text-sm">
              <span>{new Date(v.createdAt).toLocaleString()}</span>
              <Button size="sm" variant="secondary" onClick={()=>onRestore(v.id)}>Restaurar</Button>
            </li>
          ))}
          {versions.length === 0 && <li className="text-muted-foreground text-sm">Sem versões ainda.</li>}
        </ul>
      </section>
    </main>
  )
}


