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

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, loading, error, clearError } = useAuth();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation (optional but must be valid if provided)
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation (optional but must be valid if provided)
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // At least email or phone is required
    if (!email.trim() && !phone.trim()) {
      newErrors.email = 'Email or phone number is required';
      newErrors.phone = 'Email or phone number is required';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        role: 'citizen',
      });
      // Navigate to main app on success
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleLoginPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <AuthHeader 
        title="Namma Chennai"
        subtitle="Create your citizen account"
      />
      
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
            <ThemedText style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>
              Fill in your details to register
            </ThemedText>

            {error && (
              <Alert 
                message={error} 
                type="error" 
                onDismiss={clearError}
              />
            )}

            <AuthInput
              label="Full Name *"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={errors.name}
            />

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
              label="Mobile Number"
              placeholder="Mobile Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              prefix="+91"
              error={errors.phone}
            />

            <AuthInput
              label="Password *"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />

            <AuthInput
              label="Confirm Password *"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={errors.confirmPassword}
            />

            <AuthButton
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />

            <Divider text="or" />

            <AuthButton
              title="Already have an account? Login"
              onPress={handleLoginPress}
              variant="link"
            />

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                By registering, I agree to{' '}
              </ThemedText>
              <Pressable>
                <ThemedText style={styles.linkText}>Terms of Service</ThemedText>
              </Pressable>
              <ThemedText style={styles.footerText}> and </ThemedText>
              <Pressable>
                <ThemedText style={styles.linkText}>Privacy Policy</ThemedText>
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
  registerButton: {
    marginTop: 8,
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
    fontSize: 13,
  },
  linkText: {
    color: '#6366F1',
    fontSize: 13,
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
