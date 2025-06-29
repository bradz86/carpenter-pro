import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { priceService } from '../services/priceService';

const PriceComparison = ({ material }) => {
  const [retailerPrices, setRetailerPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  useEffect(() => {
    loadRetailerPrices();
  }, [material.id]);

  const loadRetailerPrices = async () => {
    setLoading(true);
    try {
      const prices = await priceService.getRetailerPrices(material.id);
      setRetailerPrices(prices);
    } catch (error) {
      console.error('Error loading retailer prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRetailerIcon = (retailer) => {
    switch (retailer.toLowerCase()) {
      case 'home depot':
        return 'home';
      case "lowe's":
        return 'hammer';
      case 'menards':
        return 'tools';
      default:
        return 'store';
    }
  };

  const openRetailerLink = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderRetailerPrice = ({ item }) => {
    const isLowest = retailerPrices.length > 0 && 
      item.price === Math.min(...retailerPrices.map(r => r.price));
    
    return (
      <Card style={[styles.retailerCard, isLowest && styles.lowestPriceCard]}>
        <Card.Content>
          <View style={styles.retailerHeader}>
            <View style={styles.retailerInfo}>
              <Icon 
                name={getRetailerIcon(item.retailer)} 
                size={24} 
                color="#666"
              />
              <Title style={styles.retailerName}>{item.retailer}</Title>
              {isLowest && (
                <Chip 
                  style={styles.lowestChip}
                  textStyle={styles.lowestChipText}
                >
                  Lowest
                </Chip>
              )}
            </View>
            <Text style={[styles.price, isLowest && styles.lowestPrice]}>
              ${item.price.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.retailerDetails}>
            <Text style={styles.stockStatus}>
              {item.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
            </Text>
            <Text style={styles.lastUpdated}>
              Updated: {new Date(item.last_scraped).toLocaleDateString()}
            </Text>
          </View>
          
          {item.url && (
            <Button
              mode="outlined"
              onPress={() => openRetailerLink(item.url)}
              style={styles.viewButton}
            >
              View on Website
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Comparing prices...</Text>
      </View>
    );
  }

  const savings = retailerPrices.length > 1 ? 
    Math.max(...retailerPrices.map(r => r.price)) - 
    Math.min(...retailerPrices.map(r => r.price)) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Price Comparison</Title>
        {savings > 0 && (
          <Text style={styles.savingsText}>
            Potential Savings: ${savings.toFixed(2)}
          </Text>
        )}
      </View>
      
      <FlatList
        data={retailerPrices}
        keyExtractor={(item) => item.retailer}
        renderItem={renderRetailerPrice}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                No retailer prices available for this material
              </Text>
            </Card.Content>
          </Card>
        }
      />
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadRetailerPrices}
      >
        <Icon name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshText}>Refresh Prices</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  retailerCard: {
    marginBottom: 12,
    elevation: 2,
  },
  lowestPriceCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  retailerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retailerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retailerName: {
    fontSize: 18,
    marginLeft: 8,
  },
  lowestChip: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
  },
  lowestChipText: {
    color: '#fff',
    fontSize: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  lowestPrice: {
    color: '#4CAF50',
  },
  retailerDetails: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockStatus: {
    color: '#666',
    fontSize: 14,
  },
  lastUpdated: {
    color: '#999',
    fontSize: 12,
  },
  viewButton: {
    marginTop: 12,
  },
  emptyCard: {
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  refreshText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default PriceComparison;