import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  bgColor?: string;
}

interface QuickActionsProps {
  title: string;
  items: QuickActionItem[];
  onItemPress?: (id: string) => void;
}

export function QuickActions({ title, items, onItemPress }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <Pressable 
            key={item.id}
            style={styles.item}
            onPress={() => onItemPress?.(item.id)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.bgColor || '#1A1A1A' }]}>
              <Ionicons name={item.icon} size={24} color={item.iconColor || '#FFD600'} />
            </View>
            <ThemedText style={styles.itemTitle} numberOfLines={2}>{item.title}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  item: {
    alignItems: 'center',
    width: 80,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 16,
  },
});
