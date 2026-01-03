import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
  onDismiss?: () => void;
}

export function Alert({ type, message, onDismiss }: AlertProps) {
  const containerStyle = [
    styles.container,
    type === 'error' && styles.errorContainer,
    type === 'success' && styles.successContainer,
    type === 'info' && styles.infoContainer,
  ];

  const textStyle = [
    styles.text,
    type === 'error' && styles.errorText,
    type === 'success' && styles.successText,
    type === 'info' && styles.infoText,
  ];

  const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  const dismissColor = type === 'error' ? '#C33' : type === 'success' ? '#3A3' : '#33C';

  return (
    <View style={containerStyle}>
      <ThemedText style={[textStyle, styles.messageText]}>{icon} {message}</ThemedText>
      {onDismiss && (
        <Pressable onPress={onDismiss} style={styles.dismissButton}>
          <Ionicons name="close" size={18} color={dismissColor} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  messageText: {
    flex: 1,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#FEE',
    borderColor: '#FCC',
  },
  successContainer: {
    backgroundColor: '#EFE',
    borderColor: '#CFC',
  },
  infoContainer: {
    backgroundColor: '#EEF',
    borderColor: '#CCF',
  },
  text: {
    fontSize: 14,
  },
  errorText: {
    color: '#C33',
  },
  successText: {
    color: '#3A3',
  },
  infoText: {
    color: '#33C',
  },
});
