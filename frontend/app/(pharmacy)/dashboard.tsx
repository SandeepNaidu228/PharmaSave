import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { pharmacyOwnerAPI } from '../../utils/api';

export default function PharmacyDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    lowStockItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pharmacyId, setPharmacyId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // TODO: Get pharmacy ID from user or API
      // For now, we'll fetch all medicines and calculate stats
      // In production, you'd have a dedicated endpoint for pharmacy stats
      const medicines = await pharmacyOwnerAPI.getMyMedicines(pharmacyId || '');
      
      // Calculate stats
      const lowStock = medicines.filter((m: any) => m.quantity < 5).length;
      
      setStats({
        totalSales: 0, // Would come from orders
        activeOrders: 0, // Would come from orders
        lowStockItems: lowStock,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Pharmacy Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back, {user?.name || 'Pharmacy Owner'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="account-circle" size={32} color="#111814" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#13ec80" />
          </View>
        ) : (
          <>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="attach-money" size={24} color="#13ec80" />
                </View>
                <Text style={styles.statValue}>${stats.totalSales.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total Sales</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="shopping-cart" size={24} color="#2563eb" />
                </View>
                <Text style={styles.statValue}>{stats.activeOrders}</Text>
                <Text style={styles.statLabel}>Active Orders</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, stats.lowStockItems > 0 && styles.statIconWarning]}>
                  <MaterialIcons 
                    name="warning" 
                    size={24} 
                    color={stats.lowStockItems > 0 ? "#ef4444" : "#6b7280"} 
                  />
                </View>
                <Text style={[styles.statValue, stats.lowStockItems > 0 && styles.statValueWarning]}>
                  {stats.lowStockItems}
                </Text>
                <Text style={styles.statLabel}>Low Stock</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/add-medicine' as any)}
                activeOpacity={0.8}
              >
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionIconContainer}>
                    <MaterialIcons name="add-circle" size={32} color="#13ec80" />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Add Medicine</Text>
                    <Text style={styles.actionSubtitle}>Add new inventory to your pharmacy</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  // TODO: Implement barcode scanner
                  alert('Barcode scanner coming soon!');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionIconContainer}>
                    <MaterialIcons name="qr-code-scanner" size={32} color="#13ec80" />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Scan Barcode</Text>
                    <Text style={styles.actionSubtitle}>Quickly add items by scanning</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <TouchableOpacity onPress={() => router.push('/orders' as any)}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.emptyState}>
                <MaterialIcons name="shopping-cart" size={48} color="#9ca3af" />
                <Text style={styles.emptyStateText}>No recent orders</Text>
                <Text style={styles.emptyStateSubtext}>Orders will appear here</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(19, 236, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIconWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111814',
    marginBottom: 4,
  },
  statValueWarning: {
    color: '#ef4444',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111814',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#13ec80',
  },
  actionButton: {
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
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111814',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});

