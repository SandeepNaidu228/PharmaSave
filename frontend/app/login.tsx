import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuthStore();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigate to the main app (Home Tab) on success
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      // Navigate to the main app (Home Tab) on success
      router.replace('/(tabs)/home');
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
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
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
});