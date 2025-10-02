import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/30 to-black">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url(https://v3.fal.media/files/elephant/yf6YlYUtan0SSjbkgf7KI_output.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
      </div>
      <div className="relative z-10 text-center px-6 animate-fade-in">
        <h2 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
          ANIME TATTOO
        </h2>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Превращаю любимых аниме персонажей в произведения искусства на вашей коже
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 shadow-2xl hover-lift">
            <Icon name="Calendar" size={20} className="mr-2" />
            Записаться на сеанс
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6 backdrop-blur-sm">
            <Icon name="Image" size={20} className="mr-2" />
            Смотреть работы
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" size={32} className="text-white/60" />
      </div>
    </section>
  );
}

export default HeroSection;
