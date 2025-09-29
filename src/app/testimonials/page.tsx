'use client'

import { Star, Quote, Heart, Award, Users } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      nome: 'Ana Costa',
      localizacao: 'Lisboa',
      rating: 5,
      comentario: 'A qualidade excepcional e o design refinado superaram todas as minhas expectativas. Cada peça conta uma história única e transformou completamente o meu espaço.',
      produto: 'Vela Aromática Lavanda',
      avatar: 'AC'
    },
    {
      id: 2,
      nome: 'Carlos Silva',
      localizacao: 'Porto',
      rating: 5,
      comentario: 'O atendimento personalizado e a atenção aos detalhes são incomparáveis. A RedVelvet não vende apenas produtos, vende experiências únicas.',
      produto: 'Candeeiro Minimalista',
      avatar: 'CS'
    },
    {
      id: 3,
      nome: 'Maria Santos',
      localizacao: 'Coimbra',
      rating: 5,
      comentario: 'Descobri a RedVelvet através de uma amiga e desde então sou cliente fiel. A curadoria é impecável e cada peça é uma obra de arte.',
      produto: 'Blusa Elegante',
      avatar: 'MS'
    },
    {
      id: 4,
      nome: 'João Pereira',
      localizacao: 'Braga',
      rating: 5,
      comentario: 'A entrega foi rápida e o produto chegou em perfeitas condições. A embalagem é elegante e mostra o cuidado que têm com cada detalhe.',
      produto: 'Vaso Decorativo Cerâmica',
      avatar: 'JP'
    },
    {
      id: 5,
      nome: 'Sofia Almeida',
      localizacao: 'Faro',
      rating: 5,
      comentario: 'Adoro a filosofia da marca. Produtos sustentáveis, elegantes e que realmente fazem a diferença no meu dia a dia. Recomendo vivamente!',
      produto: 'Calças de Linho',
      avatar: 'SA'
    },
    {
      id: 6,
      nome: 'Miguel Rodrigues',
      localizacao: 'Aveiro',
      rating: 5,
      comentario: 'A RedVelvet transformou a minha casa num verdadeiro refúgio de elegância. Cada peça foi escolhida com tanto cuidado que parece feita especialmente para mim.',
      produto: 'Vela Aromática Rosas',
      avatar: 'MR'
    }
  ]

  const stats = [
    {
      icon: Users,
      number: '500+',
      label: 'Clientes Satisfeitos'
    },
    {
      icon: Star,
      number: '4.9',
      label: 'Avaliação Média'
    },
    {
      icon: Award,
      number: '98%',
      label: 'Taxa de Satisfação'
    },
    {
      icon: Heart,
      number: '1000+',
      label: 'Produtos Vendidos'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-cream-50 via-white to-cream-100">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Testemunhos</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h1 className="heading-luxury text-4xl lg:text-6xl mb-6">
              O Que Dizem os Nossos Clientes
            </h1>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Histórias reais de clientes que transformaram os seus espaços 
              com as nossas peças exclusivas e descobriram o verdadeiro significado da elegância.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={32} className="text-redvelvet-500" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-redvelvet-500 mb-2">
                  {stat.number}
                </div>
                <p className="text-luxury font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-spacing gradient-luxury">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Avaliações</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
              Experiências Autênticas
            </h2>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Cada testemunho representa uma história única de transformação e satisfação.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className="card-luxury p-8 animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center mb-6">
                  <Quote size={20} className="text-redvelvet-500" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-redvelvet-500 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <blockquote className="text-luxury text-lg leading-relaxed mb-8 italic">
                  &ldquo;{testimonial.comentario}&rdquo;
                </blockquote>

                {/* Product */}
                <div className="mb-6 p-3 bg-redvelvet-50 border border-redvelvet-200 rounded">
                  <p className="text-sm text-redvelvet-600 font-medium">Produto:</p>
                  <p className="text-sm text-redvelvet-700">{testimonial.produto}</p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-redvelvet-200 to-redvelvet-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-redvelvet-700 font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-redvelvet-900">{testimonial.nome}</p>
                    <p className="text-sm text-redvelvet-600">{testimonial.localizacao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="card-luxury p-12 text-center animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <Quote size={32} className="text-redvelvet-500" />
              </div>
              
              <blockquote className="text-luxury text-2xl lg:text-3xl leading-relaxed mb-12 italic">
                &ldquo;A RedVelvet não é apenas uma loja, é uma experiência completa. 
                Desde o primeiro contacto até à entrega, tudo é pensado para nos fazer sentir especiais. 
                Os produtos são únicos e a qualidade é excepcional.&rdquo;
              </blockquote>

              <div className="flex items-center justify-center mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-redvelvet-500 fill-current" />
                ))}
              </div>

              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-redvelvet-200 to-redvelvet-300 rounded-full mr-6 flex items-center justify-center">
                  <span className="text-redvelvet-700 font-semibold text-lg">AC</span>
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold text-redvelvet-900">Ana Costa</p>
                  <p className="text-redvelvet-600">Cliente desde 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing gradient-luxury">
        <div className="container-luxury text-center">
          <div className="animate-fade-in-up">
            <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
              Junte-se à Nossa Comunidade
            </h2>
            <p className="text-luxury text-xl mb-12 max-w-3xl mx-auto">
              Descubra por si próprio por que tantos clientes escolhem a RedVelvet 
              para transformar os seus espaços em ambientes únicos e elegantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/shop"
                className="btn-primary group flex items-center justify-center space-x-3"
              >
                <span>Explorar Coleção</span>
                <Heart size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="/contact"
                className="btn-secondary"
              >
                Partilhar Experiência
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
