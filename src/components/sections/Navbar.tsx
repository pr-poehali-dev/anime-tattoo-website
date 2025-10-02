import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { type User } from '@/lib/api';

interface NavbarProps {
  isScrolled: boolean;
  user: User | null;
  isAuthOpen: boolean;
  authMode: 'login' | 'register';
  formData: {
    email: string;
    password: string;
    name: string;
  };
  isLoading: boolean;
  onAuthOpenChange: (open: boolean) => void;
  onAuthModeChange: (mode: 'login' | 'register') => void;
  onFormDataChange: (data: any) => void;
  onAuthSubmit: (e: React.FormEvent) => void;
  onLogout: () => void;
}

function Navbar({
  isScrolled,
  user,
  isAuthOpen,
  authMode,
  formData,
  isLoading,
  onAuthOpenChange,
  onAuthModeChange,
  onFormDataChange,
  onAuthSubmit,
  onLogout
}: NavbarProps) {
  const navigate = useNavigate();

  return (
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
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={() => {
                const userRole = localStorage.getItem('userRole');
                navigate(userRole === 'master' ? '/master-dashboard' : '/client-dashboard');
              }}>
                <Icon name="LayoutDashboard" size={16} className="mr-2" />
                {user.name}
              </Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={onLogout}>
                Выйти
              </Button>
            </div>
          ) : (
            <Dialog open={isAuthOpen} onOpenChange={onAuthOpenChange}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  data-auth-button
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Войти
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{authMode === 'login' ? 'Вход' : 'Регистрация'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onAuthSubmit} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      value={formData.email}
                      onChange={(e) => onFormDataChange({...formData, email: e.target.value})}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 Для доступа мастера используйте email с "master" (например: master@test.ru)
                    </p>
                  </div>
                  <div>
                    <Label>Пароль</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={(e) => onFormDataChange({...formData, password: e.target.value})}
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
                        onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                  </Button>
                  <button 
                    type="button"
                    onClick={() => onAuthModeChange(authMode === 'login' ? 'register' : 'login')}
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
  );
}

export default Navbar;