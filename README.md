# RedVelvet - Loja Online

Uma loja online elegante e sofisticada para produtos únicos de decoração, velas e roupa.

## 🚀 Deploy Automático

Este projeto está configurado para deploy automático usando GitHub Actions. Existem duas opções:

### Opção 1: GitHub Pages (Gratuito)
- O site será publicado automaticamente em `https://dongrie05.github.io/RedVelvet/`
- Ativa-se automaticamente quando fazes push para a branch `main`

### Opção 2: Vercel (Recomendado)
- Melhor performance e funcionalidades
- Deploy automático com previews para pull requests
- Configuração mais simples

## 📋 Configuração Inicial

### 1. Secrets do GitHub

Vai a **Settings > Secrets and variables > Actions** no teu repositório e adiciona:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
MOLLIE_API_KEY=your_mollie_api_key
```

### 2. Para Vercel (Opcional)

Se quiseres usar Vercel, adiciona também:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Export para GitHub Pages
npm run export
```

## 📁 Estrutura do Projeto

```
src/
├── app/                 # Páginas Next.js
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── lib/                # Configurações (Supabase, Mollie)
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias
```

## 🔧 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Base de dados e autenticação
- **Mollie** - Pagamentos
- **Lucide React** - Ícones

## 📞 Contacto

- **Email**: redvelvet.homeliving@gmail.com
- **Morada**: Avenida David Morão Ferreira, 55 A - 1750-220 Lisboa
- **Horário**: Segunda-Sexta: 15h00-17h00, Sábado: 10h00-19h00
- **Instagram**: [@red_velvet_fashion_pt](https://instagram.com/red_velvet_fashion_pt)
- **TikTok**: [@red_velvet_fashion_pt](https://tiktok.com/@red_velvet_fashion_pt)

## 🚀 Como Fazer Deploy

1. **Faz push do código para a branch `main`**
2. **Vai ao GitHub Actions** no teu repositório
3. **O deploy será executado automaticamente**
4. **O site estará disponível em alguns minutos**

### Para GitHub Pages:
- Vai a **Settings > Pages** no teu repositório
- Seleciona **Source: GitHub Actions**
- O site estará em `https://dongrie05.github.io/RedVelvet/`

### Para Vercel:
- Conecta o teu repositório GitHub ao Vercel
- O deploy será automático a cada push

## 📝 Notas Importantes

- O projeto está configurado para exportação estática (GitHub Pages)
- As imagens são otimizadas automaticamente
- O site é responsivo e otimizado para SEO
- Todas as funcionalidades estão integradas com Supabase

## 🎨 Design

O design segue uma estética luxuosa e elegante com:
- Paleta de cores sofisticada (vermelho, creme, dourado)
- Tipografia elegante
- Animações suaves
- Layout responsivo
- UX otimizada para conversão