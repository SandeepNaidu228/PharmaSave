import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WelcomePage() {
  // We navigate to the next screen in the onboarding flow
  const handleNext = () => {
    router.push('/save-on');
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation: Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content: Image & Text */}
      <View style={styles.content}>
        
        {/* Image Container with Green Glow */}
        <View style={styles.imageWrapper}>
          <View style={styles.glowCircle} />
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="leaf" size={120} color="#13ec80" />
          </View>
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>
            Reduce <Text style={styles.highlight}>Medicine</Text> Waste
          </Text>
          <Text style={styles.subtitle}>
            Join the movement to stop pharmaceutical waste. Buy near-expiry medicines at up to 70% off.
          </Text>
        </View>
      </View>

      {/* Footer: Dots & Button */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          onPress={handleNext}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#0a2e1e" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles defined inside the file (No external CSS needed)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Clean white background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipText: {
    color: 'rgba(0,0,0,0.5)',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1, // Keeps it square
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  glowCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(19, 236, 128, 0.1)', // Light green glow
  },
  iconBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9fafb', // Light gray box
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111814',
    lineHeight: 40,
  },
  highlight: {
    color: '#13ec80', // PharmaSave Green
  },
  subtitle: {
    color: '#6b7280', // Gray text
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 32, // Elongated active dot
    backgroundColor: '#13ec80',
  },
  button: {
    backgroundColor: '#13ec80',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadows for button depth
    shadowColor: '#13ec80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4, // For Android shadow
  },
  buttonText: {
    color: '#0a2e1e', // Dark green text for contrast
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});