import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Service {
  name: string;
  price: string;
  duration: string;
  icon: string;
}

interface ServicesSectionProps {
  services: Service[];
}

function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <h3 className="text-5xl font-black text-center mb-4 text-gradient">Услуги и цены</h3>
        <p className="text-center text-gray-400 mb-12 text-lg">Профессиональные татуировки на любой вкус</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <Card key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover-lift p-8 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name={service.icon as any} size={32} className="text-primary" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{service.name}</h4>
                <div className="text-3xl font-black text-gradient mb-2">{service.price}</div>
                <p className="text-gray-400">{service.duration}</p>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
                  Записаться
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
