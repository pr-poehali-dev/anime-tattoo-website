import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface ContactSectionProps {
  formData: ContactFormData;
  isLoading: boolean;
  onFormDataChange: (data: ContactFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function ContactSection({ formData, isLoading, onFormDataChange, onSubmit }: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <h3 className="text-5xl font-black text-center mb-4 text-gradient">Контакты и запись</h3>
        <p className="text-center text-gray-400 mb-12 text-lg">Свяжитесь со мной удобным способом</p>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card className="bg-gray-900 border-gray-800 p-8">
            <CardContent>
              <h4 className="text-2xl font-bold text-white mb-6">Записаться на сеанс</h4>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Имя</Label>
                  <Input 
                    placeholder="Ваше имя" 
                    className="bg-black border-gray-800 text-white" 
                    value={formData.name}
                    onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Телефон</Label>
                  <Input 
                    placeholder="+7 (___) ___-__-__" 
                    className="bg-black border-gray-800 text-white" 
                    value={formData.phone}
                    onChange={(e) => onFormDataChange({...formData, phone: e.target.value})}
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
                    onChange={(e) => onFormDataChange({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Описание татуировки</Label>
                  <Textarea 
                    placeholder="Расскажите о вашей идее..." 
                    className="bg-black border-gray-800 text-white min-h-32" 
                    value={formData.message}
                    onChange={(e) => onFormDataChange({...formData, message: e.target.value})}
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
  );
}

export default ContactSection;
