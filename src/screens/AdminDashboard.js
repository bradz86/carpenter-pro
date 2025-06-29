import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Card, Title, Button, DataTable, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';

const AdminDashboard = () => {
  const [scrapingStatus, setScrapingStatus] = useState([]);
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScrapingStatus();
    const interval = setInterval(loadScrapingStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadScrapingStatus = async () => {
    try {
      const response = await api.get('/api/admin/scraping-status');
      setScrapingStatus(response.data);
      setIsScrapingActive(response.data.some(log => log.status === 'running'));
    } catch (error) {
      console.error('Error loading scraping status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startScraping = async () => {
    Alert.alert(
      'Start Price Scraping',
      'This will update all material prices. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              await api.post('/api/admin/scrape-prices', {}, {
                headers: {
                  Authorization: `Bearer ${process.env.ADMIN_KEY}`
                }
              });
              Alert.alert('Success', 'Price scraping started');
              loadScrapingStatus();
            } catch (error) {
              Alert.alert('Error', 'Failed to start scraping');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'running': return '#2196F3';
      case 'failed': return '#F44336';
      default: return '#999';
    }
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return '-';
    const duration = new Date(end) - new Date(start);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Price Scraping Dashboard</Title>
        <Button
          mode="contained"
          onPress={startScraping}
          disabled={isScrapingActive}
          icon="refresh"
        >
          {isScrapingActive ? 'Scraping...' : 'Start Scraping'}
        </Button>
      </View>

      {isScrapingActive && (
        <Card style={styles.activeCard}>
          <Card.Content>
            <View style={styles.activeHeader}>
              <Icon name="sync" size={24} color="#2196F3" />
              <Text style={styles.activeText}>Price scraping in progress...</Text>
            </View>
            <ProgressBar indeterminate color="#2196F3" style={styles.progressBar} />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.statusCard}>
        <Card.Title title="Recent Scraping Jobs" />
        <Card.Content>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title>Materials</DataTable.Title>
              <DataTable.Title>Duration</DataTable.Title>
              <DataTable.Title>Started</DataTable.Title>
            </DataTable.Header>

            {scrapingStatus.map((log) => (
              <DataTable.Row key={log.id}>
                <DataTable.Cell>
                  <View style={styles.statusCell}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(log.status) }
                      ]} 
                    />
                    <Text style={styles.statusText}>{log.status}</Text>
                  </View>
                </DataTable.Cell>
                <DataTable.Cell>{log.materials_updated || 0}</DataTable.Cell>
                <DataTable.Cell>
                  {formatDuration(log.started_at, log.completed_at)}
                </DataTable.Cell>
                <DataTable.Cell>
                  {new Date(log.started_at).toLocaleString()}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      <Card style={styles.scheduleCard}>
        <Card.Title title="Scheduled Updates" />
        <Card.Content>
          <View style={styles.scheduleItem}>
            <Icon name="calendar-clock" size={20} color="#666" />
            <Text style={styles.scheduleText}>
              Next update: 1st of next month at 2:00 AM
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <Icon name="repeat" size={20} color="#666" />
            <Text style={styles.scheduleText}>
              Frequency: Twice monthly (1st and 15th)
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  activeCard: {
    margin: 16,
    elevation: 4,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2196F3',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  statusCard: {
    margin: 16,
    elevation: 2,
  },
  statusCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  scheduleCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    marginLeft: 8,
    color: '#666',
  },
});

export default AdminDashboard;