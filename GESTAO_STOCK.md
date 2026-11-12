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

Em `/admin/stock`, entrar com a conta autorizada. Selecionar o relatório de produtos e o relatório de existências da mesma loja, consultar a pré-visualização e confirmar. Produtos sem quantidade, com quantidade negativa ou com caracteres inválidos são excluídos e devem ser corrigidos na origem. Para produtos já existentes o importador altera preço, IVA e quantidade, preservando nome, descrição, categoria e imagens. Os novos produtos são criados sem fotografias. A importação processa os produtos individualmente; se houver falhas, o resultado identifica os códigos e as alterações anteriores mantêm-se.

Após uma venda física, procurar o produto e selecionar `Vendi 1`. O botão `Repor 1` corrige uma unidade e `Esgotar` coloca a quantidade a zero. Uma nova importação substitui o stock pelo valor do relatório, pelo que este deve ser atual e incluir as vendas já registadas. O ZSBMS não é atualizado pelo site.

O checkout verifica stock ao iniciar o pagamento. Sem reserva entre o início e a confirmação do pagamento, ainda pode haver vendas simultâneas do mesmo artigo; é necessário rever esse fluxo antes do lançamento.
