import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { AuthButton } from '@/components/auth-button';

export default function PersonalDetailsScreen() {
  const [shareMobile, setShareMobile] = useState<boolean | null>(null);
  const [shareEmail, setShareEmail] = useState<boolean | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'transgender' | ''>('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (shareMobile === null) {
      newErrors.shareMobile = 'Please select if you want to share mobile number';
    } else if (shareMobile && !mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (shareMobile && mobileNumber.trim() && !/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (shareEmail === null) {
      newErrors.shareEmail = 'Please select if you want to share email';
    } else if (shareEmail && !email.trim()) {
      newErrors.email = 'Email is required';
    } else if (shareEmail && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!gender) {
      newErrors.gender = 'Gender is required';
    }

    // If mobile is shared, OTP must be verified
    if (shareMobile && mobileNumber.trim() && !otpVerified) {
      newErrors.otp = 'Please send and verify OTP';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!mobileNumber.trim() || !/^[0-9]{10}$/.test(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setSendingOtp(true);
    try {
      // TODO: Call actual OTP API endpoint
      // For now, simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your mobile number');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      // TODO: Call actual OTP verification API endpoint
      // Example: POST to https://gccservices.in/pgr/api/verifyOtp
      // For now, simulate OTP verification (accept any 6-digit code)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpVerified(true);
      Alert.alert('Success', 'OTP verified successfully');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    router.push({
      pathname: '/public-grievance/register-complaint/location-details',
      params: {
        shareMobile: shareMobile ? '1' : '0',
        mobileNumber: shareMobile ? mobileNumber : '',
        shareEmail: shareEmail ? '1' : '0',
        email: shareEmail ? email : '',
        name: name.trim(),
        gender: gender,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Registration of Complaint</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>
          1. Complaining Person's Details
        </ThemedText>

        {/* Share Mobile Number */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>
            Would you like to share your Mobile Number?
          </ThemedText>
          <View style={styles.radioGroup}>
            <Pressable
              style={[styles.radioOption, shareMobile === true && styles.radioOptionSelected]}
              onPress={() => {
                setShareMobile(true);
                setErrors({ ...errors, shareMobile: '' });
              }}
            >
              <View style={[styles.radioCircle, shareMobile === true && styles.radioCircleSelected]}>
                {shareMobile === true && <View style={styles.radioInner} />}
              </View>
              <ThemedText style={[styles.radioText, shareMobile === true && styles.radioTextSelected]}>
                Yes
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.radioOption, shareMobile === false && styles.radioOptionSelected]}
              onPress={() => {
                setShareMobile(false);
                setMobileNumber('');
                setOtpSent(false);
                setOtpVerified(false);
                setOtp('');
                setErrors({ ...errors, shareMobile: '', mobileNumber: '', otp: '' });
              }}
            >
              <View style={[styles.radioCircle, shareMobile === false && styles.radioCircleSelected]}>
                {shareMobile === false && <View style={styles.radioInner} />}
              </View>
              <ThemedText style={[styles.radioText, shareMobile === false && styles.radioTextSelected]}>
                No
              </ThemedText>
            </Pressable>
          </View>
          {errors.shareMobile && <ThemedText style={styles.errorText}>{errors.shareMobile}</ThemedText>}
        </View>

        {/* Mobile Number Input */}
        {shareMobile === true && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Mobile Number</ThemedText>
            <View style={styles.mobileInputContainer}>
              <TextInput
                style={[styles.input, styles.mobileInput, errors.mobileNumber && styles.inputError]}
                value={mobileNumber}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
                  setMobileNumber(numericText);
                  if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: '' });
                }}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                editable={!otpVerified}
              />
              <Pressable
                style={[styles.otpButton, sendingOtp && styles.otpButtonDisabled]}
                onPress={handleSendOtp}
                disabled={sendingOtp || otpVerified}
              >
                <ThemedText style={styles.otpButtonText}>
                  {sendingOtp ? 'Sending...' : 'Send OTP'}
                </ThemedText>
              </Pressable>
            </View>
            {errors.mobileNumber && <ThemedText style={styles.errorText}>{errors.mobileNumber}</ThemedText>}

            {/* OTP Input */}
            {otpSent && !otpVerified && (
              <View style={styles.otpContainer}>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  value={otp}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
                    setOtp(numericText);
                  }}
                  placeholder="Enter OTP"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={6}
                />
                <Pressable
                  style={[styles.verifyButton, verifyingOtp && styles.verifyButtonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={verifyingOtp}
                >
                  <ThemedText style={styles.verifyButtonText}>
                    {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </ThemedText>
                </Pressable>
              </View>
            )}
            {otpVerified && (
              <View style={styles.verifiedContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <ThemedText style={styles.verifiedText}>OTP Verified</ThemedText>
              </View>
            )}
          </View>
        )}

        {/* Share Email */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>
            Would you like to share your Email?
          </ThemedText>
          <View style={styles.radioGroup}>
            <Pressable
              style={[styles.radioOption, shareEmail === true && styles.radioOptionSelected]}
              onPress={() => {
                setShareEmail(true);
                setErrors({ ...errors, shareEmail: '' });
              }}
            >
              <View style={[styles.radioCircle, shareEmail === true && styles.radioCircleSelected]}>
                {shareEmail === true && <View style={styles.radioInner} />}
              </View>
              <ThemedText style={[styles.radioText, shareEmail === true && styles.radioTextSelected]}>
                Yes
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.radioOption, shareEmail === false && styles.radioOptionSelected]}
              onPress={() => {
                setShareEmail(false);
                setEmail('');
                setErrors({ ...errors, shareEmail: '', email: '' });
              }}
            >
              <View style={[styles.radioCircle, shareEmail === false && styles.radioCircleSelected]}>
                {shareEmail === false && <View style={styles.radioInner} />}
              </View>
              <ThemedText style={[styles.radioText, shareEmail === false && styles.radioTextSelected]}>
                No
              </ThemedText>
            </Pressable>
          </View>
          {errors.shareEmail && <ThemedText style={styles.errorText}>{errors.shareEmail}</ThemedText>}
        </View>

        {/* Email Input */}
        {shareEmail === true && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <ThemedText style={styles.errorText}>{errors.email}</ThemedText>}
          </View>
        )}

        {/* Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Name *</ThemedText>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
          {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Gender/பாலினம் *</ThemedText>
          <View style={styles.genderOptions}>
            {(['male', 'female', 'transgender'] as const).map((g) => (
              <Pressable
                key={g}
                style={[
                  styles.genderButton,
                  gender === g && styles.genderButtonSelected,
                ]}
                onPress={() => {
                  setGender(g);
                  if (errors.gender) setErrors({ ...errors, gender: '' });
                }}
              >
                <ThemedText
                  style={[
                    styles.genderButtonText,
                    gender === g && styles.genderButtonTextSelected,
                  ]}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          {errors.gender && <ThemedText style={styles.errorText}>{errors.gender}</ThemedText>}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AuthButton
          title="Next"
          onPress={handleNext}
          style={{ backgroundColor: '#016ACD' }}
          textColor="#fff"
        />
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
  radioOptionSelected: {},
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
    borderColor: '#016ACD',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#016ACD',
  },
  radioText: {
    fontSize: 16,
    color: '#1F2937',
  },
  radioTextSelected: {
    fontWeight: '600',
  },
  mobileInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  mobileInput: {
    flex: 1,
  },
  otpButton: {
    backgroundColor: '#016ACD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  otpButtonDisabled: {
    opacity: 0.6,
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  otpInput: {
    flex: 1,
  },
  verifyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#016ACD',
    borderColor: '#016ACD',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  genderButtonTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
});
