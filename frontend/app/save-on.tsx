import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function SaveOnPage() {
  
  const handleNext = () => {
    // Navigate to the Login screen to finish onboarding
    router.push('/login');
  };

  const handleSkip = () => {
    // Skip directly to the main app
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Pagination Dots */}
      <View style={styles.paginationContainer}>
        <View style={styles.dotsWrapper}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Hero Image / Icon */}
        <View style={styles.imageContainer}>
          <View style={styles.blurBackground} />
          <MaterialIcons name="local-offer" size={100} color="#13ec80" />
        </View>

        {/* Text */}
        <Text style={styles.headline}>
          Save up to 70% on Meds
        </Text>
        <Text style={styles.subtitle}>
          Access high-quality, near-expiry medicines at a fraction of the cost while helping the planet.
        </Text>
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {/* Next Button */}
        <TouchableOpacity 
          onPress={handleNext}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#111814" />
        </TouchableOpacity>
        
        {/* Skip Button */}
        <TouchableOpacity 
          onPress={handleSkip} 
          style={styles.skipButton}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7', // Light gray background
  },
  paginationContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Space between dots
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db', // Inactive gray
  },
  dotActive: {
    width: 32, // Elongated active dot
    backgroundColor: '#111814', // Dark active color
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  blurBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#E0F2F1', // Light mint bg
    borderRadius: 150,
    opacity: 0.8,
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111814',
    textAlign: 'center',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563', // Gray-600
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#13ec80', // Primary Green
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#13ec80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#111814',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  skipButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});