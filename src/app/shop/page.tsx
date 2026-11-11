import type { Metadata } from 'next'
import { Suspense } from 'react'
import ShopClient from './ShopClient'
import { getAllProducts } from '@/lib/products'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Loja | RedVelvet',
  description: 'Decoração, velas aromáticas e roupa escolhidas na nossa loja de Lisboa. Envio grátis em Portugal Continental desde 50 €.',
  alternates: { canonical: '/shop/' },
}

export default async function ShopPage() {
  const products = await getAllProducts().catch(() => [])
  return (
    <Suspense>
      <ShopClient products={products} />
    </Suspense>
  )
}
