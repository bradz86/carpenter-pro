import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Safely import Constants with fallback
let Constants;
try {
  Constants = require('expo-constants').default;
} catch (error) {
  console.warn('expo-constants not available:', error);
  Constants = { expoConfig: null };
}

const API_URL = Constants?.expoConfig?.extra?.apiUrl || 'https://carpenterpro-ifq96.ondigitalocean.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// Material Price API calls
export const materialPriceAPI = {
  // Fetch all materials with current prices
  getMaterials: async (category = null) => {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/api/materials', { params });
      
      // Cache the response
      await AsyncStorage.setItem('cached_materials', JSON.stringify({
        data: response.data,
        timestamp: new Date().toISOString(),
      }));
      
      return response.data;
    } catch (error) {
      // If offline, return cached data
      const cached = await AsyncStorage.getItem('cached_materials');
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      throw error;
    }
  },

  // Update custom price for a material
  updateCustomPrice: async (materialId, customPrice, userId = 'local') => {
    try {
      const response = await api.post('/api/materials/custom-price', {
        userId,
        materialId,
        customPrice,
      });
      return response.data;
    } catch (error) {
      // If offline, store locally
      const key = `custom_price_${materialId}`;
      await AsyncStorage.setItem(key, customPrice.toString());
      return { success: true, offline: true };
    }
  },

  // Get price history for a material
  getPriceHistory: async (materialId) => {
    try {
      const response = await api.get(`/api/materials/${materialId}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      return [];
    }
  },

  // Search materials
  searchMaterials: async (query) => {
    try {
      const response = await api.get('/api/materials/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      // Offline search from cached data
      const cached = await AsyncStorage.getItem('cached_materials');
      if (cached) {
        const { data } = JSON.parse(cached);
        return data.filter(material => 
          material.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      return [];
    }
  },
};

// Project API calls
export const projectAPI = {
  // Get all projects
  getProjects: async () => {
    try {
      const response = await api.get('/api/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/api/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/api/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};

// Estimate API calls
export const estimateAPI = {
  // Get estimates
  getEstimates: async (projectId = null) => {
    try {
      const params = projectId ? { projectId } : {};
      const response = await api.get('/api/estimates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching estimates:', error);
      throw error;
    }
  },

  // Create estimate
  createEstimate: async (estimateData) => {
    try {
      const response = await api.post('/api/estimates', estimateData);
      return response.data;
    } catch (error) {
      console.error('Error creating estimate:', error);
      throw error;
    }
  },

  // Generate PDF
  generatePDF: async (estimateId) => {
    try {
      const response = await api.get(`/api/estimates/${estimateId}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  },

  // Send estimate email
  sendEmail: async (estimateId, emailData) => {
    try {
      const response = await api.post(`/api/estimates/${estimateId}/email`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
};

// Auth API calls
export const authAPI = {
  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
};

// Sync API calls
export const syncAPI = {
  // Sync local data with server
  syncData: async (localData) => {
    try {
      const response = await api.post('/api/sync', localData);
      return response.data;
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  },

  // Get last sync timestamp
  getLastSync: async () => {
    try {
      const response = await api.get('/api/sync/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching sync status:', error);
      throw error;
    }
  },
};

export default api;
