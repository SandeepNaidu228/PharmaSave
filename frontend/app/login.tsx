import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import { pharmacyAPI } from '../utils/api';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPharmacy, setIsPharmacy] = useState(false);
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuthStore();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      // Check user role and redirect accordingly
      const userRole = response?.role || 'citizen';
      if (userRole === 'pharmacy') {
        router.replace('/dashboard' as any);
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Validate pharmacy fields if registering as pharmacy
    if (isPharmacy) {
      if (!pharmacyName || !pharmacyAddress || !latitude || !longitude) {
        Alert.alert('Error', 'Please fill in all pharmacy details');
        return;
      }

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        Alert.alert('Error', 'Please enter valid latitude and longitude');
        return;
      }

      if (lat < -90 || lat > 90) {
        Alert.alert('Error', 'Latitude must be between -90 and 90');
        return;
      }

      if (lng < -180 || lng > 180) {
        Alert.alert('Error', 'Longitude must be between -180 and 180');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Register user with role
      const role = isPharmacy ? 'pharmacy' : 'citizen';
      const response = await register(name, email, password, role);

      // If pharmacy, create pharmacy record
      if (isPharmacy) {
        try {
          // Small delay to ensure token is persisted
          await new Promise(resolve => setTimeout(resolve, 100));
          await pharmacyAPI.create(
            pharmacyName,
            pharmacyAddress,
            parseFloat(latitude),
            parseFloat(longitude)
          );
        } catch (pharmacyError: any) {
          console.error('Pharmacy creation error:', pharmacyError);
          Alert.alert(
            'Warning',
            'Account created but pharmacy details failed to save. Please update your pharmacy info in settings.',
            [{ text: 'OK' }]
          );
        }
      }

      // Check user role and redirect accordingly
      const userRole = response?.role || 'citizen';
      if (userRole === 'pharmacy') {
        router.replace('/dashboard' as any);
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Top App Bar */}
          <View style={styles.appBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#111814" />
            </TouchableOpacity>
            
            <View style={styles.brandContainer}>
              <View style={styles.logoIcon}>
                <MaterialIcons name="medical-services" size={20} color="#13ec80" />
              </View>
              <Text style={styles.brandName}>PharmaSave</Text>
            </View>
            {/* Empty view for spacing balance */}
            <View style={{ width: 40 }} />
          </View>

          {/* Hero Area */}
          <View style={styles.heroSection}>
            <View style={styles.heroCard}>
              <View style={styles.heroOverlay} />
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified-user" size={16} color="#13ec80" />
                <Text style={styles.verifiedText}>Verified & Secure</Text>
              </View>
              <MaterialIcons name="lock" size={64} color="rgba(255,255,255,0.8)" style={{ alignSelf: 'center', marginTop: 40 }} />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textSection}>
            <Text style={styles.headline}>
              {isSignUp ? 'Create Account' : 'Welcome to PharmaSave'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp 
                ? 'Join PharmaSave and start saving on medicines while helping the planet.'
                : 'Find medicines. Save money. Reduce waste.\nLogin to access exclusive discounts.'
              }
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {isSignUp && (
              <>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.input}
                    placeholder="Enter your full name" 
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </>
            )}
            
            <Text style={[styles.label, { marginTop: isSignUp ? 16 : 0 }]}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Enter your email" 
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"} 
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Pharmacy Registration Option */}
            {isSignUp && (
              <>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      setIsPharmacy(!isPharmacy);
                      // Reset pharmacy fields when unchecking
                      if (isPharmacy) {
                        setPharmacyName('');
                        setPharmacyAddress('');
                        setLatitude('');
                        setLongitude('');
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    {isPharmacy && (
                      <MaterialIcons name="check" size={20} color="#13ec80" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>
                    I am registering as a Pharmacy Owner
                  </Text>
                </View>

                {/* Pharmacy Details Fields */}
                {isPharmacy && (
                  <View style={styles.pharmacySection}>
                    <Text style={styles.sectionTitle}>Pharmacy Details</Text>
                    
                    <Text style={styles.label}>Pharmacy Name *</Text>
                    <View style={styles.inputContainer}>
                      <TextInput 
                        style={styles.input}
                        placeholder="Enter pharmacy name" 
                        placeholderTextColor="#9ca3af"
                        value={pharmacyName}
                        onChangeText={setPharmacyName}
                      />
                    </View>

                    <Text style={[styles.label, { marginTop: 16 }]}>Pharmacy Address *</Text>
                    <View style={styles.inputContainer}>
                      <TextInput 
                        style={styles.input}
                        placeholder="Enter full address" 
                        placeholderTextColor="#9ca3af"
                        value={pharmacyAddress}
                        onChangeText={setPharmacyAddress}
                        multiline
                        numberOfLines={2}
                      />
                    </View>

                    <View style={styles.locationRow}>
                      <View style={styles.locationInput}>
                        <Text style={styles.label}>Latitude *</Text>
                        <View style={styles.inputContainer}>
                          <TextInput 
                            style={styles.input}
                            placeholder="e.g., 40.7128" 
                            placeholderTextColor="#9ca3af"
                            keyboardType="decimal-pad"
                            value={latitude}
                            onChangeText={setLatitude}
                          />
                        </View>
                      </View>

                      <View style={styles.locationInput}>
                        <Text style={styles.label}>Longitude *</Text>
                        <View style={styles.inputContainer}>
                          <TextInput 
                            style={styles.input}
                            placeholder="e.g., -74.0060" 
                            placeholderTextColor="#9ca3af"
                            keyboardType="decimal-pad"
                            value={longitude}
                            onChangeText={setLongitude}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.locationHint}>
                      <MaterialIcons name="info" size={16} color="#6b7280" />
                      <Text style={styles.hintText}>
                        You can find coordinates using Google Maps or a GPS app
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Action Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity 
              onPress={isSignUp ? handleRegister : handleLogin}
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#111814" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {isSignUp ? 'Create Account' : 'Login'}
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#111814" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Toggle between Login and Sign Up */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => {
              setIsSignUp(!isSignUp);
              // Reset pharmacy fields when switching
              if (isSignUp) {
                setIsPharmacy(false);
                setPharmacyName('');
                setPharmacyAddress('');
                setLatitude('');
                setLongitude('');
              }
            }}>
              <Text style={styles.toggleLink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="g-translate" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="apple" size={20} color="#000000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    backgroundColor: 'rgba(19, 236, 128, 0.2)',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111814',
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  heroCard: {
    width: '100%',
    height: 200,
    backgroundColor: '#111814', // Dark background for contrast
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19, 236, 128, 0.05)', // Slight green tint
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'uppercase',
    color: '#111814',
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111814',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    fontSize: 15,
  },
  formSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    height: 56,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111814',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  actionSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#13ec80',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#13ec80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#111814',
  },
  socialSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  socialButtonText: {
    fontWeight: '600',
    marginLeft: 8,
    color: '#374151',
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#13ec80',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#13ec80',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  pharmacySection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111814',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  locationInput: {
    flex: 1,
  },
  locationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    gap: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#1e40af',
    flex: 1,
  },
});