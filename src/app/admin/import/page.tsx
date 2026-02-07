'use client'

import { useState } from 'react'
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { importProducts, parseCSVData, generateCSVTemplate, ImportResult } from '@/utils/importProducts'

export default function ImportProductsPage() {
  const [csvData, setCsvData] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Por favor, selecione um ficheiro CSV válido')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCsvData(content)
      setResult(null)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleImport = async () => {
    if (!csvData.trim()) {
      alert('Por favor, carregue um ficheiro CSV primeiro')
      return
    }

    setIsImporting(true)
    setResult(null)

    try {
      const products = parseCSVData(csvData)
      const importResult = await importProducts(products)
      setResult(importResult)
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
        message: 'Erro ao processar dados'
      })
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = generateCSVTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template-produtos.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Importar Produtos
          </h1>
          <p className="text-lg text-gray-600">
            Importe produtos em massa através de um ficheiro CSV
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Instruções de Importação
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Use o template CSV fornecido para garantir o formato correto</li>
                <li>• Campos obrigatórios: código, descrição, referência, IVA, família, preço</li>
                <li>• Stock, tamanhos e imagem ficam inicialmente vazios</li>
                <li>• Códigos devem ser únicos</li>
                <li>• Preços devem ser números positivos</li>
                <li>• IVA deve estar entre 0 e 100</li>
              </ul>
            </div>

            {/* Template Download */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Template CSV
              </h3>
              <p className="text-gray-600 mb-4">
                Descarregue o template para garantir o formato correto
              </p>
              <button
                onClick={downloadTemplate}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Descarregar Template</span>
              </button>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Carregar Ficheiro CSV
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Arraste o ficheiro CSV para aqui
                </p>
                <p className="text-gray-600 mb-4">ou</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                >
                  <FileText size={16} />
                  <span>Selecionar Ficheiro</span>
                </label>
              </div>

              {csvData && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Ficheiro carregado com sucesso
                  </p>
                  <p className="text-sm text-gray-500">
                    {csvData.split('\n').length} linhas detectadas
                  </p>
                </div>
              )}
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={!csvData || isImporting}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                !csvData || isImporting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isImporting ? 'A importar...' : 'Importar Produtos'}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Import Results */}
            {result && (
              <div className={`rounded-lg p-6 ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-4">
                  {result.success ? (
                    <CheckCircle size={24} className="text-green-600" />
                  ) : (
                    <AlertCircle size={24} className="text-red-600" />
                  )}
                  <h3 className={`text-lg font-semibold ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Importação Bem-sucedida' : 'Erro na Importação'}
                  </h3>
                </div>

                <p className={`mb-4 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>

                {result.success && (
                  <div className="bg-green-100 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">
                      ✓ {result.imported} produtos importados com sucesso
                    </p>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div className="bg-red-100 rounded-lg p-4">
                    <h4 className="text-red-800 font-medium mb-2">Erros encontrados:</h4>
                    <ul className="space-y-1">
                      {result.errors.map((error, index) => (
                        <li key={index} className="text-red-700 text-sm">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* CSV Preview */}
            {csvData && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pré-visualização dos Dados
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {csvData.split('\n')[0].split(',').map((header, index) => (
                          <th key={index} className="text-left py-2 px-3 font-medium text-gray-900">
                            {header.trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.split('\n').slice(1, 6).map((line, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          {line.split(',').map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-2 px-3 text-gray-600">
                              {cell.trim()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvData.split('\n').length > 6 && (
                    <p className="text-sm text-gray-500 mt-2">
                      ... e mais {csvData.split('\n').length - 6} linhas
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Precisa de Ajuda?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Formato CSV:</strong> Use vírgulas para separar colunas e quebras de linha para separar registos.
                </p>
                <p>
                  <strong>Codificação:</strong> Certifique-se de que o ficheiro está em UTF-8.
                </p>
                <p>
                  <strong>Validação:</strong> Todos os campos obrigatórios devem estar preenchidos.
                </p>
                <p>
                  <strong>Suporte:</strong> Contacte o administrador se encontrar problemas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
