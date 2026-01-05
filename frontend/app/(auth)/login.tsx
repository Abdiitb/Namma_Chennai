import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { AuthHeader } from '@/components/auth-header';
import { AuthInput } from '@/components/auth-input';
import { AuthButton } from '@/components/auth-button';
import { Divider } from '@/components/divider';
import { ThemedText } from '@/components/themed-text';
import { Alert } from '@/components/alert';

import { useAuth } from '@/context/auth-context';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading, error, clearError } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login({ email, password });
      // Navigate to main app on success
      console.log('Login successful, navigating to main app');
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled by the hook
      console.error('Login failed:', err);
    }
  };

  const handleRegisterPress = () => {
    router.push('./register');
  };

  return (
    <View style={styles.container}>
      <AuthHeader />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <ThemedText style={styles.title}>Login to Your Account</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your credentials to proceed
            </ThemedText>

            {error && (
              <Alert 
                message={error} 
                type="error" 
                onDismiss={clearError}
              />
            )}

            <AuthInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <AuthInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />

            <Pressable style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>
                Forgot Password?
              </ThemedText>
            </Pressable>

            <AuthButton
              title="Continue"
              onPress={handleLogin}
              loading={loading}
            />

            <Divider text="or" />

            <AuthButton
              title="Create New Account"
              onPress={handleRegisterPress}
              variant="secondary"
            />

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                By continuing, I agree to{' '}
              </ThemedText>
              <Pressable>
                <ThemedText style={styles.linkText}>Terms of Service</ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.helpContainer}>
            <ThemedText style={styles.helpText}>Facing Trouble - </ThemedText>
            <Pressable>
              <ThemedText style={styles.linkText}>Need Help?</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
  keyboardView: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  formContainer: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 'auto',
  },
  helpText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
