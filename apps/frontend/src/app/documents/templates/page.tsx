"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { API_BASE, fetchWithAuth } from "@/lib/api"

type Template = { key: string; name?: string; body?: string; html?: string }
type SimpleTpl = { key: string; name: string; atsReady?: boolean; premium?: boolean }

export default function TemplatesPage() {
  const router = useRouter()
  const [simple, setSimple] = useState<SimpleTpl[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [plan, setPlan] = useState<'starter'|'pro'|'team'|'unknown'>("unknown")

  async function load() {
    try {
      const [meRes, sRes] = await Promise.all([
        fetchWithAuth(`${API_BASE}/auth/me`),
        fetchWithAuth(`${API_BASE}/documents/templates/list`),
      ])
      if (meRes.status === 401 || sRes.status === 401) {
        toast.error('Sessão expirada, faça login novamente')
        router.push('/login')
        return
      }
      if (meRes.ok) {
        const me = await meRes.json().catch(()=>null)
        const p = (me?.plan as any) || 'starter'
        setPlan(p==='pro'||p==='team'||p==='starter'?p:'starter')
      }
      const s = sRes.ok ? await sRes.json().catch(()=>[]) : []
      setSimple(Array.isArray(s) ? s : [])
    } catch {
      toast.error('Falha ao carregar templates')
    }
  }

  useEffect(() => { load() }, [])

  async function loadPreview(key: string) {
    try {
      const tpl = simple.find(x=>x.key===key)
      if (tpl?.premium && plan==='starter') {
        toast.error('Template Pro. Faça upgrade para visualizar/exportar.')
        return
      }
      setPreviewLoading(true)
      setSelectedKey(key)
      setPreviewHtml(null)
      const res = await fetchWithAuth(`${API_BASE}/documents/templates/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateKey: key })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPreviewHtml(data?.html ?? null)
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao gerar preview')
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      <Toaster />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Modelos de Currículo</h1>
      </div>

      <section className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground leading-relaxed space-y-2">
        <p><strong className="text-foreground">O que é um modelo de currículo?</strong> É um layout pronto que monta seu currículo automaticamente com os dados do seu perfil (nome, headline, experiências, formações, habilidades, etc.).</p>
        <p><strong className="text-foreground">Como usar?</strong> Escolha um dos modelos abaixo para visualizar aqui em cima, baixar em PDF ou enviar pelo WhatsApp. Modelos marcados com <span className="text-green-700">• ATS</span> são compatíveis com sistemas de rastreamento.</p>
        <div className="mt-2">
          <p className="mb-1"><strong className="text-foreground">Pré-visualização do modelo selecionado:</strong></p>
          {previewLoading && <div className="text-xs">Gerando preview...</div>}
          {!previewLoading && previewHtml && (
            <iframe className="w-full h-[520px] border rounded bg-white" srcDoc={previewHtml} />
          )}
          {!previewLoading && !previewHtml && (
            <div className="text-xs">Selecione um modelo abaixo para visualizar aqui.</div>
          )}
          <div className="text-[11px] text-muted-foreground mt-3">
            {plan==='starter' ? (
              <span>Modelos com selo <span className="px-1 rounded bg-amber-100 text-amber-800">Pro</span> são exclusivos dos planos Pro/Team. Faça upgrade para desbloquear.</span>
            ) : (
              <span>Você possui acesso a modelos Pro. Aproveite os templates premium.</span>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Templates prontos (usam seu perfil automaticamente)</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {simple.map(t => (
            <li key={t.key} className={`border rounded p-3 flex items-center gap-3 ${selectedKey===t.key ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex-1">
                <button onClick={() => loadPreview(t.key)} className="font-medium underline-offset-2 hover:underline text-left">
                  {t.name} {t.atsReady ? <span className="text-xs text-green-700">• ATS</span> : null}
                  {t.premium ? <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 align-middle">Pro</span> : null}
                </button>
                <div className="text-xs text-muted-foreground">{t.key}</div>
              </div>
              {t.premium && plan==='starter' ? (
                <Button size="sm" onClick={()=>{ router.push('/checkout?plan=pro') }}>Fazer Upgrade</Button>
              ) : (
              <Button size="sm" variant="secondary" onClick={async ()=>{
                try {
                  const res = await fetchWithAuth(`${API_BASE}/documents/templates/export.pdf`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateKey: t.key })
                  })
                  if (!res.ok) throw new Error(`HTTP ${res.status}`)
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${t.key}.pdf`
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  setTimeout(()=>URL.revokeObjectURL(url), 15000)
                } catch (e:any) { toast.error(e?.message ?? 'Falha ao exportar') }
              }}>Baixar PDF</Button>
              )}
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Veja meu currículo: ' + (typeof window!=='undefined' ? window.location.origin : '') )}`}
                target="_blank"
                className="text-sm underline"
                rel="noreferrer"
              >Enviar WhatsApp</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}


