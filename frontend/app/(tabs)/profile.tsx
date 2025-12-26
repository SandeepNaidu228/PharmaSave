import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useMedicineStore } from '../../store/useMedicineStore';

export default function ProfilePage() {
  const { user, logout, checkAuth } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const { saved } = useMedicineStore();

  useEffect(() => {
    checkAuth();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Calculate saved amount (difference between original and discounted prices)
  const totalSaved = saved.reduce((sum, medicine) => {
    return sum + (medicine.originalPrice - (medicine.discountedPrice || 0));
  }, 0);

  const rescuedCount = orders.filter(order => order.status === 'picked').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <MaterialIcons name="settings" size={24} color="#111814" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
               <MaterialIcons name="person" size={60} color="#ccc" />
            </View>
            <View style={styles.ecoBadge}>
              <MaterialIcons name="eco" size={16} color="#102219" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userSince}>{user?.email || ''}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>${totalSaved.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{rescuedCount}</Text>
              <Text style={styles.statLabel}>Rescued</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
            {[
            { icon: 'notifications', label: 'Notifications' },
            { icon: 'credit-card', label: 'Payment Methods' },
            { icon: 'favorite', label: 'Saved Items', badge: saved.length.toString() },
            { icon: 'shopping-cart', label: 'My Orders', badge: orders.length.toString() },
            { icon: 'help', label: 'Help & Support' },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.menuItem,
                index !== 4 && styles.menuItemBorder // Add border to all except the last one
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons name={item.icon as any} size={24} color="#9ca3af" />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7',
  },
  headerSafeArea: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111814',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e5e7eb',
    borderWidth: 4,
    borderColor: 'rgba(19, 236, 128, 0.2)', // Light green border
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ecoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#13ec80',
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111814',
  },
  userSince: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 24,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f6f8f7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#13ec80',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111814',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeContainer: {
    backgroundColor: 'rgba(19, 236, 128, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#15803d', // Green-700
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoutText: {
    color: '#ef4444', // Red-500
    fontSize: 16,
    fontWeight: 'bold',
  },
});