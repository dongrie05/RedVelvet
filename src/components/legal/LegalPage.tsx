import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { BUSINESS } from '@/lib/business'

export type LegalSection = { id: string; title: string; body: React.ReactNode }

const LEGAL_NAV = [
  { href: '/terms/', label: 'Termos e Condições' },
  { href: '/privacy/', label: 'Privacidade' },
  { href: '/shipping/', label: 'Envios e Devoluções' },
  { href: '/withdrawal/', label: 'Livre resolução' },
]

/** Página legal: navegação entre documentos, resumo, índice fixo e secções com âncoras. */
export default function LegalPage({ current, title, accent, updated, summary, sections, children }: {
  current: string; title: string; accent?: string; updated: string
  summary?: string[]; sections: LegalSection[]; children?: React.ReactNode
}) {
  const toc = (
    <ol className="space-y-1">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="flex gap-3 rounded-lg py-1.5 text-sm text-[#6b5a5c] transition-colors hover:text-[#1c1012]">
            <span className="w-5 shrink-0 tabular-nums text-[#1c1012]/35">{String(i + 1).padStart(2, '0')}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="bg-[#f7f3ee]">
      <header className="container-luxury pb-10 pt-[clamp(32px,5vw,64px)]">
        <nav aria-label="Documentos legais" className="-mx-8 flex gap-2 overflow-x-auto px-8 pb-1 [scrollbar-width:none] sm:-mx-12 sm:px-12 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
          {LEGAL_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={current === n.href ? 'page' : undefined}
              className={`inline-flex h-[38px] shrink-0 items-center rounded-full border px-4 text-sm transition-colors ${
                current === n.href ? 'border-[#210a0f] bg-[#210a0f] text-[#f7efe9]' : 'border-[#1c1012]/15 text-[#1c1012]/75 hover:border-[#1c1012]/35 hover:text-[#1c1012]'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="mt-10 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> Informação legal
        </p>
        <h1 className="mt-3 font-serif text-[clamp(36px,5vw,68px)] font-normal leading-[1] tracking-[-0.025em] text-[#1c1012]">
          {title}{accent && <> <em className="italic text-[#8a5a60]">{accent}</em></>}
        </h1>
        <p className="mt-4 text-[13px] text-[#6b5a5c]">Última atualização: {updated}</p>
      </header>

      <div className="container-luxury grid grid-cols-1 gap-10 pb-[clamp(72px,9vw,128px)] lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[104px]">
            {summary && summary.length > 0 && (
              <div className="rounded-[20px] bg-white p-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#1c1012]/55">Em poucas palavras</p>
                <ul className="mt-4 space-y-2.5 text-[14.5px] leading-relaxed text-[#1c1012]/85">
                  {summary.map((s) => (
                    <li key={s} className="flex gap-2.5"><span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-redvelvet-500" />{s}</li>
                  ))}
                </ul>
              </div>
            )}
            <details className="group mt-4 rounded-[20px] border border-[#1c1012]/[.1] px-5 lg:hidden">
              <summary className="flex h-14 cursor-pointer list-none items-center justify-between text-sm text-[#1c1012] [&::-webkit-details-marker]:hidden">
                Nesta página <ChevronDown size={16} className="transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="pb-4">{toc}</div>
            </details>
            <div className="mt-8 hidden lg:block">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#1c1012]/55">Nesta página</p>
              {toc}
            </div>
          </div>
        </aside>

        <article className="lg:col-span-8">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-[#1c1012]/[.1] pb-2 pt-8 first:border-t-0 first:pt-0">
              <h2 className="flex gap-4 font-serif text-[clamp(22px,2.2vw,28px)] font-normal leading-tight text-[#1c1012]">
                <span className="mt-1.5 shrink-0 font-sans text-xs font-medium tabular-nums tracking-[0.2em] text-redvelvet-500">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              <div className="legal-body mt-4 pb-6 text-[15.5px] leading-[1.75] text-[#3d2c2f] md:pl-9">{s.body}</div>
            </section>
          ))}
          {children}
          <div className="mt-6 rounded-[20px] bg-[#210a0f] p-6 text-[#f7efe9] md:p-8">
            <p className="font-serif text-[22px]">Ficou com alguma dúvida?</p>
            <p className="mt-2 text-sm text-[#f7efe9]/70">Fale connosco antes de comprar — respondemos com gosto.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-full bg-[#f7efe9] px-5 text-sm font-medium text-[#210a0f]">WhatsApp</a>
              <a href={`mailto:${BUSINESS.email}`} className="inline-flex h-11 items-center rounded-full border border-[#f7efe9]/25 px-5 text-sm">{BUSINESS.email}</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
