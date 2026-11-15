# Preparação do lançamento — RedVelvet

## Estado do trabalho

O painel de produtos e as alterações do checkout têm de ser revistos e publicados antes de serem usados. A migração de reserva de stock está no repositório; ainda não deve ser considerada aplicada na base de dados de produção. As contas, credenciais e configuração da Vercel não podem ser confirmadas a partir deste ambiente.

## Conta de gestão

- Criar uma conta para `gorete.j.duarte@gmail.com` no registo da loja e confirmar o email. A palavra-passe é escolhida pela própria; não deve ser enviada por mensagem.
- Na Vercel, definir `ADMIN_EMAILS` com esse endereço. Adicionar outros endereços apenas se devem ter o mesmo acesso de gestão.
- Confirmar em `/admin/stock` que a conta autorizada entra e que uma conta normal não consegue alterar produtos ou encomendas.

## Vercel e Mollie

- Confirmar as variáveis de servidor `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`, `MOLLIE_API_KEY` e `NEXT_PUBLIC_APP_URL`. O URL público deve ser HTTPS e corresponder ao domínio da loja. A chave de serviço e a chave Mollie são secretas e não devem usar o prefixo `NEXT_PUBLIC_`.
- Separar as credenciais de teste e produção da Mollie. Configurar `NEXT_PUBLIC_BUSINESS_LEGAL_NAME` e `NEXT_PUBLIC_BUSINESS_NIF` com os dados reais.
- Durante a instalação, manter o checkout fechado e confirmar que não há pagamentos pendentes da versão anterior. Aplicar a migração `supabase/migrations/20261115123305_checkout_stock_reservation.sql` ao projeto Supabase correto antes de disponibilizar o código que a utiliza. Não executar os ensaios contra produção.
- Publicar a versão revista e confirmar o domínio HTTPS e a receção do webhook `/api/webhooks/mollie/`.

## Catálogo e operação

- Exportar relatórios atualizados de produtos e existências da mesma loja no ZSBMS; pré-visualizar a data, preços e quantidades antes de importar.
- Rever os artigos com stock negativo, em falta ou caracteres danificados. Adicionar fotografias, descrições e tamanhos no painel. Os relatórios de 11/11/2026 já não devem ser considerados stock atual sem nova conferência.
- As reservas online reduzem a quantidade disponível. A loja física deve respeitar as unidades reservadas. Vendas físicas devem ser registadas no ZSBMS e refletidas manualmente no site, pois não existe sincronização automática.
- A proteção contra excesso de pedidos automatizados no checkout deve ser configurada no alojamento. Sem uma tarefa periódica automática, pagamentos que não enviem webhook têm de ser verificados no painel.
- Verificar diariamente as encomendas e pagamentos pendentes no painel. A confirmação do envio não cria etiqueta, não emite fatura nem envia mensagem ao cliente; combinar esses passos com o processo da loja.

## Verificação antes de vender

- Em ambiente de teste, efetuar encomendas com Mollie para pagamento confirmado, cancelado e expirado; conferir encomenda, stock, webhook e retorno ao site.
- Repetir a confirmação de pagamento e simular duas compras da última unidade, para confirmar que só uma reserva é aceite. Confirmar como é tratado um pagamento sem stock disponível.
- Testar importação, edição e fotografia de um produto, acesso de administrador e acesso de uma conta normal. Conferir a loja em telemóvel e computador.
- Confirmar nome legal, NIF, morada, contactos, custos e prazos de envio, devoluções, privacidade e informação comercial. Validar o processo de faturação com quem trata da contabilidade.
- Só depois destes passos configurar a chave de produção da Mollie e abrir as vendas. Se um pagamento ficar sem identificador confirmado, verificar na Mollie antes de libertar a reserva.
