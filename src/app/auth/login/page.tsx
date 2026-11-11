'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthShell, { authBtn } from '@/components/auth/AuthShell'
import PasswordInput from '@/components/auth/PasswordInput'
import { authErrorPt } from '@/lib/authErrors'

function safeNext(v: string | null) {
  return v && v.startsWith('/') && !v.startsWith('//') ? v : '/account/'
}

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNext(params.get('next'))
  const confirmed = params.get('confirmed') === '1'
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) { setError('Indique o email e a palavra-passe.'); return }
    setIsLoading(true)
    setError('')
    try {
      const { data, error } = await signIn(email.trim(), password)
      if (error) setError(authErrorPt(error.message))
      else if (data.user) { router.push(next); return }
    } catch (err) {
      setError(authErrorPt(err instanceof Error ? err.message : ''))
    }
    setIsLoading(false)
  }

  return (
    <AuthShell
      eyebrow="Conta"
      title="Olá"
      accent="de novo."
      intro={<>Ainda não tem conta? <Link href={`/auth/register/${next !== '/account/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-[#1c1012] underline underline-offset-4">Criar conta</Link></>}
    >
      {confirmed && (
        <div role="status" className="mb-6 flex gap-2.5 rounded-xl border border-[#cfe5d6] bg-[#eef7f1] p-3.5 text-sm text-[#22603b]">
          <CheckCircle2 size={18} className="shrink-0" /> Email confirmado. Já pode iniciar sessão.
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="rv-label">Email</label>
          <input id="email" type="email" inputMode="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }} className="rv-input" placeholder="nome@email.com" />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="rv-label">Palavra-passe</label>
            <Link href="/auth/forgot-password/" className="text-[13px] text-[#6b5a5c] underline-offset-4 hover:text-[#1c1012] hover:underline">
              Esqueceu-se?
            </Link>
          </div>
          <PasswordInput id="password" autoComplete="current-password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }} />
        </div>
        {error && <div role="alert" className="rounded-xl border border-[#f5c2c9] bg-[#fdecee] p-3.5 text-sm text-[#8a1c2b]">{error}</div>}
        <button type="submit" disabled={isLoading} className={`${authBtn} !mt-6`}>
          {isLoading ? <><Loader2 size={16} className="animate-spin" /> A entrar…</> : 'Iniciar sessão'}
        </button>
      </form>
      <p className="mt-8 border-t border-[#1c1012]/[.1] pt-6 text-sm leading-relaxed text-[#6b5a5c]">
        Não precisa de conta para comprar: pode finalizar a encomenda como convidado.{' '}
        <Link href="/shop/" className="text-[#1c1012] underline underline-offset-4">Ver a loja</Link>
      </p>
    </AuthShell>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
