# RedVelvet — Loja Online

Next.js 15 (App Router) · Supabase (produtos, clientes, encomendas) · Mollie (MB WAY, Multibanco, cartão, Apple Pay) · Vercel.

## Fluxo de compra

`Produto → Carrinho (localStorage) → /checkout → POST /api/checkout → Mollie → /checkout/success`

- **/api/checkout** recalcula preços, portes e stock **a partir da base de dados** (o browser nunca define o preço), cria a encomenda `pending` e o pagamento Mollie.
- **/api/webhooks/mollie** recebe a confirmação, marca a encomenda `paid` e desconta stock (idempotente).
- **/api/orders/[id]** mostra o estado na página de sucesso (protegido por token da encomenda).
- Regras de portes: `src/lib/shop.ts`. Dados legais da empresa: `src/lib/business.ts`.

## ✅ Checklist para começar a vender

1. **Supabase → SQL Editor**: correr `supabase/migrations/20261111_launch_checkout_security.sql`
   (remove a permissão que deixava qualquer utilizador registado alterar preços, e adiciona as colunas do checkout).
2. **Vercel → Settings → Environment Variables** (ver `env.example`):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `MOLLIE_API_KEY`, `NEXT_PUBLIC_APP_URL` e `NEXT_PUBLIC_SITE_URL` (domínio final, ex. `https://redvelvet.pt`),
   `ADMIN_SECRET`, `NEXT_PUBLIC_BUSINESS_LEGAL_NAME`, `NEXT_PUBLIC_BUSINESS_NIF`.
3. **Mollie**: ativar MB WAY, Multibanco e cartões no dashboard. Primeiro testar com chave `test_…`, depois trocar para `live_…`.
4. **Compra de teste** ponta a ponta com a chave de teste → confirmar a encomenda `paid` na tabela `orders` e o stock descontado.
5. Rever os textos de **Termos**, **Privacidade** e **Envios** (`/terms`, `/privacy`, `/shipping`) e os preços de envio para Ilhas/Espanha.
6. Registar a loja no **Livro de Reclamações Eletrónico** (obrigatório; o link já está no rodapé).

## Gerir encomendas

No Supabase, tabela `orders`: filtrar `status = paid` para ver o que expedir. Depois de enviar, mudar para `shipped`.

## Importar produtos

`/admin/import` (password = `ADMIN_SECRET`). Imagens/stock/tamanhos editam-se depois na tabela `products`.

## Desenvolvimento

```bash
cp env.example .env.local
npm install
npm run dev
```

Nota: em `localhost` a Mollie não consegue chamar o webhook; o estado é confirmado quando o cliente volta à página de sucesso.
