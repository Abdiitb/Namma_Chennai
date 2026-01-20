import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';

interface ServiceCardProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  onPress?: () => void;
}

export function ServiceCard({
  title,
  subtitle,
  icon,
  iconColor = ThemeColors.textPrimary,
  iconBgColor = ThemeColors.iconBgGray,
  onPress
}: ServiceCardProps) {
  return (
    <Pressable 
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: ThemeColors.border }}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: 130,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textBold,
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textBold,
    lineHeight: 18,
    marginTop: 2,
  },
});
