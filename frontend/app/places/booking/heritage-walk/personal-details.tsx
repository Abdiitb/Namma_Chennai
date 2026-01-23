import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

type VisitorCategory = 'individual' | 'family' | 'school' | 'college';

export default function PersonalDetailsScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const visitorCategory = params.visitor_category as VisitorCategory;
  const visitDate = params.visit_date as string;

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    aadhar: '',
    age: '',
    signLanguageRequired: false,
    guideLanguage: 'English',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.aadhar.trim()) {
      newErrors.aadhar = 'Aadhaar number is required';
    } else if (!/^[0-9]{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = 'Please enter a valid 12-digit Aadhaar number';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = 'Please enter a valid age';
      }
    }

    if (!formData.signLanguageRequired && !formData.guideLanguage) {
      newErrors.guideLanguage = 'Please select a guide language';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    // Navigate to category-specific details if needed
    if (visitorCategory === 'family') {
      router.push({
        pathname: '/places/booking/heritage-walk/family-details',
        params: {
          place_unique_name: placeUniqueName,
          visitor_category: visitorCategory,
          visit_date: visitDate,
          ...formData,
          signLanguageRequired: formData.signLanguageRequired ? '1' : '0',
        },
      });
    } else if (visitorCategory === 'school') {
      router.push({
        pathname: '/places/booking/heritage-walk/school-details',
        params: {
          place_unique_name: placeUniqueName,
          visitor_category: visitorCategory,
          visit_date: visitDate,
          ...formData,
          signLanguageRequired: formData.signLanguageRequired ? '1' : '0',
        },
      });
    } else if (visitorCategory === 'college') {
      router.push({
        pathname: '/places/booking/heritage-walk/college-details',
        params: {
          place_unique_name: placeUniqueName,
          visitor_category: visitorCategory,
          visit_date: visitDate,
          ...formData,
          signLanguageRequired: formData.signLanguageRequired ? '1' : '0',
        },
      });
    } else {
      // Individual - go directly to review
      router.push({
        pathname: '/places/booking/heritage-walk/review',
        params: {
          place_unique_name: placeUniqueName,
          visitor_category: visitorCategory,
          visit_date: visitDate,
          ...formData,
          signLanguageRequired: formData.signLanguageRequired ? '1' : '0',
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
        <ThemedText style={styles.headerTitle}>Personal Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Full Name *</ThemedText>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
          />
          {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
        </View>

        {/* Mobile Number */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Mobile Number *</ThemedText>
          <TextInput
            style={[styles.input, errors.mobile && styles.inputError]}
            value={formData.mobile}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
              setFormData({ ...formData, mobile: numericText });
              if (errors.mobile) setErrors({ ...errors, mobile: '' });
            }}
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.mobile && <ThemedText style={styles.errorText}>{errors.mobile}</ThemedText>}
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Address *</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, errors.address && styles.inputError]}
            value={formData.address}
            onChangeText={(text) => {
              setFormData({ ...formData, address: text });
              if (errors.address) setErrors({ ...errors, address: '' });
            }}
            placeholder="Enter your address"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
          {errors.address && <ThemedText style={styles.errorText}>{errors.address}</ThemedText>}
        </View>

        {/* Aadhaar Number */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Aadhaar Number *</ThemedText>
          <TextInput
            style={[styles.input, errors.aadhar && styles.inputError]}
            value={formData.aadhar}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 12);
              setFormData({ ...formData, aadhar: numericText });
              if (errors.aadhar) setErrors({ ...errors, aadhar: '' });
            }}
            placeholder="Enter 12-digit Aadhaar number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={12}
          />
          {errors.aadhar && <ThemedText style={styles.errorText}>{errors.aadhar}</ThemedText>}
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Age *</ThemedText>
          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            value={formData.age}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
              setFormData({ ...formData, age: numericText });
              if (errors.age) setErrors({ ...errors, age: '' });
            }}
            placeholder="Enter your age"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={3}
          />
          {errors.age && <ThemedText style={styles.errorText}>{errors.age}</ThemedText>}
        </View>

        {/* Sign Language */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Is sign language interpreter required? *</ThemedText>
          <View style={styles.radioGroup}>
            <Pressable
              style={[styles.radioOption, formData.signLanguageRequired && styles.radioOptionSelected]}
              onPress={() => setFormData({ ...formData, signLanguageRequired: true, guideLanguage: '' })}
            >
              <View style={[styles.radioCircle, formData.signLanguageRequired && styles.radioCircleSelected]}>
                {formData.signLanguageRequired && <View style={styles.radioInner} />}
              </View>
              <ThemedText style={[styles.radioText, formData.signLanguageRequired && styles.radioTextSelected]}>
                Yes
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.radioOption, !formData.signLanguageRequired && styles.radioOptionSelected]}
              onPress={() => setFormData({ ...formData, signLanguageRequired: false, guideLanguage: 'English' })}
            >
              <View style={[styles.radioCircle, !formData.signLanguageRequired && styles.radioCircleSelected]}>
                {!formData.signLanguageRequired && <View style={styles.radioInner} />}
              </View>
              <ThemedText style={[styles.radioText, !formData.signLanguageRequired && styles.radioTextSelected]}>
                No
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Guide Language (only if sign language not required) */}
        {!formData.signLanguageRequired && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Preferred Guide Language *</ThemedText>
            <View style={styles.languageOptions}>
              {['Tamil', 'English'].map((lang) => (
                <Pressable
                  key={lang}
                  style={[
                    styles.languageButton,
                    formData.guideLanguage === lang && styles.languageButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, guideLanguage: lang })}
                >
                  <ThemedText
                    style={[
                      styles.languageButtonText,
                      formData.guideLanguage === lang && styles.languageButtonTextSelected,
                    ]}
                  >
                    {lang}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {errors.guideLanguage && <ThemedText style={styles.errorText}>{errors.guideLanguage}</ThemedText>}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            Object.keys(errors).length > 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={Object.keys(errors).length > 0}
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
    marginBottom: 20,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOptionSelected: {
    // Add any selected styling if needed
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#1F2937',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1F2937',
  },
  radioText: {
    fontSize: 16,
    color: '#1F2937',
  },
  radioTextSelected: {
    fontWeight: '600',
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  languageButtonSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  languageButtonTextSelected: {
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
