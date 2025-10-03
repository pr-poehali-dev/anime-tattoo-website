import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: number;
  user_id: number;
  client_name: string;
  client_email: string;
  service_type: string;
  description: string;
  status: string;
  price: number | null;
  payment_method: string | null;
  created_at: string;
}

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message: string;
  created_at: string;
}

const MasterDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [userId] = useState(() => localStorage.getItem('userId'));

  useEffect(() => {
    if (!userId) {
      console.log('No userId, redirecting to home');
      navigate('/');
      return;
    }
    console.log('Loading orders for master userId:', userId);
    loadOrders();
  }, [userId, navigate]);

  const loadOrders = async () => {
    const localOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    console.log('Master loading orders from localStorage:', localOrders);
    
    if (localOrders.length > 0) {
      const ordersWithDetails = localOrders.map((order: any) => ({
        ...order,
        user_id: order.user_id || 999,
        client_name: order.client_name || 'Клиент',
        client_email: order.client_email || 'client@example.com',
      }));
      setOrders(ordersWithDetails);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('https://functions.poehali.dev/70a8d501-1b95-4105-97ed-d5928e0e12d5', {
        headers: {
          'X-User-Id': userId!,
        },
      });
      const data = await response.json();
      console.log('Master loaded orders from API:', data);
      
      setOrders(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
      setIsLoading(false);
    }
  };

  const selectOrder = async (order: Order) => {
    setSelectedOrder(order);
    setPrice(order.price?.toString() || '');
    await loadMessages(order.id);
  };

  const loadMessages = async (orderId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/702e7931-41cc-45a8-ad61-5ca8fc761bab?order_id=${orderId}`, {
        headers: {
          'X-User-Id': userId!,
        },
      });
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder) return;

    try {
      await fetch('https://functions.poehali.dev/702e7931-41cc-45a8-ad61-5ca8fc761bab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId!,
        },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          message: newMessage,
        }),
      });

      setNewMessage('');
      await loadMessages(selectedOrder.id);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
    }
  };

  const setOrderPrice = async () => {
    if (!selectedOrder || !price) return;

    try {
      await fetch('https://functions.poehali.dev/70a8d501-1b95-4105-97ed-d5928e0e12d5', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId!,
        },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          price: parseFloat(price),
        }),
      });

      toast({
        title: 'Успешно!',
        description: 'Цена выставлена. Клиент получит уведомление',
      });

      const response = await fetch('https://functions.poehali.dev/70a8d501-1b95-4105-97ed-d5928e0e12d5', {
        headers: {
          'X-User-Id': userId!,
        },
      });
      const updatedOrders = await response.json();
      setOrders(updatedOrders);
      
      const updated = updatedOrders.find((o: Order) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выставить цену',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Новый', variant: 'secondary' },
      discussing: { label: 'Обсуждение', variant: 'default' },
      priced: { label: 'Цена выставлена', variant: 'outline' },
      paid: { label: 'Оплачен', variant: 'default' },
      completed: { label: 'Завершён', variant: 'secondary' },
    };
    const s = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Кабинет мастера</h1>
          <Button variant="outline" onClick={() => {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            navigate('/');
          }}>
            <Icon name="LogOut" className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Все заказы</CardTitle>
              <CardDescription>
                Всего: {orders.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Пока нет заказов
                </p>
              ) : (
                orders.map((order) => (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedOrder?.id === order.id ? 'border-primary' : ''
                    }`}
                    onClick={() => selectOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{order.service_type}</p>
                          <p className="text-xs text-muted-foreground">{order.client_name}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ru-RU')}
                      </p>
                      {order.price && (
                        <p className="text-sm font-bold mt-2">{order.price} ₽</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            {selectedOrder ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedOrder.service_type}</CardTitle>
                      <CardDescription>
                        Клиент: {selectedOrder.client_name} ({selectedOrder.client_email})
                      </CardDescription>
                      <p className="text-sm mt-2">{selectedOrder.description}</p>
                    </div>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedOrder.status !== 'paid' && selectedOrder.status !== 'completed' && (
                    <div className="mb-6 p-4 bg-primary/10 rounded-lg space-y-4">
                      <div>
                        <Label htmlFor="price">Стоимость работы (₽)</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Введите стоимость"
                          />
                          <Button onClick={setOrderPrice} disabled={!price}>
                            {selectedOrder.price ? 'Обновить' : 'Выставить'}
                          </Button>
                        </div>
                      </div>
                      {selectedOrder.price && (
                        <p className="text-sm text-muted-foreground">
                          Текущая цена: {selectedOrder.price} ₽
                          {selectedOrder.status === 'priced' && ' (ожидает оплаты клиентом)'}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedOrder.payment_method && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        {selectedOrder.payment_method === 'online' 
                          ? '✓ Клиент оплатил онлайн' 
                          : '✓ Клиент выбрал оплату наличными при встрече'}
                      </p>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="font-medium">Общение с клиентом</h3>
                    <div className="border rounded-lg p-4 h-[400px] overflow-y-auto space-y-4">
                      {messages.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center">
                          Пока нет сообщений
                        </p>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === parseInt(userId!) ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender_id === parseInt(userId!)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-xs font-medium mb-1">
                                {msg.sender_role === 'master' ? 'Вы' : `👤 ${msg.sender_name}`}
                              </p>
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.created_at).toLocaleString('ru-RU')}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Напишите сообщение..."
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Icon name="Send" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center text-muted-foreground">
                  <Icon name="Package" className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Выберите заказ для просмотра</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MasterDashboard;