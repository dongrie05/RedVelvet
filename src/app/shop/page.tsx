'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Grid, List, SlidersHorizontal } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import CategoryFilter from '@/components/product/CategoryFilter'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Product, supabase } from '@/lib/supabase'

// Categorias base (podes substituir por query se tiveres tabela categories)

const categories = ['Decoração', 'Velas', 'Roupa']

type SortOption = 'preco_asc' | 'preco_desc' | 'nome_asc' | 'nome_desc'

function ShopPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  )
  const [query, setQuery] = useState<string>(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState<SortOption>('nome_asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 500
  })

  // Sanitize numeric inputs to avoid leading zeros like "0100"
  const sanitizeNumber = (value: string) => {
    const trimmed = value.trim()
    // Remove leading zeros but keep single 0
    const normalized = trimmed.replace(/^0+(?=\d)/, '')
    const num = Number(normalized === '' ? '0' : normalized)
    return Number.isNaN(num) ? 0 : num
  }

  // Load products from Supabase (fetch all; client-side diacritic-insensitive filtering)
  useEffect(() => {
    const load = async () => {
      try {
        console.log('[Shop] Fetching products from Supabase...')
        let req = supabase
          .from('products')
          .select('id,codigo,referencia,nome,descricao,categoria,preco,stock,tamanhos,imagem_url,iva,created_at,updated_at')
          .order('created_at', { ascending: false })
        const { data, error } = await req

        if (error) {
          console.error('[Shop] Error loading products from Supabase:', error)
          setProducts([])
          setFilteredProducts([])
        } else {
          console.log('[Shop] Loaded products:', data?.length)
          const normalized = (data || []).map((p: any) => ({
            ...p,
            preco: typeof p.preco === 'string' ? Number(p.preco) : p.preco,
            iva: typeof p.iva === 'string' ? Number(p.iva) : p.iva,
          })) as Product[]
          setProducts(normalized)
          setFilteredProducts(normalized)
        }
      } catch (err) {
        console.error('[Shop] Unexpected error loading products:', err)
        setProducts([])
        setFilteredProducts([])
      }
    }
    load()
  }, [])

  // Ensure fresh data when navigating back/forward without full refresh
  useEffect(() => {
    const handle = () => {
      // Trigger filters recompute and ensure state is up-to-date
      setFilteredProducts(prev => [...prev])
    }
    window.addEventListener('pageshow', handle)
    return () => window.removeEventListener('pageshow', handle)
  }, [])

  // Sync query param changes driven by Header search
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  // Filter and sort products (includes diacritic-insensitive text search)
  useEffect(() => {
    let filtered = [...products]

    const normalize = (s: string | undefined | null) =>
      (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

    const qn = normalize(query)
    if (qn.length > 0) {
      filtered = filtered.filter(p => {
        const fields = [p.nome, p.descricao || '', p.categoria, p.codigo, p.referencia]
        return fields.some(f => normalize(f).includes(qn))
      })
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoria === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter(
      product => product.preco >= priceRange.min && product.preco <= priceRange.max
    )

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'preco_asc':
          return a.preco - b.preco
        case 'preco_desc':
          return b.preco - a.preco
        case 'nome_asc':
          return a.nome.localeCompare(b.nome)
        case 'nome_desc':
          return b.nome.localeCompare(a.nome)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy, priceRange, query])

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
  }

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('pt-PT', {
  //     style: 'currency',
  //     currency: 'EUR'
  //   }).format(price)
  // }

  // Generate breadcrumbs based on current state
  const getBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; href?: string }> = [
      { label: 'Início', href: '/' },
      { label: 'Loja', href: '/shop' }
    ]

    if (selectedCategory) {
      breadcrumbs.push({ label: selectedCategory })
    }

    return breadcrumbs
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-luxury py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={getBreadcrumbs()} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-px bg-redvelvet-500"></div>
            <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Loja</span>
            <div className="w-12 h-px bg-redvelvet-500"></div>
          </div>
          <h1 className="heading-luxury text-3xl lg:text-4xl mb-4">
            {selectedCategory ? selectedCategory : 'Nossa Coleção'}
          </h1>
          <p className="text-luxury text-lg">
            {selectedCategory 
              ? `Descubra a nossa seleção de ${selectedCategory.toLowerCase()} únicos e elegantes`
              : 'Descubra a nossa seleção de produtos únicos e elegantes'
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Category Filter */}
            <div className="card-luxury p-6">
              <h3 className="heading-luxury text-lg mb-4">Categorias</h3>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Price Filter */}
            <div className="card-luxury p-6">
              <h3 className="heading-luxury text-lg mb-4">Preço</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    onBlur={(e) => setPriceRange(prev => {
                      const minVal = sanitizeNumber(e.target.value)
                      return { ...prev, min: minVal }
                    })}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={0}
                    step={1}
                    className="input-field"
                  />
                  <span className="text-redvelvet-500 font-medium">€</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    onBlur={(e) => setPriceRange(prev => {
                      const maxVal = sanitizeNumber(e.target.value)
                      return { ...prev, max: maxVal }
                    })}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={0}
                    step={1}
                    className="input-field"
                  />
                  <span className="text-redvelvet-500 font-medium">€</span>
                </div>
              </div>
            </div>

            {/* Stock Filter */}
            <div className="card-luxury p-6">
              <h3 className="heading-luxury text-lg mb-4">Disponibilidade</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-redvelvet-300 text-redvelvet-600 focus:ring-redvelvet-500"
                />
                <span className="ml-2 text-sm text-redvelvet-700">Apenas em stock</span>
              </label>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="card-luxury p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-redvelvet-600 font-medium">
                    {filteredProducts.length} produtos encontrados
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="input-field text-sm"
                  >
                    <option value="nome_asc">Nome: A-Z</option>
                    <option value="nome_desc">Nome: Z-A</option>
                    <option value="preco_asc">Preço: Menor para Maior</option>
                    <option value="preco_desc">Preço: Maior para Menor</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-redvelvet-200 rounded-none">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 transition-colors duration-300 ${
                        viewMode === 'grid' 
                          ? 'bg-redvelvet-500 text-white' 
                          : 'text-redvelvet-600 hover:bg-redvelvet-50'
                      }`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 transition-colors duration-300 ${
                        viewMode === 'list' 
                          ? 'bg-redvelvet-500 text-white' 
                          : 'text-redvelvet-600 hover:bg-redvelvet-50'
                      }`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-redvelvet-300 mb-4">
                  <SlidersHorizontal size={48} className="mx-auto" />
                </div>
                <h3 className="heading-luxury text-lg mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-luxury mb-6">
                  Tente ajustar os filtros para encontrar o que procura.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setPriceRange({ min: 0, max: 500 })
                  }}
                  className="btn-primary"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return <ShopPageContent />
}
