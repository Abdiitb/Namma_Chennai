import { StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { ThemedText } from './themed-text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary' 
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'danger' && styles.buttonDanger,
    (disabled || loading) && styles.buttonDisabled,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'secondary' && styles.buttonTextSecondary,
  ];

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#007AFF' : '#fff'} />
      ) : (
        <ThemedText style={textStyle}>{title}</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
  },
});
