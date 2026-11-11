import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalSection } from '@/components/legal/LegalPage'
import WithdrawalHelper from '@/components/legal/WithdrawalHelper'
import { BUSINESS } from '@/lib/business'

export const metadata: Metadata = { title: 'Formulário de livre resolução | RedVelvet', alternates: { canonical: '/withdrawal/' } }

const sections: LegalSection[] = [
  { id: 'como', title: 'Como exercer o direito', body: (
    <>
      <p>
        Tem 14 dias a contar da receção da encomenda para desistir da compra, sem indicar motivo. Para isso, envie-nos uma
        declaração inequívoca — pode usar o modelo abaixo (não é obrigatório) ou escrever-nos por{' '}
        <a href={`mailto:${BUSINESS.email}`}>email</a>. Depois indicamos como devolver os artigos.
      </p>
      <p>Mais detalhes nos <Link href="/terms/#livre-resolucao">Termos e Condições</Link> e em <Link href="/shipping/#devolucoes">Envios e Devoluções</Link>.</p>
    </>
  ) },
  { id: 'modelo', title: 'Modelo de formulário', body: (
    <>
      <p className="text-sm text-[#6b5a5c]">Anexo B do Decreto-Lei n.º 24/2014, de 14 de fevereiro.</p>
      <blockquote className="rounded-2xl border border-[#1c1012]/[.1] bg-white p-5 text-[15px] leading-[1.8] text-[#1c1012]/85">
        <p>Para: {BUSINESS.legalName}, {BUSINESS.address}, {BUSINESS.email}</p>
        <p className="mt-3">Pelo presente comunico/comunicamos (*) que resolvo/resolvemos (*) do meu/nosso (*) contrato de compra e venda do(s) seguinte(s) bem(ns) (*):</p>
        <p className="mt-3">Solicitado em (*) / recebido em (*):</p>
        <p>Nome do(s) consumidor(es):</p>
        <p>Endereço do(s) consumidor(es):</p>
        <p>Assinatura do(s) consumidor(es) (só no caso de o presente formulário ser notificado em papel):</p>
        <p>Data:</p>
        <p className="mt-3 text-sm text-[#6b5a5c]">(*) Riscar o que não interessa.</p>
      </blockquote>
    </>
  ) },
]

export default function WithdrawalPage() {
  return (
    <LegalPage
      current="/withdrawal/"
      title="Livre"
      accent="resolução."
      updated="11 de novembro de 2026"
      summary={['14 dias após receber a encomenda.', 'Não precisa de dar motivo.', 'Reembolso em até 14 dias, pelo mesmo meio de pagamento.']}
      sections={sections}
    >
      <WithdrawalHelper />
    </LegalPage>
  )
}
