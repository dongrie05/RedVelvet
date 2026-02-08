# Notificações de novos pedidos

Quando é inserida uma nova linha na tabela **orders** (por exemplo após pagamento via Mollie), pode receber um **email** no momento.

## Como funciona

1. O **Supabase** envia um webhook HTTP (POST) para a sua aplicação sempre que há um **INSERT** na tabela `orders`.
2. A API **`/api/webhooks/new-order`** recebe esse POST e envia um **email** (via Resend) para o endereço configurado em `NOTIFY_EMAIL_TO`.

## Configuração

### 1. Resend (envio de email)

- Registe-se em [resend.com](https://resend.com).
- Crie uma **API Key** (Dashboard > API Keys).
- Em **teste** pode usar o remetente `onboarding@resend.dev`.
- Em **produção** adicione e verifique o seu domínio no Resend e use, por exemplo, `encomendas@redvelvet.pt` em `NOTIFY_EMAIL_FROM`.

Variáveis de ambiente:

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `RESEND_API_KEY` | Sim | API Key do Resend |
| `NOTIFY_EMAIL_TO` | Não | Email que recebe o aviso (default: redvelvet.homeliving@gmail.com) |
| `NOTIFY_EMAIL_FROM` | Não | Remetente (default: RedVelvet &lt;onboarding@resend.dev&gt;) |

### 2. Webhook no Supabase

1. No [Dashboard do Supabase](https://supabase.com/dashboard), abra o seu projeto.
2. Vá a **Database** → **Webhooks** (ou **Integrations** → **Webhooks**).
3. **Create a new webhook:**
   - **Name:** ex. `Notificar novo pedido`
   - **Table:** `orders`
   - **Events:** selecione **Insert**
   - **URL:**  
     - Produção: `https://red-velvet-one.vercel.app/api/webhooks/new-order`  
     - (Substitua pelo URL real do seu site se for diferente.)
4. Guarde. O webhook passa a ser chamado em cada novo INSERT em `orders`.

### 3. Variáveis na Vercel

No projeto na Vercel, em **Settings** → **Environment Variables**, adicione:

- `RESEND_API_KEY`
- (Opcional) `NOTIFY_EMAIL_TO` e `NOTIFY_EMAIL_FROM`

Faça um novo deploy após alterar variáveis.

## Conteúdo do email

O email inclui:

- Número do pedido
- Total, subtotal, custo de envio
- Método de pagamento e estado
- Morada de envio
- Lista de produtos (nome, quantidade, preço)

Assim que houver uma nova linha em `orders`, recebe este resumo por email e pode seguir pelo WhatsApp (+351 916 350 502) se quiser.
