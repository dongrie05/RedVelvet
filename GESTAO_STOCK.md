# Gestão de stock

A área `/admin/stock` permite importar os relatórios de produtos e existências do ZSBMS e atualizar o stock depois de uma venda física. Os ficheiros aceites são os relatórios HTML com extensão `.xls` disponibilizados no ZSBMS; outros ficheiros Excel exigem adaptação.

## Antes de disponibilizar

1. Alojar a aplicação como servidor Next.js com API routes; não suporta alojamento estático.
2. Configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e `ADMIN_EMAILS` no servidor. Em `ADMIN_EMAILS`, indicar os endereços das contas autorizadas, separados por vírgula. Cada pessoa deve ter uma conta Supabase com email confirmado. A chave de serviço é secreta e não deve ser exposta no navegador.
3. Inspecionar as políticas RLS de `public.products` no projeto real. O esquema antigo deste repositório contém uma política que permite escrita a qualquer utilizador autenticado. Se existir, removê-la no SQL Editor antes de disponibilizar o painel:

```sql
DROP POLICY IF EXISTS "Products are editable by authenticated users" ON public.products;
```

Confirmar que nenhuma outra política ou permissão permite escrita indevida. O painel verifica o utilizador no servidor e usa a chave de serviço para escrever. A política de leitura pública deve manter-se ativa.
4. Confirmar que a conta tem acesso e experimentar num ambiente de ensaio antes de usar dados reais.

## Utilização

Em `/admin/stock`, entrar com a conta autorizada. Selecionar o relatório de produtos e o relatório de existências da mesma loja, consultar a data e a loja, rever os valores atuais e novos na pré-visualização e confirmar. Se o produto tiver sido alterado desde a pré-visualização, a importação desse artigo falha e deve ser revista novamente. Produtos sem quantidade, com quantidade negativa ou com caracteres inválidos são excluídos e devem ser corrigidos na origem. Para produtos já existentes o importador altera preço, IVA e quantidade, preservando nome, descrição, categoria e imagens. Os novos produtos são criados sem fotografias. A importação processa os produtos individualmente; se houver falhas, o resultado identifica os códigos e as alterações anteriores mantêm-se.

Após uma venda física, procurar o produto e selecionar `Vendi 1`. O botão `Repor 1` corrige uma unidade e `Esgotar` coloca a quantidade a zero. Uma nova importação substitui o stock pelo valor do relatório, pelo que este deve ser atual e incluir as vendas já registadas. O ZSBMS não é atualizado pelo site.

O checkout verifica stock ao iniciar o pagamento. Sem reserva entre o início e a confirmação do pagamento, ainda pode haver vendas simultâneas do mesmo artigo; é necessário rever esse fluxo antes do lançamento.

## Editar produtos e fotografias

No painel, escolha «Editar produto» para atualizar nome, descrição, categoria, preço e tamanhos e para adicionar até três imagens JPEG, PNG ou WebP, com um máximo de 3 MB por ficheiro. A primeira é a principal; as restantes aparecem na galeria. Grave as alterações para as associar ao produto. A imagem é enviada para o bucket público `products` através de uma rota protegida no servidor. Retirar uma imagem da ficha não elimina o ficheiro do armazenamento; um carregamento cancelado pode deixar um ficheiro sem associação. O bucket tem de existir e a service role tem de estar configurada na Vercel. A importação do ZSBMS preserva o nome, a descrição, a categoria e as fotografias dos produtos existentes, mas substitui preço, IVA e stock pelos valores do relatório.

## Encomendas e reservas

Ao iniciar o pagamento, a loja reserva as unidades numa transação. A Mollie confirma o estado através do webhook ou quando a loja verifica o pagamento. Um pagamento cancelado, falhado ou expirado liberta a reserva apenas uma vez; um pagamento confirmado fica disponível no painel para preparação e registo de envio. Marcar como enviada não envia emails nem cria etiquetas de transporte.

A secção «Encomendas a acompanhar» permite verificar na Mollie os pagamentos pendentes. Se o pagamento não tiver chegado a ser iniciado, pode cancelar a encomenda e repor o stock. Se a ligação à Mollie falhar depois de o pagamento poder ter sido iniciado, a reserva mantém-se: consulte a Mollie e introduza o identificador `tr_...` para confirmar o estado. Não reponha manualmente as unidades enquanto o resultado não estiver confirmado. Se um pagamento for confirmado sem stock disponível, contacte o cliente; depois de repor stock pode atribuí-lo à encomenda no painel.

Enquanto um artigo estiver reservado, as alterações manuais e a importação do respetivo stock são bloqueadas para evitar disponibilizar a mesma unidade duas vezes. A loja física também deve respeitar essas reservas. O painel apresenta até 100 encomendas; não substitui uma solução de faturação, envio ou notificação automática.

Antes de ativar este código, aplicar a migração `20261115123305_checkout_stock_reservation.sql` no projeto correto e confirmar a configuração da Mollie, URL público, webhook e credenciais de servidor na Vercel. Experimentar com credenciais de teste da Mollie: pagamento bem-sucedido, cancelado, expirado, duplicação do webhook e compras simultâneas da última unidade. Não usar dados reais de clientes para o ensaio.

### Ensaios técnicos locais

Com Docker disponível, `python3 supabase/tests/checkout_stock_concurrency.py` cria uma base de dados descartável, executa os ensaios SQL e de concorrência e elimina o contentor no fim. Não acede ao Supabase da loja nem à Mollie; os testes com a Mollie continuam necessários antes do lançamento.
