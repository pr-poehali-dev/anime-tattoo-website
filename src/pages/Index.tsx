import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { api, storage, type User } from '@/lib/api';

function Index() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', message: '' });
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const auth = storage.getAuth();
    if (auth) {
      setUser(auth.user);
      setToken(auth.token);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let response;
      if (authMode === 'login') {
        response = await api.login(formData.email, formData.password);
      } else {
        response = await api.register(formData.email, formData.password, formData.name);
      }
      
      setUser(response.user);
      setToken(response.token);
      storage.saveAuth(response.user, response.token);
      setIsAuthOpen(false);
      
      toast({
        title: 'Успешно!',
        description: authMode === 'login' ? 'Вы вошли в систему' : 'Регистрация завершена'
      });
      
      setFormData({ email: '', password: '', name: '', phone: '', message: '' });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    storage.clearAuth();
    toast({
      title: 'Вы вышли из системы'
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.sendContactForm({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message
      });
      
      toast({
        title: 'Отправлено!',
        description: 'Спасибо! Мы свяжемся с вами в ближайшее время.'
      });
      
      setFormData({ ...formData, name: '', phone: '', email: '', message: '' });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const portfolio = [
    {
      id: 1,
      title: 'Дракон с сакурой',
      image: '/img/725041ac-2268-49ad-acb4-58517d3167ef.jpg',
      category: 'Японский стиль'
    },
    {
      id: 2,
      title: 'Киберпанк персонаж',
      image: '/img/566df6a1-53df-418a-858e-1f0d8bd1aee9.jpg',
      category: 'Киберпанк'
    },
    {
      id: 3,
      title: 'Карп кои с волнами',
      image: '/img/ada6edb8-4fbf-48fb-b596-7f9b69b6ba11.jpg',
      category: 'Японский стиль'
    }
  ];

  const services = [
    { name: 'Маленькая татуировка', price: '3000-8000₽', duration: '1-2 часа', icon: 'Sparkles' },
    { name: 'Средняя татуировка', price: '8000-20000₽', duration: '2-4 часа', icon: 'Star' },
    { name: 'Большая татуировка', price: '20000-50000₽', duration: '4-8 часов', icon: 'Flame' },
    { name: 'Полный рукав', price: '50000-100000₽', duration: 'Несколько сеансов', icon: 'Award' }
  ];

  const reviews = [
    { name: 'Анна К.', rating: 5, text: 'Потрясающая работа! Мой персонаж из аниме получился невероятно детализированным' },
    { name: 'Дмитрий С.', rating: 5, text: 'Профессионал своего дела. Сделал мне дракона - все в восторге!' },
    { name: 'Мария В.', rating: 5, text: 'Лучший тату-мастер! Рисунок держится отлично, все зажило идеально' }
  ];

  const faq = [
    { q: 'Больно ли делать татуировку?', a: 'Ощущения индивидуальны, но современные методы позволяют минимизировать дискомфорт.' },
    { q: 'Сколько времени заживает татуировка?', a: 'Полное заживление занимает 2-4 недели при правильном уходе.' },
    { q: 'Можно ли делать татуировку летом?', a: 'Да, но важно защищать свежую татуировку от прямых солнечных лучей.' },
    { q: 'Нужна ли предоплата?', a: 'Да, для бронирования сеанса требуется предоплата 30% от стоимости.' }
  ];

  const careSteps = [
    { title: 'Первые 2-3 часа', text: 'Не снимайте защитную пленку', icon: 'Shield' },
    { title: 'Первые 2 недели', text: 'Мойте татуировку без мыла 2-3 раза в день', icon: 'Droplet' },
    { title: 'Увлажнение', text: 'Наносите заживляющую мазь тонким слоем', icon: 'Sparkles' },
    { title: 'Избегайте', text: 'Бани, бассейны, прямые солнечные лучи', icon: 'AlertCircle' }
  ];

  const categories = ['Все', 'Японский стиль', 'Киберпанк', 'Аниме персонажи'];

  const filteredPortfolio = selectedCategory === 'Все' 
    ? portfolio 
    : portfolio.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">ANIME TATTOO</h1>
          <div className="hidden md:flex gap-6 items-center">
            <a href="#portfolio" className="text-white hover:text-primary transition-colors">Портфолио</a>
            <a href="#services" className="text-white hover:text-primary transition-colors">Услуги</a>
            <a href="#reviews" className="text-white hover:text-primary transition-colors">Отзывы</a>
            <a href="#contact" className="text-white hover:text-primary transition-colors">Контакты</a>
{user ? (
              <div className="flex items-center gap-4">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={() => navigate('/dashboard')}>
                  <Icon name="LayoutDashboard" size={16} className="mr-2" />
                  {user.name}
                </Button>
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Icon name="User" size={16} className="mr-2" />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{authMode === 'login' ? 'Вход' : 'Регистрация'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>Пароль</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                    {authMode === 'register' && (
                      <div>
                        <Label>Имя</Label>
                        <Input 
                          type="text" 
                          placeholder="Ваше имя" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <button 
                      type="button"
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
                    >
                      {authMode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </nav>

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
                onClick={() => setSelectedCategory(cat)}
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

      <section id="reviews" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <h3 className="text-5xl font-black text-center mb-4 text-gradient">Отзывы клиентов</h3>
          <p className="text-center text-gray-400 mb-12 text-lg">Что говорят о моей работе</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <Card key={idx} className="bg-gray-800 border-gray-700 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{review.text}"</p>
                  <p className="text-white font-bold">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h3 className="text-5xl font-black text-center mb-4 text-gradient">Процесс работы</h3>
          <p className="text-center text-gray-400 mb-12 text-lg">От идеи до готовой татуировки</p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Консультация', desc: 'Обсуждаем идею, стиль и размер', icon: 'MessageCircle' },
              { step: '02', title: 'Эскиз', desc: 'Создаю уникальный дизайн для вас', icon: 'PenTool' },
              { step: '03', title: 'Сеанс', desc: 'Воплощаем эскиз в жизнь', icon: 'Sparkles' },
              { step: '04', title: 'Уход', desc: 'Даю рекомендации по уходу', icon: 'Heart' }
            ].map((item, idx) => (
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

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <h3 className="text-5xl font-black text-center mb-4 text-gradient">Вопросы и ответы</h3>
          <p className="text-center text-gray-400 mb-12 text-lg">Ответы на популярные вопросы</p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faq.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-black border-gray-800 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-primary font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contact" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h3 className="text-5xl font-black text-center mb-4 text-gradient">Контакты и запись</h3>
          <p className="text-center text-gray-400 mb-12 text-lg">Свяжитесь со мной удобным способом</p>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card className="bg-gray-900 border-gray-800 p-8">
              <CardContent>
                <h4 className="text-2xl font-bold text-white mb-6">Записаться на сеанс</h4>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label className="text-white">Имя</Label>
                    <Input 
                      placeholder="Ваше имя" 
                      className="bg-black border-gray-800 text-white" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Телефон</Label>
                    <Input 
                      placeholder="+7 (___) ___-__-__" 
                      className="bg-black border-gray-800 text-white" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-black border-gray-800 text-white" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Описание татуировки</Label>
                    <Textarea 
                      placeholder="Расскажите о вашей идее..." 
                      className="bg-black border-gray-800 text-white min-h-32" 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isLoading}>
                    <Icon name="Send" size={20} className="mr-2" />
                    {isLoading ? 'Отправка...' : 'Отправить заявку'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800 p-6 hover-lift">
                <CardContent className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Адрес студии</h5>
                    <p className="text-gray-400">г. Москва, ул. Примерная, д. 123</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 p-6 hover-lift">
                <CardContent className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="Phone" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Телефон</h5>
                    <p className="text-gray-400">+7 (999) 123-45-67</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 p-6 hover-lift">
                <CardContent className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="Mail" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Email</h5>
                    <p className="text-gray-400">info@anime-tattoo.ru</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary to-accent p-6">
                <CardContent>
                  <h5 className="text-white font-bold mb-4 text-xl">Социальные сети</h5>
                  <div className="flex gap-4">
                    <Button variant="secondary" size="icon" className="bg-white/20 hover:bg-white/30">
                      <Icon name="Instagram" size={24} />
                    </Button>
                    <Button variant="secondary" size="icon" className="bg-white/20 hover:bg-white/30">
                      <Icon name="MessageCircle" size={24} />
                    </Button>
                    <Button variant="secondary" size="icon" className="bg-white/20 hover:bg-white/30">
                      <Icon name="Facebook" size={24} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h4 className="text-3xl font-black text-gradient mb-4">ANIME TATTOO</h4>
            <p className="text-gray-400 mb-6">© 2024 Все права защищены</p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;