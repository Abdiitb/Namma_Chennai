import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function SchoolDetailsScreen() {
  const params = useLocalSearchParams();
  const [schoolData, setSchoolData] = useState({
    schoolname: '',
    grade: '',
    noofstudents: '',
    approxage: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!schoolData.schoolname.trim()) {
      newErrors.schoolname = 'School name is required';
    }

    if (!schoolData.grade.trim()) {
      newErrors.grade = 'Class/Grade is required';
    }

    if (!schoolData.noofstudents || parseInt(schoolData.noofstudents) < 1) {
      newErrors.noofstudents = 'Number of students is required';
    }

    if (!schoolData.approxage || parseInt(schoolData.approxage) < 1) {
      newErrors.approxage = 'Approximate age is required';
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
        ...schoolData,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>School Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>School Information</ThemedText>
        <ThemedText style={styles.subtitle}>
          Please provide details about the school group
        </ThemedText>

        {/* School Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>School Name *</ThemedText>
          <TextInput
            style={[styles.input, errors.schoolname && styles.inputError]}
            value={schoolData.schoolname}
            onChangeText={(text) => {
              setSchoolData({ ...schoolData, schoolname: text });
              if (errors.schoolname) setErrors({ ...errors, schoolname: '' });
            }}
            placeholder="Enter school name"
            placeholderTextColor="#9CA3AF"
          />
          {errors.schoolname && <ThemedText style={styles.errorText}>{errors.schoolname}</ThemedText>}
        </View>

        {/* Grade */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Class / Grade *</ThemedText>
          <TextInput
            style={[styles.input, errors.grade && styles.inputError]}
            value={schoolData.grade}
            onChangeText={(text) => {
              setSchoolData({ ...schoolData, grade: text });
              if (errors.grade) setErrors({ ...errors, grade: '' });
            }}
            placeholder="e.g., 10, 12, etc."
            placeholderTextColor="#9CA3AF"
          />
          {errors.grade && <ThemedText style={styles.errorText}>{errors.grade}</ThemedText>}
        </View>

        {/* Number of Students */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Number of Students *</ThemedText>
          <TextInput
            style={[styles.input, errors.noofstudents && styles.inputError]}
            value={schoolData.noofstudents}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
              setSchoolData({ ...schoolData, noofstudents: numericText });
              if (errors.noofstudents) setErrors({ ...errors, noofstudents: '' });
            }}
            placeholder="Enter number of students"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.noofstudents && <ThemedText style={styles.errorText}>{errors.noofstudents}</ThemedText>}
        </View>

        {/* Approximate Age */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Approximate Age of Students *</ThemedText>
          <TextInput
            style={[styles.input, errors.approxage && styles.inputError]}
            value={schoolData.approxage}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
              setSchoolData({ ...schoolData, approxage: numericText });
              if (errors.approxage) setErrors({ ...errors, approxage: '' });
            }}
            placeholder="Enter approximate age"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.approxage && <ThemedText style={styles.errorText}>{errors.approxage}</ThemedText>}
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
