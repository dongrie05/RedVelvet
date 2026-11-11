'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()
  const [bump, setBump] = useState(false)

  const pathname = usePathname()
  const [atTop, setAtTop] = useState(true)
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // Na homepage, o header funde-se com o hero cor de veludo até se fazer scroll
  const tone = pathname === '/' && atTop && !isMenuOpen && !isSearchOpen ? 'dark' : 'light'

  useEffect(() => {
    const onAdded = () => { setBump(true); setTimeout(() => setBump(false), 350) }
    window.addEventListener('cart:added', onAdded)
    return () => window.removeEventListener('cart:added', onAdded)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const triggerSearch = () => {
    const term = searchTerm.trim()
    if (term.length === 0) {
      router.push('/shop')
    } else {
      router.push(`/shop?q=${encodeURIComponent(term)}`)
    }
    setIsSearchOpen(false)
  }

  return (
        <header data-tone={tone} className="bg-white/95 backdrop-blur-md border-b border-redvelvet-200 sticky top-0 z-50 transition-colors duration-300">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-32 h-12 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/logo.jpg"
                alt="RedVelvet"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
                <Link href="/" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-sm font-medium tracking-wider uppercase">
              Início
            </Link>
                <Link href="/shop" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-sm font-medium tracking-wider uppercase">
              Loja
            </Link>
                <Link href="/about" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-sm font-medium tracking-wider uppercase">
              Sobre
            </Link>
                <Link href="/contact" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-sm font-medium tracking-wider uppercase">
              Contactos
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Pesquisar"
                  className="p-2 text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300"
            >
              <Search size={20} />
            </button>

            {/* Account */}
            {user ? (
              <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300">
                  <User size={20} />
                  <span className="hidden sm:block text-sm font-medium">{user.nome || user.email}</span>
                </button>
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-redvelvet-200 shadow-luxury py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <Link href="/account" className="block px-6 py-3 text-sm text-redvelvet-700 hover:bg-cream-50 transition-colors duration-200">
                    A Minha Conta
                  </Link>
                  <button
                    onClick={handleSignOut}
                        className="block w-full text-left px-6 py-3 text-sm text-redvelvet-700 hover:bg-cream-50 transition-colors duration-200"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
                  <Link href="/auth/login" className="flex items-center space-x-2 p-2 text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300">
                <User size={20} />
                <span className="hidden sm:block text-sm font-medium">Entrar</span>
              </Link>
            )}

            {/* Cart */}
            <Link id="cart-icon" href="/cart" aria-label={`Carrinho (${itemCount})`} className={`relative p-2 text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 ${bump ? 'scale-110' : ''}`}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span id="cart-badge" className={`absolute -top-1 -right-1 bg-redvelvet-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium transition-transform ${bump ? 'scale-110' : ''}`}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
                  className="lg:hidden p-2 text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
            {isSearchOpen && (
              <div className="py-6 border-t border-redvelvet-200 animate-fade-in-up">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                    placeholder="Pesquisar produtos..."
                    className="input-luxury pl-14"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        triggerSearch()
                      }
                    }}
              />
                  <Search
                    size={24}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 text-redvelvet-400 cursor-pointer"
                    onClick={triggerSearch}
                  />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
              <div className="lg:hidden py-8 border-t border-redvelvet-200 animate-fade-in-up">
            <nav className="flex flex-col space-y-6">
                  <Link href="/" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-lg font-medium tracking-wider uppercase">
                Início
              </Link>
                  <Link href="/shop" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-lg font-medium tracking-wider uppercase">
                Loja
              </Link>
                  <Link href="/about" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-lg font-medium tracking-wider uppercase">
                Sobre
              </Link>
                  <Link href="/contact" className="text-redvelvet-700 hover:text-redvelvet-500 transition-colors duration-300 text-lg font-medium tracking-wider uppercase">
                Contactos
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
