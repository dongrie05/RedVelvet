# RedVelvet - Loja Online

Uma loja online completa construída com Next.js, Supabase e Mollie, oferecendo produtos únicos e elegantes.

## 🚀 Funcionalidades

### ✨ Principais Características
- **E-commerce Completo**: Catálogo de produtos, carrinho de compras, checkout integrado
- **Autenticação**: Sistema de login/registro com Supabase Auth
- **Pagamentos**: Integração com Mollie (Cartões, Apple Pay, Google Pay, MB Way, Multibanco, Transferência)
- **Multi-idioma**: Suporte para Português e Inglês
- **Design Responsivo**: Interface moderna e adaptável a todos os dispositivos
- **SEO Otimizado**: Meta tags e estrutura otimizada para motores de busca

### 🛍️ Páginas Implementadas
- **Home**: Banner principal, categorias em destaque, produtos populares
- **Loja**: Catálogo com filtros por categoria, ordenação e pesquisa
- **Produto**: Página detalhada com imagens, descrição, avaliações
- **Carrinho**: Gestão de itens, cálculo de portes automático
- **Checkout**: Processo de compra completo com múltiplos métodos de pagamento
- **Conta**: Área do cliente com histórico de pedidos
- **Sobre/Contactos**: Informações da empresa e dados de contacto
- **Testemunhos**: Sistema de avaliações de clientes

### 🗄️ Base de Dados (Supabase)
- **products**: Catálogo de produtos com categorias, preços, stock
- **customers**: Dados dos clientes vinculados à autenticação
- **orders**: Pedidos com histórico completo e status
- **reviews**: Sistema de avaliações e comentários
- **categories**: Organização de produtos por categorias

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS com tema personalizado
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Pagamentos**: Mollie (cartões, MB Way, Apple Pay, Google Pay, Multibanco, transferência)
- **Internacionalização**: next-i18next
- **SEO**: next-seo
- **Ícones**: Lucide React

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Supabase
- Conta Stripe

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/redvelvet.git
cd redvelvet
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e configure suas chaves:
```bash
cp env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase

# Mollie
MOLLIE_API_KEY=sua_chave_da_mollie

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Base de Dados
Execute o script SQL no Supabase:
```bash
# Copie o conteúdo de supabase-schema.sql e execute no SQL Editor do Supabase
```

### 5. Executar o Projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🗃️ Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── auth/              # Autenticação (login, register)
│   ├── cart/              # Carrinho de compras
│   ├── checkout/          # Finalização de compra
│   ├── product/           # Páginas de produtos
│   ├── shop/              # Catálogo da loja
│   └── admin/             # Área administrativa
├── components/            # Componentes reutilizáveis
│   ├── layout/            # Header, Footer
│   ├── product/           # ProductCard, CategoryFilter
│   └── ui/                # Componentes de interface
├── hooks/                 # Hooks personalizados
├── lib/                   # Configurações (Supabase, Mollie)
├── locales/               # Traduções (PT, EN)
├── types/                 # Definições TypeScript
└── utils/                 # Funções utilitárias
```

## 📊 Importação de Produtos

### Via Interface Web
1. Acesse `/admin/import`
2. Descarregue o template CSV
3. Preencha com seus produtos
4. Faça upload e importe

### Formato CSV
```csv
codigo,descricao,referencia,iva,familia,preco
DEC001,Vela Aromática Lavanda,REF001,23,Velas,24.90
DEC002,Candeeiro Minimalista,REF002,23,Decoração,89.90
```

### Campos Obrigatórios
- **codigo**: Código único do produto
- **descricao**: Nome/descrição do produto
- **referencia**: Referência interna
- **iva**: Taxa de IVA (0-100)
- **familia**: Categoria do produto
- **preco**: Preço em euros

## 🎨 Personalização

### Cores do Tema
Edite `tailwind.config.js` para personalizar as cores:
```javascript
colors: {
  primary: {
    500: '#ef4444', // Vermelho principal
    600: '#dc2626',
    // ...
  }
}
```

### Traduções
Adicione novas traduções em `src/locales/[idioma]/common.json`

### Componentes
Todos os componentes são modulares e podem ser facilmente personalizados.

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### GitHub Pages
```bash
npm run deploy
```

### Outras Plataformas
O projeto é compatível com qualquer plataforma que suporte Next.js.

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas de lint
npm run type-check   # Verificar tipos TypeScript
npm run export       # Exportar para estático
```

## 📱 Funcionalidades Mobile

- Design totalmente responsivo
- Touch-friendly interface
- Otimizado para performance mobile
- PWA ready (configurável)

## 🔒 Segurança

- Autenticação segura com Supabase
- Row Level Security (RLS) ativado
- Validação de dados no frontend e backend
- HTTPS obrigatório em produção

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm run test

# Testes de integração
npm run test:integration
```

## 📈 Performance

- Otimização de imagens com Next.js Image
- Lazy loading de componentes
- Cache otimizado
- Bundle splitting automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para `suporte@redvelvet.pt` ou abra uma issue no GitHub.

## 🎯 Roadmap

- [ ] Sistema de cupões de desconto
- [ ] Wishlist/Favoritos
- [ ] Chat de suporte ao cliente
- [ ] App mobile nativo
- [ ] Sistema de afiliados
- [ ] Analytics avançados
- [ ] Integração com redes sociais
- [ ] Sistema de notificações push

---

**Desenvolvido com ❤️ para RedVelvet**