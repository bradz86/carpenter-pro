import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const priceService = {
  // Get retailer prices for comparison
  getRetailerPrices: async (materialId) => {
    try {
      const response = await api.get(`/api/materials/${materialId}/retailer-prices`);
      return response.data;
    } catch (error) {
      console.error('Error fetching retailer prices:', error);
      return [];
    }
  },

  // Get price alerts
  getPriceAlerts: async () => {
    try {
      const response = await api.get('/api/price-alerts');
      
      // Cache alerts
      await AsyncStorage.setItem('price_alerts', JSON.stringify({
        data: response.data,
        timestamp: new Date().toISOString()
      }));
      
      return response.data;
    } catch (error) {
      // Return cached alerts if offline
      const cached = await AsyncStorage.getItem('price_alerts');
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      return [];
    }
  },

  // Mark alert as read
  markAlertRead: async (alertId) => {
    try {
      await api.post(`/api/price-alerts/${alertId}/mark-read`);
      return true;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
  },

  // Get price trend data
  getPriceTrend: async (materialId, days = 30) => {
    try {
      const response = await api.get(`/api/materials/${materialId}/trend`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching price trend:', error);
      return [];
    }
  }
};