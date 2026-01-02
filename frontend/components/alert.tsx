import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
}

export function Alert({ type, message }: AlertProps) {
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

  return (
    <View style={containerStyle}>
      <ThemedText style={textStyle}>{icon} {message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
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
