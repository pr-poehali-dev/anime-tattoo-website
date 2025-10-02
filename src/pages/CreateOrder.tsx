import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceType || !description.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/dashboard');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/70a8d501-1b95-4105-97ed-d5928e0e12d5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
        body: JSON.stringify({
          service_type: serviceType,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании заказа');
      }

      const order = await response.json();

      toast({
        title: 'Заказ создан!',
        description: 'Мастер скоро с вами свяжется',
      });

      navigate(`/client-dashboard?orderId=${order.id}`);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заказ',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
          На главную
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Оформление заказа</CardTitle>
            <CardDescription>
              Расскажите, что вы хотите. Мастер свяжется с вами для обсуждения деталей
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="service">Выберите услугу</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Что вас интересует?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Тату в стиле аниме">Тату в стиле аниме</SelectItem>
                    <SelectItem value="Эскиз татуировки">Эскиз татуировки</SelectItem>
                    <SelectItem value="Перекрытие старой тату">Перекрытие старой тату</SelectItem>
                    <SelectItem value="Консультация">Консультация</SelectItem>
                    <SelectItem value="Другое">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Опишите ваши пожелания</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Расскажите подробнее о том, что вы хотите. Например: какой персонаж, размер, место размещения..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Icon name="Info" className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Что будет дальше:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Мастер увидит ваш заказ и начнёт обсуждение</li>
                      <li>Вы обсудите все детали в чате</li>
                      <li>Мастер выставит стоимость работы</li>
                      <li>Вы сможете оплатить удобным способом</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Создание заказа...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2 h-4 w-4" />
                    Отправить заказ
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
