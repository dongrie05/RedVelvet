'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthShell, { authBtn } from '@/components/auth/AuthShell'
import { authErrorPt } from '@/lib/authErrors'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Email inválido.'); return }
    setIsLoading(true); setError('')
    const { error } = await resetPassword(email.trim())
    // Por privacidade, não revelamos se o email existe: só mostramos erros de limite/ligação
    if (error && /rate|too many|security|fetch|network/i.test(error.message)) setError(authErrorPt(error.message))
    else setSent(true)
    setIsLoading(false)
  }

  return (
    <AuthShell eyebrow="Conta" title="Recuperar" accent="acesso."
      intro={sent ? undefined : 'Indique o email da sua conta. Enviamos um link para criar uma nova palavra-passe.'}>
      {sent ? (
        <div className="rounded-[20px] bg-white p-6">
          <MailCheck size={26} className="text-redvelvet-500" />
          <p className="mt-4 text-[15px] leading-relaxed text-[#1c1012]/85">
            Se existir uma conta com <strong className="font-medium text-[#1c1012]">{email.trim()}</strong>, vai receber um email com o link nos próximos minutos.
          </p>
          <p className="mt-3 text-sm text-[#6b5a5c]">Veja também a pasta de spam.</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="rv-label">Email</label>
            <input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} className="rv-input" placeholder="nome@email.com" />
          </div>
          {error && <div role="alert" className="rounded-xl border border-[#f5c2c9] bg-[#fdecee] p-3.5 text-sm text-[#8a1c2b]">{error}</div>}
          <button type="submit" disabled={isLoading} className={`${authBtn} !mt-6`}>
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> A enviar…</> : 'Enviar link'}
          </button>
        </form>
      )}
      <Link href="/auth/login/" className="mt-8 inline-flex items-center gap-1.5 text-sm text-[#6b5a5c] hover:text-[#1c1012]">
        <ArrowLeft size={14} /> Voltar a iniciar sessão
      </Link>
    </AuthShell>
  )
}
