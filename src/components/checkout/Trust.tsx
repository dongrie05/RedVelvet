import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { BUSINESS } from '@/lib/business'

export function PaymentPills({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Métodos de pagamento">
      {['MB WAY', 'Multibanco', 'Cartão', 'Apple Pay'].map((m) => (
        <li key={m} className="rounded-full border border-[#1c1012]/[.12] px-2.5 py-1 text-xs text-[#1c1012]/75">{m}</li>
      ))}
    </ul>
  )
}

export function Guarantees() {
  return (
    <ul className="mt-6 space-y-2.5 border-t border-[#1c1012]/[.1] pt-5 text-[13.5px] text-[#1c1012]/75">
      <li className="flex items-center gap-2.5"><Truck size={16} className="text-redvelvet-500" /> Enviado em {BUSINESS.shippingDays}</li>
      <li className="flex items-center gap-2.5"><RotateCcw size={16} className="text-redvelvet-500" /> 14 dias para devolver</li>
      <li className="flex items-center gap-2.5"><ShieldCheck size={16} className="text-redvelvet-500" /> Pagamento seguro via Mollie</li>
    </ul>
  )
}
