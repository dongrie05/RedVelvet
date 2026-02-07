import OptimizedImage from './OptimizedImage';

interface CategoryImageProps {
  category: 'clothing' | 'candles' | 'decorative-elements' | 'hero';
  priority?: boolean;
  className?: string;
}

const imageConfig = {
  clothing: {
    src: '/images/categories/clothing/clothing-hero.jpg',
    alt: 'Coleção de Roupa Red Velvet',
    width: 800,
    height: 600,
  },
  candles: {
    src: '/images/categories/candles/candles-hero.png',
    alt: 'Velas Decorativas Red Velvet',
    width: 800,
    height: 600,
  },
  'decorative-elements': {
    src: '/images/categories/decorative-elements/decorative-elements.png',
    alt: 'Elementos Decorativos Red Velvet',
    width: 800,
    height: 600,
  },
  hero: {
    src: '/images/categories/hero/hero-main.png',
    alt: 'Red Velvet - Moda e Decoração',
    width: 1200,
    height: 600,
  },
};

export default function CategoryImage({ 
  category, 
  priority = false, 
  className = '' 
}: CategoryImageProps) {
  const config = imageConfig[category];
  
  return (
    <OptimizedImage
      src={config.src}
      alt={config.alt}
      width={config.width}
      height={config.height}
      priority={priority}
      className={className}
      sizes={category === 'hero' 
        ? '(max-width: 768px) 100vw, 1200px' 
        : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
      quality={category === 'hero' ? 90 : 85}
      fill={category === 'hero'}
    />
  );
}
