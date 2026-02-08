# 🚀 Guia Completo de Configuração do Supabase - RedVelvet

## 📋 **Passos para Configuração Completa**

### **1. Criar Projeto no Supabase**

1. **Acesse [supabase.com](https://supabase.com)** e faça login
2. **Clique em "New Project"**
3. **Preencha os dados:**
   - **Name:** `redvelvet-ecommerce`
   - **Database Password:** (crie uma senha forte e guarde-a!)
   - **Region:** `West Europe (Ireland)` (mais próximo de Portugal)
4. **Clique em "Create new project"**
5. **Aguarde a criação** (2-3 minutos)

### **2. Obter Credenciais**

1. **No painel do Supabase**, vá para **Settings > API**
2. **Copie as seguintes informações:**
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (chave pública)
   - **service_role key** (chave de serviço - mantenha em segredo!)

### **3. Configurar Variáveis de Ambiente**

1. **Crie o arquivo `.env.local`** na raiz do projeto:
```bash
cp env.example .env.local
```

2. **Edite o arquivo `.env.local`** com suas credenciais:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico

# Mollie Configuration
MOLLIE_API_KEY=test_sua_chave

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **4. Criar Estrutura do Banco de Dados**

1. **No painel do Supabase**, vá para **SQL Editor**
2. **Copie todo o conteúdo do arquivo `supabase-schema.sql`**
3. **Cole no SQL Editor e execute**
4. **Verifique se as tabelas foram criadas** em **Table Editor**

### **5. Configurar Autenticação**

1. **No painel do Supabase**, vá para **Authentication > Settings**
2. **Configure os seguintes campos:**
   - **Site URL:** `http://localhost:3000` (para desenvolvimento)
   - **Redirect URLs:** `http://localhost:3000/auth/callback`
3. **Em "Auth Providers", configure:**
   - **Email:** ✅ Habilitado
   - **Confirm email:** ✅ Habilitado (recomendado)
4. **Salve as configurações**

### **6. Importar Produtos (Opcional)**

Se você tem um arquivo CSV com produtos:

1. **Formate o CSV** com as colunas:
```csv
Código,Descrição,Referência,IVA,Família,Preço
V001,Vela Aromática Lavanda,VL-LAV-001,23.00,Velas,24.90
D001,Candeeiro Minimalista,DE-CAN-001,23.00,Decoração,89.90
```

2. **Execute o script de importação:**
```bash
node scripts/import-products.js produtos.csv
```

3. **Edite os produtos** no painel do Supabase:
   - Adicione imagens (`imagem_url`)
   - Configure stock
   - Defina tamanhos disponíveis

### **7. Testar a Conexão**

1. **Reinicie o servidor de desenvolvimento:**
```bash
npm run dev
```

2. **Acesse `http://localhost:3000`**
3. **Verifique se não há erros no console**

### **8. Configurar Storage (Para Imagens)**

1. **No painel do Supabase**, vá para **Storage**
2. **Crie um bucket chamado `products`**
3. **Configure as políticas:**
   - **Public:** ✅ (para imagens de produtos)
   - **File size limit:** 10MB
4. **Configure RLS policies** para o bucket

### **9. Configurar Email Templates (Opcional)**

1. **Vá para Authentication > Email Templates**
2. **Personalize os templates** de:
   - Confirmação de email
   - Reset de password
   - Convites

### **10. Configurar Webhook de Novos Pedidos (Email)**

Para receber um email sempre que existir uma nova linha na tabela `orders`:

1. **Resend (envio de email):**
   - Crie conta em [resend.com](https://resend.com) e obtenha uma API Key.
   - No `.env.local` (e nas variáveis de ambiente da Vercel), defina:
     - `RESEND_API_KEY=re_xxxx` (obrigatório)
     - `NOTIFY_EMAIL_TO=redvelvet.homeliving@gmail.com` (opcional; é o valor por defeito)
     - `NOTIFY_EMAIL_FROM=RedVelvet <onboarding@resend.dev>` (em teste; em produção use um domínio verificado no Resend)

2. **Webhook no Supabase:**
   - No painel do Supabase, vá a **Database > Webhooks** (ou **Integrations > Webhooks**).
   - Crie um novo webhook:
     - **Name:** `Novo pedido - notificar`
     - **Table:** `orders`
     - **Events:** marque **Insert**
     - **URL:** `https://red-velvet-one.vercel.app/api/webhooks/new-order` (substitua pelo URL real do seu deploy)
   - Guarde. Sempre que for inserida uma linha em `orders`, o Supabase envia um POST para esta URL e a aplicação envia um email para `NOTIFY_EMAIL_TO`.

Ver também o ficheiro **NOTIFICACOES_PEDIDOS.md** para mais pormenores.

---

## 🔧 **Comandos Úteis**

### **Instalar Dependências**
```bash
npm install @supabase/supabase-js
```

### **Verificar Conexão**
```bash
# No terminal do projeto
node -e "console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### **Reset do Banco (Cuidado!)**
```sql
-- No SQL Editor do Supabase
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Depois execute novamente o supabase-schema.sql
```

---

## 📊 **Estrutura das Tabelas**

### **products**
- `id` (UUID, Primary Key)
- `codigo` (VARCHAR, Unique)
- `referencia` (VARCHAR)
- `nome` (VARCHAR)
- `descricao` (TEXT)
- `categoria` (VARCHAR)
- `preco` (DECIMAL)
- `stock` (INTEGER)
- `tamanhos` (TEXT[])
- `imagem_url` (TEXT)
- `iva` (DECIMAL)

### **customers**
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK para auth.users)
- `nome` (VARCHAR)
- `email` (VARCHAR, Unique)
- `telefone` (VARCHAR)
- `morada` (TEXT)
- `historico_compras` (UUID[])

### **orders**
- `id` (UUID, Primary Key)
- `cliente_id` (UUID, FK para customers)
- `numero_pedido` (VARCHAR, Unique)
- `lista_produtos` (JSONB)
- `subtotal` (DECIMAL)
- `custo_envio` (DECIMAL)
- `total` (DECIMAL)
- `status` (VARCHAR)

### **reviews**
- `id` (UUID, Primary Key)
- `cliente_id` (UUID, FK para customers)
- `produto_id` (UUID, FK para products)
- `rating` (INTEGER, 1-5)
- `comentario` (TEXT)
- `aprovado` (BOOLEAN)

---

## 🚨 **Problemas Comuns**

### **Erro de Conexão**
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se não há firewall bloqueando

### **Erro de Permissão**
- Verifique as políticas RLS
- Confirme se está usando a chave correta (anon vs service_role)
- Verifique se o usuário está autenticado

### **Erro de Schema**
- Execute novamente o `supabase-schema.sql`
- Verifique se todas as extensões estão habilitadas
- Confirme se as tabelas foram criadas corretamente

---

## 📞 **Suporte**

- **Documentação Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Comunidade:** [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord:** [discord.supabase.com](https://discord.supabase.com)

---

## ✅ **Checklist de Configuração**

- [ ] Projeto Supabase criado
- [ ] Credenciais obtidas
- [ ] Variáveis de ambiente configuradas
- [ ] Schema do banco executado
- [ ] Autenticação configurada
- [ ] Storage configurado
- [ ] Produtos importados (opcional)
- [ ] Conexão testada
- [ ] Aplicação funcionando

**🎉 Parabéns! Seu Supabase está configurado e pronto para uso!**
