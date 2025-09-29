'use client'

import { useAuth } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, ShoppingBag, Heart, Settings, LogOut, ArrowRight, X } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import WishlistItemCard from '@/components/product/WishlistItemCard'

export default function AccountPage() {
  const { user, signOut, loading } = useAuth()
  const { wishlist, removeFromWishlist } = useWishlist()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    // Aguardar o carregamento da autenticação
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else {
        setIsLoading(false)
      }
    }
  }, [user, loading, router])

  // Load orders when tab is selected
  useEffect(() => {
    const loadOrders = async () => {
      if (!user || activeTab !== 'orders') return
      try {
        setOrdersLoading(true)
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!customer) {
          setOrders([])
          setOrdersLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('orders')
          .select('id, numero_pedido, total, status, created_at, lista_produtos')
          .eq('cliente_id', customer.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading orders:', error)
          setOrders([])
        } else {
          setOrders(data || [])
        }
      } catch (e) {
        console.error('Unexpected error loading orders:', e)
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }
    loadOrders()
  }, [user, activeTab])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-redvelvet-500"></div>
      </div>
    )
  }

  if (!user) {
    return null // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
          {/* Hero Section */}
          <section className="relative py-8 lg:py-12">
            <div className="container-luxury">
              <div className="text-center mb-6 animate-fade-in-up">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="w-12 h-px bg-redvelvet-500"></div>
                  <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Minha Conta</span>
                  <div className="w-12 h-px bg-redvelvet-500"></div>
                </div>
                <h1 className="heading-luxury text-2xl lg:text-3xl mb-3">
                  Bem-vindo de volta
                </h1>
                <p className="text-luxury max-w-2xl mx-auto">
                  Gerencie a sua conta e acompanhe os seus pedidos na RedVelvet.
                </p>
              </div>
            </div>
          </section>

      {/* Account Content */}
      <section className="py-8 bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-8 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-redvelvet-200 to-redvelvet-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User size={24} className="text-redvelvet-700" />
                  </div>
                  <h3 className="heading-luxury text-lg mb-2">{user.nome || 'Utilizador'}</h3>
                  <div className="text-redvelvet-500 text-xs leading-tight">
                    {user.email.split('@').map((part, index) => (
                      <div key={index}>
                        {index === 0 ? part : `@${part}`}
                      </div>
                    ))}
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-none transition-colors duration-300 ${
                      activeTab === 'profile' 
                        ? 'bg-redvelvet-500 text-white border border-redvelvet-500' 
                        : 'text-redvelvet-700 bg-white border border-redvelvet-200 hover:bg-redvelvet-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <User size={18} />
                      <span>Perfil</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-3 rounded-none transition-colors duration-300 ${
                      activeTab === 'orders' 
                        ? 'bg-redvelvet-500 text-white border border-redvelvet-500' 
                        : 'text-redvelvet-700 bg-white border border-redvelvet-200 hover:bg-redvelvet-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBag size={18} />
                      <span>Meus Pedidos</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full text-left px-4 py-3 rounded-none transition-colors duration-300 ${
                      activeTab === 'wishlist' 
                        ? 'bg-redvelvet-500 text-white border border-redvelvet-500' 
                        : 'text-redvelvet-700 bg-white border border-redvelvet-200 hover:bg-redvelvet-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Heart size={18} />
                      <span>Lista de Desejos</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 rounded-none transition-colors duration-300 ${
                      activeTab === 'settings' 
                        ? 'bg-redvelvet-500 text-white border border-redvelvet-500' 
                        : 'text-redvelvet-700 bg-white border border-redvelvet-200 hover:bg-redvelvet-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Settings size={18} />
                      <span>Configurações</span>
                    </div>
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-redvelvet-600 hover:text-redvelvet-700 hover:bg-redvelvet-50 border border-transparent hover:border-redvelvet-200 rounded-none transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <LogOut size={18} />
                      <span>Sair</span>
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {/* Profile Information */}
                {activeTab === 'profile' && (
                  <div className="card-luxury p-8">
                    <h2 className="heading-luxury text-2xl mb-6">Informações do Perfil</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-redvelvet-900 mb-2">Nome</label>
                      <input
                        type="text"
                        defaultValue={user.nome || ''}
                        className="input-luxury"
                        placeholder="O seu nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-redvelvet-900 mb-2">E-mail</label>
                      <input
                        type="email"
                        defaultValue={user.email || ''}
                        className="input-luxury"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-redvelvet-900 mb-2">Telefone</label>
                      <input
                        type="tel"
                        className="input-luxury"
                        placeholder="+351 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-redvelvet-900 mb-2">Data de Registo</label>
                      <input
                        type="text"
                        defaultValue={new Date().toLocaleDateString('pt-PT')}
                        className="input-luxury"
                        disabled
                      />
                    </div>
                  </div>
                    <div className="mt-6">
                      <button className="btn-primary">
                        Guardar Alterações
                      </button>
                    </div>
                  </div>
                )}

                {/* Orders Section */}
                {activeTab === 'orders' && (
                  <div className="card-luxury p-8">
                    <h2 className="heading-luxury text-2xl mb-6">Meus Pedidos</h2>
                    {ordersLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-redvelvet-500 mx-auto mb-4"></div>
                        <p className="text-redvelvet-600">A carregar pedidos...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag size={48} className="text-redvelvet-300 mx-auto mb-4" />
                        <p className="text-redvelvet-600 text-lg mb-2">Ainda não tem pedidos</p>
                        <p className="text-redvelvet-500 text-sm mb-6">Quando fizer uma compra, os seus pedidos aparecerão aqui.</p>
                        <Link href="/shop" className="btn-primary group inline-flex items-center space-x-2">
                          <span>Explorar Loja</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const itemsCount = Array.isArray(order.lista_produtos) ? order.lista_produtos.length : (order.lista_produtos?.items?.length ?? 0)
                          return (
                            <div key={order.id} className="border border-redvelvet-200 p-4 bg-white flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="text-sm text-redvelvet-500">Pedido #{order.numero_pedido || order.id.slice(0,8)}</div>
                                <div className="text-redvelvet-900 font-medium">{new Date(order.created_at).toLocaleDateString('pt-PT')}</div>
                                <div className="text-sm text-redvelvet-600">{itemsCount} {itemsCount === 1 ? 'artigo' : 'artigos'}</div>
                              </div>
                              <div className="text-right space-y-1">
                                <div className="text-redvelvet-900 font-semibold">{new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(Number(order.total))}</div>
                                <div className="text-xs uppercase tracking-wider text-redvelvet-500">{order.status}</div>
                                <Link href={`/orders/${order.id}`} className="text-sm text-redvelvet-600 hover:text-redvelvet-500 underline">Detalhes</Link>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Wishlist Section */}
                {activeTab === 'wishlist' && (
                  <div className="card-luxury p-8">
                    <h2 className="heading-luxury text-2xl mb-6">Lista de Desejos</h2>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart size={48} className="text-redvelvet-300 mx-auto mb-4" />
                        <p className="text-redvelvet-600 text-lg mb-2">A sua lista de desejos está vazia</p>
                        <p className="text-redvelvet-500 text-sm mb-6">Adicione produtos à sua lista de desejos para os encontrar facilmente mais tarde.</p>
                        <Link href="/shop" className="btn-primary group inline-flex items-center space-x-2">
                          <span>Explorar Loja</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-redvelvet-600 text-sm">
                          {wishlist.length} {wishlist.length === 1 ? 'produto' : 'produtos'} na sua lista de desejos
                        </p>
                        <div className="space-y-3">
                          {wishlist.map((product) => (
                            <WishlistItemCard
                              key={product.id}
                              product={product}
                              onRemove={removeFromWishlist}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Settings Section */}
                {activeTab === 'settings' && (
                  <div className="card-luxury p-8">
                    <h2 className="heading-luxury text-2xl mb-6">Configurações</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-redvelvet-900 mb-2">Notificações por Email</label>
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="w-4 h-4 text-redvelvet-600" defaultChecked />
                          <span className="text-sm text-redvelvet-700">Receber atualizações sobre pedidos</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-redvelvet-900 mb-2">Newsletter</label>
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="w-4 h-4 text-redvelvet-600" />
                          <span className="text-sm text-redvelvet-700">Receber novidades e ofertas especiais</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <button className="btn-primary">
                          Guardar Preferências
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
