-- =====================================================================
-- RedVelvet — preparação para vendas online (checkout Mollie + segurança)
-- Executar UMA VEZ no Supabase: SQL Editor > New query > colar > Run
-- É seguro voltar a correr (idempotente).
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- 1. SEGURANÇA: ninguém altera produtos a partir do browser ----------
-- Antes, QUALQUER utilizador registado podia mudar preços/stock (policy "authenticated").
DROP POLICY IF EXISTS "Products are editable by authenticated users" ON products;
DROP POLICY IF EXISTS "Categories are editable by authenticated users" ON categories;
-- (A service role usada no servidor ignora RLS — o import/admin continua a funcionar via API.)

-- Encomendas só são criadas pelo servidor (preços validados). Clientes apenas leem as suas.
DROP POLICY IF EXISTS "Customers can create own orders" ON orders;

-- ---------- 2. Encomendas: checkout como convidado + Mollie ----------
ALTER TABLE orders ALTER COLUMN cliente_id DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS nome_cliente      TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_cliente     TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS telefone_cliente  TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS nif_cliente       TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notas             TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mollie_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS access_token      UUID NOT NULL DEFAULT gen_random_uuid();
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email_cliente);
CREATE INDEX IF NOT EXISTS idx_orders_mollie ON orders(mollie_payment_id);

-- Clientes registados também veem encomendas feitas com o mesmo email como convidado
DROP POLICY IF EXISTS "Customers can view own orders by email" ON orders;
CREATE POLICY "Customers can view own orders by email" ON orders FOR SELECT USING (
  email_cliente IS NOT NULL AND lower(email_cliente) = lower(auth.jwt() ->> 'email')
);

-- ---------- 3. Descontar stock de forma atómica (chamado pelo webhook) ----------
CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, p_qty INTEGER)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE products SET stock = GREATEST(0, COALESCE(stock, 0) - p_qty) WHERE id = p_id;
$$;
REVOKE ALL ON FUNCTION decrement_stock(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION decrement_stock(UUID, INTEGER) TO service_role;

-- ---------- 4. Galeria (caso a migração anterior não tenha sido corrida) ----------
ALTER TABLE products ADD COLUMN IF NOT EXISTS galeria JSONB DEFAULT '[]';
