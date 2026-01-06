import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  ScrollView, StyleSheet, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { pharmacyOwnerAPI } from '../../utils/api';

export default function AddMedicinePage() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    expiryDate: '',
    price: '',
    quantity: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pharmacyId, setPharmacyId] = useState<string | null>(null);
  const [isLoadingPharmacy, setIsLoadingPharmacy] = useState(true);

  useEffect(() => {
    loadPharmacy();
  }, []);

  const loadPharmacy = async () => {
    try {
      setIsLoadingPharmacy(true);
      const pharmacy = await pharmacyOwnerAPI.getMyPharmacy();
      setPharmacyId(pharmacy._id);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Pharmacy not linked to this account. Please contact support.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setIsLoadingPharmacy(false);
    }
  };

  const handleSave = async () => {
    if (!pharmacyId) {
      Alert.alert('Error', 'Pharmacy not linked to this account');
      return;
    }

    if (!formData.name || !formData.brand || !formData.expiryDate || !formData.price || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
      Alert.alert('Error', 'Invalid price or quantity');
      return;
    }

    setIsLoading(true);
    try {
      // Backend automatically gets pharmacy from logged-in user
      await pharmacyOwnerAPI.createMedicine({
        name: formData.name,
        brand: formData.brand,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        quantity,
        originalPrice: price,
      });

      Alert.alert('Success', 'Medicine added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add medicine');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPharmacy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#13ec80" />
          <Text style={styles.loadingText}>Loading pharmacy info...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pharmacyId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>Pharmacy not linked</Text>
          <Text style={styles.errorSubtext}>Please contact support to link your pharmacy account</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111814" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Medicine</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Medicine Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Paracetamol 500mg"
            placeholderTextColor="#9ca3af"
            value={formData.name}
            onChangeText={v => setFormData(p => ({ ...p, name: v }))}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Brand *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Tylenol"
            placeholderTextColor="#9ca3af"
            value={formData.brand}
            onChangeText={v => setFormData(p => ({ ...p, brand: v }))}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Expiry Date (YYYY-MM-DD) *</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-01-05"
            placeholderTextColor="#9ca3af"
            value={formData.expiryDate}
            onChangeText={v => setFormData(p => ({ ...p, expiryDate: v }))}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Price ($) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
            value={formData.price}
            onChangeText={v => setFormData(p => ({ ...p, price: v }))}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Quantity *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={formData.quantity}
            onChangeText={v => setFormData(p => ({ ...p, quantity: v }))}
          />
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isLoading || !pharmacyId}
          >
            {isLoading ? (
              <ActivityIndicator color="#111814" />
            ) : (
              <>
                <Text style={styles.btnText}>Save Product</Text>
                <MaterialIcons name="check-circle" size={20} color="#111814" />
              </>
            )}
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111814',
  },
  content: {
    flex: 1,
  },
  formSection: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111814',
  },
  buttonSection: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: '#13ec80',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#13ec80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111814',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111814',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#13ec80',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111814',
  },
});
