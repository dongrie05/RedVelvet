import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalSection } from '@/components/legal/LegalPage'
import { BUSINESS } from '@/lib/business'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shop'

export const metadata: Metadata = { title: 'Termos e Condições | RedVelvet', alternates: { canonical: '/terms/' } }

const sections: LegalSection[] = [
  { id: 'vendedor', title: 'Identificação do vendedor', body: (
    <p>
      A loja online {BUSINESS.brand} é explorada por <strong>{BUSINESS.legalName}</strong>
      {BUSINESS.nif ? <>, NIF {BUSINESS.nif}</> : null}, com sede em {BUSINESS.address}.
      Contactos: <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> · {BUSINESS.phone}.
    </p>
  ) },
  { id: 'encomendas', title: 'Encomendas', body: (
    <p>
      Ao clicar em “Encomendar e pagar” o cliente faz uma encomenda com obrigação de pagamento. O contrato considera-se
      celebrado quando o pagamento é confirmado; enviamos a confirmação para o email indicado. Reservamo-nos o direito de
      cancelar encomendas em caso de erro manifesto de preço ou de rutura de stock, reembolsando integralmente qualquer valor pago.
    </p>
  ) },
  { id: 'precos', title: 'Preços e pagamento', body: (
    <p>
      Todos os preços são apresentados em euros e incluem IVA à taxa legal em vigor. Os portes de envio são indicados antes
      da confirmação da encomenda. Os pagamentos são processados de forma segura pela Mollie B.V. (MB WAY, Multibanco,
      cartão e outros métodos disponíveis). A {BUSINESS.brand} não tem acesso aos dados do seu cartão.
    </p>
  ) },
  { id: 'envio', title: 'Envio e entrega', body: (
    <p>
      As encomendas são expedidas após confirmação do pagamento, com prazo estimado de {BUSINESS.shippingDays}. Envio
      gratuito para Portugal Continental em compras a partir de {FREE_SHIPPING_THRESHOLD} €. Custos e destinos em{' '}
      <Link href="/shipping/">Envios e Devoluções</Link>.
    </p>
  ) },
  { id: 'livre-resolucao', title: 'Direito de livre resolução', body: (
    <>
      <p>
        Nos termos do Decreto-Lei n.º 24/2014, tem <strong>14 dias</strong> a contar da receção da encomenda para a devolver
        sem indicar motivo. Basta enviar-nos uma declaração inequívoca — por email para{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> ou usando o{' '}
        <Link href="/withdrawal/">formulário de livre resolução</Link>.
      </p>
      <p>
        O reembolso, incluindo os portes de envio iniciais (modalidade padrão), é feito no prazo de 14 dias após recebermos a
        declaração, pelo mesmo meio de pagamento, podendo ser retido até recebermos o artigo. Os custos de devolução são
        suportados pelo cliente, salvo artigo defeituoso ou errado. Os artigos devem ser devolvidos em bom estado.
      </p>
      <p>Excetuam-se artigos personalizados e artigos selados que, por razões de higiene, tenham sido abertos após a entrega (por exemplo, velas utilizadas).</p>
    </>
  ) },
  { id: 'garantia', title: 'Garantia', body: (
    <p>
      Os bens beneficiam da garantia legal de conformidade de 3 anos (Decreto-Lei n.º 84/2021). Em caso de defeito,
      contacte-nos com fotografias do artigo para resolvermos por reparação, substituição, redução de preço ou reembolso.
    </p>
  ) },
  { id: 'litigios', title: 'Resolução de litígios', body: (
    <p>
      Em caso de litígio, o consumidor pode recorrer à entidade de Resolução Alternativa de Litígios de Consumo:{' '}
      <a href={BUSINESS.ral.url} target="_blank" rel="noopener noreferrer">{BUSINESS.ral.name}</a>. Mais informação no{' '}
      <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer">Portal do Consumidor</a>. Dispõe ainda do{' '}
      <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">Livro de Reclamações Eletrónico</a>.
    </p>
  ) },
  { id: 'lei', title: 'Lei aplicável', body: <p>Estes termos regem-se pela lei portuguesa.</p> },
]

export default function TermsPage() {
  return (
    <LegalPage
      current="/terms/"
      title="Termos e"
      accent="Condições."
      updated="11 de novembro de 2026"
      summary={[
        'Preços em euros, com IVA incluído; portes mostrados antes de pagar.',
        'Pagamento seguro via Mollie: MB WAY, Multibanco ou cartão.',
        `Envio em ${BUSINESS.shippingDays} após o pagamento.`,
        '14 dias para devolver sem dar motivo; 3 anos de garantia legal.',
      ]}
      sections={sections}
    />
  )
}
