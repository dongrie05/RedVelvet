import { supabase } from '@/lib/supabase'

export interface ImportProduct {
  codigo: string
  descricao: string
  referencia: string
  iva: number
  familia: string
  preco: number
}

export interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  message: string
}

/**
 * Importa produtos de um array de dados CSV/Excel
 * @param products Array de produtos para importar
 * @returns Resultado da importação
 */
export async function importProducts(products: ImportProduct[]): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    imported: 0,
    errors: [],
    message: ''
  }

  try {
    // Validar dados de entrada
    const validationErrors = validateImportData(products)
    if (validationErrors.length > 0) {
      result.errors = validationErrors
      result.message = 'Dados inválidos encontrados'
      return result
    }

    // Preparar dados para inserção
    const productsToInsert = products.map(product => ({
      codigo: product.codigo.trim(),
      referencia: product.referencia.trim(),
      nome: product.descricao.trim(),
      descricao: product.descricao.trim(),
      categoria: product.familia.trim(),
      preco: product.preco,
      stock: 0, // Inicialmente NULL, será editado manualmente
      tamanhos: null, // Inicialmente NULL, será editado manualmente
      imagem_url: null, // Inicialmente NULL, será editado manualmente
      iva: product.iva || 23
    }))

    // Inserir produtos no Supabase
    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select()

    if (error) {
      result.errors.push(`Erro ao inserir produtos: ${error.message}`)
      result.message = 'Erro na importação'
      return result
    }

    result.success = true
    result.imported = data?.length || 0
    result.message = `${result.imported} produtos importados com sucesso`

    return result
  } catch (error) {
    result.errors.push(`Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    result.message = 'Erro na importação'
    return result
  }
}

/**
 * Valida os dados de importação
 * @param products Array de produtos para validar
 * @returns Array de erros de validação
 */
function validateImportData(products: ImportProduct[]): string[] {
  const errors: string[] = []

  if (!products || products.length === 0) {
    errors.push('Nenhum produto fornecido para importação')
    return errors
  }

  // Verificar se há códigos duplicados
  const codigos = products.map(p => p.codigo.trim())
  const codigosDuplicados = codigos.filter((codigo, index) => codigos.indexOf(codigo) !== index)
  if (codigosDuplicados.length > 0) {
    errors.push(`Códigos duplicados encontrados: ${codigosDuplicados.join(', ')}`)
  }

  // Validar cada produto
  products.forEach((product, index) => {
    const linha = index + 1

    if (!product.codigo || product.codigo.trim().length === 0) {
      errors.push(`Linha ${linha}: Código é obrigatório`)
    }

    if (!product.descricao || product.descricao.trim().length === 0) {
      errors.push(`Linha ${linha}: Descrição é obrigatória`)
    }

    if (!product.referencia || product.referencia.trim().length === 0) {
      errors.push(`Linha ${linha}: Referência é obrigatória`)
    }

    if (!product.familia || product.familia.trim().length === 0) {
      errors.push(`Linha ${linha}: Família é obrigatória`)
    }

    if (typeof product.preco !== 'number' || product.preco < 0) {
      errors.push(`Linha ${linha}: Preço deve ser um número positivo`)
    }

    if (typeof product.iva !== 'number' || product.iva < 0 || product.iva > 100) {
      errors.push(`Linha ${linha}: IVA deve ser um número entre 0 e 100`)
    }
  })

  return errors
}

/**
 * Converte dados CSV para formato de importação
 * @param csvData Dados CSV como string
 * @returns Array de produtos para importação
 */
export function parseCSVData(csvData: string): ImportProduct[] {
  const lines = csvData.split('\n').filter(line => line.trim().length > 0)
  
  if (lines.length < 2) {
    throw new Error('CSV deve ter pelo menos um cabeçalho e uma linha de dados')
  }

  // Parse do cabeçalho
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  
  // Verificar se todos os campos obrigatórios estão presentes
  const requiredFields = ['codigo', 'descricao', 'referencia', 'iva', 'familia', 'preco']
  const missingFields = requiredFields.filter(field => !headers.includes(field))
  
  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios em falta: ${missingFields.join(', ')}`)
  }

  // Parse das linhas de dados
  const products: ImportProduct[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    
    if (values.length !== headers.length) {
      throw new Error(`Linha ${i + 1}: Número de colunas não corresponde ao cabeçalho`)
    }

    const product: ImportProduct = {
      codigo: values[headers.indexOf('codigo')] || '',
      descricao: values[headers.indexOf('descricao')] || '',
      referencia: values[headers.indexOf('referencia')] || '',
      iva: parseFloat(values[headers.indexOf('iva')]) || 23,
      familia: values[headers.indexOf('familia')] || '',
      preco: parseFloat(values[headers.indexOf('preco')]) || 0
    }

    products.push(product)
  }

  return products
}

/**
 * Gera um template CSV para importação
 * @returns String CSV com cabeçalhos e exemplo
 */
export function generateCSVTemplate(): string {
  const headers = ['codigo', 'descricao', 'referencia', 'iva', 'familia', 'preco']
  const example = ['DEC001', 'Vela Aromática Lavanda', 'REF001', '23', 'Velas', '24.90']
  
  return [headers.join(','), example.join(',')].join('\n')
}

/**
 * Verifica se já existem produtos com os códigos fornecidos
 * @param codigos Array de códigos para verificar
 * @returns Array de códigos que já existem
 */
export async function checkExistingProducts(codigos: string[]): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('codigo')
      .in('codigo', codigos)

    if (error) {
      throw new Error(`Erro ao verificar produtos existentes: ${error.message}`)
    }

    return data?.map(p => p.codigo) || []
  } catch (error) {
    console.error('Erro ao verificar produtos existentes:', error)
    return []
  }
}
