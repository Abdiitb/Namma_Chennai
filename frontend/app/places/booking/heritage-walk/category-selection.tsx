import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

type VisitorCategory = 'individual' | 'family' | 'school' | 'college';

const CATEGORIES: { value: VisitorCategory; label: string; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
  { value: 'individual', label: 'Individual', icon: 'person-outline', description: 'Single visitor' },
  { value: 'family', label: 'Family', icon: 'people-outline', description: 'Family members visiting together' },
  { value: 'school', label: 'School', icon: 'school-outline', description: 'Group booking for school students' },
  { value: 'college', label: 'College', icon: 'library-outline', description: 'Group booking for college students' },
];

export default function CategorySelectionScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const [selectedCategory, setSelectedCategory] = useState<VisitorCategory | null>(null);

  const handleContinue = () => {
    if (selectedCategory) {
      router.push({
        pathname: '/places/booking/heritage-walk/select-date',
        params: {
          place_unique_name: placeUniqueName,
          visitor_category: selectedCategory,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Select Booking Category</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.subtitle}>
          Choose the category that best describes your visit
        </ThemedText>

        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.value}
              style={[
                styles.categoryCard,
                selectedCategory === category.value && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedCategory(category.value)}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons
                  name={category.icon}
                  size={32}
                  color={selectedCategory === category.value ? '#FFFFFF' : '#1F2937'}
                />
              </View>
              <ThemedText
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.value && styles.categoryLabelSelected,
                ]}
              >
                {category.label}
              </ThemedText>
              <ThemedText
                style={[
                  styles.categoryDescription,
                  selectedCategory === category.value && styles.categoryDescriptionSelected,
                ]}
              >
                {category.description}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            !selectedCategory && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedCategory}
        >
          <ThemedText
            style={[
              styles.continueButtonText,
              !selectedCategory && styles.continueButtonTextDisabled,
            ]}
          >
            Continue
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginRight: 28,
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryCardSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  categoryIconContainer: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryLabelSelected: {
    color: '#FFFFFF',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryDescriptionSelected: {
    color: '#D1D5DB',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
