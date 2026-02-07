'use client'

import { generateFAQSchema } from '@/lib/seo'
import { SEO_CONFIG } from '@/lib/seoConfig'

interface FAQItem {
  question: string
  answer: string
}

interface AIOptimizedContentProps {
  faqs?: FAQItem[]
  children: React.ReactNode
}

export default function AIOptimizedContent({ faqs = [], children }: AIOptimizedContentProps) {
  // FAQ padrão para otimização de AI
  const defaultFAQs: FAQItem[] = SEO_CONFIG.aiOptimizedFAQs

  const allFAQs = [...defaultFAQs, ...faqs]
  const faqSchema = generateFAQSchema(allFAQs)

  return (
    <>
      {/* Structured Data para FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      
      {/* Conteúdo otimizado para AI */}
      <div className="ai-optimized-content">
        {children}
        
        {/* FAQ Section - Otimizada para AI assistants */}
        <section className="py-16 bg-gray-50" id="faq">
          <div className="container-luxury">
            <div className="text-center mb-12">
              <h2 className="heading-luxury text-4xl lg:text-5xl mb-6">
                Perguntas Frequentes
              </h2>
              <p className="text-luxury text-xl max-w-3xl mx-auto">
                Respostas às questões mais comuns sobre os nossos produtos e serviços
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {allFAQs.map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
                  >
                    <h3 className="text-xl font-semibold text-redvelvet-900 mb-4">
                      {faq.question}
                    </h3>
                    <p className="text-luxury leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

// Componente específico para otimização de conteúdo para AI
export function AIFriendlyContent({ 
  title, 
  description, 
  children 
}: { 
  title: string
  description: string
  children: React.ReactNode 
}) {
  return (
    <article className="ai-friendly-content">
      <header className="mb-8">
        <h1 className="heading-luxury text-4xl lg:text-5xl mb-6">
          {title}
        </h1>
        <p className="text-luxury text-xl leading-relaxed max-w-4xl">
          {description}
        </p>
      </header>
      
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </article>
  )
}

// Componente para respostas diretas otimizadas para AI
export function DirectAnswer({ 
  question, 
  answer, 
  source 
}: { 
  question: string
  answer: string
  source?: string 
}) {
  return (
    <div className="direct-answer bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        {question}
      </h3>
      <p className="text-blue-800 leading-relaxed">
        {answer}
      </p>
      {source && (
        <p className="text-sm text-blue-600 mt-3">
          Fonte: {source}
        </p>
      )}
    </div>
  )
}
