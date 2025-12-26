import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMedicineStore, Medicine } from '../../store/useMedicineStore';

export default function HomePage() {
  const { medicines, isLoading, fetchMedicines, toggleSave, isSaved } = useMedicineStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchMedicines();
    setRefreshing(false);
  }, [fetchMedicines]);
  
  const handleProductPress = (medicine: Medicine) => {
    // Navigate to the Details page with medicine data
    router.push({
      pathname: '/details',
      params: { medicineId: medicine._id || medicine.id },
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <View style={styles.brandSection}>
            <View style={styles.logoIcon}>
              <MaterialIcons name="local-pharmacy" size={24} color="#13ec80" />
            </View>
            <Text style={styles.brandName}>PharmaSave</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="notifications-none" size={24} color="#111814" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="shopping-cart" size={24} color="#111814" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Good Morning, Alex.</Text>
          <Text style={styles.subGreeting}>Find your medicines today.</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/search')}
            style={styles.searchBar}
            activeOpacity={0.9}
          >
            <MaterialIcons name="search" size={24} color="#9ca3af" />
            <Text style={styles.searchText}>Search medicines...</Text>
            <MaterialIcons name="document-scanner" size={20} color="#13ec80" />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.expiryBadge}>
                <Text style={styles.expiryText}>EXPIRING SOON</Text>
              </View>
              <Text style={styles.heroTitle}>Save the Planet,{"\n"}Save Money.</Text>
              <Text style={styles.heroSubtitle}>Up to 70% off on essentials.</Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Shop Deals</Text>
              </TouchableOpacity>
            </View>
            {/* Decor Icon */}
            <View style={styles.heroDecor}>
               <MaterialIcons name="medication" size={140} color="#13ec80" />
            </View>
          </View>
        </View>

        {/* Categories / Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
           {['All', 'Near Expiry', 'Discount %', 'Antibiotics'].map((chip, index) => (
             <TouchableOpacity 
               key={index} 
               style={[
                 styles.categoryChip, 
                 index === 0 ? styles.categoryChipActive : styles.categoryChipInactive
               ]}
             >
               <Text style={[
                 styles.categoryText,
                 index === 0 ? styles.categoryTextActive : styles.categoryTextInactive
               ]}>
                 {chip}
               </Text>
             </TouchableOpacity>
           ))}
        </ScrollView>

        {/* Featured Deals */}
        <View style={styles.dealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Deals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading && medicines.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#13ec80" />
              <Text style={styles.loadingText}>Loading medicines...</Text>
            </View>
          ) : medicines.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="medication" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No medicines available</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.dealsContent}
            >
              {medicines.slice(0, 10).map((medicine) => (
                <TouchableOpacity 
                  key={medicine._id || medicine.id} 
                  style={styles.productCard}
                  onPress={() => handleProductPress(medicine)}
                  activeOpacity={0.9}
                >
                  {/* Product Image Placeholder */}
                  <View style={styles.productImageContainer}>
                    <MaterialIcons name="medical-services" size={48} color="#ccc" />
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{medicine.discountPercent}% OFF</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleSave(medicine);
                      }}
                    >
                      <MaterialIcons 
                        name={isSaved(medicine._id || medicine.id || '') ? "bookmark" : "bookmark-border"} 
                        size={20} 
                        color={isSaved(medicine._id || medicine.id || '') ? "#13ec80" : "#9ca3af"} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{medicine.name}</Text>
                    <Text style={styles.pharmacyName}>{medicine.pharmacyName || medicine.pharmacy?.name || 'Unknown'} • {medicine.distance || 'N/A'}</Text>
                    
                    <View style={styles.expiryTag}>
                      <MaterialIcons name="access-time" size={12} color="#c2410c" />
                      <Text style={styles.expiryTagText}>Exp: {medicine.expiryDays} Days</Text>
                    </View>

                    <View style={styles.priceRow}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.currentPrice}>${medicine.discountedPrice?.toFixed(2) || '0.00'}</Text>
                        <Text style={styles.originalPrice}>${medicine.originalPrice?.toFixed(2) || '0.00'}</Text>
                      </View>
                      <TouchableOpacity style={styles.addButton}>
                        <MaterialIcons name="add" size={20} color="#111814" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
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
    paddingTop: 8, // Adjust for status bar
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    backgroundColor: 'rgba(19, 236, 128, 0.1)',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111814',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111814',
  },
  subGreeting: {
    color: '#6b7280',
    fontSize: 18,
    marginTop: 4,
    fontWeight: '500',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#9ca3af',
  },
  heroSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  heroCard: {
    backgroundColor: '#E0FDF4',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 160,
    justifyContent: 'center',
  },
  heroContent: {
    zIndex: 10,
    width: '66%',
  },
  expiryBadge: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  expiryText: {
    color: '#ea580c', // Orange-600
    fontWeight: 'bold',
    fontSize: 10,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111814',
    lineHeight: 28,
  },
  heroSubtitle: {
    color: '#4b5563',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 12,
  },
  heroButton: {
    backgroundColor: '#13ec80',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroButtonText: {
    fontWeight: 'bold',
    color: '#111814',
  },
  heroDecor: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    opacity: 0.2,
    transform: [{ rotate: '12deg' }],
  },
  categoriesScroll: {
    marginTop: 24,
  },
  categoriesContent: {
    paddingLeft: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(19, 236, 128, 0.1)',
    borderColor: '#13ec80',
  },
  categoryChipInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#f3f4f6',
  },
  categoryText: {
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#111814',
  },
  categoryTextInactive: {
    color: '#4b5563',
  },
  dealsSection: {
    marginTop: 32,
    paddingBottom: 100, // Space for Tab Bar
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111814',
  },
  seeAllText: {
    color: '#13ec80',
    fontWeight: 'bold',
  },
  dealsContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    width: 240,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImageContainer: {
    height: 128,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444', // Red-500
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111814',
  },
  pharmacyName: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  expiryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: '#fff7ed', // Orange-50
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  expiryTagText: {
    fontSize: 10,
    color: '#c2410c', // Orange-700
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111814',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#13ec80',
    padding: 8,
    borderRadius: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 14,
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
  },
});