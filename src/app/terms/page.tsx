import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/components/legal/LegalPage'
import { BUSINESS } from '@/lib/business'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shop'

export const metadata: Metadata = { title: 'Termos e Condições | RedVelvet', alternates: { canonical: '/terms/' } }

export default function TermsPage() {
  return (
    <LegalPage title="Termos e Condições" updated="11 de novembro de 2026">
      <h2>1. Identificação do vendedor</h2>
      <p>
        A loja online {BUSINESS.brand} é explorada por <strong>{BUSINESS.legalName}</strong>
        {BUSINESS.nif ? <>, NIF {BUSINESS.nif}</> : null}, com sede em {BUSINESS.address}.
        Contactos: <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> · {BUSINESS.phone}.
      </p>

      <h2>2. Encomendas</h2>
      <p>
        Ao clicar em “Encomendar e pagar” o cliente faz uma encomenda com obrigação de pagamento. O contrato
        considera-se celebrado quando o pagamento é confirmado. Reservamo-nos o direito de cancelar encomendas em caso
        de erro manifesto de preço ou de rutura de stock, reembolsando integralmente qualquer valor pago.
      </p>

      <h2>3. Preços e pagamento</h2>
      <p>
        Todos os preços são apresentados em euros e incluem IVA à taxa legal em vigor. Os portes de envio são indicados
        antes da confirmação da encomenda. Os pagamentos são processados de forma segura pela Mollie B.V. (MB WAY,
        Multibanco, cartão e outros métodos disponíveis). A {BUSINESS.brand} não tem acesso aos dados do seu cartão.
      </p>

      <h2>4. Envio e entrega</h2>
      <p>
        As encomendas são expedidas após confirmação do pagamento, com prazo estimado de {BUSINESS.shippingDays}.
        Envio gratuito para Portugal Continental em compras a partir de {FREE_SHIPPING_THRESHOLD} €. Mais detalhes em{' '}
        <Link href="/shipping">Envios e Devoluções</Link>.
      </p>

      <h2>5. Direito de livre resolução (devolução)</h2>
      <p>
        Nos termos do Decreto-Lei n.º 24/2014, o cliente tem 14 dias a contar da receção da encomenda para a devolver
        sem necessidade de indicar motivo. Para exercer este direito basta enviar-nos uma declaração inequívoca por email
        para <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. O reembolso, incluindo os portes de envio
        iniciais (modalidade padrão), é feito no prazo de 14 dias após recebermos a declaração, podendo ser retido até
        recebermos o artigo de volta. Os custos de devolução são suportados pelo cliente, salvo artigo defeituoso ou
        errado. Os artigos devem ser devolvidos em bom estado. Excetuam-se artigos personalizados ou que, por razões de
        higiene, tenham sido abertos após a entrega (ex.: velas utilizadas).
      </p>

      <h2>6. Garantia</h2>
      <p>
        Os bens beneficiam da garantia legal de conformidade de 3 anos (Decreto-Lei n.º 84/2021). Em caso de defeito,
        contacte-nos com fotografias do artigo para resolvermos por reparação, substituição ou reembolso.
      </p>

      <h2>7. Resolução de litígios</h2>
      <p>
        Em caso de litígio, o consumidor pode recorrer à entidade de Resolução Alternativa de Litígios de Consumo:{' '}
        <a href={BUSINESS.ral.url} target="_blank" rel="noopener noreferrer">{BUSINESS.ral.name}</a>. Mais informação em{' '}
        <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer">Portal do Consumidor</a>.
        Dispõe ainda do{' '}
        <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">Livro de Reclamações Eletrónico</a>.
      </p>

      <h2>8. Lei aplicável</h2>
      <p>Estes termos regem-se pela lei portuguesa.</p>
    </LegalPage>
  )
}
