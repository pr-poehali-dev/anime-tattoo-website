import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CareStep {
  title: string;
  text: string;
  icon: string;
}

interface CareSectionProps {
  careSteps: CareStep[];
}

function CareSection({ careSteps }: CareSectionProps) {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <h3 className="text-5xl font-black text-center mb-4 text-gradient">Уход за татуировкой</h3>
        <p className="text-center text-gray-400 mb-12 text-lg">Рекомендации для быстрого заживления</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {careSteps.map((step, idx) => (
            <Card key={idx} className="bg-gray-900 border-gray-800 hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={step.icon as any} size={28} className="text-primary" />
                </div>
                <h4 className="text-white font-bold mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CareSection;
