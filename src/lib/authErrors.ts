/** Traduz mensagens de erro do Supabase Auth para português. */
export function authErrorPt(message?: string | null): string {
  const m = (message || '').toLowerCase()
  if (m.includes('invalid login credentials')) return 'Email ou palavra-passe incorretos.'
  if (m.includes('email not confirmed')) return 'Ainda não confirmou o email. Veja a sua caixa de correio (e o spam).'
  if (m.includes('user already registered') || m.includes('already been registered')) return 'Já existe uma conta com este email. Inicie sessão ou recupere a palavra-passe.'
  if (m.includes('password should be at least') || m.includes('weak password')) return 'A palavra-passe é demasiado fraca. Use pelo menos 8 caracteres.'
  if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes')) return 'Demasiadas tentativas. Aguarde um minuto e tente de novo.'
  if (m.includes('invalid email') || m.includes('unable to validate email')) return 'Email inválido.'
  if (m.includes('same password') || m.includes('different from the old')) return 'A nova palavra-passe tem de ser diferente da anterior.'
  if (m.includes('session') && m.includes('missing')) return 'O link expirou. Peça um novo email de recuperação.'
  if (m.includes('fetch') || m.includes('network')) return 'Sem ligação. Verifique a internet e tente de novo.'
  return 'Não foi possível concluir. Tente novamente.'
}
