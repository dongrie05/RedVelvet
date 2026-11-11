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
        
        {/* FAQ (também usado como dados estruturados para Google/assistentes) */}
        <section className="rv-faq bg-[#f7f3ee] py-[clamp(72px,9vw,120px)]" id="faq">
          <div className="container-luxury max-w-[760px]">
            <h2 className="mb-8 font-serif text-[clamp(30px,3.6vw,44px)] font-normal tracking-[-0.02em] text-[#1c1012]">
              Perguntas frequentes
            </h2>
            <div className="border-t border-[#1c1012]/[.12]">
              {allFAQs.map((faq) => (
                <details key={faq.question} className="group border-b border-[#1c1012]/[.12]">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-[22px] text-[17px] font-medium text-[#1c1012] lg:text-lg">
                    {faq.question}
                    <span data-plus aria-hidden className="text-2xl font-light leading-none text-redvelvet-500">+</span>
                  </summary>
                  <p className="pb-[22px] pr-10 text-[15.5px] leading-[1.65] text-[#6b5a5c]">{faq.answer}</p>
                </details>
              ))}
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
