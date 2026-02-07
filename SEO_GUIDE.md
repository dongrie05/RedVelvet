# SEO e Otimização para AI Assistants - RedVelvet

Este projeto implementa uma estratégia completa de SEO otimizada tanto para motores de busca tradicionais quanto para AI assistants como ChatGPT, Perplexity, Claude e outros.

## 🚀 Funcionalidades Implementadas

### SEO Tradicional
- ✅ Metadata dinâmico com Open Graph e Twitter Cards
- ✅ Dados estruturados JSON-LD (Schema.org)
- ✅ Sitemap.xml automático
- ✅ Robots.txt otimizado
- ✅ Breadcrumbs estruturados
- ✅ URLs amigáveis
- ✅ Otimização de imagens com alt text

### Otimização para AI Assistants (GEO - Generative Engine Optimization)
- ✅ Conteúdo estruturado com FAQ otimizado
- ✅ Respostas diretas para perguntas comuns
- ✅ Conteúdo semântico e contextual
- ✅ Robots.txt específico para AI crawlers
- ✅ Dados estruturados para melhor compreensão
- ✅ Conteúdo otimizado para pesquisa por voz

### Analytics e Tracking
- ✅ Google Analytics 4 configurado
- ✅ Eventos de e-commerce
- ✅ Tracking de interações com AI
- ✅ Métricas de performance

## 📁 Estrutura dos Arquivos

```
src/
├── lib/
│   ├── seo.ts                 # Funções principais de SEO
│   ├── seoConfig.ts           # Configuração centralizada
│   └── analytics.ts           # Tracking e analytics
├── components/
│   ├── seo/
│   │   └── AIOptimizedContent.tsx  # Componente para AI
│   └── analytics/
│       └── GoogleAnalytics.tsx     # GA4 integration
└── app/
    ├── layout.tsx             # Metadata global
    ├── sitemap.ts             # Sitemap automático
    ├── robots.ts              # Robots.txt
    └── product/[id]/
        └── page.tsx           # Metadata dinâmico por produto
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
# SEO Configuration
NEXT_PUBLIC_SITE_URL=https://redvelvet.pt
NEXT_PUBLIC_SITE_NAME=RedVelvet
NEXT_PUBLIC_SITE_DESCRIPTION=Loja online especializada em produtos únicos de decoração, velas aromáticas e roupa elegante

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Search Console
GOOGLE_SITE_VERIFICATION=your-google-site-verification-code

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@redvelvet
NEXT_PUBLIC_FACEBOOK_PAGE=https://www.facebook.com/redvelvet
NEXT_PUBLIC_INSTAGRAM_HANDLE=https://www.instagram.com/redvelvet

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=info@redvelvet.pt
NEXT_PUBLIC_CONTACT_PHONE=+351-XXX-XXX-XXX
```

### 2. Google Analytics Setup

1. Crie uma conta no Google Analytics 4
2. Obtenha o ID de tracking (formato: G-XXXXXXXXXX)
3. Adicione ao arquivo `.env.local`
4. O tracking será automático em todas as páginas

### 3. Google Search Console

1. Adicione o site ao Google Search Console
2. Obtenha o código de verificação
3. Adicione ao arquivo `.env.local`
4. Submeta o sitemap: `https://redvelvet.pt/sitemap.xml`

## 🎯 Estratégias de SEO Implementadas

### Para Motores de Busca Tradicionais

1. **On-Page SEO**
   - Títulos otimizados (H1, H2, H3)
   - Meta descriptions únicas
   - Keywords estratégicas
   - URLs semânticas

2. **Technical SEO**
   - Core Web Vitals otimizados
   - Imagens otimizadas
   - Carregamento rápido
   - Mobile-first design

3. **Structured Data**
   - Organization schema
   - Product schema
   - Breadcrumb schema
   - FAQ schema
   - Website schema

### Para AI Assistants

1. **Conteúdo Estruturado**
   - FAQ otimizado para perguntas comuns
   - Respostas diretas e claras
   - Informações contextuais

2. **Semantic Markup**
   - Dados estruturados JSON-LD
   - Schema.org completo
   - Metadados semânticos

3. **AI-Friendly Content**
   - Perguntas e respostas estruturadas
   - Informações verificáveis
   - Conteúdo atualizado

## 📊 Monitoramento

### Google Analytics Events

O sistema rastreia automaticamente:

- **E-commerce**: Visualizações de produtos, adições ao carrinho, compras
- **AI Interactions**: Pesquisas via AI, visualizações de FAQ
- **User Behavior**: Navegação, tempo na página, bounce rate

### Métricas Importantes

1. **SEO Tradicional**
   - Posições no Google
   - Tráfego orgânico
   - CTR (Click-Through Rate)
   - Core Web Vitals

2. **AI Optimization**
   - Menções em AI assistants
   - Citações como fonte
   - Tráfego de AI crawlers

## 🔧 Personalização

### Adicionar Novas Keywords

Edite `src/lib/seoConfig.ts`:

```typescript
primaryKeywords: [
  'nova keyword',
  'outra keyword',
  // ...
]
```

### Adicionar FAQ Personalizado

```typescript
// Em qualquer componente
<AIOptimizedContent faqs={[
  {
    question: "Nova pergunta?",
    answer: "Resposta detalhada..."
  }
]}>
  {/* Seu conteúdo */}
</AIOptimizedContent>
```

### Tracking Personalizado

```typescript
import { trackAISearch, trackFAQView } from '@/lib/analytics'

// Rastrear pesquisa AI
trackAISearch('pergunta do usuário', 'chatgpt')

// Rastrear visualização de FAQ
trackFAQView('Pergunta específica')
```

## 🚀 Deploy e Verificação

### 1. Build e Deploy

```bash
npm run build
npm run export
```

### 2. Verificação SEO

1. **Google Search Console**: Verifique indexação
2. **Google PageSpeed Insights**: Teste performance
3. **Rich Results Test**: Valide structured data
4. **Mobile-Friendly Test**: Confirme responsividade

### 3. Teste AI Assistants

Teste perguntas como:
- "Onde posso comprar velas aromáticas em Portugal?"
- "Que tipos de produtos vende a RedVelvet?"
- "Como contactar a RedVelvet?"

## 📈 Próximos Passos

1. **Monitoramento Contínuo**
   - Acompanhe métricas no GA4
   - Monitore posições no Google
   - Verifique menções em AI assistants

2. **Otimização Contínua**
   - Atualize conteúdo regularmente
   - Adicione novos FAQ baseados em perguntas reais
   - Otimize baseado em dados

3. **Expansão**
   - Adicione mais structured data
   - Implemente reviews schema
   - Otimize para mais AI assistants

## 🆘 Suporte

Para dúvidas ou problemas:
- Verifique os logs do console
- Confirme variáveis de ambiente
- Teste em ambiente de desenvolvimento primeiro

---

**Nota**: Esta implementação segue as melhores práticas atuais de SEO e otimização para AI assistants, garantindo máxima visibilidade tanto em motores de busca tradicionais quanto em plataformas de IA emergentes.
