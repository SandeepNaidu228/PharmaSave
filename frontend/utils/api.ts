const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://10.136.185.131:5000/api';

// Get token from AsyncStorage
const getToken = async (): Promise<string | null> => {
  try {
    const AsyncStorage =
      require('@react-native-async-storage/async-storage').default;
    const authData = await AsyncStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.token || null;
    }
    return null;
  } catch {
    return null;
  }
};

// Generic API request
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Request failed');

  return data;
};

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string, role?: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiRequest('/auth/me'),
};

// Medicine API
export const medicineAPI = {
  getAll: () => apiRequest('/medicines'),
  getById: (id: string) => apiRequest(`/medicines/${id}`),
};

// Pharmacy API
export const pharmacyAPI = {
  getNearby: (latitude: number, longitude: number, distance?: number) => {
    const params = new URLSearchParams();
    params.append('latitude', latitude.toString());
    params.append('longitude', longitude.toString());
    if (distance) params.append('distance', distance.toString());
    return apiRequest(`/pharmacies/nearby?${params.toString()}`);
  },

  getMyPharmacy: () => apiRequest('/pharmacies/my'),

  create: (name: string, address: string, latitude: number, longitude: number) =>
    apiRequest('/pharmacies', {
      method: 'POST',
      body: JSON.stringify({ name, address, latitude, longitude }),
    }),
};

// Order API
export const orderAPI = {
  create: (medicineId: string, quantity: number) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ medicineId, quantity }),
    }),

  getMyOrders: () => apiRequest('/orders/my'),
};

// Pharmacy Owner API
export const pharmacyOwnerAPI = {
  getMyPharmacy: () => apiRequest('/pharmacies/my'),

  createMedicine: (data: {
    name: string;
    brand: string;
    expiryDate: string;
    quantity: number;
    originalPrice: number;
  }) =>
    apiRequest('/medicines', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
