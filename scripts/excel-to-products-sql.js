/**
 * Script para converter o Excel (HTML) de produtos em SQL INSERT para public.products
 * Uso: node scripts/excel-to-products-sql.js "C:\Users\GC\Downloads\Produtos_20260207163536_.xls"
 */

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || path.join(__dirname, '../Produtos_20260207163536_.xls');
const outputPath = path.join(__dirname, 'insert-products.sql');

function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/&euro;/g, '€')
    .replace(/&nbsp;/g, '')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Ccedil;/g, 'Ç')
    .replace(/&atilde;/g, 'ã')
    .replace(/&otilde;/g, 'õ')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&agrave;/g, 'à')
    .replace(/&egrave;/g, 'è')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&acirc;/g, 'â')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Ntilde;/g, 'Ñ')
    .replace(/&amp;/g, '&')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Oslash;/g, 'Ø')
    .replace(/&Atilde;/g, 'Ã')
    .trim();
}

function extractTdContent(td) {
  const match = td.match(/<td[^>]*>([\s\S]*?)<\/td>/);
  if (!match) return '';
  const inner = match[1]
    .replace(/<b>/g, '')
    .replace(/<\/b>/g, '')
    .trim();
  return decodeHtmlEntities(inner);
}

function parsePreco(str) {
  if (!str) return 0;
  const cleaned = str.replace(/€/g, '').replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

const html = fs.readFileSync(inputPath, 'utf8');

// Encontrar todas as linhas <tr> com dados (têm <td> com número em negrito na 2ª coluna)
const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
const rows = [];
let m;
while ((m = trRegex.exec(html)) !== null) {
  const trContent = m[1];
  const tdRegex = /<td[^>]*>[\s\S]*?<\/td>/gi;
  const tds = [];
  let tdMatch;
  while ((tdMatch = tdRegex.exec(trContent)) !== null) {
    tds.push(tdMatch[0]);
  }
  if (tds.length >= 9) {
    const num = extractTdContent(tds[1]);
    if (num && /^\d+$/.test(num)) rows.push(tds);
  }
}

const seenCodigos = new Set();
const products = [];

for (const tds of rows) {
  const descricao = extractTdContent(tds[2]);
  const referencia = extractTdContent(tds[3]);
  const familia = extractTdContent(tds[5]) || 'GERAL';
  const subFamilia = extractTdContent(tds[6]);
  const descricaoCurta = extractTdContent(tds[7]);
  const precoStr = extractTdContent(tds[8]);
  const preco = parsePreco(precoStr);

  let codigo = referencia && referencia.length > 0 ? referencia : null;
  if (!codigo) {
    codigo = 'PROD-' + (products.length + 1);
  } else {
    if (seenCodigos.has(codigo)) {
      codigo = codigo + '-' + (products.length + 1);
    }
    seenCodigos.add(codigo);
  }

  const categoria = subFamilia ? familia + ' / ' + subFamilia : familia;
  products.push({
    codigo,
    referencia: referencia || codigo,
    nome: descricao || codigo,
    descricao: descricaoCurta || null,
    categoria: categoria.substring(0, 100),
    preco,
    stock: 0,
    tamanhos: null,
    imagem_url: null,
    iva: 23
  });
}

let sql = `-- INSERT de ${products.length} produtos para public.products (Supabase)
-- Gerado a partir de ${path.basename(inputPath)}

INSERT INTO public.products (codigo, referencia, nome, descricao, categoria, preco, stock, tamanhos, imagem_url, iva)
VALUES
`;

const values = products.map((p) => {
  return `  (${escapeSql(p.codigo)}, ${escapeSql(p.referencia)}, ${escapeSql(p.nome)}, ${p.descricao ? escapeSql(p.descricao) : 'NULL'}, ${escapeSql(p.categoria)}, ${p.preco}, ${p.stock}, NULL, NULL, ${p.iva})`;
});

sql += values.join(',\n');
sql += '\nON CONFLICT (codigo) DO UPDATE SET\n';
sql += '  referencia = EXCLUDED.referencia,\n';
sql += '  nome = EXCLUDED.nome,\n';
sql += '  descricao = EXCLUDED.descricao,\n';
sql += '  categoria = EXCLUDED.categoria,\n';
sql += '  preco = EXCLUDED.preco,\n';
sql += '  stock = EXCLUDED.stock,\n';
sql += '  updated_at = now();\n';

fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Ficheiro gerado:', outputPath);
console.log('Total de produtos:', products.length);
