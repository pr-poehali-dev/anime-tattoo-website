import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { api, storage, type User, type Booking } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = storage.getAuth();
    if (!auth) {
      navigate('/');
      return;
    }
    setUser(auth.user);
    setToken(auth.token);
    loadBookings(auth.user.id, auth.token);
  }, [navigate]);

  const loadBookings = async (userId: number, authToken: string) => {
    setIsLoading(true);
    try {
      const data = await api.getBookings(userId, authToken);
      setBookings(data);
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

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    if (!token) return;
    
    try {
      await api.updateBookingStatus(bookingId, newStatus, token);
      toast({
        title: 'Успешно',
        description: 'Статус записи обновлен'
      });
      if (user) {
        loadBookings(user.id, token);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    storage.clearAuth();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтверждено';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <nav className="bg-black/90 backdrop-blur-md shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">ANIME TATTOO</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">{user.name}</span>
            <Badge variant="outline" className="border-primary text-primary">
              {user.role === 'master' ? 'Мастер' : 'Клиент'}
            </Badge>
            <Button variant="outline" onClick={() => navigate('/')}>
              Главная
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-black text-white mb-8">
          {user.role === 'master' ? 'Панель мастера' : 'Мой кабинет'}
        </h2>

        <Tabs defaultValue="bookings" className="space-y-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="bookings">
              <Icon name="Calendar" size={16} className="mr-2" />
              Записи
            </TabsTrigger>
            {user.role === 'master' && (
              <>
                <TabsTrigger value="clients">
                  <Icon name="Users" size={16} className="mr-2" />
                  Клиенты
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <Icon name="BarChart3" size={16} className="mr-2" />
                  Статистика
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="bookings">
            {isLoading ? (
              <div className="text-center text-white py-12">Загрузка...</div>
            ) : bookings.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="py-12 text-center">
                  <Icon name="Calendar" size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Записей пока нет</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="bg-gray-800 border-gray-700 hover-lift">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {booking.service_name || `Услуга #${booking.service_id}`}
                          </h3>
                          {user.role === 'master' && (
                            <p className="text-gray-400 mb-2">
                              <Icon name="User" size={16} className="inline mr-2" />
                              {booking.client_name} ({booking.client_email})
                            </p>
                          )}
                          <p className="text-gray-400">
                            <Icon name="Calendar" size={16} className="inline mr-2" />
                            {new Date(booking.booking_date).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </div>
                      
                      {booking.notes && (
                        <div className="bg-gray-900 p-4 rounded-lg mb-4">
                          <p className="text-gray-300">{booking.notes}</p>
                        </div>
                      )}

                      {user.role === 'master' && booking.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(booking.id!, 'confirmed')}
                          >
                            <Icon name="Check" size={16} className="mr-2" />
                            Подтвердить
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusChange(booking.id!, 'cancelled')}
                          >
                            <Icon name="X" size={16} className="mr-2" />
                            Отменить
                          </Button>
                        </div>
                      )}

                      {user.role === 'master' && booking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 mt-4"
                          onClick={() => handleStatusChange(booking.id!, 'completed')}
                        >
                          <Icon name="CheckCircle" size={16} className="mr-2" />
                          Завершить
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {user.role === 'master' && (
            <>
              <TabsContent value="clients">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Клиенты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Список клиентов в разработке...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Всего записей</p>
                          <p className="text-3xl font-bold text-white">{bookings.length}</p>
                        </div>
                        <Icon name="Calendar" size={32} className="text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Подтверждено</p>
                          <p className="text-3xl font-bold text-white">
                            {bookings.filter(b => b.status === 'confirmed').length}
                          </p>
                        </div>
                        <Icon name="Check" size={32} className="text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Завершено</p>
                          <p className="text-3xl font-bold text-white">
                            {bookings.filter(b => b.status === 'completed').length}
                          </p>
                        </div>
                        <Icon name="CheckCircle" size={32} className="text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;
