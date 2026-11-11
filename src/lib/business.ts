/**
 * Dados legais da empresa — OBRIGATÓRIO preencher antes de vender
 * (Decreto-Lei 7/2004 e 24/2014: identificação do vendedor em lojas online).
 * Pode definir via variáveis de ambiente na Vercel ou editar aqui.
 */
export const BUSINESS = {
  brand: 'RedVelvet',
  legalName: process.env.NEXT_PUBLIC_BUSINESS_LEGAL_NAME || 'RedVelvet',
  nif: process.env.NEXT_PUBLIC_BUSINESS_NIF || '',
  address: 'Avenida David Morão Ferreira, 55 A, 1750-220 Lisboa, Portugal',
  email: 'redvelvet.homeliving@gmail.com',
  phone: '+351 916 350 502',
  phoneHref: 'tel:+351916350502',
  whatsapp: '351916350502',
  instagram: 'https://instagram.com/red_velvet_fashion_pt',
  tiktok: 'https://www.tiktok.com/@red_velvet_fashion_deco',
  hours: ['Segunda a sexta-feira: 15:00 - 17:00', 'Sábado: 10:00 - 19:00', 'Domingo: encerrado'],
  /** Prazo de envio comunicado ao cliente */
  shippingDays: '2 a 5 dias úteis',
  /** Entidade de Resolução Alternativa de Litígios (Lisboa) */
  ral: { name: 'CACCL — Centro de Arbitragem de Conflitos de Consumo de Lisboa', url: 'https://www.centroarbitragemlisboa.pt' },
}
