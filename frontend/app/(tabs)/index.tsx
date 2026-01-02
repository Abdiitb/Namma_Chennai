import { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Header } from '@/components/header';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Alert } from '@/components/alert';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ZERO_QUERIES } from '@/zero/queries';
import { useQuery } from '@rocicorp/zero/react';

const API_BASE_URL = 'http://localhost:3000';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  // Use the defined query instead of raw ZQL
  const [tickets] = useQuery(ZERO_QUERIES.allTickets());

  console.log('Fetched tickets:', tickets);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      console.log('Login successful:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  // Logged in view
  if (user) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Namma Chennai" subtitle="Citizen Services Portal" />
        
        <Card style={styles.userCard}>
          <ThemedText style={styles.welcomeText}>Welcome, {user.name}!</ThemedText>
          
          <View style={styles.userInfo}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
          </View>

          <View style={styles.userInfo}>
            <ThemedText style={styles.infoLabel}>Role</ThemedText>
            <View style={styles.roleBadge}>
              <ThemedText style={styles.roleText}>{user.role.toUpperCase()}</ThemedText>
            </View>
          </View>

          <Button 
            title="Logout" 
            onPress={handleLogout} 
            variant="danger" 
          />
        </Card>
      </ThemedView>
    );
  }

  // Login view
  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Header title="Namma Chennai" subtitle="Citizen Services Portal" />

          <Card>
            <ThemedText style={styles.formTitle}>Login</ThemedText>

            {error && <Alert type="error" message={error} />}

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
            />
          </Card>

          <Card style={styles.demoCard}>
            <ThemedText style={styles.demoTitle}>Demo Credentials</ThemedText>
            <ThemedText style={styles.demoText}>Email: raj@example.com</ThemedText>
            <ThemedText style={styles.demoText}>Password: password123</ThemedText>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  demoCard: {
    marginTop: 16,
    backgroundColor: '#f0f8ff',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 13,
    color: '#666',
    marginVertical: 2,
  },
  userCard: {
    margin: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
