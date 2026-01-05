import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from './themed-text';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AuthHeader({ 
  title = 'Namma Chennai',
  subtitle = 'Citizen Services Portal'
}: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Placeholder for logo - you can replace with actual image */}
        {/* <View style={styles.logoCircle}>
          <ThemedText style={styles.logoText}>NC</ThemedText>
        </View> */}
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFD600',
  },
});
