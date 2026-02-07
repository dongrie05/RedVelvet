'use client'

import { ChevronRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter()

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Breadcrumb clicked:', href)
    router.push(href)
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={16} className="text-redvelvet-400 mx-2" />
            )}
            {item.href ? (
              <a
                href={item.href}
                onClick={(e) => handleClick(item.href!, e)}
                className="text-redvelvet-600 hover:text-redvelvet-500 transition-colors duration-200 font-medium cursor-pointer"
              >
                {index === 0 && <Home size={16} className="inline mr-1" />}
                {item.label}
              </a>
            ) : (
              <span className="text-redvelvet-800 font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
