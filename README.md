# RedVelvet - Loja Online

Uma loja online elegante e sofisticada para produtos únicos de decoração, velas e roupa.

## 🚀 Deploy Automático

Este projeto está configurado para fazer deploy automático usando GitHub Actions. Tens duas opções:

### Opção 1: GitHub Pages (Gratuito)

1. **Ativa GitHub Pages no teu repositório:**
   - Vai a `Settings` > `Pages`
   - Em `Source`, seleciona `GitHub Actions`

2. **Configura os Secrets necessários:**
   - Vai a `Settings` > `Secrets and variables` > `Actions`
   - Adiciona estes secrets:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     MOLLIE_API_KEY=your_mollie_api_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

3. **Faz push para a branch `main`:**
   ```bash
   git add .
   git commit -m "Deploy setup"
   git push origin main
   ```

4. **O site estará disponível em:**
   `https://dongrie05.github.io/RedVelvet/`

### Opção 2: Vercel (Recomendado)

1. **Cria conta no Vercel:**
   - Vai a [vercel.com](https://vercel.com)
   - Regista-te com a tua conta GitHub

2. **Importa o projeto:**
   - Clica em "New Project"
   - Seleciona o repositório `RedVelvet`
   - Clica em "Import"

3. **Configura as variáveis de ambiente:**
   - Vai a `Settings` > `Environment Variables`
   - Adiciona as mesmas variáveis da Opção 1

4. **Deploy automático:**
   - O Vercel fará deploy automático sempre que fizeres push para `main`
   - O site estará disponível em: `https://redvelvet-xxx.vercel.app`

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Export estático (para GitHub Pages)
npm run export
```

## 📧 Informações de Contacto

- **Email**: redvelvet.homeliving@gmail.com
- **Morada**: Avenida David Morão Ferreira, 55 A - 1750-220 Lisboa
- **Horário**: Segunda-Sexta: 15h00-17h00, Sábado: 10h00-19h00
- **Instagram**: [@red_velvet_fashion_pt](https://instagram.com/red_velvet_fashion_pt)
- **TikTok**: [@red_velvet_fashion_pt](https://tiktok.com/@red_velvet_fashion_pt)

## 🛍️ Funcionalidades

- ✅ Catálogo de produtos com filtros
- ✅ Carrinho de compras
- ✅ Lista de desejos (wishlist)
- ✅ Sistema de autenticação
- ✅ Pagamentos com Mollie (MB Way, Multibanco, etc.)
- ✅ Design responsivo
- ✅ Integração com Supabase

## 🚀 Próximos Passos

1. Faz push do código para o GitHub
2. Configura os secrets necessários
3. Ativa GitHub Pages ou conecta ao Vercel
4. O teu site estará online automaticamente!

---

**Desenvolvido com ❤️ para RedVelvet**