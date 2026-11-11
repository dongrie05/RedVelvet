import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductPageClient from './ProductPageClient'
import { getProduct } from '@/lib/products'
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
  return <ProductPageClient product={product} />
}
