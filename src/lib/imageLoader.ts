export default function imageLoader({ src, width, quality }: {
  src: string
  width: number
  quality?: number
}) {
  // Para imagens locais, retornar o caminho diretamente
  if (src.startsWith('/')) {
    return src
  }
  
  // Para URLs externas, manter como estão
  return src
}
