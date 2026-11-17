#!/usr/bin/env python3
"""Teste concorrente num PostgreSQL descartável em Docker; nunca usa produção."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import subprocess
import time
import uuid

ROOT = Path(__file__).resolve().parents[2]
NAME = 'redvelvet-test-' + uuid.uuid4().hex[:12]


def docker(*args, check=True, input_text=None):
    return subprocess.run(['docker', *args], input=input_text, text=True,
                          capture_output=True, check=check)


def sql(query, check=True):
    return docker('exec', '-i', NAME, 'psql', '-U', 'postgres', '-v',
                  'ON_ERROR_STOP=1', '-Atq', input_text=query, check=check)


def concurrent(*queries):
    with ThreadPoolExecutor(max_workers=len(queries)) as pool:
        return list(pool.map(lambda q: sql(q, check=False), queries))


def main():
    docker('run', '-d', '--rm', '--name', NAME, '-e',
           'POSTGRES_PASSWORD=local-test-only', 'postgres:17-alpine')
    try:
        for _ in range(100):
            logs = docker('logs', NAME, check=False)
            if ('PostgreSQL init process complete; ready for start up.' in (logs.stdout + logs.stderr)
                    and sql('SELECT 1', check=False).returncode == 0):
                break
            time.sleep(.2)
        else:
            raise RuntimeError('O PostgreSQL de ensaio não iniciou')
        docker('exec', NAME, 'createdb', '-U', 'postgres', 'redvelvet_reservation_test')
        docker('exec', NAME, 'mkdir', '-p', '/tmp/redvelvet-tests/tests', '/tmp/redvelvet-tests/migrations')
        docker('cp', str(ROOT / 'supabase/tests/checkout_stock_reservation.sql'), NAME + ':/tmp/redvelvet-tests/tests/')
        docker('cp', str(ROOT / 'supabase/migrations/20261115123305_checkout_stock_reservation.sql'), NAME + ':/tmp/redvelvet-tests/migrations/')
        docker('exec', NAME, 'psql', '-U', 'postgres', '-d', 'redvelvet_reservation_test', '-v', 'ON_ERROR_STOP=1', '-f', '/tmp/redvelvet-tests/tests/checkout_stock_reservation.sql')
        print('Transações, permissões e pagamentos repetidos: verificados.')
        sql("""CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
          CREATE TABLE public.products (id uuid primary key, stock integer, preco numeric);
          CREATE TABLE public.orders (id uuid primary key, status text not null, lista_produtos jsonb not null,
            mollie_payment_id text, data_pagamento timestamptz, metodo_pagamento text);""")
        sql((ROOT / 'supabase/migrations/20261115123305_checkout_stock_reservation.sql').read_text())
        sql("""INSERT INTO products VALUES ('00000000-0000-4000-8000-000000000001',1,10);
          INSERT INTO orders(id,status,lista_produtos) VALUES
          ('00000000-0000-4000-8000-000000000011','pending','[{"produto_id":"00000000-0000-4000-8000-000000000001","quantidade":1,"preco_unitario":10}]'),
          ('00000000-0000-4000-8000-000000000012','pending','[{"produto_id":"00000000-0000-4000-8000-000000000001","quantidade":1,"preco_unitario":10}]');""")
        a, b = concurrent(*[
            f"BEGIN; SELECT reserve_checkout_order('00000000-0000-4000-8000-0000000000{i}'); SELECT pg_sleep(.5); COMMIT;"
            for i in (11, 12)
        ])
        assert sum(result.returncode == 0 for result in (a, b)) == 1, 'Duas reservas ou nenhuma foram aceites'
        assert sum('stock_or_price_changed' in result.stderr for result in (a, b)) == 1, 'A reserva concorrente não foi recusada por falta de stock'
        assert sql("SELECT stock FROM products WHERE id='00000000-0000-4000-8000-000000000001'").stdout.strip() == '0'
        print('Duas compras da última unidade: apenas uma reserva aceite.')

        winner = 11 if a.returncode == 0 else 12
        order_id = f'00000000-0000-4000-8000-0000000000{winner}'
        canceled, started = concurrent(
            f"SELECT cancel_unstarted_checkout('{order_id}')",
            f"UPDATE orders SET payment_attempt_started=true WHERE id='{order_id}' AND status='pending' AND stock_reserved AND NOT payment_attempt_started RETURNING id",
        )
        if canceled.returncode == 0:
            assert not started.stdout.strip(), 'Pagamento iniciou após o cancelamento'
            assert sql(f"SELECT status FROM orders WHERE id='{order_id}'").stdout.strip() == 'cancelled'
        else:
            assert 'payment_may_have_started' in canceled.stderr and started.stdout.strip(), 'Reserva libertada depois do início do pagamento'
            assert sql(f"SELECT payment_attempt_started FROM orders WHERE id='{order_id}'").stdout.strip() == 't'
        print('Cancelamento e início do pagamento: ações incompatíveis não avançam em conjunto.')
    finally:
        docker('rm', '-f', NAME, check=False)


if __name__ == '__main__':
    main()
