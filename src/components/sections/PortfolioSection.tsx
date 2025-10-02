import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PortfolioItem {
  id: number;
  title: string;
  image: string;
  category: string;
}

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function PortfolioSection({ portfolio, categories, selectedCategory, onCategoryChange }: PortfolioSectionProps) {
  const filteredPortfolio = selectedCategory === 'Все' 
    ? portfolio 
    : portfolio.filter(item => item.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <h3 className="text-5xl font-black text-center mb-4 text-gradient">Портфолио</h3>
        <p className="text-center text-gray-400 mb-12 text-lg">Мои лучшие работы в стиле аниме</p>
        
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className={`cursor-pointer px-6 py-2 text-sm transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolio.map(item => (
            <Card key={item.id} className="overflow-hidden bg-gray-800 border-gray-700 hover-lift cursor-pointer group">
              <div className="relative overflow-hidden aspect-square">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h4 className="text-white font-bold text-xl mb-2">{item.title}</h4>
                    <Badge className="bg-primary">{item.category}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;
