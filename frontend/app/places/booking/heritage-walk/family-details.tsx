import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function FamilyDetailsScreen() {
  const params = useLocalSearchParams();
  const [familyData, setFamilyData] = useState({
    familyMembers: '',
    childrenBelow5: '',
    children6to17: '',
    adults: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!familyData.familyMembers || parseInt(familyData.familyMembers) < 1) {
      newErrors.familyMembers = 'Total family members is required';
    }

    if (!familyData.childrenBelow5) {
      newErrors.childrenBelow5 = 'This field is required (enter 0 if none)';
    }

    if (!familyData.children6to17) {
      newErrors.children6to17 = 'This field is required (enter 0 if none)';
    }

    if (!familyData.adults || parseInt(familyData.adults) < 1) {
      newErrors.adults = 'Number of adults is required';
    }

    // Validate that total matches
    const total = parseInt(familyData.childrenBelow5 || '0') +
                  parseInt(familyData.children6to17 || '0') +
                  parseInt(familyData.adults || '0');
    const familyMembers = parseInt(familyData.familyMembers || '0');

    if (total !== familyMembers) {
      newErrors.total = 'Total members must match the sum of children and adults';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    router.push({
      pathname: '/places/booking/heritage-walk/review',
      params: {
        ...params,
        ...familyData,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Family Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>Family Information</ThemedText>
        <ThemedText style={styles.subtitle}>
          Please provide details about all family members visiting
        </ThemedText>

        {/* Total Family Members */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Total number of family members *</ThemedText>
          <TextInput
            style={[styles.input, errors.familyMembers && styles.inputError]}
            value={familyData.familyMembers}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
              setFamilyData({ ...familyData, familyMembers: numericText });
              if (errors.familyMembers) setErrors({ ...errors, familyMembers: '' });
            }}
            placeholder="Enter total number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.familyMembers && <ThemedText style={styles.errorText}>{errors.familyMembers}</ThemedText>}
        </View>

        {/* Children Below 5 */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Number of children below 5 years *</ThemedText>
          <TextInput
            style={[styles.input, errors.childrenBelow5 && styles.inputError]}
            value={familyData.childrenBelow5}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
              setFamilyData({ ...familyData, childrenBelow5: numericText });
              if (errors.childrenBelow5) setErrors({ ...errors, childrenBelow5: '' });
            }}
            placeholder="Enter number (0 if none)"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.childrenBelow5 && <ThemedText style={styles.errorText}>{errors.childrenBelow5}</ThemedText>}
        </View>

        {/* Children 6 to 17 */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Number of children between 6 and 17 years *</ThemedText>
          <TextInput
            style={[styles.input, errors.children6to17 && styles.inputError]}
            value={familyData.children6to17}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
              setFamilyData({ ...familyData, children6to17: numericText });
              if (errors.children6to17) setErrors({ ...errors, children6to17: '' });
            }}
            placeholder="Enter number (0 if none)"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.children6to17 && <ThemedText style={styles.errorText}>{errors.children6to17}</ThemedText>}
        </View>

        {/* Adults */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Number of adults *</ThemedText>
          <TextInput
            style={[styles.input, errors.adults && styles.inputError]}
            value={familyData.adults}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
              setFamilyData({ ...familyData, adults: numericText });
              if (errors.adults) setErrors({ ...errors, adults: '' });
            }}
            placeholder="Enter number of adults"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.adults && <ThemedText style={styles.errorText}>{errors.adults}</ThemedText>}
        </View>

        {errors.total && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{errors.total}</ThemedText>
          </View>
        )}

        <View style={styles.summaryBox}>
          <ThemedText style={styles.summaryTitle}>Summary</ThemedText>
          <ThemedText style={styles.summaryText}>
            Children below 5: {familyData.childrenBelow5 || '0'}
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            Children 6-17: {familyData.children6to17 || '0'}
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            Adults: {familyData.adults || '0'}
          </ThemedText>
          <ThemedText style={styles.summaryTotal}>
            Total: {parseInt(familyData.childrenBelow5 || '0') +
                    parseInt(familyData.children6to17 || '0') +
                    parseInt(familyData.adults || '0')} / {familyData.familyMembers || '0'}
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            Object.keys(errors).length > 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
        >
          <ThemedText
            style={[
              styles.continueButtonText,
              Object.keys(errors).length > 0 && styles.continueButtonTextDisabled,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
