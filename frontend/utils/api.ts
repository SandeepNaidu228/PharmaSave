// API Configuration and Service Layer
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.136.185.131:5000/api';

// Helper function to get auth token from AsyncStorage
const getToken = async (): Promise<string | null> => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const authData = await AsyncStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      // Zustand persist stores data in state property
      return parsed.state?.token || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string, role?: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
};

// Medicine API
export const medicineAPI = {
  getAll: async () => {
    return apiRequest('/medicines', {
      method: 'GET',
    });
  },

  search: async (query?: string, nearExpiry?: boolean, highDiscount?: boolean) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (nearExpiry) params.append('nearExpiry', 'true');
    if (highDiscount) params.append('highDiscount', 'true');
    
    const queryString = params.toString();
    return apiRequest(`/medicines/search${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiRequest(`/medicines/${id}`, {
      method: 'GET',
    });
  },
};

// Pharmacy API
export const pharmacyAPI = {
  getNearby: async (latitude: number, longitude: number, distance?: number) => {
    const params = new URLSearchParams();
    params.append('latitude', latitude.toString());
    params.append('longitude', longitude.toString());
    if (distance) params.append('distance', distance.toString());
    
    return apiRequest(`/pharmacies/nearby?${params.toString()}`, {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiRequest(`/pharmacies/${id}`, {
      method: 'GET',
    });
  },
};

// Order API
export const orderAPI = {
  create: async (medicineId: string, quantity: number) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ medicineId, quantity }),
    });
  },

  getMyOrders: async () => {
    return apiRequest('/orders/my', {
      method: 'GET',
    });
  },

  updateStatus: async (orderId: string, status: 'picked' | 'expired') => {
    return apiRequest(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

