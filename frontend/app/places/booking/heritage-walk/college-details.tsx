import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

const YEAR_OPTIONS = ['1', '2', '3', '4'];

export default function CollegeDetailsScreen() {
  const params = useLocalSearchParams();
  const [collegeData, setCollegeData] = useState({
    Collegename: '',
    department: '',
    years: '',
    noofStudents: '',
    Aproxage: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!collegeData.Collegename.trim()) {
      newErrors.Collegename = 'College name is required';
    }

    if (!collegeData.department.trim()) {
      newErrors.department = 'Department name is required';
    }

    if (!collegeData.years) {
      newErrors.years = 'Year of study is required';
    }

    if (!collegeData.noofStudents || parseInt(collegeData.noofStudents) < 1) {
      newErrors.noofStudents = 'Number of students is required';
    }

    if (!collegeData.Aproxage || parseInt(collegeData.Aproxage) < 1) {
      newErrors.Aproxage = 'Approximate age is required';
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
        ...collegeData,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>College Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>College Information</ThemedText>
        <ThemedText style={styles.subtitle}>
          Please provide details about the college group
        </ThemedText>

        {/* College Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>College Name *</ThemedText>
          <TextInput
            style={[styles.input, errors.Collegename && styles.inputError]}
            value={collegeData.Collegename}
            onChangeText={(text) => {
              setCollegeData({ ...collegeData, Collegename: text });
              if (errors.Collegename) setErrors({ ...errors, Collegename: '' });
            }}
            placeholder="Enter college name"
            placeholderTextColor="#9CA3AF"
          />
          {errors.Collegename && <ThemedText style={styles.errorText}>{errors.Collegename}</ThemedText>}
        </View>

        {/* Department */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Department *</ThemedText>
          <TextInput
            style={[styles.input, errors.department && styles.inputError]}
            value={collegeData.department}
            onChangeText={(text) => {
              setCollegeData({ ...collegeData, department: text });
              if (errors.department) setErrors({ ...errors, department: '' });
            }}
            placeholder="Enter department name"
            placeholderTextColor="#9CA3AF"
          />
          {errors.department && <ThemedText style={styles.errorText}>{errors.department}</ThemedText>}
        </View>

        {/* Year of Study */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Year of Study *</ThemedText>
          <View style={styles.yearOptions}>
            {YEAR_OPTIONS.map((year) => (
              <Pressable
                key={year}
                style={[
                  styles.yearButton,
                  collegeData.years === year && styles.yearButtonSelected,
                ]}
                onPress={() => {
                  setCollegeData({ ...collegeData, years: year });
                  if (errors.years) setErrors({ ...errors, years: '' });
                }}
              >
                <ThemedText
                  style={[
                    styles.yearButtonText,
                    collegeData.years === year && styles.yearButtonTextSelected,
                  ]}
                >
                  {year === '1' ? 'First Year' : year === '2' ? 'Second Year' : year === '3' ? 'Third Year' : 'Final Year'}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          {errors.years && <ThemedText style={styles.errorText}>{errors.years}</ThemedText>}
        </View>

        {/* Number of Students */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Number of Students *</ThemedText>
          <TextInput
            style={[styles.input, errors.noofStudents && styles.inputError]}
            value={collegeData.noofStudents}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
              setCollegeData({ ...collegeData, noofStudents: numericText });
              if (errors.noofStudents) setErrors({ ...errors, noofStudents: '' });
            }}
            placeholder="Enter number of students"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.noofStudents && <ThemedText style={styles.errorText}>{errors.noofStudents}</ThemedText>}
        </View>

        {/* Approximate Age */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Approximate Age of Students *</ThemedText>
          <TextInput
            style={[styles.input, errors.Aproxage && styles.inputError]}
            value={collegeData.Aproxage}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
              setCollegeData({ ...collegeData, Aproxage: numericText });
              if (errors.Aproxage) setErrors({ ...errors, Aproxage: '' });
            }}
            placeholder="Enter approximate age"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          {errors.Aproxage && <ThemedText style={styles.errorText}>{errors.Aproxage}</ThemedText>}
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
  yearOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  yearButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  yearButtonSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  yearButtonTextSelected: {
    color: '#FFFFFF',
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
