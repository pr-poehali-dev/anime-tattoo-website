import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api, storage, type User } from '@/lib/api';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ProcessSection from '@/components/sections/ProcessSection';
import CareSection from '@/components/sections/CareSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';

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
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    
    if (userId && userName) {
      const mockUser = { id: parseInt(userId), name: userName, email: '', role: userRole || 'client' };
      setUser(mockUser);
      setToken('mock-token');
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userId = Math.random().toString(36).substring(7);
      const userName = authMode === 'register' ? formData.name : formData.email.split('@')[0];
      const userRole = formData.email.includes('master') ? 'master' : 'client';
      
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userRole', userRole);
      
      const mockUser = { id: parseInt(userId), name: userName, email: formData.email, role: userRole };
      setUser(mockUser);
      setToken('mock-token');
      setIsAuthOpen(false);
      
      toast({
        title: 'Успешно!',
        description: authMode === 'login' ? 'Вы вошли в систему' : 'Регистрация завершена'
      });
      
      if (userRole === 'master') {
        navigate('/master-dashboard');
      } else {
        navigate('/client-dashboard');
      }
      
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
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isScrolled={isScrolled}
        user={user}
        isAuthOpen={isAuthOpen}
        authMode={authMode}
        formData={formData}
        isLoading={isLoading}
        onAuthOpenChange={setIsAuthOpen}
        onAuthModeChange={setAuthMode}
        onFormDataChange={setFormData}
        onAuthSubmit={handleAuth}
        onLogout={handleLogout}
      />
      
      <HeroSection />
      
      <PortfolioSection
        portfolio={portfolio}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <AboutSection />
      
      <ServicesSection services={services} />
      
      <ReviewsSection reviews={reviews} />
      
      <ProcessSection />
      
      <CareSection careSteps={careSteps} />
      
      <FAQSection faq={faq} />
      
      <ContactSection
        formData={formData}
        isLoading={isLoading}
        onFormDataChange={setFormData}
        onSubmit={handleContactSubmit}
      />
      
      <Footer />
    </div>
  );
}

export default Index;