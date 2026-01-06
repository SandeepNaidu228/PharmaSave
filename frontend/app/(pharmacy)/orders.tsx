import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { pharmacyOwnerAPI, orderAPI } from '../../utils/api';

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  medicine: {
    _id: string;
    name: string;
    brand: string;
  };
  quantity: number;
  status: 'reserved' | 'picked' | 'expired';
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pharmacyId, setPharmacyId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await pharmacyOwnerAPI.getPharmacyOrders(pharmacyId || '');
      // Filter to show only reserved/pending orders
      const pendingOrders = (data || []).filter((order: Order) => order.status === 'reserved');
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleAccept = async (orderId: string) => {
    try {
      // Accepting means marking as picked
      await orderAPI.updateStatus(orderId, 'picked');
      Alert.alert('Success', 'Order accepted successfully');
      loadOrders();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept order');
    }
  };

  const handleReject = async (orderId: string) => {
    Alert.alert(
      'Reject Order',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              // Rejecting means marking as expired
              await orderAPI.updateStatus(orderId, 'expired');
              Alert.alert('Success', 'Order rejected');
              loadOrders();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to reject order');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} pending reservations</Text>
      </View>

      {isLoading && orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#13ec80" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>No pending orders</Text>
          <Text style={styles.emptySubtext}>Customer reservations will appear here</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {orders.map((order) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.customerName}>{order.user?.name || 'Customer'}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Pending</Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.medicineInfo}>
                  <MaterialIcons name="medication" size={20} color="#13ec80" />
                  <View style={styles.medicineTextContainer}>
                    <Text style={styles.medicineName}>{order.medicine?.name || 'Medicine'}</Text>
                    <Text style={styles.medicineBrand}>{order.medicine?.brand || ''}</Text>
                  </View>
                </View>
                <Text style={styles.quantityText}>Quantity: {order.quantity}</Text>
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReject(order._id)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="close" size={18} color="#ef4444" />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAccept(order._id)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="check" size={18} color="#111814" />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111814',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111814',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  orderDetails: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicineTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111814',
    marginBottom: 2,
  },
  medicineBrand: {
    fontSize: 12,
    color: '#6b7280',
  },
  quantityText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 32,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#13ec80',
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111814',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});

