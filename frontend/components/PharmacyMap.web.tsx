import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PharmacyMap() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="map" size={80} color="#e5e7eb" />
      <Text style={styles.title}>Map View</Text>
      <Text style={styles.subtitle}>Interactive maps are available on the mobile app.</Text>
      
      <TouchableOpacity onPress={() => router.push('/(tabs)/search')} style={styles.button}>
        <Text style={styles.buttonText}>Browse List View</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111814',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#13ec80',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#111814',
    fontWeight: 'bold',
    fontSize: 16,
  }
});