import { StyleSheet, TextInput, View, TextInputProps, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  isPassword?: boolean;
}

export function AuthInput({ 
  label, 
  error, 
  prefix,
  isPassword = false,
  ...props 
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {prefix && (
          <ThemedText style={styles.prefix}>{prefix}</ThemedText>
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <Pressable 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#9CA3AF" 
            />
          </Pressable>
        )}
      </View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  prefix: {
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#000000',
  },
  eyeButton: {
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});
