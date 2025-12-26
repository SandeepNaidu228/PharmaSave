import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMedicineStore, Medicine } from '../../store/useMedicineStore';
import { useOrderStore } from '../../store/useOrderStore';

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('');
  const [nearExpiry, setNearExpiry] = useState(false);
  const [highDiscount, setHighDiscount] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { medicines, isLoading, searchMedicines, toggleSave, isSaved } = useMedicineStore();
  const { createOrder } = useOrderStore();

  useEffect(() => {
    // Initial load or when filters change
    const timeoutId = setTimeout(() => {
      searchMedicines(searchQuery || undefined, nearExpiry, highDiscount);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, nearExpiry, highDiscount]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await searchMedicines(searchQuery || undefined, nearExpiry, highDiscount);
    setRefreshing(false);
  }, [searchQuery, nearExpiry, highDiscount]);

  const handleReserve = async (medicine: Medicine) => {
    try {
      await createOrder(medicine._id || medicine.id || '', 1);
      alert('Medicine reserved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to reserve medicine');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#111814" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Results</Text>
        </View>
        
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#9ca3af" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search medicines..." 
            placeholderTextColor="#9ca3af"
            autoFocus={false}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterChip, nearExpiry && styles.filterChipActive]}
            onPress={() => setNearExpiry(!nearExpiry)}
          >
            <Text style={[styles.filterText, nearExpiry && styles.filterTextActive]}>
              Near Expiry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, highDiscount && styles.filterChipActive]}
            onPress={() => setHighDiscount(!highDiscount)}
          >
            <Text style={[styles.filterText, highDiscount && styles.filterTextActive]}>
              High Discount
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Results for "${searchQuery}"` : 'Top Results'} ({medicines.length})
        </Text>
        
        {isLoading && medicines.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#13ec80" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No medicines found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          medicines.map((medicine) => (
            <View key={medicine._id || medicine.id} style={styles.resultCard}>
              <View style={styles.cardTop}>
                <View style={styles.imageContainer}>
                  <MaterialIcons name="medication" size={40} color="#ccc" />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => toggleSave(medicine)}
                  >
                    <MaterialIcons 
                      name={isSaved(medicine._id || medicine.id || '') ? "bookmark" : "bookmark-border"} 
                      size={20} 
                      color={isSaved(medicine._id || medicine.id || '') ? "#13ec80" : "#9ca3af"} 
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.cardDetails}>
                  <View>
                    <View style={styles.titleRow}>
                      <Text style={styles.productName}>{medicine.name}</Text>
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{medicine.discountPercent}% OFF</Text>
                      </View>
                    </View>
                    <Text style={styles.manufacturer}>{medicine.brand}</Text>
                  </View>
                  
                  <View style={styles.expiryContainer}>
                    <MaterialIcons name="warning" size={14} color="#f59e0b" />
                    <Text style={styles.expiryText}>Expires in {medicine.expiryDays} days</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.pharmacyInfo}>
                    {medicine.pharmacyName || medicine.pharmacy?.name || 'Unknown Pharmacy'} • {medicine.distance || 'N/A'}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${medicine.discountedPrice?.toFixed(2) || '0.00'}</Text>
                    <Text style={styles.oldPrice}>${medicine.originalPrice?.toFixed(2) || '0.00'}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.reserveButton}
                  onPress={() => handleReserve(medicine)}
                >
                  <Text style={styles.reserveButtonText}>Reserve</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
    paddingBottom: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111814',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8f7',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#111814',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111814',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111814',
    flex: 1,
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#dcfce7', // Green-100
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#15803d', // Green-700
    fontSize: 10,
    fontWeight: 'bold',
  },
  manufacturer: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryText: {
    color: '#d97706', // Amber-600
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBottom: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pharmacyInfo: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111814',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 12,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  reserveButton: {
    backgroundColor: '#13ec80',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reserveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111814',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  filterChipActive: {
    backgroundColor: 'rgba(19, 236, 128, 0.1)',
    borderColor: '#13ec80',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#111814',
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
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 4,
    color: '#9ca3af',
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