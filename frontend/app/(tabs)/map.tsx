import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Platform } from 'react-native';
// It is safe to import this here because map.web.tsx handles the web version
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// --- MOCK DATA ---
const PHARMACIES = [
  { 
    id: 1, 
    name: 'Green Cross Pharmacy', 
    address: '123 Health Ave, Downtown',
    distance: '0.8 miles',
    rating: 4.8,
    lat: 37.78825, 
    lng: -122.4324,
    hasDeal: true,
    dealItem: 'Amoxicillin 500mg',
    dealPrice: '$6.00',
    originalPrice: '$12.00',
    expiry: 'Expires in 5 days',
    stock: 3
  },
  { 
    id: 2, 
    name: 'MediPlus Store', 
    address: '456 Wellness Blvd',
    distance: '1.2 miles',
    rating: 4.5,
    lat: 37.78325, 
    lng: -122.4424,
    hasDeal: true,
    dealItem: 'Vitamin C Pack',
    dealPrice: '$5.00',
    originalPrice: '$10.00',
    expiry: 'Expires in 10 days',
    stock: 12
  },
  { 
    id: 3, 
    name: 'City Care', 
    address: '789 Urban St',
    distance: '2.0 miles',
    rating: 4.2,
    lat: 37.79525, 
    lng: -122.4124,
    hasDeal: false,
  },
];

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0221,
  });

  const selectedPharmacy = PHARMACIES.find(p => p.id === selectedId);

  return (
    <View style={styles.container}>
      {/* MAP LAYER */}
      <MapView 
        style={styles.map} 
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={() => setSelectedId(null)}
      >
        {PHARMACIES.map((pharmacy) => {
          const isSelected = selectedId === pharmacy.id;
          return (
            <Marker
              key={pharmacy.id}
              coordinate={{ latitude: pharmacy.lat, longitude: pharmacy.lng }}
              onPress={(e) => {
                e.stopPropagation();
                setSelectedId(pharmacy.id);
              }}
            >
              <View style={styles.markerWrapper}>
                {isSelected && <View style={styles.markerPulse} />}
                <View style={[styles.markerBubble, isSelected && styles.markerBubbleSelected, (!isSelected && pharmacy.hasDeal) && styles.markerBubbleDeal]}>
                  {pharmacy.hasDeal ? (
                     <MaterialIcons name="savings" size={18} color={isSelected || pharmacy.hasDeal ? "white" : "#13ec80"} />
                  ) : (
                     <MaterialIcons name="local-pharmacy" size={18} color={isSelected ? "white" : "#13ec80"} />
                  )}
                </View>
                {(isSelected || pharmacy.hasDeal) && (
                  <View style={styles.markerLabelContainer}>
                    <Text style={[styles.markerLabel, pharmacy.hasDeal && !isSelected && { color: '#d97706' }]}>
                      {pharmacy.hasDeal ? '50% OFF' : pharmacy.name}
                    </Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* TOP OVERLAY */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.topContent}>
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <MaterialIcons name="search" size={24} color="#618975" />
              </View>
              <TextInput 
                style={styles.searchInput}
                placeholder="Search medicines..."
                placeholderTextColor="#618975"
              />
              <TouchableOpacity style={styles.micIcon}>
                <MaterialIcons name="mic" size={24} color="#13ec80" />
              </TouchableOpacity>
            </View>
            <View style={styles.profilePic}>
               <MaterialIcons name="person" size={24} color="#ccc" />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            <TouchableOpacity style={[styles.chip, styles.chipActive]}>
              <Text style={styles.chipTextActive}>Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <MaterialIcons name="bolt" size={16} color="#f59e0b" />
              <Text style={styles.chipText}>Open Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <MaterialIcons name="percent" size={16} color="#13ec80" />
              <Text style={styles.chipText}>Discounted</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>24h Open</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* FLOATING BUTTONS */}
      <View style={[styles.floatingButtons, selectedId ? { bottom: 280 } : { bottom: 100 }]}>
        <TouchableOpacity style={styles.iconFab}>
          <MaterialIcons name="my-location" size={24} color="#111814" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listFab}
          onPress={() => router.push('/(tabs)/search')}
        >
          <MaterialIcons name="format-list-bulleted" size={20} color="white" />
          <Text style={styles.listFabText}>List View</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM CARD */}
      {selectedPharmacy && (
        <View style={styles.bottomCardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.pharmacyImage}>
                 <MaterialIcons name="storefront" size={32} color="#9ca3af" />
              </View>
              <View style={styles.headerText}>
                <View style={styles.titleRow}>
                  <Text style={styles.pharmacyName} numberOfLines={1}>{selectedPharmacy.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{selectedPharmacy.rating} ★</Text>
                  </View>
                </View>
                <Text style={styles.addressText}>{selectedPharmacy.distance} • {selectedPharmacy.address}</Text>
                <Text style={styles.statusText}>Open • Closes 10 PM</Text>
              </View>
            </View>

            {selectedPharmacy.hasDeal && (
              <View style={styles.dealBox}>
                <View style={styles.dealHeader}>
                  <View style={styles.dealBadge}>
                    <MaterialIcons name="warning" size={16} color="#f59e0b" />
                    <Text style={styles.dealBadgeText}>NEAR EXPIRY DEAL</Text>
                  </View>
                  <Text style={styles.expiryText}>{selectedPharmacy.expiry}</Text>
                </View>
                
                <View style={styles.dealContent}>
                  <View>
                    <Text style={styles.dealItemName}>{selectedPharmacy.dealItem}</Text>
                    <Text style={styles.stockText}>{selectedPharmacy.stock} boxes left in stock</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.oldPrice}>{selectedPharmacy.originalPrice}</Text>
                    <Text style={styles.newPrice}>{selectedPharmacy.dealPrice}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.reserveButton}>
                <Text style={styles.reserveText}>Reserve Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="directions" size={24} color="#111814" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="call" size={24} color="#111814" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },

  // Marker Styles
  markerWrapper: { alignItems: 'center', justifyContent: 'center' },
  markerPulse: { position: 'absolute', width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(19, 236, 128, 0.3)' },
  markerBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 2, borderColor: '#13ec80', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  markerBubbleSelected: { backgroundColor: '#13ec80', borderColor: '#fff', transform: [{ scale: 1.1 }] },
  markerBubbleDeal: { backgroundColor: '#fbbf24', borderColor: '#fff' },
  markerLabelContainer: { marginTop: 4, backgroundColor: 'white', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  markerLabel: { fontSize: 10, fontWeight: 'bold', color: '#111814' },

  // Top Overlay
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  topContent: { paddingHorizontal: 16, paddingTop: 40 },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, height: 48, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  searchIcon: { paddingLeft: 12, paddingRight: 8 },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#111814' },
  micIcon: { paddingHorizontal: 12 },
  profilePic: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  chipsScroll: { flexDirection: 'row', paddingBottom: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 16, height: 36, borderRadius: 18, marginRight: 8, gap: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  chipActive: { backgroundColor: '#111814' },
  chipText: { fontSize: 14, fontWeight: '500', color: '#111814' },
  chipTextActive: { fontSize: 14, fontWeight: '500', color: 'white' },

  // Floating Buttons
  floatingButtons: { position: 'absolute', right: 16, alignItems: 'flex-end', gap: 12 },
  iconFab: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  listFab: { flexDirection: 'row', alignItems: 'center', height: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: '#111814', gap: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  listFabText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  // Bottom Card
  bottomCardContainer: { position: 'absolute', bottom: 85, left: 0, right: 0, paddingHorizontal: 16 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 30, elevation: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  cardHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  pharmacyImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pharmacyName: { fontSize: 18, fontWeight: 'bold', color: '#111814', flex: 1, paddingRight: 8 },
  ratingBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#15803d' },
  addressText: { fontSize: 14, color: '#618975', marginTop: 2 },
  statusText: { fontSize: 14, fontWeight: '500', color: '#13ec80', marginTop: 4 },
  dealBox: { backgroundColor: '#f6f8f7', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed', marginBottom: 16 },
  dealHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dealBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dealBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#618975', letterSpacing: 0.5 },
  expiryText: { fontSize: 12, color: '#618975' },
  dealContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  dealItemName: { fontSize: 16, fontWeight: 'bold', color: '#111814' },
  stockText: { fontSize: 14, color: '#618975' },
  priceContainer: { alignItems: 'flex-end' },
  oldPrice: { fontSize: 12, textDecorationLine: 'line-through', color: '#618975' },
  newPrice: { fontSize: 18, fontWeight: 'bold', color: '#13ec80' },
  actionRow: { flexDirection: 'row', gap: 12 },
  reserveButton: { flex: 1, height: 44, backgroundColor: '#13ec80', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reserveText: { fontWeight: 'bold', color: '#111814', fontSize: 14 },
  iconButton: { width: 44, height: 44, backgroundColor: '#f3f4f6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});