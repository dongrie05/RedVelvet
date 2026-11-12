'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Item = { codigo: string; nome: string; referencia: string; categoria: string; preco: number; iva: number; stock: number | null; problema: string }
function table(text: string) {
  if (!/<(?:html|table|tr)\b/i.test(text)) throw new Error('Este ficheiro não tem o formato HTML exportado pelo ZSBMS.')
  const doc = new DOMParser().parseFromString(text, 'text/html')
  return Array.from(doc.querySelectorAll('tr'), row => Array.from(row.querySelectorAll('th,td'), cell => (cell.textContent || '').trim()))
}
function numberPT(value: string) {
  const s = value.replace(/[€%\s]/g, '').replace(/\./g, '').replace(',', '.')
  return s === '' ? NaN : Number(s)
}
function parse(productText: string, stockText: string): Item[] {
  const rows = table(productText)
  const header = rows.findIndex(r => r.includes('Código') && r.includes('PVP1') && r.includes('Descrição'))
  if (header < 0) throw new Error('Não foi encontrado o cabeçalho de produtos esperado.')
  const cols = rows[header]
  const get = (row: string[], name: string) => row[cols.indexOf(name)] || ''
  for (const col of ['Código', 'Descrição', 'Referência', 'Familia', 'PVP1', 'Iva']) if (!cols.includes(col)) throw new Error(`Falta a coluna ${col} no relatório de produtos.`)
  const quantities = new Map<string, number>()
  let code = ''
  for (const row of table(stockText)) {
    if (row.length === 3 && /^\d+$/.test(row[0]) && !row[2]) code = row[0]
    else if (row[0] === 'Total Qtd Stock do Produto' && code) {
      if (quantities.has(code)) throw new Error(`O stock tem o código ${code} repetido.`)
      quantities.set(code, numberPT(row[1])); code = ''
    }
  }
  if (!quantities.size) throw new Error('Não foram encontrados totais no relatório de stock.')
  const seen = new Set<string>()
  return rows.slice(header + 1).filter(row => get(row, 'Código')).map(row => {
    const codigo = get(row, 'Código'), nome = get(row, 'Descrição'), referencia = get(row, 'Referência'), categoria = get(row, 'Familia'), preco = numberPT(get(row, 'PVP1')), iva = numberPT(get(row, 'Iva')), stock = quantities.get(codigo) ?? null
    if (seen.has(codigo)) throw new Error(`O produto ${codigo} aparece mais do que uma vez.`)
    seen.add(codigo)
    let problema = ''
    if (stock === null) problema = 'Sem stock no relatório'
    else if (!Number.isSafeInteger(stock) || stock < 0) problema = 'Stock negativo ou inválido'
    else if (!nome || !categoria || !Number.isFinite(preco) || preco < 0 || !Number.isFinite(iva) || iva < 0 || iva > 100 || nome.includes('�') || categoria.includes('�') || referencia.includes('�')) problema = 'Dados em falta ou caracteres inválidos'
    return { codigo, nome, referencia, categoria, preco, iva, stock, problema }
  })
}
export default function ImportPanel({ onDone }: { onDone: () => void }) {
  const [productFile, setProductFile] = useState<File | null>(null), [stockFile, setStockFile] = useState<File | null>(null)
  const [items, setItems] = useState<Item[]>([]), [error, setError] = useState(''), [busy, setBusy] = useState(false), [result, setResult] = useState('')
  async function preview() {
    if (!productFile || !stockFile) return
    setError(''); setResult(''); setItems([])
    try {
      if (productFile.size > 5_000_000 || stockFile.size > 5_000_000) throw new Error('Cada ficheiro deve ter menos de 5 MB.')
      const parsed = parse(await productFile.text(), await stockFile.text())
      if (!parsed.length) throw new Error('Não foram encontrados produtos.')
      setItems(parsed)
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível ler os ficheiros.') }
  }
  const valid = items.filter(p => !p.problema)
  async function apply() {
    if (!valid.length || !window.confirm(`Importar ${valid.length} produtos? Os preços e stocks existentes serão atualizados.`)) return
    setBusy(true); setError(''); setResult('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Sessão expirada. Inicie sessão novamente.')
      const response = await fetch('/api/admin/zsbms-import', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ products: valid.map(p => ({ codigo: p.codigo, nome: p.nome, referencia: p.referencia, categoria: p.categoria, preco: p.preco, iva: p.iva, stock: p.stock })) }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setResult(`${data.created} produtos criados; ${data.updated} atualizados.${data.failures.length ? ` Falharam os códigos: ${data.failures.join(', ')}. Reveja antes de voltar a importar.` : ''}`)
      setItems([]); onDone()
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro na importação.') }
    setBusy(false)
  }
  return <section className="my-6 rounded-lg bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Importar do ZSBMS</h2><p className="mt-2 text-sm">Carregue os relatórios de produtos e de existências da mesma loja. Os artigos com stock negativo, em falta ou dados inválidos ficam de fora para revisão.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label>Produtos<input type="file" accept=".xls,.html,.htm" onChange={e => { setProductFile(e.target.files?.[0] || null); setItems([]) }} className="mt-1 block w-full text-sm" /></label><label>Existências<input type="file" accept=".xls,.html,.htm" onChange={e => { setStockFile(e.target.files?.[0] || null); setItems([]) }} className="mt-1 block w-full text-sm" /></label></div><button type="button" onClick={() => void preview()} disabled={!productFile || !stockFile || busy} className="mt-4 rounded border px-4 py-2 disabled:opacity-40">Ver pré-visualização</button>{error && <p role="alert" className="mt-3 text-red-700">{error}</p>}{result && <p role="status" className="mt-3">{result}</p>}{items.length > 0 && <><p className="mt-4 font-semibold">{valid.length} prontos · {items.length - valid.length} precisam de revisão</p><p className="text-sm">Os produtos existentes mantêm o nome, a descrição e as fotografias; o preço, IVA e stock são atualizados.</p><div className="mt-3 max-h-72 overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th>Código</th><th>Produto</th><th>Preço</th><th>Stock</th><th>Estado</th></tr></thead><tbody>{items.map(p => <tr key={p.codigo} className="border-t"><td>{p.codigo}</td><td>{p.nome}</td><td>{Number.isFinite(p.preco) ? p.preco.toFixed(2) + ' €' : '—'}</td><td>{p.stock ?? '—'}</td><td>{p.problema || 'Pronto'}</td></tr>)}</tbody></table></div><button onClick={() => void apply()} disabled={busy || !valid.length} className="mt-4 rounded bg-redvelvet-700 px-4 py-2 text-white disabled:opacity-40">{busy ? 'A importar…' : `Importar ${valid.length} produtos`}</button></>}</section>
}
