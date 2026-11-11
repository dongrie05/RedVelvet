import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import { BUSINESS } from '@/lib/business'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COUNTRIES, formatPrice } from '@/lib/shop'

export const metadata: Metadata = { title: 'Envios e Devoluções | RedVelvet', alternates: { canonical: '/shipping/' } }

export default function ShippingPage() {
  return (
    <LegalPage title="Envios e Devoluções" updated="11 de novembro de 2026">
      <h2>Custos de envio</h2>
      <table>
        <thead><tr><th>Destino</th><th>Até 24,99 €</th><th>25 € – 49,99 €</th><th>50 € ou mais</th></tr></thead>
        <tbody>
          {Object.entries(SHIPPING_COUNTRIES).map(([k, c]) => (
            <tr key={k}>
              <td>{c.label}</td>
              <td>{formatPrice(c.base)}</td>
              <td>{formatPrice(c.reduced)}</td>
              <td>{k === 'PT' ? 'Grátis' : formatPrice(c.reduced)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Envio gratuito para Portugal Continental em compras a partir de {FREE_SHIPPING_THRESHOLD} €.</p>

      <h2>Prazos</h2>
      <p>
        As encomendas são preparadas após a confirmação do pagamento e entregues em {BUSINESS.shippingDays}.
        Pagamentos por Multibanco só são confirmados quando o pagamento é efetuado.
      </p>

      <h2>Devoluções</h2>
      <p>
        Tem 14 dias após a receção para devolver qualquer artigo, sem indicar motivo. Envie um email para{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> com o número da encomenda e indicamos como proceder.
        Os portes de devolução ficam a cargo do cliente, exceto se o artigo chegar danificado ou não corresponder à
        encomenda. O reembolso é feito pelo mesmo meio de pagamento até 14 dias depois.
      </p>

      <h2>Artigo danificado?</h2>
      <p>
        Contacte-nos em até 48 horas com fotografias da embalagem e do artigo ({BUSINESS.phone} / WhatsApp) e
        resolvemos de imediato.
      </p>
    </LegalPage>
  )
}
