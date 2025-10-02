function AboutSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <h3 className="text-5xl font-black mb-6 text-gradient">Обо мне</h3>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Привет! Я — Мастер Юки, специализируюсь на аниме татуировках уже более 8 лет. 
              Превращаю ваших любимых персонажей в уникальные произведения искусства.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Каждая татуировка — это история, которую мы создаем вместе. Использую только 
              профессиональное оборудование и качественные краски из Японии и США.
            </p>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">8+</div>
                <div className="text-gray-400">лет опыта</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">500+</div>
                <div className="text-gray-400">работ</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">100%</div>
                <div className="text-gray-400">довольных клиентов</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-3xl opacity-30"></div>
            <img 
              src="https://v3.fal.media/files/elephant/yf6YlYUtan0SSjbkgf7KI_output.png" 
              alt="Master" 
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
