/**
 * Regras comerciais da loja — usadas no browser E no servidor (checkout).
 * Alterar aqui muda o carrinho, o checkout e o valor cobrado na Mollie.
 */

export const FREE_SHIPPING_THRESHOLD = 50

/** Países para onde a loja envia e respetivo custo base. */
export const SHIPPING_COUNTRIES = {
  PT: { label: 'Portugal (Continente)', base: 5.9, reduced: 3.5 },
  'PT-ILHAS': { label: 'Portugal (Açores e Madeira)', base: 9.9, reduced: 9.9 },
  ES: { label: 'Espanha', base: 9.9, reduced: 9.9 },
} as const

export type ShippingCountry = keyof typeof SHIPPING_COUNTRIES

export function isShippingCountry(v: unknown): v is ShippingCountry {
  return typeof v === 'string' && v in SHIPPING_COUNTRIES
}

export function calculateShipping(subtotal: number, country: ShippingCountry = 'PT'): number {
  if (subtotal <= 0) return 0
  if (country === 'PT' && subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  const c = SHIPPING_COUNTRIES[country]
  return subtotal >= 25 ? c.reduced : c.base
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price)
}

export const MAX_QTY_PER_ITEM = 20
