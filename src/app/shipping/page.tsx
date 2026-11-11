import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalSection } from '@/components/legal/LegalPage'
import { BUSINESS } from '@/lib/business'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COUNTRIES, formatPrice } from '@/lib/shop'

export const metadata: Metadata = { title: 'Envios e Devoluções | RedVelvet', alternates: { canonical: '/shipping/' } }

const rows = Object.entries(SHIPPING_COUNTRIES).map(([k, c]) => ({
  key: k, label: c.label, a: formatPrice(c.base), b: formatPrice(c.reduced), c: k === 'PT' ? 'Grátis' : formatPrice(c.reduced),
}))

const sections: LegalSection[] = [
  { id: 'custos', title: 'Custos de envio', body: (
    <>
      {/* Tabela no computador */}
      <div className="hidden overflow-hidden rounded-2xl bg-white md:block">
        <table className="w-full text-left text-[15px]">
          <thead className="text-[13px] text-[#6b5a5c]">
            <tr className="border-b border-[#1c1012]/[.08]">
              <th className="px-5 py-3.5 font-medium">Destino</th>
              <th className="px-5 py-3.5 font-medium">Até 24,99 €</th>
              <th className="px-5 py-3.5 font-medium">25 € – 49,99 €</th>
              <th className="px-5 py-3.5 font-medium">50 € ou mais</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-[#1c1012]/[.06] last:border-0">
                <td className="px-5 py-3.5 text-[#1c1012]">{r.label}</td>
                <td className="px-5 py-3.5">{r.a}</td>
                <td className="px-5 py-3.5">{r.b}</td>
                <td className={`px-5 py-3.5 ${r.c === 'Grátis' ? 'font-medium text-[#2f7d4f]' : ''}`}>{r.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cartões no telemóvel */}
      <ul className="!list-none space-y-2.5 !pl-0 md:hidden">
        {rows.map((r) => (
          <li key={r.key} className="!pl-0 rounded-2xl bg-white p-4 before:!hidden">
            <p className="font-medium text-[#1c1012]">{r.label}</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-[13px] tabular-nums">
              <div><dt className="text-[#6b5a5c]">Até 24,99 €</dt><dd className="text-[#1c1012]">{r.a}</dd></div>
              <div><dt className="text-[#6b5a5c]">25–49,99 €</dt><dd className="text-[#1c1012]">{r.b}</dd></div>
              <div><dt className="text-[#6b5a5c]">50 € +</dt><dd className={r.c === 'Grátis' ? 'font-medium text-[#2f7d4f]' : 'text-[#1c1012]'}>{r.c}</dd></div>
            </dl>
          </li>
        ))}
      </ul>
      <p>Envio gratuito para Portugal Continental em compras a partir de {FREE_SHIPPING_THRESHOLD} €.</p>
    </>
  ) },
  { id: 'prazos', title: 'Prazos', body: (
    <p>
      As encomendas são preparadas após a confirmação do pagamento e entregues em {BUSINESS.shippingDays}. Pagamentos por
      Multibanco só são confirmados quando o pagamento é efetuado. Pode acompanhar o estado na sua{' '}
      <Link href="/account/">conta</Link>.
    </p>
  ) },
  { id: 'devolucoes', title: 'Devoluções', body: (
    <>
      <p>
        Tem <strong>14 dias</strong> após a receção para devolver qualquer artigo, sem indicar motivo. Envie-nos um email para{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> com o número da encomenda, ou use o{' '}
        <Link href="/withdrawal/">formulário de livre resolução</Link>, e indicamos como proceder.
      </p>
      <p>
        Os portes de devolução ficam a cargo do cliente, exceto se o artigo chegar danificado ou não corresponder à
        encomenda. O reembolso é feito pelo mesmo meio de pagamento até 14 dias depois.
      </p>
    </>
  ) },
  { id: 'danificado', title: 'Artigo danificado', body: (
    <p>
      Contacte-nos em até 48 horas com fotografias da embalagem e do artigo ({BUSINESS.phone} / WhatsApp) e resolvemos de
      imediato. Este prazo serve para agilizar o processo e não limita a garantia legal de 3 anos.
    </p>
  ) },
]

export default function ShippingPage() {
  return (
    <LegalPage
      current="/shipping/"
      title="Envios e"
      accent="Devoluções."
      updated="11 de novembro de 2026"
      summary={[
        `Envio grátis em Portugal Continental desde ${FREE_SHIPPING_THRESHOLD} €.`,
        `Entrega em ${BUSINESS.shippingDays} após o pagamento.`,
        '14 dias para devolver, sem dar motivo.',
      ]}
      sections={sections}
    />
  )
}
