'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Loader2, MailCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthShell, { authBtn } from '@/components/auth/AuthShell'
import PasswordInput from '@/components/auth/PasswordInput'
import { authErrorPt } from '@/lib/authErrors'

const MIN = 8

function RegisterForm() {
  const params = useSearchParams()
  const next = params.get('next')
  const { signUp } = useAuth()
  const [f, setF] = useState({ nome: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<'nome' | 'email' | 'password', string>>>({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')

  const set = (e: React.ChangeEvent<HTMLInputElement>) => {
    setF((v) => ({ ...v, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: undefined })); setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const er: typeof errors = {}
    if (!f.nome.trim()) er.nome = 'Indique o seu nome'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) er.email = 'Email inválido'
    if (f.password.length < MIN) er.password = `Use pelo menos ${MIN} caracteres`
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) { document.getElementById(first)?.focus(); return }
    setIsLoading(true)
    try {
      const { data, error } = await signUp(f.email.trim(), f.password, f.nome.trim())
      if (error) setError(authErrorPt(error.message))
      // Supabase devolve um utilizador sem identidades quando o email já existe
      else if (data.user && data.user.identities && data.user.identities.length === 0) setError(authErrorPt('user already registered'))
      else if (data.user) setSentTo(f.email.trim())
    } catch (err) {
      setError(authErrorPt(err instanceof Error ? err.message : ''))
    }
    setIsLoading(false)
  }

  if (sentTo) {
    return (
      <AuthShell eyebrow="Conta criada" title="Confirme o" accent="seu email.">
        <div className="rounded-[20px] bg-white p-6">
          <MailCheck size={26} className="text-redvelvet-500" />
          <p className="mt-4 text-[15px] leading-relaxed text-[#1c1012]/85">
            Enviámos um link de confirmação para <strong className="font-medium text-[#1c1012]">{sentTo}</strong>. Abra-o para ativar a conta.
          </p>
          <p className="mt-3 text-sm text-[#6b5a5c]">Não chegou? Veja a pasta de spam ou promoções.</p>
        </div>
        <Link href="/auth/login/" className={`${authBtn} mt-6`}>Ir para iniciar sessão</Link>
        {next && <Link href={next.startsWith('/') && !next.startsWith('//') ? next : '/shop/'} className="mt-4 block text-center text-sm text-[#6b5a5c] underline underline-offset-4">Continuar sem esperar</Link>}
      </AuthShell>
    )
  }

  const err = (k: keyof typeof errors) => errors[k] && <p id={`${k}-err`} className="mt-1.5 text-[13px] text-redvelvet-600">{errors[k]}</p>

  return (
    <AuthShell
      eyebrow="Conta"
      title="Criar"
      accent="conta."
      intro={<>Já tem conta? <Link href="/auth/login/" className="text-[#1c1012] underline underline-offset-4">Iniciar sessão</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="nome" className="rv-label">Nome</label>
          <input id="nome" name="nome" autoComplete="name" value={f.nome} onChange={set} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'nome-err' : undefined} className="rv-input" />
          {err('nome')}
        </div>
        <div>
          <label htmlFor="email" className="rv-label">Email</label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={set} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} className="rv-input" placeholder="nome@email.com" />
          {err('email')}
        </div>
        <div>
          <label htmlFor="password" className="rv-label">Palavra-passe</label>
          <PasswordInput id="password" name="password" autoComplete="new-password" value={f.password} onChange={set} aria-invalid={!!errors.password} aria-describedby="password-hint" />
          {errors.password ? err('password') : (
            <p id="password-hint" className={`mt-1.5 text-[12.5px] ${f.password.length >= MIN ? 'text-[#2f7d4f]' : 'text-[#6b5a5c]'}`}>
              {f.password.length >= MIN ? '✓ ' : ''}Pelo menos {MIN} caracteres
            </p>
          )}
        </div>
        {error && <div role="alert" className="rounded-xl border border-[#f5c2c9] bg-[#fdecee] p-3.5 text-sm text-[#8a1c2b]">{error}</div>}
        <button type="submit" disabled={isLoading} className={`${authBtn} !mt-6`}>
          {isLoading ? <><Loader2 size={16} className="animate-spin" /> A criar conta…</> : 'Criar conta'}
        </button>
        <p className="text-[12.5px] leading-relaxed text-[#6b5a5c]">
          Ao criar conta aceita os <Link href="/terms/" className="underline underline-offset-2">Termos e Condições</Link> e a{' '}
          <Link href="/privacy/" className="underline underline-offset-2">Política de Privacidade</Link>.
        </p>
      </form>
    </AuthShell>
  )
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>
}
