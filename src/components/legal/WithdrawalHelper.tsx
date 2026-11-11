'use client'

import { useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { BUSINESS } from '@/lib/business'

/** Preenche o modelo de formulário de livre resolução e envia por email / copia. */
export default function WithdrawalHelper() {
  const [f, setF] = useState({ nome: '', morada: '', encomenda: '', artigos: '', recebido: '' })
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setF((v) => ({ ...v, [e.target.name]: e.target.value })); setError('') }

  const text = () => [
    `Para: ${BUSINESS.legalName}, ${BUSINESS.address}, ${BUSINESS.email}`,
    '',
    `Pelo presente comunico que resolvo o meu contrato de compra e venda do(s) seguinte(s) bem(ns): ${f.artigos.trim()}`,
    `Encomenda n.º: ${f.encomenda.trim() || '—'}`,
    `Recebido em: ${f.recebido ? new Date(f.recebido).toLocaleDateString('pt-PT') : '—'}`,
    `Nome do consumidor: ${f.nome.trim()}`,
    `Endereço do consumidor: ${f.morada.trim()}`,
    `Data: ${new Date().toLocaleDateString('pt-PT')}`,
  ].join('\n')

  const valid = () => {
    if (!f.nome.trim() || !f.artigos.trim()) { setError('Indique pelo menos o seu nome e os artigos a devolver.'); return false }
    return true
  }
  const email = () => {
    if (!valid()) return
    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Livre resolução${f.encomenda ? ' — ' + f.encomenda.trim() : ''}`)}&body=${encodeURIComponent(text())}`
  }
  const copy = async () => {
    if (!valid()) return
    try { await navigator.clipboard.writeText(text()); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <div className="rounded-[24px] bg-white p-6 md:p-8">
      <p className="font-serif text-[22px] text-[#1c1012]">Preencher e enviar</p>
      <p className="mt-1.5 text-sm text-[#6b5a5c]">Preenchemos o formulário por si; depois envia-o do seu email (fica com prova do envio).</p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="w-nome" className="rv-label">Nome</label><input id="w-nome" name="nome" value={f.nome} onChange={set} autoComplete="name" className="rv-input" /></div>
        <div><label htmlFor="w-enc" className="rv-label">N.º da encomenda</label><input id="w-enc" name="encomenda" value={f.encomenda} onChange={set} placeholder="RV-261111-AB12C" className="rv-input" /></div>
        <div className="md:col-span-2"><label htmlFor="w-morada" className="rv-label">Morada</label><input id="w-morada" name="morada" value={f.morada} onChange={set} autoComplete="street-address" className="rv-input" /></div>
        <div className="md:col-span-2"><label htmlFor="w-art" className="rv-label">Artigos a devolver</label><textarea id="w-art" name="artigos" value={f.artigos} onChange={set} rows={3} className="rv-input" placeholder="Ex.: Casaco Bouclé Carmim, tamanho M" /></div>
        <div><label htmlFor="w-rec" className="rv-label">Data de receção</label><input id="w-rec" name="recebido" type="date" value={f.recebido} onChange={set} className="rv-input" /></div>
      </div>
      {error && <p role="alert" className="mt-3 text-[13px] text-redvelvet-600">{error}</p>}
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <button type="button" onClick={email} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#210a0f] px-6 text-[15px] font-medium text-[#f7efe9] hover:bg-[#3a1219]">
          <Mail size={16} /> Enviar por email
        </button>
        <button type="button" onClick={copy} className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#1c1012]/20 px-6 text-[15px] text-[#1c1012] hover:bg-[#1c1012]/5">
          {copied ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar texto</>}
        </button>
      </div>
    </div>
  )
}
