'use client'

import { useState } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { BUSINESS } from '@/lib/business'

const SUBJECTS = ['Dúvida sobre um produto', 'Encomenda já feita', 'Devolução ou troca', 'Pedido especial ou oferta', 'Parcerias', 'Outro']

export default function ContactForm() {
  const [f, setF] = useState({ nome: '', assunto: SUBJECTS[0], encomenda: '', mensagem: '' })
  const [error, setError] = useState('')
  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((v) => ({ ...v, [e.target.name]: e.target.value })); setError('')
  }

  const text = () => [
    `Olá RedVelvet! Sou ${f.nome.trim()}.`,
    `Assunto: ${f.assunto}`,
    f.encomenda.trim() ? `Encomenda: ${f.encomenda.trim()}` : '',
    '',
    f.mensagem.trim(),
  ].filter((l, i) => l !== '' || i === 3).join('\n')

  const valid = () => {
    if (!f.nome.trim() || f.mensagem.trim().length < 5) { setError('Indique o seu nome e escreva a mensagem.'); return false }
    return true
  }

  const viaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid()) return
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text())}`, '_blank', 'noopener,noreferrer')
  }
  const viaEmail = () => {
    if (!valid()) return
    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`${f.assunto} — ${f.nome.trim()}`)}&body=${encodeURIComponent(text())}`
  }

  const showOrder = f.assunto === 'Encomenda já feita' || f.assunto === 'Devolução ou troca'

  return (
    <form onSubmit={viaWhatsApp} noValidate className="rounded-[24px] bg-white p-6 md:p-9">
      <h2 className="font-serif text-[26px] font-normal text-[#1c1012]">Ou escreva-nos aqui</h2>
      <p className="mt-2 text-[14.5px] text-[#6b5a5c]">Preparamos a mensagem; depois envia-a pelo WhatsApp ou por email.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="c-nome" className="rv-label">Nome</label>
          <input id="c-nome" name="nome" value={f.nome} onChange={set} autoComplete="name" className="rv-input" />
        </div>
        <div>
          <label htmlFor="c-assunto" className="rv-label">Assunto</label>
          <select id="c-assunto" name="assunto" value={f.assunto} onChange={set} className="rv-input">
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        {showOrder && (
          <div className="md:col-span-2">
            <label htmlFor="c-encomenda" className="rv-label">N.º da encomenda (opcional)</label>
            <input id="c-encomenda" name="encomenda" value={f.encomenda} onChange={set} placeholder="RV-261111-AB12C" className="rv-input" />
          </div>
        )}
        <div className="md:col-span-2">
          <label htmlFor="c-mensagem" className="rv-label">Mensagem</label>
          <textarea id="c-mensagem" name="mensagem" value={f.mensagem} onChange={set} rows={5} maxLength={1500} className="rv-input resize-y" placeholder="Como podemos ajudar?" />
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-[13px] text-redvelvet-600">{error}</p>}
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <button type="submit" className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#210a0f] text-[15px] font-medium text-[#f7efe9] transition-colors hover:bg-[#3a1219]">
          <MessageCircle size={17} /> Continuar no WhatsApp
        </button>
        <button type="button" onClick={viaEmail} className="flex h-14 items-center justify-center gap-2 rounded-full border border-[#1c1012]/20 px-6 text-[15px] text-[#1c1012] transition-colors hover:bg-[#1c1012]/5">
          <Mail size={17} /> Enviar por email
        </button>
      </div>
    </form>
  )
}
