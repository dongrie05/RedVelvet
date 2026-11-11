'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import AuthShell, { authBtn } from '@/components/auth/AuthShell'
import PasswordInput from '@/components/auth/PasswordInput'
import { authErrorPt } from '@/lib/authErrors'

const MIN = 8

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const [ready, setReady] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // O link do email abre esta página com uma sessão de recuperação
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
    })
    supabase.auth.getSession().then(({ data }) => setReady((r) => r || !!data.session))
    const t = setTimeout(() => setReady((r) => r ?? false), 2500)
    return () => { sub.subscription.unsubscribe(); clearTimeout(t) }
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < MIN) { setError(`Use pelo menos ${MIN} caracteres.`); return }
    setIsLoading(true); setError('')
    const { error } = await updatePassword(password)
    if (error) setError(authErrorPt(error.message))
    else setDone(true)
    setIsLoading(false)
  }

  return (
    <AuthShell eyebrow="Conta" title="Nova" accent="palavra-passe.">
      {done ? (
        <>
          <div role="status" className="flex gap-2.5 rounded-xl border border-[#cfe5d6] bg-[#eef7f1] p-3.5 text-sm text-[#22603b]">
            <CheckCircle2 size={18} className="shrink-0" /> Palavra-passe atualizada.
          </div>
          <Link href="/account/" className={`${authBtn} mt-6`}>Ir para a minha conta</Link>
        </>
      ) : ready === false ? (
        <>
          <p className="text-[15px] leading-relaxed text-[#6b5a5c]">Este link expirou ou já foi usado. Peça um novo email de recuperação.</p>
          <Link href="/auth/forgot-password/" className={`${authBtn} mt-6`}>Pedir novo link</Link>
        </>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="password" className="rv-label">Nova palavra-passe</label>
            <PasswordInput id="password" autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} />
            <p className={`mt-1.5 text-[12.5px] ${password.length >= MIN ? 'text-[#2f7d4f]' : 'text-[#6b5a5c]'}`}>{password.length >= MIN ? '✓ ' : ''}Pelo menos {MIN} caracteres</p>
          </div>
          {error && <div role="alert" className="rounded-xl border border-[#f5c2c9] bg-[#fdecee] p-3.5 text-sm text-[#8a1c2b]">{error}</div>}
          <button type="submit" disabled={isLoading || ready === null} className={`${authBtn} !mt-6`}>
            {isLoading || ready === null ? <><Loader2 size={16} className="animate-spin" /> {ready === null ? 'A validar link…' : 'A guardar…'}</> : 'Guardar palavra-passe'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
