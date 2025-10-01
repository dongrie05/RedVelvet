'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode integrar com um serviço de email ou API
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-cream-50 via-white to-cream-100">
        <div className="container-luxury">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-redvelvet-500"></div>
              <span className="text-redvelvet-500 font-medium tracking-widest text-sm uppercase">Contactos</span>
              <div className="w-12 h-px bg-redvelvet-500"></div>
            </div>
            <h1 className="heading-luxury text-4xl lg:text-6xl mb-6">
              Entre em Contacto
            </h1>
            <p className="text-luxury text-xl max-w-3xl mx-auto">
              Estamos aqui para ajudar. Entre em contacto connosco para qualquer dúvida, 
              sugestão ou pedido especial.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="animate-fade-in-up">
              <h2 className="heading-luxury text-3xl lg:text-4xl mb-8">
                Informações de Contacto
              </h2>
              
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-redvelvet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-redvelvet-900 mb-2">Email</h3>
                    <p className="text-luxury mb-1">redvelvet.homeliving@gmail.com</p>
                    <p className="text-sm text-redvelvet-600">Resposta em até 24 horas</p>
                  </div>
                </div>


                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-redvelvet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-redvelvet-900 mb-2">Morada</h3>
                    <p className="text-luxury mb-1">Avenida David Morão Ferreira, 55 A</p>
                    <p className="text-luxury mb-1">1750-220 Lisboa, Portugal</p>
                    <p className="text-sm text-redvelvet-600">Showroom por marcação</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-redvelvet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-redvelvet-900 mb-2">Horário de Funcionamento</h3>
                    <div className="text-luxury space-y-1">
                      <p>Segunda - Sexta: 15h00 - 17h00</p>
                      <p>Sábado: 10h00 - 19h00</p>
                      <p>Domingo: Encerrado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12 pt-8 border-t border-redvelvet-200">
                <h3 className="font-semibold text-redvelvet-900 mb-4">Siga-nos</h3>
                <div className="flex space-x-4">
                  <a href="https://instagram.com/red_velvet_fashion_pt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center hover:bg-redvelvet-500 hover:text-white transition-colors duration-300">
                    <span className="text-sm font-semibold">ig</span>
                  </a>
                  <a href="https://tiktok.com/@red_velvet_fashion_pt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-redvelvet-500/10 border border-redvelvet-300/30 rounded-full flex items-center justify-center hover:bg-redvelvet-500 hover:text-white transition-colors duration-300">
                    <span className="text-sm font-semibold">tt</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up-delay">
              <div className="card-luxury p-8">
                <h2 className="heading-luxury text-3xl mb-8">
                  Envie-nos uma Mensagem
                </h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 border border-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Mensagem Enviada!</h3>
                    <p className="text-luxury">Obrigado pelo seu contacto. Responderemos em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-redvelvet-900 mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          id="nome"
                          name="nome"
                          required
                          value={formData.nome}
                          onChange={handleChange}
                          className="input-luxury"
                          placeholder="O seu nome completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-redvelvet-900 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="input-luxury"
                          placeholder="o.seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-redvelvet-900 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          className="input-luxury"
                          placeholder="+351 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="assunto" className="block text-sm font-medium text-redvelvet-900 mb-2">
                          Assunto *
                        </label>
                        <select
                          id="assunto"
                          name="assunto"
                          required
                          value={formData.assunto}
                          onChange={handleChange}
                          className="input-luxury"
                        >
                          <option value="">Selecione um assunto</option>
                          <option value="duvida">Dúvida sobre produto</option>
                          <option value="pedido">Pedido especial</option>
                          <option value="devolucao">Devolução/Troca</option>
                          <option value="parceria">Parceria</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mensagem" className="block text-sm font-medium text-redvelvet-900 mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        id="mensagem"
                        name="mensagem"
                        required
                        rows={6}
                        value={formData.mensagem}
                        onChange={handleChange}
                        className="input-luxury resize-none"
                        placeholder="Conte-nos como podemos ajudar..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary group flex items-center justify-center space-x-3 w-full"
                    >
                      <Send size={20} />
                      <span>Enviar Mensagem</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-spacing gradient-luxury">
        <div className="container-luxury">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="heading-luxury text-3xl lg:text-4xl mb-6">Encontre-nos</h2>
            <p className="text-luxury text-xl max-w-2xl mx-auto">
              Visite o nosso showroom em Lisboa e descubra as nossas peças exclusivas.
            </p>
          </div>

          <div className="card-luxury p-2 animate-fade-in-up-delay">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm border border-redvelvet-200">
              <iframe
                title="Mapa - Avenida David Morão Ferreira, 55 A - Lisboa"
                src="https://www.google.com/maps?q=Avenida%20David%20Mor%C3%A3o%20Ferreira%2C%2055%20A%2C%201750-220%20Lisboa&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-3 text-center">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Avenida%20David%20Mor%C3%A3o%20Ferreira%2C%2055%20A%2C%201750-220%20Lisboa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-redvelvet-600 underline hover:text-redvelvet-700"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
