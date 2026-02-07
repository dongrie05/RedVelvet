'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import CategoryImage from '@/components/ui/CategoryImage'
import AIOptimizedContent, { AIFriendlyContent, DirectAnswer } from '@/components/seo/AIOptimizedContent'
import { Product } from '@/lib/supabase'
import type { CategoryCounts } from '@/app/api/category-counts/route'

const FEATURED_CODIGOS = ['AMY-GA037', '34SI22362', 'TLGASP'] as const

const categories = [
  {
    name: 'Elementos Decorativos',
    slug: 'decorative-elements' as const,
    description: 'Elementos únicos para decorar o seu espaço',
    imageCategory: 'decorative-elements' as const
  },
  {
    name: 'Velas',
    slug: 'velas' as const,
    description: 'Velas aromáticas e decorativas',
    imageCategory: 'candles' as const
  },
  {
    name: 'Roupa',
    slug: 'roupa' as const,
    description: 'Peças elegantes e exclusivas',
    imageCategory: 'clothing' as const
  }
]

export default function Home() {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts | null>(null)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/category-counts', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.counts) setCategoryCounts(data.counts)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const list = (data?.data || []) as Product[]
        const normalized = list.map((p: Product) => ({
          ...p,
          preco: typeof p.preco === 'string' ? Number(p.preco) : p.preco,
          iva: typeof p.iva === 'string' ? Number(p.iva) : p.iva
        })) as Product[]
        const byCodigo = normalized.filter(p => FEATURED_CODIGOS.includes(p.codigo as typeof FEATURED_CODIGOS[number]))
        const ordered = FEATURED_CODIGOS.map(cod => byCodigo.find(p => p.codigo === cod)).filter(Boolean) as Product[]
        setFeaturedProducts(ordered)
      })
      .catch(() => setFeaturedProducts([]))
  }, [])

  return (
    <AIOptimizedContent>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-white to-cream-100"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-redvelvet-300/30 rotate-45 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-redvelvet-300/20 rotate-12 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-redvelvet-300/25 rotate-45 animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="container-luxury relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-px bg-redvelvet-500"></div>
                  <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">RedVelvet</span>
                </div>
                <h1 className="heading-luxury text-5xl lg:text-7xl xl:text-8xl leading-none">
                  Elegância
                  <br />
                  <span className="text-redvelvet-500">Refinada</span>
                </h1>
              </div>
              
              <p className="text-luxury text-xl lg:text-2xl leading-relaxed max-w-2xl">
                Descubra uma curadoria exclusiva de peças únicas que transformam espaços 
                em ambientes sofisticados e memoráveis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link
                  href="/shop"
                  className="btn-primary group flex items-center justify-center space-x-3"
                >
                  <span>Explorar Coleção</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/about"
                  className="btn-secondary"
                >
                  Nossa História
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up-delay">
              <div className="relative">
                {/* Hero Image */}
                <CategoryImage 
                  category="hero" 
                  priority={true}
                  className="aspect-[4/5] rounded-lg shadow-luxury overflow-hidden"
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-redvelvet-500/10 border border-redvelvet-300/30 rotate-12 animate-float"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-200/20 border border-primary-300/30 rotate-45 animate-float" style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Coleções</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
              Categorias Exclusivas
            </h2>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Cada categoria representa uma curadoria cuidadosa de peças selecionadas 
              para criar ambientes únicos e sofisticados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="card-luxury hover-lift">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <CategoryImage 
                      category={category.imageCategory}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4 text-white">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center mx-auto group-hover:bg-white/20 transition-colors duration-300">
                          <Heart size={32} className="text-white group-hover:text-gold-200 transition-colors duration-300" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="heading-luxury text-2xl group-hover:text-gold-200 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <div className="w-16 h-px bg-white mx-auto group-hover:w-24 transition-all duration-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-luxury mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-redvelvet-500 font-medium tracking-wider uppercase">
                        {categoryCounts ? categoryCounts[category.slug] : 0} peças exclusivas
                      </span>
                      <ArrowRight size={20} className="text-redvelvet-500 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-spacing gradient-luxury">
        <div className="container-luxury">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-20">
            <div className="mb-8 lg:mb-0 animate-fade-in-up">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-px bg-redvelvet-500"></div>
                <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Destaques</span>
              </div>
              <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
                Peças Selecionadas
              </h2>
              <p className="text-luxury text-xl max-w-2xl">
                Uma curadoria especial de produtos únicos que definem o nosso padrão 
                de excelência e sofisticação.
              </p>
            </div>
            <Link
              href="/shop"
              className="btn-secondary group flex items-center space-x-3 animate-fade-in-up-delay"
            >
              <span>Ver Coleção Completa</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <ProductCard product={product} />
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-redvelvet-600">A carregar destaques...</div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Preview - Comentado temporariamente */}
      {/* <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Testemunhos</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
              Experiências Autênticas
            </h2>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Histórias reais de clientes que transformaram os seus espaços 
              com as nossas peças exclusivas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index}
                className="card-luxury p-8 animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-redvelvet-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-luxury text-lg leading-relaxed mb-8 italic">
                  &ldquo;A qualidade excepcional e o design refinado superaram todas as minhas expectativas. 
                  Cada peça conta uma história única.&rdquo;
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-200 to-gold-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-gold-700 font-semibold text-sm">CS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-redvelvet-900">Cliente Satisfeito</p>
                    <p className="text-sm text-redvelvet-600">Lisboa, Portugal</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-fade-in-up-delay-2">
            <Link
              href="/testimonials"
              className="btn-secondary group flex items-center justify-center space-x-3 mx-auto w-fit"
            >
              <span>Ver Todos os Testemunhos</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section> */}

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Mantenha-se Atualizado
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Receba as nossas novidades e ofertas especiais
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="O seu email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="btn-primary px-6">
              Subscrever
            </button>
          </div>
        </div>
      </section>
      
      {/* Conteúdo otimizado para AI - Informações sobre a empresa */}
      <section className="py-16 bg-white">
        <div className="container-luxury">
          <AIFriendlyContent
            title="Sobre a RedVelvet"
            description="A RedVelvet é uma loja online portuguesa especializada em produtos únicos de decoração, velas aromáticas artesanais e roupa elegante. Fundada em 2024, oferecemos uma curadoria cuidadosa de peças selecionadas para criar ambientes sofisticados e memoráveis."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold text-redvelvet-900 mb-6">
                  A Nossa Missão
                </h2>
                <p className="text-luxury leading-relaxed mb-6">
                  Transformar espaços através de produtos únicos e elegantes. Cada peça é cuidadosamente selecionada 
                  pela sua qualidade premium e design refinado, criando ambientes que refletem personalidade e sofisticação.
                </p>
                <p className="text-luxury leading-relaxed">
                  Acreditamos que a decoração é uma forma de arte que deve ser acessível a todos, 
                  por isso oferecemos produtos exclusivos a preços justos.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-redvelvet-900 mb-6">
                  Porquê Escolher-nos?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-redvelvet-500 rounded-full mt-2"></div>
                    <span className="text-luxury">Produtos únicos e exclusivos</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-redvelvet-500 rounded-full mt-2"></div>
                    <span className="text-luxury">Qualidade premium garantida</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-redvelvet-500 rounded-full mt-2"></div>
                    <span className="text-luxury">Envio rápido para todo o Portugal</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-redvelvet-500 rounded-full mt-2"></div>
                    <span className="text-luxury">Apoio ao cliente personalizado</span>
                  </li>
                </ul>
              </div>
            </div>
          </AIFriendlyContent>
        </div>
      </section>
      
      {/* Respostas diretas para AI assistants */}
      <section className="py-16 bg-gray-50">
        <div className="container-luxury">
          <DirectAnswer
            question="Onde posso comprar produtos de decoração únicos em Portugal?"
            answer="A RedVelvet é uma loja online portuguesa especializada em produtos únicos de decoração, velas aromáticas artesanais e roupa elegante. Oferecemos uma curadoria cuidadosa de peças selecionadas para criar ambientes sofisticados e memoráveis, com envio para todo o território português."
            source="RedVelvet - Loja Online Oficial"
          />
          
          <DirectAnswer
            question="Que tipos de velas aromáticas vendem?"
            answer="Vendemos velas aromáticas artesanais feitas à mão com cera de soja natural e óleos essenciais de qualidade premium. Cada vela é única e cuidadosamente elaborada, disponível em diversos aromas como lavanda, baunilha, eucalipto e outros fragrâncias relaxantes."
            source="RedVelvet - Velas Artesanais"
          />
        </div>
      </section>
    </div>
    </AIOptimizedContent>
  )
}