import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductPageClient from './ProductPageClient'
import { getAllProducts, getProduct } from '@/lib/products'
import { getCategorySlug } from '@/lib/categoryUtils'
import { SEO_CONFIG } from '@/lib/seoConfig'

export const revalidate = 60

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Produto não encontrado', robots: { index: false } }
  const description = (product.descricao || product.nome).slice(0, 160)
  return {
    title: `${product.nome} | ${SEO_CONFIG.site.name}`,
    description,
    alternates: { canonical: `/product/${product.id}/` },
    openGraph: {
      title: product.nome,
      description,
      images: product.imagem_url ? [{ url: product.imagem_url }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()
  const slug = getCategorySlug(product.categoria)
  const related = (await getAllProducts().catch(() => []))
    .filter((p) => p.id !== product.id && p.stock > 0 && getCategorySlug(p.categoria) === slug)
    .slice(0, 4)
  return <ProductPageClient product={product} related={related} />
}
