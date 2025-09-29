'use client'

import { ArrowRight, Heart, Users, Award, Globe } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-cream-50 via-white to-cream-100">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Sobre Nós</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h1 className="heading-luxury text-4xl lg:text-6xl mb-6">
              Nossa História
            </h1>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Uma jornada de paixão pela elegância e sofisticação, criando experiências únicas 
              através de peças cuidadosamente selecionadas.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="heading-luxury text-3xl lg:text-4xl mb-8">
                Nascemos da Paixão pela Elegância
              </h2>
              <div className="space-y-6 text-luxury leading-relaxed">
                <p>
                  A RedVelvet nasceu da convicção de que cada espaço merece ser transformado 
                  em um ambiente único e memorável. Fundada em 2024, nossa marca representa 
                  a fusão perfeita entre tradição e modernidade.
                </p>
                <p>
                  Cada produto em nossa curadoria é selecionado com base em critérios rigorosos 
                  de qualidade, design e autenticidade. Acreditamos que a verdadeira elegância 
                  reside nos detalhes e na capacidade de contar uma história através de cada peça.
                </p>
                <p>
                  Nossa missão é democratizar o acesso ao luxo, oferecendo produtos exclusivos 
                  que elevam o quotidiano e transformam espaços em verdadeiros refúgios de 
                  sofisticação e conforto.
                </p>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up-delay">
              <div className="aspect-[4/5] bg-gradient-to-br from-redvelvet-100 to-cream-200 border border-redvelvet-200 shadow-luxury flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-redvelvet-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Heart size={40} className="text-redvelvet-500" />
                  </div>
                  <p className="text-redvelvet-600 font-medium">Nossa História</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing gradient-luxury">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Valores</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
              O Que Nos Move
            </h2>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Nossos valores fundamentais guiam cada decisão e cada produto que oferecemos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: 'Paixão',
                description: 'Cada produto é escolhido com amor e dedicação, refletindo nossa paixão pela beleza e qualidade.'
              },
              {
                icon: Award,
                title: 'Excelência',
                description: 'Buscamos constantemente a perfeição em cada detalhe, desde a seleção até a entrega.'
              },
              {
                icon: Users,
                title: 'Comunidade',
                description: 'Construímos relacionamentos duradouros com nossos clientes, criando uma comunidade de amantes da elegância.'
              }
            ].map((value, index) => (
              <div 
                key={value.title}
                className="card-luxury p-8 text-center animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon size={32} className="text-redvelvet-500" />
                </div>
                <h3 className="heading-luxury text-2xl mb-4">{value.title}</h3>
                <p className="text-luxury leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Equipa</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
              Conheça Nossa Equipa
            </h2>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Profissionais dedicados que compartilham a mesma visão de excelência e sofisticação.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: 'Ana Silva',
                role: 'Fundadora & CEO',
                description: 'Visionária apaixonada por design e elegância, Ana lidera a RedVelvet com determinação e criatividade.'
              },
              {
                name: 'Carlos Mendes',
                role: 'Diretor Criativo',
                description: 'Especialista em curadoria e design, Carlos é responsável por selecionar cada peça única da nossa coleção.'
              },
              {
                name: 'Maria Santos',
                role: 'Diretora de Operações',
                description: 'Garante que cada experiência seja perfeita, desde a seleção até a entrega aos nossos clientes.'
              }
            ].map((member, index) => (
              <div 
                key={member.name}
                className="card-luxury p-8 text-center animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-redvelvet-200 to-redvelvet-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-redvelvet-700 font-semibold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="heading-luxury text-xl mb-2">{member.name}</h3>
                <p className="text-redvelvet-500 font-medium mb-4">{member.role}</p>
                <p className="text-luxury text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing gradient-luxury">
        <div className="container-luxury text-center">
          <div className="animate-fade-in-up">
            <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
              Junte-se à Nossa História
            </h2>
            <p className="text-luxury text-xl mb-12 max-w-3xl mx-auto">
              Descubra produtos únicos que transformarão o seu espaço e elevarão o seu estilo de vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/shop"
                className="btn-primary group flex items-center justify-center space-x-3"
              >
                <span>Explorar Coleção</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="/contact"
                className="btn-secondary"
              >
                Contactar-nos
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
