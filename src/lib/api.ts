const API_URLS = {
  auth: 'https://functions.poehali.dev/db3baf7a-7ff5-441e-8969-5832417e14c7',
  bookings: 'https://functions.poehali.dev/80444fd1-2f9b-4ad7-b78e-a708172966ad',
  contact: 'https://functions.poehali.dev/cf06bc83-1174-4f8b-8a12-104636153942'
};

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'master' | 'client';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Booking {
  id?: number;
  user_id: number;
  service_id: number;
  booking_date: string;
  notes?: string;
  status?: string;
  created_at?: string;
}

export const api = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка входа');
    }
    
    return response.json();
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, name })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка регистрации');
    }
    
    return response.json();
  },

  async createBooking(booking: Booking, token: string): Promise<Booking> {
    const response = await fetch(API_URLS.bookings, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      },
      body: JSON.stringify(booking)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка создания записи');
    }
    
    return response.json();
  },

  async getBookings(userId?: number, token?: string): Promise<Booking[]> {
    const url = new URL(API_URLS.bookings);
    if (userId) {
      url.searchParams.set('user_id', userId.toString());
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: token ? { 'X-Auth-Token': token } : {}
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка загрузки записей');
    }
    
    return response.json();
  },

  async updateBookingStatus(id: number, status: string, token: string): Promise<Booking> {
    const response = await fetch(API_URLS.bookings, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      },
      body: JSON.stringify({ id, status })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления записи');
    }
    
    return response.json();
  },

  async sendContactForm(data: { name: string; phone: string; email: string; message: string }): Promise<{ success: boolean; message: string }> {
    const response = await fetch(API_URLS.contact, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка отправки формы');
    }
    
    return response.json();
  }
};

export const storage = {
  saveAuth(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  getAuth(): { user: User; token: string } | null {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) return null;
    
    try {
      return { user: JSON.parse(userStr), token };
    } catch {
      return null;
    }
  },

  clearAuth() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};
