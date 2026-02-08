-- Adicionar galeria de imagens aos produtos (até 3 fotos por produto)
-- Execute no SQL Editor do Supabase se a tabela products já existir

ALTER TABLE products
ADD COLUMN IF NOT EXISTS galeria JSONB DEFAULT '[]';

COMMENT ON COLUMN products.galeria IS 'Array de URLs de imagens adicionais (ex: 2 ou 3 fotos). A imagem principal continua em imagem_url.';

-- Exemplo: adicionar 2 fotos extra a um produto (total 3: imagem_url + 2 da galeria)
-- UPDATE products SET galeria = '["https://...url-foto-2", "https://...url-foto-3"]'::jsonb WHERE id = 'uuid-do-produto';
