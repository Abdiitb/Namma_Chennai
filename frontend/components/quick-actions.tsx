import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';

interface QuickActionItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  bgColor?: string;
}

interface QuickActionsProps {
  title?: string;
  items: QuickActionItem[];
  onItemPress?: (id: string) => void;
}

export function QuickActions({ title, items, onItemPress }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      {title ? <ThemedText style={styles.sectionTitle}>{title}</ThemedText> : null}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item, index) => (
          <Pressable 
            key={item.id}
            style={[
              styles.pill, 
              index === 0 && styles.pillActive
            ]}
            onPress={() => onItemPress?.(item.id)}
          >
            <View style={[
              styles.iconCircle, 
              { backgroundColor: index === 0 ? ThemeColors.white : item.bgColor || ThemeColors.iconBgGray }
            ]}>
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={item.iconColor || ThemeColors.textPrimary} 
              />
            </View>
            <ThemedText style={[
              styles.pillText,
              index === 0 && styles.pillTextActive
            ]}>
              {item.title}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ThemeColors.textBold,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: 8,
  },
  pillActive: {
    backgroundColor: ThemeColors.textBold,
    borderColor: ThemeColors.textBold,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.textBold,
  },
  pillTextActive: {
    color: ThemeColors.white,
  },
});
