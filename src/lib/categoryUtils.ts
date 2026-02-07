/**
 * Normalização de categorias: evita problemas com encoding (DECORACO, DECORACO)
 * e garante que "DECORAÇÃO" e variantes são tratadas corretamente.
 */

/** Normaliza para comparação/filtro: maiúsculas, sem acentos, sem caracteres corrompidos */
export function normalizeCategoryForFilter(s: string | undefined | null): string {
  if (s == null) return ''
  const cleaned = String(s)
    .replace(/\uFFFD/g, '') // replacement character (mojibake)
  return cleaned
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/** Indica se a categoria (já normalizada) é Decoração / Elementos Decorativos */
export function isDecorativeCategory(normalized: string): boolean {
  if (!normalized) return false
  return normalized.includes('DECORAC')
}

/** Indica se é Velas */
export function isVelasCategory(normalized: string): boolean {
  return normalized.includes('VELAS')
}

/** Indica se é Vestuário / Roupa */
export function isVestuarioCategory(normalized: string): boolean {
  return normalized.includes('VESTUARIO')
}

/** Devolve o nome da categoria formatado para exibir (DECORAÇÃO, Velas, Vestuário, etc.) */
export function formatCategoryDisplay(categoria: string | undefined | null): string {
  if (categoria == null || categoria === '') return ''
  const n = normalizeCategoryForFilter(categoria)
  if (isVelasCategory(n)) return 'Velas'
  if (isVestuarioCategory(n)) return 'Vestuário'
  if (isDecorativeCategory(n) || n.includes('DECORAC')) return 'DECORAÇÃO'
  if (n.includes('NATAL')) return 'Natal'
  if (n.includes('MOBILIARIO')) return 'Mobiliário'
  if (n.includes('TEXTEIS')) return 'Têxteis'
  if (n.includes('SERVICOS')) return 'Serviços'
  return categoria.trim()
}

/** Devolve o slug para filtrar na loja (decorative-elements, velas, roupa) */
export function getCategorySlug(categoria: string | undefined | null): string | null {
  if (categoria == null || categoria === '') return null
  const n = normalizeCategoryForFilter(categoria)
  if (isVelasCategory(n)) return 'velas'
  if (isVestuarioCategory(n)) return 'roupa'
  if (isDecorativeCategory(n) || !isVelasCategory(n) && !isVestuarioCategory(n)) return 'decorative-elements'
  return null
}
