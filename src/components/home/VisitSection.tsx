import { ArrowUpRight, Clock, Instagram, MapPin, MessageCircle } from 'lucide-react'
import { BUSINESS } from '@/lib/business'

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address)}`

export default function VisitSection() {
  return (
      <section id="visite" className="scroll-mt-20 bg-[#210a0f] py-[clamp(80px,9vw,120px)] text-[#f7efe9]">
        <div className="container-luxury grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3.5 text-xs font-medium uppercase tracking-[0.28em] text-[#f7efe9]/60">
              <span aria-hidden className="h-px w-8 bg-[#f7efe9]/40" /> Loja física
            </p>
            <h2 className="mt-5 font-serif text-[clamp(34px,4.4vw,60px)] font-normal leading-[1.02] tracking-[-0.025em] text-[#f7efe9]">
              Também nos encontra <em className="italic text-[#e9a8ae]">em Lisboa.</em>
            </h2>
            <p className="mt-6 max-w-[30rem] text-base leading-relaxed text-[#f7efe9]/72">
              Venha ver e sentir as peças ao vivo. Se preferir, falamos pelo WhatsApp e reservamos o que gostar.
            </p>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <ul className="space-y-4 text-[15px] text-[#f7efe9]/85">
              <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-[#e9a8ae]" />{BUSINESS.address}</li>
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-[#e9a8ae]" />
                <span>{BUSINESS.hours.map((h) => <span key={h} className="block">{h}</span>)}</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#f7efe9] px-6 text-[15px] font-medium text-[#210a0f] transition-transform active:scale-[.97]">
                Como chegar <ArrowUpRight size={16} />
              </a>
              <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[#f7efe9]/25 px-6 text-[15px] text-[#f7efe9] transition-colors hover:bg-[#f7efe9]/10">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="rv-link inline-flex items-center gap-2 text-sm text-[#f7efe9]/70 hover:text-[#f7efe9]">
              <Instagram size={16} /> Siga-nos no Instagram
            </a>
          </div>
        </div>
      </section>
  )
}
