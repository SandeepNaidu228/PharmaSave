import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { pharmacyOwnerAPI } from '../../utils/api';

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  expiryDate: string;
  expiryDays: number;
}

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pharmacyId, setPharmacyId] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const data = await pharmacyOwnerAPI.getMyMedicines(pharmacyId || '');
      setMedicines(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      setMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInventory();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <Text style={styles.headerSubtitle}>{medicines.length} items in stock</Text>
      </View>

      {isLoading && medicines.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#13ec80" />
        </View>
      ) : medicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="inventory" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>No medicines in inventory</Text>
          <Text style={styles.emptySubtext}>Add your first medicine to get started</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-medicine' as any)}
          >
            <Text style={styles.addButtonText}>Add Medicine</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {medicines.map((medicine) => (
            <View key={medicine._id} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>{medicine.name}</Text>
                  <Text style={styles.medicineBrand}>{medicine.brand}</Text>
                </View>
                {medicine.quantity < 5 && (
                  <View style={styles.warningBadge}>
                    <MaterialIcons name="warning" size={16} color="#ef4444" />
                  </View>
                )}
              </View>

              <View style={styles.medicineDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="inventory" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>Stock: {medicine.quantity}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="attach-money" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>${medicine.originalPrice.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="event" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Expires: {formatDate(medicine.expiryDate)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="access-time" size={16} color="#f59e0b" />
                    <Text style={[styles.detailText, styles.expiryText]}>
                      {medicine.expiryDays} days left
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-medicine' as any)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#111814" />
      </TouchableOpacity>
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
  medicineCard: {
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
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111814',
    marginBottom: 4,
  },
  medicineBrand: {
    fontSize: 12,
    color: '#6b7280',
  },
  warningBadge: {
    padding: 4,
  },
  medicineDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  expiryText: {
    color: '#f59e0b',
    fontWeight: '600',
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
  addButton: {
    backgroundColor: '#13ec80',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111814',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#13ec80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#13ec80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

