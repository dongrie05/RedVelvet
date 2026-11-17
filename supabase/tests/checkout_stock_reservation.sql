-- Execute apenas numa base de dados descartável chamada redvelvet_reservation_test.
-- Exemplo: psql -v ON_ERROR_STOP=1 -d redvelvet_reservation_test -f supabase/tests/checkout_stock_reservation.sql
\set ON_ERROR_STOP on
BEGIN;
DO $$ BEGIN
  IF current_database() <> 'redvelvet_reservation_test' THEN RAISE EXCEPTION 'Use uma base descartável redvelvet_reservation_test'; END IF;
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname IN ('products','orders')) THEN
    RAISE EXCEPTION 'A base de ensaio deve estar vazia';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role; END IF;
END $$;
CREATE TABLE public.products (id uuid PRIMARY KEY, stock integer, preco numeric);
CREATE TABLE public.orders (id uuid PRIMARY KEY, status text NOT NULL, lista_produtos jsonb NOT NULL, mollie_payment_id text, data_pagamento timestamptz, metodo_pagamento text);
\ir ../migrations/20261115123305_checkout_stock_reservation.sql
\set ON_ERROR_STOP on
INSERT INTO products VALUES ('00000000-0000-4000-8000-000000000001',1,10);
INSERT INTO orders(id,status,lista_produtos) VALUES
('00000000-0000-4000-8000-000000000011','pending','[{"produto_id":"00000000-0000-4000-8000-000000000001","quantidade":1,"preco_unitario":10}]'),
('00000000-0000-4000-8000-000000000012','pending','[{"produto_id":"00000000-0000-4000-8000-000000000001","quantidade":1,"preco_unitario":10}]');
SELECT reserve_checkout_order('00000000-0000-4000-8000-000000000011');
DO $$ BEGIN
  IF (SELECT stock FROM products LIMIT 1) <> 0 THEN RAISE EXCEPTION 'Reserva não descontou stock'; END IF;
  BEGIN PERFORM reserve_checkout_order('00000000-0000-4000-8000-000000000012'); RAISE EXCEPTION 'Segunda reserva foi aceite'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'stock_or_price_changed' THEN RAISE; END IF; END;
  BEGIN UPDATE products SET stock=9; RAISE EXCEPTION 'Stock reservado foi alterado'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'stock_reserved_for_checkout' THEN RAISE; END IF; END;
END $$;
SELECT apply_checkout_payment('00000000-0000-4000-8000-000000000011','tr_A1','canceled',null);
SELECT apply_checkout_payment('00000000-0000-4000-8000-000000000011','tr_A1','canceled',null);
DO $$ BEGIN IF (SELECT stock FROM products LIMIT 1) <> 1 THEN RAISE EXCEPTION 'Cancelamento duplicou reposição'; END IF; END $$;
SELECT reserve_checkout_order('00000000-0000-4000-8000-000000000012');
SELECT apply_checkout_payment('00000000-0000-4000-8000-000000000012','tr_B1','paid','creditcard');
SELECT apply_checkout_payment('00000000-0000-4000-8000-000000000012','tr_B1','paid','creditcard');
DO $$ BEGIN IF (SELECT stock FROM products LIMIT 1) <> 0 THEN RAISE EXCEPTION 'Pagamento foi descontado duas vezes'; END IF; END $$;
SELECT apply_checkout_payment('00000000-0000-4000-8000-000000000011','tr_A1','paid','creditcard');
DO $$ BEGIN IF (SELECT status FROM orders WHERE id='00000000-0000-4000-8000-000000000011') <> 'paid_stock_issue' THEN RAISE EXCEPTION 'Pagamento tardio sem aviso'; END IF; END $$;
SELECT 'Verificações de reserva concluídas' AS resultado;
-- Resolver uma encomenda paga sem stock só é possível depois de repor as unidades.
DO $$ BEGIN
  BEGIN PERFORM resolve_paid_stock_issue('00000000-0000-4000-8000-000000000011'); RAISE EXCEPTION 'Aceitou sem stock';
  EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'stock_or_price_changed' THEN RAISE; END IF; END;
END $$;
UPDATE products SET stock=1 WHERE id='00000000-0000-4000-8000-000000000001';
SELECT resolve_paid_stock_issue('00000000-0000-4000-8000-000000000011');
DO $$ BEGIN
 IF (SELECT stock FROM products LIMIT 1) <> 0 OR (SELECT status FROM orders WHERE id='00000000-0000-4000-8000-000000000011') <> 'paid' THEN RAISE EXCEPTION 'Resolução incorreta'; END IF;
 IF has_function_privilege('anon','public.reserve_checkout_order(uuid)','EXECUTE') OR has_function_privilege('authenticated','public.apply_checkout_payment(uuid,text,text,text)','EXECUTE') OR has_function_privilege('service_role','public.checkout_adjust_stock(jsonb,integer,boolean)','EXECUTE') THEN RAISE EXCEPTION 'Permissão indevida'; END IF;
 IF NOT has_function_privilege('service_role','public.apply_checkout_payment(uuid,text,text,text)','EXECUTE') THEN RAISE EXCEPTION 'Servidor sem permissão'; END IF;
END $$;
-- Cancelamento administrativo só antes de qualquer tentativa de pagamento.
INSERT INTO products VALUES ('00000000-0000-4000-8000-000000000004',2,40);
INSERT INTO orders(id,status,lista_produtos) VALUES
('00000000-0000-4000-8000-000000000041','pending','[{"produto_id":"00000000-0000-4000-8000-000000000004","quantidade":1,"preco_unitario":40}]'),
('00000000-0000-4000-8000-000000000042','pending','[{"produto_id":"00000000-0000-4000-8000-000000000004","quantidade":1,"preco_unitario":40}]');
SELECT reserve_checkout_order('00000000-0000-4000-8000-000000000041');
SELECT reserve_checkout_order('00000000-0000-4000-8000-000000000042');
UPDATE orders SET payment_attempt_started=true WHERE id='00000000-0000-4000-8000-000000000042';
SELECT cancel_unstarted_checkout('00000000-0000-4000-8000-000000000041');
DO $$ BEGIN
 IF (SELECT stock FROM products WHERE id='00000000-0000-4000-8000-000000000004') <> 1 THEN RAISE EXCEPTION 'Reposição incorreta'; END IF;
 BEGIN PERFORM cancel_unstarted_checkout('00000000-0000-4000-8000-000000000042'); RAISE EXCEPTION 'Cancelamento inseguro permitido';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'payment_may_have_started' THEN RAISE; END IF; END;
END $$;

-- Se um artigo do carrinho não puder ser reservado, nenhum dos restantes é descontado.
INSERT INTO products VALUES ('00000000-0000-4000-8000-000000000005',1,50), ('00000000-0000-4000-8000-000000000006',0,60);
INSERT INTO orders(id,status,lista_produtos) VALUES ('00000000-0000-4000-8000-000000000051','pending','[{"produto_id":"00000000-0000-4000-8000-000000000005","quantidade":1,"preco_unitario":50},{"produto_id":"00000000-0000-4000-8000-000000000006","quantidade":1,"preco_unitario":60}]');
DO $$ BEGIN
 BEGIN PERFORM reserve_checkout_order('00000000-0000-4000-8000-000000000051'); RAISE EXCEPTION 'Reserva parcial aceite';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'stock_or_price_changed' THEN RAISE; END IF; END;
 IF (SELECT stock FROM products WHERE id='00000000-0000-4000-8000-000000000005') <> 1 THEN RAISE EXCEPTION 'Reserva parcial não revertida'; END IF;
END $$;
ROLLBACK;
