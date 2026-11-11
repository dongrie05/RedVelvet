import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import { BUSINESS } from '@/lib/business'

export const metadata: Metadata = { title: 'Política de Privacidade | RedVelvet', alternates: { canonical: '/privacy/' } }

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de Privacidade" updated="11 de novembro de 2026">
      <h2>Responsável pelo tratamento</h2>
      <p>
        {BUSINESS.legalName}{BUSINESS.nif ? `, NIF ${BUSINESS.nif}` : ''}, {BUSINESS.address}. Contacto:{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>

      <h2>Que dados recolhemos e para quê</h2>
      <ul>
        <li><strong>Encomendas:</strong> nome, email, telefone, morada e NIF (opcional) — para processar, enviar e faturar a encomenda (execução de contrato e obrigação legal).</li>
        <li><strong>Conta de cliente:</strong> email e password (cifrada) — para acompanhar encomendas e favoritos (consentimento / contrato).</li>
        <li><strong>Contacto:</strong> dados que nos envia no formulário ou WhatsApp — para responder ao pedido.</li>
        <li><strong>Estatísticas:</strong> se ativado, o Google Analytics recolhe dados de navegação agregados.</li>
      </ul>

      <h2>Subcontratantes</h2>
      <p>
        Supabase (alojamento da base de dados), Vercel (alojamento do site), Mollie B.V. (pagamentos) e a transportadora
        responsável pela entrega. Não vendemos os seus dados a terceiros.
      </p>

      <h2>Conservação</h2>
      <p>Os dados de faturação são conservados pelo prazo legal (10 anos). Os restantes, enquanto a conta estiver ativa ou até pedir a sua eliminação.</p>

      <h2>Os seus direitos</h2>
      <p>
        Pode pedir acesso, retificação, eliminação, limitação, portabilidade ou opor-se ao tratamento através de{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. Tem ainda o direito de apresentar reclamação à{' '}
        <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">CNPD</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Usamos armazenamento local do navegador para guardar o carrinho e a sessão de cliente (essenciais ao
        funcionamento). Cookies de estatística só são usados se o Google Analytics estiver ativo.
      </p>
    </LegalPage>
  )
}
