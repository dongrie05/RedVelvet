// SEO Configuration
export const SEO_CONFIG = {
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://redvelvet.pt',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'RedVelvet',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Loja online especializada em produtos únicos de decoração, velas aromáticas e roupa elegante',
    language: 'pt',
    locale: 'pt_PT',
  },
  
  business: {
    name: 'RedVelvet',
    email: 'redvelvet.homeliving@gmail.com',
    phone: '+351916350502',
    address: {
      country: 'PT',
      locality: 'Lisboa',
    },
    currency: 'EUR',
    foundingDate: '2024',
  },
  
  social: {
    twitter: '',
    facebook: '',
    instagram: 'https://instagram.com/red_velvet_fashion_pt',
  },
  
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || '',
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
  },
  
  // Keywords principais para SEO
  primaryKeywords: [
    'loja online Portugal',
    'decoração casa',
    'velas aromáticas',
    'roupa elegante',
    'produtos únicos',
    'design sofisticado',
    'decoração minimalista',
    'velas artesanais',
    'roupa premium',
    'acessórios decoração',
    'candeeiros',
    'elementos decorativos',
    'estilo elegante',
    'qualidade premium'
  ],
  
  // Keywords por categoria
  categoryKeywords: {
    'velas': [
      'vela aromática',
      'vela artesanal',
      'cera de soja',
      'aromaterapia',
      'vela lavanda',
      'vela baunilha',
      'vela eucalipto',
      'vela natural',
      'pavio algodão'
    ],
    'decorative-elements': [
      'decoração casa',
      'elementos decorativos',
      'candeeiros',
      'decoração minimalista',
      'acessórios decoração',
      'objetos decorativos',
      'decoração moderna'
    ],
    'clothing': [
      'roupa elegante',
      'roupa premium',
      'blusa seda',
      'moda feminina',
      'roupa sofisticada',
      'peças exclusivas'
    ]
  },
  
  // FAQ otimizado para AI assistants
  aiOptimizedFAQs: [
    {
      question: "O que é a RedVelvet?",
      answer: "A RedVelvet é uma loja portuguesa, online e com loja física em Lisboa, de decoração, velas aromáticas e roupa, com peças escolhidas uma a uma."
    },
    {
      question: "Que tipos de produtos vendem?",
      answer: "Três coleções: decoração para a casa, velas aromáticas e decorativas, e roupa."
    },
    {
      question: "Fazem envios para todo o Portugal?",
      answer: "Sim, enviamos para Portugal Continental, Açores, Madeira e Espanha, com entrega em 2 a 5 dias úteis. O envio é grátis em Portugal Continental a partir de 50 €."
    },
    {
      question: "Qual é a política de devoluções?",
      answer: "Tem 14 dias após a receção para devolver qualquer artigo, sem indicar motivo. Basta enviar-nos um email com o número da encomenda. Os detalhes estão na página Envios e Devoluções."
    },
    {
      question: "Que formas de pagamento aceitam?",
      answer: "MB WAY, Multibanco, cartão de crédito/débito e Apple Pay, através da plataforma segura Mollie. Não guardamos os dados do seu cartão."
    },
    {
      question: "Como posso contactar o apoio ao cliente?",
      answer: "Pelo WhatsApp ou telefone +351 916 350 502, pelo email redvelvet.homeliving@gmail.com, ou na nossa loja na Avenida David Morão Ferreira, 55 A, em Lisboa."
    }
  ]
}

// Função para gerar keywords dinâmicas baseadas no contexto
export function generateContextualKeywords(baseKeywords: string[], context: string): string[] {
  const contextualKeywords = [...baseKeywords]
  
  switch (context) {
    case 'product':
      contextualKeywords.push('comprar online', 'preço', 'stock', 'entrega rápida')
      break
    case 'category':
      contextualKeywords.push('categoria', 'coleção', 'produtos similares')
      break
    case 'home':
      contextualKeywords.push('início', 'destaques', 'novidades', 'ofertas')
      break
  }
  
  return contextualKeywords
}
