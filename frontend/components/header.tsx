import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
