import type { Metadata } from 'next'
import LegalPage, { LegalSection } from '@/components/legal/LegalPage'
import { BUSINESS } from '@/lib/business'

export const metadata: Metadata = { title: 'Política de Privacidade | RedVelvet', alternates: { canonical: '/privacy/' } }

const sections: LegalSection[] = [
  { id: 'responsavel', title: 'Responsável pelo tratamento', body: (
    <p>
      {BUSINESS.legalName}{BUSINESS.nif ? `, NIF ${BUSINESS.nif}` : ''}, {BUSINESS.address}. Contacto:{' '}
      <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
    </p>
  ) },
  { id: 'dados', title: 'Que dados recolhemos e para quê', body: (
    <ul>
      <li><strong>Encomendas:</strong> nome, email, telefone, morada e NIF (opcional) — para processar, enviar e faturar a encomenda (execução de contrato e obrigação legal).</li>
      <li><strong>Conta de cliente:</strong> email e palavra-passe (cifrada) e, se os indicar, nome, telefone e morada — para acompanhar encomendas, favoritos e preencher o checkout (contrato).</li>
      <li><strong>Contacto:</strong> os dados que nos envia por WhatsApp, telefone ou email — para responder ao pedido.</li>
      <li><strong>Estatísticas:</strong> se ativado, o Google Analytics recolhe dados de navegação agregados.</li>
    </ul>
  ) },
  { id: 'subcontratantes', title: 'Com quem partilhamos', body: (
    <p>
      Supabase (alojamento da base de dados), Vercel (alojamento do site), Mollie B.V. (pagamentos) e a transportadora
      responsável pela entrega. Não vendemos os seus dados a terceiros.
    </p>
  ) },
  { id: 'conservacao', title: 'Durante quanto tempo', body: (
    <p>Os dados de faturação são conservados pelo prazo legal (10 anos). Os restantes, enquanto a conta estiver ativa ou até pedir a sua eliminação.</p>
  ) },
  { id: 'direitos', title: 'Os seus direitos', body: (
    <p>
      Pode pedir acesso, retificação, eliminação, limitação, portabilidade ou opor-se ao tratamento através de{' '}
      <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. Tem ainda o direito de apresentar reclamação à{' '}
      <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">CNPD</a>.
    </p>
  ) },
  { id: 'cookies', title: 'Cookies e armazenamento local', body: (
    <p>
      Usamos o armazenamento local do navegador para guardar o carrinho e a sessão de cliente — são essenciais ao
      funcionamento da loja. Cookies de estatística só são usados se o Google Analytics estiver ativo.
    </p>
  ) },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      current="/privacy/"
      title="Política de"
      accent="Privacidade."
      updated="11 de novembro de 2026"
      summary={[
        'Só pedimos os dados necessários para enviar e faturar a encomenda.',
        'Não vendemos os seus dados; o pagamento é tratado pela Mollie.',
        'Pode pedir uma cópia ou a eliminação dos seus dados a qualquer momento.',
      ]}
      sections={sections}
    />
  )
}
