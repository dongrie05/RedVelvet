export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="bg-cream-50">
      <div className="container-luxury py-12 lg:py-16 max-w-3xl">
        <h1 className="heading-luxury text-3xl lg:text-4xl mb-2">{title}</h1>
        <p className="text-sm text-redvelvet-500 mb-10">Última atualização: {updated}</p>
        <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-redvelvet-900 prose-a:text-redvelvet-600">
          {children}
        </div>
      </div>
    </div>
  )
}
