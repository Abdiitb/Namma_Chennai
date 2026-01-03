import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

interface ServiceCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  onPress?: () => void;
}

export function ServiceCard({ 
  title, 
  icon, 
  iconColor = '#6366F1',
  iconBgColor = '#EEF2FF',
  onPress 
}: ServiceCardProps) {
  return (
    <Pressable 
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: '#E5E7EB' }}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={28} color={iconColor} />
      </View>
      <ThemedText style={styles.title} numberOfLines={2}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 18,
  },
});
