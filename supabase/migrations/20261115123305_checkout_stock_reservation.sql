-- Reservas são mantidas até a Mollie confirmar pagamento ou estado terminal.
-- A falha de rede nunca liberta automaticamente uma reserva com pagamento incerto.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stock_reserved boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stock_finalized boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stock_reservation_version smallint NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_attempt_started boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.checkout_adjust_stock(p_lines jsonb, p_direction integer, p_check_price boolean DEFAULT false)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE line record; changed integer; previous_op text;
BEGIN
  IF p_direction NOT IN (-1, 1) OR jsonb_typeof(p_lines) <> 'array' OR jsonb_array_length(p_lines) = 0 THEN
    RAISE EXCEPTION 'invalid_order_lines';
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(p_lines) x WHERE NOT (x ? 'produto_id' AND x ? 'quantidade' AND x ? 'preco_unitario') OR (x->>'quantidade')::integer <= 0) THEN
    RAISE EXCEPTION 'invalid_order_lines';
  END IF;
  previous_op := current_setting('redvelvet.reservation_op', true);
  PERFORM set_config('redvelvet.reservation_op', 'on', true);
  FOR line IN
    SELECT (x->>'produto_id')::uuid AS id, sum((x->>'quantidade')::integer)::integer AS qty,
           min((x->>'preco_unitario')::numeric) AS min_price, max((x->>'preco_unitario')::numeric) AS max_price
    FROM jsonb_array_elements(p_lines) x GROUP BY (x->>'produto_id')::uuid ORDER BY (x->>'produto_id')::uuid
  LOOP
    UPDATE public.products SET stock = COALESCE(stock, 0) + p_direction * line.qty
      WHERE id = line.id AND (p_direction = 1 OR COALESCE(stock, 0) >= line.qty)
        AND (NOT p_check_price OR (preco = line.min_price AND preco = line.max_price));
    GET DIAGNOSTICS changed = ROW_COUNT;
    IF changed <> 1 THEN RAISE EXCEPTION 'stock_or_price_changed' USING ERRCODE = 'P0001'; END IF;
  END LOOP;
  PERFORM set_config('redvelvet.reservation_op', COALESCE(previous_op, ''), true);
