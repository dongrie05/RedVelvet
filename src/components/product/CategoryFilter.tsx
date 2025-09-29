'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className = ''
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCategorySelect = (category: string | null) => {
    onCategoryChange(category)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center space-x-2 px-4 py-2 border border-redvelvet-300 rounded-none bg-white hover:bg-redvelvet-50 transition-colors"
      >
        <Filter size={16} />
        <span>Filtrar</span>
        {selectedCategory && (
          <span className="bg-redvelvet-100 text-redvelvet-800 text-xs px-2 py-1 rounded-full">
            {selectedCategory}
          </span>
        )}
      </button>

      {/* Desktop filter */}
      <div className="hidden md:block">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-redvelvet-500 text-white'
                : 'bg-redvelvet-100 text-redvelvet-700 hover:bg-redvelvet-200'
            }`}
          >
            Todas as Categorias
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-redvelvet-500 text-white'
                  : 'bg-redvelvet-100 text-redvelvet-700 hover:bg-redvelvet-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile filter dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white border border-redvelvet-200 rounded-none shadow-luxury z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-redvelvet-900">Filtrar por Categoria</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-redvelvet-100 rounded"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left px-3 py-2 rounded-none text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-redvelvet-500 text-white'
                    : 'bg-redvelvet-100 text-redvelvet-700 hover:bg-redvelvet-200'
                }`}
              >
                Todas as Categorias
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-3 py-2 rounded-none text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-redvelvet-500 text-white'
                      : 'bg-redvelvet-100 text-redvelvet-700 hover:bg-redvelvet-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
