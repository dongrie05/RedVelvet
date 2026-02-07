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
    email: 'info@redvelvet.pt',
    phone: '+351-XXX-XXX-XXX',
    address: {
      country: 'PT',
      locality: 'Lisboa',
    },
    currency: 'EUR',
    foundingDate: '2024',
  },
  
  social: {
    twitter: '@redvelvet',
    facebook: 'https://www.facebook.com/redvelvet',
    instagram: 'https://www.instagram.com/redvelvet',
  },
  
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX',
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
      answer: "A RedVelvet é uma loja online portuguesa especializada em produtos únicos de decoração, velas aromáticas artesanais e roupa elegante. Oferecemos uma curadoria cuidadosa de peças selecionadas para criar ambientes sofisticados e memoráveis."
    },
    {
      question: "Que tipos de produtos vendem?",
      answer: "Vendemos três categorias principais: elementos decorativos únicos, velas aromáticas artesanais e roupa elegante. Todos os produtos são selecionados pela sua qualidade premium e design refinado."
    },
    {
      question: "Fazem envios para todo o Portugal?",
      answer: "Sim, fazemos envios para todo o território português continental e ilhas. Os prazos de entrega variam entre 2-5 dias úteis dependendo da localização."
    },
    {
      question: "Qual é a política de devoluções?",
      answer: "Oferecemos 30 dias para devoluções em produtos não personalizados. O produto deve estar nas mesmas condições de recebimento, com etiquetas e embalagem originais."
    },
    {
      question: "As velas são feitas à mão?",
      answer: "Sim, todas as nossas velas são artesanais e feitas à mão com cera de soja natural e óleos essenciais de qualidade premium. Cada vela é única e cuidadosamente elaborada."
    },
    {
      question: "Como posso contactar o apoio ao cliente?",
      answer: "Pode contactar-nos através do email info@redvelvet.pt ou através do formulário de contacto no nosso site. Respondemos normalmente em 24 horas durante dias úteis."
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
