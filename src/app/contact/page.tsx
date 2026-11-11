import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { MAPS_URL } from '@/components/home/VisitSection'
import { BUSINESS } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Contactos | RedVelvet',
  description: `Fale com a RedVelvet pelo WhatsApp, telefone ou email, ou visite a loja em Lisboa: ${BUSINESS.address}.`,
  alternates: { canonical: '/contact/' },
}

function TikTok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

const CHANNELS = [
  { icon: MessageCircle, label: 'WhatsApp', value: 'Enviar mensagem', note: BUSINESS.phone, href: `https://wa.me/${BUSINESS.whatsapp}`, external: true, dark: true },
  { icon: Phone, label: 'Telefone', value: BUSINESS.phone, note: 'Nos horários da loja', href: BUSINESS.phoneHref, external: false, dark: false },
  { icon: Mail, label: 'Email', value: BUSINESS.email, note: 'Para pedidos detalhados', href: `mailto:${BUSINESS.email}`, external: false, dark: false },
]

export default function ContactPage() {
  return (
    <div className="bg-[#f7f3ee]">
      <header className="container-luxury pb-10 pt-[clamp(40px,7vw,96px)]">
        <p className="rv-rise flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> Contactos
        </p>
        <h1 className="mt-4 font-serif text-[clamp(40px,6vw,88px)] font-normal leading-[0.98] tracking-[-0.03em] text-[#1c1012]">
          <span className="rv-line"><span style={{ animationDelay: '.1s' }}>Fale <em className="italic text-[#8a5a60]">connosco.</em></span></span>
        </h1>
        <p className="rv-rise mt-5 max-w-[34rem] text-[16px] leading-relaxed text-[#6b5a5c]" style={{ animationDelay: '.3s' }}>
          Dúvidas sobre uma peça, uma encomenda ou uma oferta? O WhatsApp é a forma mais rápida.
          Se for sobre uma encomenda, tenha o número à mão.
        </p>
      </header>

      <div className="container-luxury">
        <ul className="rv-rise grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4" style={{ animationDelay: '.4s' }}>
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`group flex h-full items-center gap-4 rounded-[20px] p-5 transition-transform active:scale-[.99] md:min-h-[150px] md:flex-col md:items-stretch md:justify-between md:gap-0 md:rounded-[24px] md:p-6 ${
                  c.dark ? 'bg-[#210a0f] text-[#f7efe9]' : 'bg-white text-[#1c1012]'
                }`}
              >
                <div className="flex shrink-0 items-center justify-between md:w-full">
                  <c.icon size={22} className={c.dark ? 'text-[#e9a8ae]' : 'text-redvelvet-500'} />
                  <ArrowUpRight size={18} className="hidden opacity-50 transition-transform duration-300 group-hover:rotate-45 group-hover:opacity-100 md:block" />
                </div>
                <div className="min-w-0 flex-1 md:mt-8 md:flex-none">
                  <p className={`text-[13px] ${c.dark ? 'text-[#f7efe9]/60' : 'text-[#6b5a5c]'}`}>{c.label}</p>
                  <p className="mt-0.5 text-[16px] font-medium md:mt-1 md:text-[17px]">
                    {c.value.includes('@') ? <>{c.value.split('@')[0]}@<wbr />{c.value.split('@')[1]}</> : c.value}
                  </p>
                  <p className={`mt-0.5 text-[13px] ${c.dark ? 'text-[#f7efe9]/60' : 'text-[#6b5a5c]'}`}>{c.note}</p>
                </div>
                <ArrowUpRight size={18} className="shrink-0 opacity-50 md:hidden" />
              </a>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-10 py-[clamp(56px,7vw,96px)] lg:grid-cols-12 lg:gap-12">
          <div className="space-y-10 lg:col-span-5">
            <section>
              <h2 className="font-serif text-[26px] font-normal text-[#1c1012]">A loja em Lisboa</h2>
              <ul className="mt-5 space-y-4 text-[15px] text-[#1c1012]/85">
                <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-redvelvet-500" />{BUSINESS.address}</li>
                <li className="flex gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-redvelvet-500" />
                  <span>{BUSINESS.hours.map((h) => <span key={h} className="block">{h}</span>)}</span>
                </li>
              </ul>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full border border-[#1c1012]/20 px-6 text-[15px] text-[#1c1012] hover:bg-[#1c1012]/5">
                Como chegar <ArrowUpRight size={16} />
              </a>
            </section>
            <section>
              <h2 className="font-serif text-[26px] font-normal text-[#1c1012]">Siga as novidades</h2>
              <div className="mt-5 flex gap-3">
                <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-[15px] text-[#1c1012] hover:bg-white/70">
                  <Instagram size={18} /> Instagram
                </a>
                <a href={BUSINESS.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-[15px] text-[#1c1012] hover:bg-white/70">
                  <TikTok /> TikTok
                </a>
              </div>
            </section>
            <p className="text-sm text-[#6b5a5c]">
              Questões sobre portes, prazos ou devoluções? Veja <Link href="/shipping/" className="underline underline-offset-4">Envios e Devoluções</Link> ou as{' '}
              <Link href="/#faq" className="underline underline-offset-4">perguntas frequentes</Link>.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        <div className="pb-[clamp(64px,8vw,112px)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#ede6de] md:aspect-[21/9]">
            <iframe
              title={`Mapa — ${BUSINESS.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&output=embed`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
