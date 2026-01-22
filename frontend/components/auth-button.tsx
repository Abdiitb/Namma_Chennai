import { StyleSheet, Pressable, ActivityIndicator, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link';
  style?: ViewStyle;
  textColor?: string; // Add this line
}

export function AuthButton({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  style,
  textColor, // Add this parameter
}: AuthButtonProps) {
  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'link' && styles.buttonLink,
    (disabled || loading) && styles.buttonDisabled,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'secondary' && styles.buttonTextSecondary,
    variant === 'link' && styles.buttonTextLink,
    textColor && { color: textColor }, // Apply custom text color
  ];

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor || (variant === 'primary' ? '#000000' : '#FFD600')} />
      ) : (
        <ThemedText style={textStyle}>{title}</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD600',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000000',
  },
  buttonLink: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#000000',
  },
  buttonTextLink: {
    color: '#FFD600',
    fontWeight: '500',
  },
});
