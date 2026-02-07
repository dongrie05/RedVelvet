// Script para importar produtos do Excel/CSV para o Supabase
// Execute com: node scripts/import-products.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key para importação

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para ler CSV
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim());
    const product = {};

    headers.forEach((header, index) => {
      const value = values[index];
      
      switch (header.toLowerCase()) {
        case 'código':
        case 'codigo':
          product.codigo = value;
          break;
        case 'descrição':
        case 'descricao':
          product.descricao = value;
          break;
        case 'referência':
        case 'referencia':
          product.referencia = value;
          break;
        case 'iva':
          product.iva = parseFloat(value) || 23.00;
          break;
        case 'família':
        case 'familia':
          product.categoria = value;
          break;
        case 'preço':
        case 'preco':
          product.preco = parseFloat(value.replace(',', '.')) || 0;
          break;
        default:
          // Campos adicionais podem ser adicionados aqui
          break;
      }
    });

    // Campos obrigatórios com valores padrão
    if (!product.codigo) product.codigo = `PROD-${Date.now()}-${i}`;
    if (!product.referencia) product.referencia = product.codigo;
    if (!product.nome) product.nome = product.descricao || 'Produto sem nome';
    if (!product.categoria) product.categoria = 'Outros';
    if (!product.preco) product.preco = 0;
    if (!product.iva) product.iva = 23.00;

    // Campos que ficam NULL para edição manual
    product.stock = null;
    product.tamanhos = null;
    product.imagem_url = null;

    products.push(product);
  }

  return products;
}

// Função para importar produtos
async function importProducts(products) {
  console.log(`📦 Importando ${products.length} produtos...`);

  try {
    const { data, error } = await supabase
      .from('products')
      .insert(products);

    if (error) {
      console.error('❌ Erro ao importar produtos:', error);
      return false;
    }

    console.log('✅ Produtos importados com sucesso!');
    return true;
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return false;
  }
}

// Função principal
async function main() {
  const csvFile = process.argv[2];
  
  if (!csvFile) {
    console.log('📋 Uso: node scripts/import-products.js <arquivo.csv>');
    console.log('');
    console.log('📝 Formato esperado do CSV:');
    console.log('Código,Descrição,Referência,IVA,Família,Preço');
    console.log('V001,Vela Aromática Lavanda,VL-LAV-001,23.00,Velas,24.90');
    console.log('');
    console.log('💡 Campos obrigatórios: Código, Descrição, Referência, Família, Preço');
    console.log('💡 Campos opcionais: IVA (padrão: 23.00)');
    console.log('💡 Campos que ficam NULL para edição manual: stock, tamanhos, imagem_url');
    return;
  }

  if (!fs.existsSync(csvFile)) {
    console.error(`❌ Arquivo não encontrado: ${csvFile}`);
    return;
  }

  try {
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    const products = parseCSV(csvContent);
    
    console.log(`📊 ${products.length} produtos encontrados no arquivo`);
    console.log('📋 Primeiro produto:', products[0]);
    
    const success = await importProducts(products);
    
    if (success) {
      console.log('');
      console.log('🎉 Importação concluída!');
      console.log('💡 Acesse o painel do Supabase para editar:');
      console.log('   - Adicionar imagens (imagem_url)');
      console.log('   - Definir stock');
      console.log('   - Configurar tamanhos disponíveis');
    }
  } catch (err) {
    console.error('❌ Erro ao processar arquivo:', err);
  }
}

// Executar script
main();
