# 📸 Como Adicionar as Imagens ao Site RedVelvet

## ✅ Configuração Completa

Já configurei tudo para teres o **carregamento mais rápido possível** das imagens! Aqui está o que foi implementado:

### 🚀 Otimizações Implementadas

1. **Next.js Image Optimization** - Conversão automática para WebP/AVIF
2. **Preload das Imagens Críticas** - Carregamento prioritário
3. **Componentes Otimizados** - Lazy loading e placeholders
4. **Cache de 30 dias** - Imagens em cache por mais tempo
5. **Tamanhos Responsivos** - Diferentes tamanhos para diferentes dispositivos

## 📁 Estrutura de Pastas Criada

```
public/images/categories/
├── clothing/
│   └── clothing-hero.png (primeira imagem - roupa)
├── candles/
│   └── candles-hero.png (segunda imagem - velas)
├── decorative-elements/
│   └── decorative-elements.png (quarta imagem - elementos decorativos)
└── hero/
    └── hero-main.png (terceira imagem - imagem inicial)
```

## 🎯 Como Adicionar as Imagens

### Opção 1: Via Terminal (Mais Rápido)

1. **Salva as imagens no teu computador** com estes nomes:
   - `clothing-hero.png` (primeira imagem)
   - `candles-hero.png` (segunda imagem)
   - `hero-main.png` (terceira imagem)
   - `decorative-elements.png` (quarta imagem)

2. **Executa estes comandos** (ajusta os caminhos conforme necessário):
```bash
# Navega para a pasta do projeto
cd /Users/goncalodongrie/redvelvet/RedVelvet

# Move as imagens para as pastas corretas
mv ~/Downloads/clothing-hero.png public/images/categories/clothing/
mv ~/Downloads/candles-hero.png public/images/categories/candles/
mv ~/Downloads/hero-main.png public/images/categories/hero/
mv ~/Downloads/decorative-elements.png public/images/categories/decorative-elements/
```

### Opção 2: Via GitHub (Interface Web)

1. Vai ao GitHub e navega para a pasta `public/images/categories/`
2. Clica em "Add file" → "Upload files"
3. Arrasta as imagens para as pastas corretas
4. Faz commit das alterações

## 🔧 Como Usar os Componentes

### Para a Imagem Hero (Página Inicial)
```tsx
import CategoryImage from '@/components/ui/CategoryImage'

<CategoryImage 
  category="hero" 
  priority={true}  // Carrega primeiro
  className="aspect-[4/5] rounded-lg"
/>
```

### Para Categorias
```tsx
<CategoryImage 
  category="clothing"  // ou "candles", "decorative-elements"
  className="w-full h-full object-cover"
/>
```

### Para Imagens Personalizadas
```tsx
import OptimizedImage from '@/components/ui/OptimizedImage'

<OptimizedImage
  src="/images/categories/clothing/clothing-hero.png"
  alt="Coleção de Roupa"
  width={800}
  height={600}
  priority={true}
  quality={90}
/>
```

## ⚡ Performance Garantida

- **WebP/AVIF**: Formatos até 50% menores que JPEG
- **Lazy Loading**: Imagens carregam só quando necessário
- **Preload**: Imagens críticas carregam primeiro
- **Cache**: 30 dias de cache no browser
- **Responsive**: Diferentes tamanhos para mobile/desktop
- **Placeholders**: Animação de loading suave

## 🎨 Resultado Final

Depois de adicionares as imagens, vais ter:

1. **Hero Section**: Imagem principal otimizada com carregamento prioritário
2. **Categorias**: Imagens de fundo nas secções de roupa, velas e elementos decorativos
3. **Performance**: Carregamento ultra-rápido com otimizações automáticas
4. **Responsive**: Perfeito em todos os dispositivos

## 🚀 Deploy

Quando fizeres push para o GitHub, o Vercel vai automaticamente:
- Otimizar as imagens
- Fazer deploy das alterações
- Ativar o cache global

**Está tudo pronto! Só precisas de adicionar as imagens nas pastas corretas! 🎉**
