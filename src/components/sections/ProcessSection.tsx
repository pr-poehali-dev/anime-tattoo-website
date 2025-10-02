import Icon from '@/components/ui/icon';

function ProcessSection() {
  const processSteps = [
    { step: '01', title: 'Консультация', desc: 'Обсуждаем идею, стиль и размер', icon: 'MessageCircle' },
    { step: '02', title: 'Эскиз', desc: 'Создаю уникальный дизайн для вас', icon: 'PenTool' },
    { step: '03', title: 'Сеанс', desc: 'Воплощаем эскиз в жизнь', icon: 'Sparkles' },
    { step: '04', title: 'Уход', desc: 'Даю рекомендации по уходу', icon: 'Heart' }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h3 className="text-5xl font-black text-center mb-4 text-gradient">Процесс работы</h3>
        <p className="text-center text-gray-400 mb-12 text-lg">От идеи до готовой татуировки</p>
        
        <div className="grid md:grid-cols-4 gap-8">
          {processSteps.map((item, idx) => (
            <div key={idx} className="text-center animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Icon name={item.icon as any} size={32} className="text-white" />
              </div>
              <div className="text-6xl font-black text-primary/20 mb-2">{item.step}</div>
              <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
