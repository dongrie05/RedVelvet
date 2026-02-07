// Temporariamente desabilitado para resolver problemas de build
/*
import ProductPageClient from './ProductPageClient'
import { generateMetadata, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { Metadata } from 'next'

// Mock data - será substituído por dados reais do Supabase
const mockProduct = {
  id: '1',
  codigo: 'DEC001',
  referencia: 'REF001',
  nome: 'Vela Aromática Lavanda',
  descricao: 'Vela artesanal com aroma relaxante de lavanda, perfeita para criar um ambiente acolhedor. Feita com cera de soja 100% natural e pavio de algodão, esta vela oferece uma queima limpa e duradoura.',
  categoria: 'Velas',
  preco: 24.90,
  stock: 15,
  tamanhos: ['Pequena', 'Média', 'Grande'],
  imagem_url: '/images/vela-lavanda.jpg',
  iva: 23,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Generate static params for static export
export async function generateStaticParams() {
  // Return a list of product IDs to pre-generate
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}

// Generate metadata for each product page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // In a real app, fetch product data from Supabase
  const product = mockProduct // Replace with actual data fetching
  
  return generateMetadata({
    title: `${product.nome} - Vela Aromática Artesanal`,
    description: `${product.descricao} Compre online na RedVelvet. Qualidade premium, envio rápido para todo o Portugal.`,
    keywords: [
      'vela aromática',
      'vela lavanda',
      'vela artesanal',
      'cera de soja',
      'decoração casa',
      'aromaterapia',
      'produtos naturais',
      'RedVelvet'
    ],
    canonical: `/product/${product.id}`,
    ogImage: product.imagem_url,
    ogType: 'product'
  })
}

export default function ProductPage() {
  return <ProductPageClient />
}
*/

import { redirect } from 'next/navigation'

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}

export default function ProductPage() {
  // Temporariamente redirecionar para a loja
  redirect('/shop')
}
