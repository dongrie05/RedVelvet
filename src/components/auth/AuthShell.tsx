import Image from 'next/image'
import { Check } from 'lucide-react'

const PERKS = ['Acompanhe o estado das suas encomendas', 'Guarde peças nos favoritos', 'Dados preenchidos no checkout']

/** Layout partilhado das páginas de conta: foto veludo à esquerda, formulário à direita. */
export default function AuthShell({ eyebrow, title, accent, intro, children }: {
  eyebrow: string; title: string; accent: string; intro?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="grid min-h-[calc(100dvh-80px)] grid-cols-1 bg-[#f7f3ee] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#210a0f] text-[#f7efe9] lg:block">
        <Image src="/images/categories/hero/hero-main.png" alt="" aria-hidden fill sizes="50vw" className="rv-settle object-cover object-[60%_20%]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,#210a0f_18%,rgba(33,10,15,.55)_48%,rgba(33,10,15,0)_75%)]" />
        <div aria-hidden className="rv-grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-14 xl:p-16">
          <p className="font-serif text-[clamp(34px,3.4vw,52px)] font-normal leading-[0.98] tracking-[-0.025em]">
            Para a casa, <em className="italic text-[#e9a8ae]">e para si.</em>
          </p>
          <ul className="mt-7 space-y-2.5 text-[15px] text-[#f7efe9]/75">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5"><Check size={16} className="text-[#e9a8ae]" /> {p}</li>
            ))}
          </ul>
        </div>
      </aside>
      <section className="flex items-center justify-center px-8 py-12 sm:px-12 lg:py-16" data-auth-form>
        <div className="w-full max-w-[420px]">
          <p className="rv-rise flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> {eyebrow}
          </p>
          <h1 className="rv-rise mt-3 font-serif text-[clamp(34px,4vw,48px)] font-normal leading-[1.02] tracking-[-0.025em] text-[#1c1012]" style={{ animationDelay: '.06s' }}>
            {title} <em className="italic text-[#8a5a60]">{accent}</em>
          </h1>
          {intro && <div className="rv-rise mt-3 text-[15px] leading-relaxed text-[#6b5a5c]" style={{ animationDelay: '.12s' }}>{intro}</div>}
          <div className="rv-rise mt-8" style={{ animationDelay: '.18s' }}>{children}</div>
        </div>
      </section>
    </div>
  )
}

export const authBtn = 'flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#210a0f] text-[15px] font-medium text-[#f7efe9] transition-colors hover:bg-[#3a1219] disabled:cursor-wait disabled:opacity-70'
