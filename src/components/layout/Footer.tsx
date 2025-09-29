import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="gradient-dark text-cream-50">
      <div className="container-luxury py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="relative w-32 h-12">
                <Image
                  src="/images/logo.jpg"
                  alt="RedVelvet"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-cream-200 text-sm leading-relaxed">
              Uma curadoria exclusiva de peças únicas que transformam espaços 
              em ambientes sofisticados e memoráveis.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/red_velvet_fashion_pt" target="_blank" rel="noopener noreferrer" className="text-cream-300 hover:text-redvelvet-400 transition-colors duration-300 p-2 border border-cream-300/20 hover:border-redvelvet-400/50">
                <Instagram size={20} />
              </a>
              <a href="https://tiktok.com/@red_velvet_fashion_pt" target="_blank" rel="noopener noreferrer" className="text-cream-300 hover:text-redvelvet-400 transition-colors duration-300 p-2 border border-cream-300/20 hover:border-redvelvet-400/50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-semibold text-redvelvet-400">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-cream-200 hover:text-redvelvet-400 transition-colors duration-300 text-sm">
                  Loja
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream-200 hover:text-redvelvet-400 transition-colors duration-300 text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cream-200 hover:text-redvelvet-400 transition-colors duration-300 text-sm">
                  Contactos
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-cream-200 hover:text-redvelvet-400 transition-colors duration-300 text-sm">
                  Testemunhos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-semibold text-redvelvet-400">Coleções</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop?category=decoracao" className="text-cream-200 hover:text-redvelvet-400 transition-colors duration-300 text-sm">
                  Decoração
                </Link>
              </li>
              <li>
                <Link href="/shop?category=velas" className="text-cream-200 hover:text-redvelvet-400 transition-colors duration-300 text-sm">
                  Velas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=roupa" className="text-cream-200 hover:text-redvelvet-400 transition-colors duration-300 text-sm">
                  Roupa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-semibold text-redvelvet-400">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-redvelvet-400" />
                <span className="text-cream-200 text-sm">redvelvet.homeliving@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-redvelvet-400 mt-0.5" />
                <span className="text-cream-200 text-sm leading-relaxed">
                  Avenida David Morão Ferreira, 55 A<br />
                  1750-220 Lisboa, Portugal
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-redvelvet-400 mt-0.5" />
                <span className="text-cream-200 text-sm leading-relaxed">
                  Segunda a sexta-feira: 15:00 - 17:00<br />
                  Sábado: 10:00 - 19:00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="luxury-divider-thick border-redvelvet-300/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cream-300 text-sm">
              © 2024 RedVelvet. Todos os direitos reservados.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <Link href="/privacy" className="text-cream-300 hover:text-redvelvet-400 text-sm transition-colors duration-300">
                Política de Privacidade
              </Link>
              <Link href="/terms" className="text-cream-300 hover:text-redvelvet-400 text-sm transition-colors duration-300">
                Termos de Serviço
              </Link>
              <Link href="/shipping" className="text-cream-300 hover:text-redvelvet-400 text-sm transition-colors duration-300">
                Envios e Devoluções
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

