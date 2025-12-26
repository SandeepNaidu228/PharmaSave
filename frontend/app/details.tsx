import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { medicineAPI } from '../utils/api';
import { useOrderStore } from '../store/useOrderStore';
import { useMedicineStore } from '../store/useMedicineStore';
import type { Medicine } from '../store/useMedicineStore';

export default function MedicineDetails() {
  const { medicineId } = useLocalSearchParams<{ medicineId: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { createOrder } = useOrderStore();
  const { toggleSave, isSaved } = useMedicineStore();

  useEffect(() => {
    if (medicineId) {
      fetchMedicineDetails();
    }
  }, [medicineId]);

  const fetchMedicineDetails = async () => {
    try {
      setIsLoading(true);
      const data = await medicineAPI.getById(medicineId);
      setMedicine({
        _id: data._id,
        id: data._id,
        name: data.name,
        brand: data.brand,
        originalPrice: data.originalPrice,
        discountedPrice: data.discountedPrice,
        discountPercent: data.discountPercent,
        expiryDays: data.expiryDays,
        pharmacy: data.pharmacy,
        pharmacyName: data.pharmacy?.name || 'Unknown Pharmacy',
        quantity: data.quantity,
        isNearExpiry: data.isNearExpiry,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load medicine details');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!medicine) return;
    
    try {
      await createOrder(medicine._id || medicine.id || '', quantity);
      Alert.alert('Success', 'Medicine reserved successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reserve medicine');
    }
  };

  if (isLoading || !medicine) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#13ec80" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading medicine details...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.circleButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#111814" />
          </TouchableOpacity>
          <View style={styles.circleButton}>
            <MaterialIcons name="ios-share" size={20} color="#111814" />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Product Image */}
        <View style={styles.heroSection}>
          <View style={styles.heroImageContainer}>
            {/* Background Blobs (Simulated with views) */}
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />
            
            {/* Product Placeholder */}
            <MaterialCommunityIcons name="pill" size={180} color="#13ec80" />
            
            {/* Discount Badge */}
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{medicine.discountPercent}% OFF</Text>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => toggleSave(medicine)}
            >
              <MaterialIcons 
                name={isSaved(medicine._id || medicine.id || '') ? "bookmark" : "bookmark-border"} 
                size={24} 
                color={isSaved(medicine._id || medicine.id || '') ? "#13ec80" : "#9ca3af"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Info */}
        <View style={styles.infoSection}>
          <View>
            <Text style={styles.productTitle}>{medicine.name}</Text>
            <Text style={styles.productSubtitle}>Brand: {medicine.brand}</Text>
          </View>

          {/* Price & Expiry Row */}
          <View style={styles.priceExpiryRow}>
            <View>
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>${medicine.discountedPrice?.toFixed(2) || '0.00'}</Text>
                <Text style={styles.originalPrice}>${medicine.originalPrice?.toFixed(2) || '0.00'}</Text>
              </View>
              <Text style={styles.stockStatus}>In stock: {medicine.quantity || 0} packs</Text>
            </View>

            <View style={styles.expiryBadge}>
              <MaterialIcons name="warning" size={18} color="#c2410c" />
              <View>
                <Text style={styles.expiryLabel}>EXPIRES</Text>
                <Text style={styles.expiryDate}>In {medicine.expiryDays} days</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Pharmacy Card */}
          <TouchableOpacity style={styles.pharmacyCard}>
            <View style={styles.pharmacyIcon}>
              <MaterialIcons name="storefront" size={24} color="#2563eb" />
            </View>
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>{medicine.pharmacyName || medicine.pharmacy?.name || 'Unknown Pharmacy'}</Text>
              <View style={styles.pharmacyMeta}>
                {medicine.pharmacy?.address && (
                  <>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="location-on" size={14} color="gray" />
                      <Text style={styles.metaText}>{medicine.pharmacy.address}</Text>
                    </View>
                    <Text style={styles.metaDot}>•</Text>
                  </>
                )}
                <Text style={styles.metaOpenStatus}>Available</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>

          {/* Safety Verification */}
          <View style={styles.safetyCard}>
            <MaterialIcons name="verified-user" size={24} color="#2563eb" />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Safety Verification</Text>
              <Text style={styles.safetyDescription}>
                Safe for use before expiry when stored properly. This product has been quality checked by our partner pharmacists.
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionHeader}>About this medicine</Text>
            <Text style={styles.descriptionText}>
              Panadol Extra contains a combination of paracetamol and caffeine. It is designed to provide effective relief from headaches, muscle aches, backaches, and fever. The caffeine acts to further amplify the pain-relieving effect of paracetamol.
            </Text>
            <Text style={styles.readMoreText}>Read full leaflet</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          {/* Quantity */}
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <MaterialIcons name="remove" size={20} color={quantity <= 1 ? "#9ca3af" : "black"} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => setQuantity(Math.min(medicine.quantity || 1, quantity + 1))}
              disabled={quantity >= (medicine.quantity || 1)}
            >
              <MaterialIcons name="add" size={20} color={quantity >= (medicine.quantity || 1) ? "#9ca3af" : "black"} />
            </TouchableOpacity>
          </View>

          {/* Reserve Button */}
          <TouchableOpacity 
            onPress={handleReserve}
            style={styles.reserveButton}
            activeOpacity={0.8}
            disabled={!medicine.quantity || medicine.quantity === 0}
          >
            <Text style={styles.reserveButtonText}>Reserve Now</Text>
            <MaterialIcons name="shopping-bag" size={20} color="#111814" />
          </TouchableOpacity>
        </View>
      </View>
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
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom bar
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    padding: 32,
  },
  blobTopRight: {
    position: 'absolute',
    top: -64,
    right: -64,
    height: 256,
    width: 256,
    borderRadius: 128,
    backgroundColor: '#eff6ff', // blue-50
    opacity: 0.6,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -64,
    left: -64,
    height: 256,
    width: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(19, 236, 128, 0.1)',
    opacity: 0.6,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 20,
    backgroundColor: '#FF4747',
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoSection: {
    paddingHorizontal: 16,
    gap: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: '#111814',
  },
  productSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  priceExpiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  currentPrice: {
    fontSize: 30,
    fontWeight: '800',
    color: '#13ec80',
    letterSpacing: -0.5,
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a', // green-600
    marginTop: 4,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff7ed', // orange-50
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffedd5', // orange-100
  },
  expiryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#ea580c', // orange-600
    lineHeight: 10,
  },
  expiryDate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c2410c', // orange-700
    lineHeight: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  pharmacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  pharmacyIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontWeight: 'bold',
    color: '#111814',
    fontSize: 16,
  },
  pharmacyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  metaDot: {
    fontSize: 12,
    color: '#d1d5db',
  },
  metaOpenStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16a34a',
  },
  safetyCard: {
    borderRadius: 12,
    backgroundColor: '#eff6ff', // blue-50
    borderColor: '#dbeafe', // blue-100
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1e3a8a', // blue-900
  },
  safetyDescription: {
    fontSize: 12,
    color: '#1e40af', // blue-800
    marginTop: 4,
    lineHeight: 18,
  },
  descriptionSection: {
    marginTop: 24,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111814',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#4b5563',
  },
  readMoreText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#13ec80',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 16,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    padding: 4,
  },
  qtyButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    width: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#111814',
  },
  reserveButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: '#13ec80',
    shadowColor: '#13ec80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reserveButtonText: {
    color: '#111814',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});