END;
$$;
REVOKE ALL ON FUNCTION public.checkout_adjust_stock(jsonb, integer, boolean) FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.reserve_checkout_order(p_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ord public.orders%ROWTYPE;
BEGIN
  SELECT * INTO ord FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND OR ord.status <> 'pending' OR ord.stock_finalized THEN RAISE EXCEPTION 'invalid_order'; END IF;
  IF ord.stock_reserved THEN RETURN; END IF;
  PERFORM public.checkout_adjust_stock(ord.lista_produtos, -1, true);
  UPDATE public.orders SET stock_reserved = true, stock_reservation_version = 1 WHERE id = ord.id;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_checkout_order(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_checkout_order(uuid) TO service_role;

-- Só liberta uma reserva quando é comprovado que o pagamento não chegou a ser iniciado.
CREATE OR REPLACE FUNCTION public.cancel_unstarted_checkout(p_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ord public.orders%ROWTYPE;
BEGIN
  SELECT * INTO ord FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND OR ord.status <> 'pending' OR NOT ord.stock_reserved OR ord.stock_finalized
     OR ord.stock_reservation_version <> 1 OR ord.payment_attempt_started OR ord.mollie_payment_id IS NOT NULL THEN
    RAISE EXCEPTION 'payment_may_have_started';
  END IF;
  PERFORM public.checkout_adjust_stock(ord.lista_produtos, 1, false);
  UPDATE public.orders SET status = 'cancelled', stock_reserved = false WHERE id = ord.id;
END;
$$;
REVOKE ALL ON FUNCTION public.cancel_unstarted_checkout(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_unstarted_checkout(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.apply_checkout_payment(p_order_id uuid, p_payment_id text, p_status text, p_method text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ord public.orders%ROWTYPE;
BEGIN
  IF p_payment_id !~ '^tr_[A-Za-z0-9]+$' OR p_status NOT IN ('paid','open','pending','authorized','failed','canceled','expired') THEN RAISE EXCEPTION 'invalid_payment'; END IF;
  SELECT * INTO ord FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'order_not_found'; END IF;
  IF ord.mollie_payment_id IS NOT NULL AND ord.mollie_payment_id <> p_payment_id THEN RAISE EXCEPTION 'payment_mismatch'; END IF;
  IF ord.mollie_payment_id IS NULL THEN UPDATE public.orders SET mollie_payment_id = p_payment_id WHERE id = ord.id; END IF;
  IF ord.stock_finalized OR ord.status IN ('paid','shipped','delivered','paid_stock_issue') THEN RETURN ord.status; END IF;
  IF p_status = 'paid' THEN
    IF NOT ord.stock_reserved THEN
      BEGIN
        PERFORM public.checkout_adjust_stock(ord.lista_produtos, -1, false);
      EXCEPTION WHEN SQLSTATE 'P0001' THEN
        UPDATE public.orders SET status = 'paid_stock_issue', data_pagamento = now(), metodo_pagamento = p_method WHERE id = ord.id;
        RETURN 'paid_stock_issue';
      END;
    END IF;
    UPDATE public.orders SET status = 'paid', data_pagamento = now(), metodo_pagamento = p_method, stock_reserved = false, stock_finalized = true WHERE id = ord.id;
    RETURN 'paid';
  ELSIF p_status IN ('failed','canceled','expired') THEN
    IF ord.stock_reserved THEN PERFORM public.checkout_adjust_stock(ord.lista_produtos, 1, false); END IF;
    UPDATE public.orders SET status = 'cancelled', stock_reserved = false WHERE id = ord.id;
    RETURN 'cancelled';
  END IF;
  IF ord.status = 'payment_setup_error' THEN
    UPDATE public.orders SET status = 'pending' WHERE id = ord.id;
    RETURN 'pending';
  END IF;
  RETURN ord.status;
END;
$$;
REVOKE ALL ON FUNCTION public.apply_checkout_payment(uuid, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_checkout_payment(uuid, text, text, text) TO service_role;

-- A loja pode resolver manualmente um pagamento confirmado sem stock após reposição.
CREATE OR REPLACE FUNCTION public.resolve_paid_stock_issue(p_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ord public.orders%ROWTYPE;
BEGIN
  SELECT * INTO ord FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND OR ord.status <> 'paid_stock_issue' OR ord.stock_reserved OR ord.stock_finalized THEN
    RAISE EXCEPTION 'order_not_resolvable';
  END IF;
  PERFORM public.checkout_adjust_stock(ord.lista_produtos, -1, false);
  UPDATE public.orders SET status = 'paid', stock_finalized = true WHERE id = ord.id;
END;
$$;
REVOKE ALL ON FUNCTION public.resolve_paid_stock_issue(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_paid_stock_issue(uuid) TO service_role;

-- A importação do ZSBMS não deve repor unidades temporariamente reservadas.
CREATE OR REPLACE FUNCTION public.protect_reserved_product_stock()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF current_setting('redvelvet.reservation_op', true) = 'on' THEN RETURN NEW; END IF;
  IF EXISTS (
    SELECT 1 FROM public.orders o
    CROSS JOIN LATERAL jsonb_array_elements(
      CASE WHEN jsonb_typeof(o.lista_produtos) = 'array' THEN o.lista_produtos ELSE '[]'::jsonb END
    ) item
    WHERE o.stock_reserved AND item->>'produto_id' = NEW.id::text
  ) THEN RAISE EXCEPTION 'stock_reserved_for_checkout' USING ERRCODE = 'P0001'; END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.protect_reserved_product_stock() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS protect_reserved_product_stock ON public.products;
CREATE TRIGGER protect_reserved_product_stock BEFORE UPDATE OF stock ON public.products
FOR EACH ROW WHEN (OLD.stock IS DISTINCT FROM NEW.stock) EXECUTE FUNCTION public.protect_reserved_product_stock();
