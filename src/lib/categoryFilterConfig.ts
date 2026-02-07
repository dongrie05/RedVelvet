/**
 * =============================================================================
 * FILTRO DE CATEGORIAS OCULTAS
 * =============================================================================
 * Produtos cuja categoria contenha algum dos textos abaixo NÃO aparecem:
 * - na loja (lista de produtos)
 * - nas contagens da homepage (peças por categoria)
 * - nos destaques
 *
 * Quando quiseres esconder uma categoria (ex.: Natal fora da época), adiciona
 * o texto ao array EXCLUDED_CATEGORIES. A comparação ignora maiúsculas e acentos.
 *
 * Exemplos:
 *   ['NATAL']        -> esconde categorias que contenham "NATAL"
 *   ['NATAL','PROMO'] -> esconde Natal e Promo
 *   []               -> não esconde nenhuma (mostra tudo)
 */

export const EXCLUDED_CATEGORIES: string[] = [
  'NATAL',
  'VERAO',
  'SERVICOS',
]

/** Verifica se a categoria (normalizada) deve ser oculta */
export function isCategoryExcluded(categoriaNormalizada: string): boolean {
  if (!categoriaNormalizada || EXCLUDED_CATEGORIES.length === 0) return false
  const upper = categoriaNormalizada.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return EXCLUDED_CATEGORIES.some((excluded) => {
    const exUpper = excluded.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return upper.includes(exUpper)
  })
}
