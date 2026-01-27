import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthButton } from '@/components/auth-button';

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const complaintNumber = params.complaintNumber as string;

  const handleBackToHome = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#10B981" />
        </View>

        {/* Success Messages */}
        <ThemedText style={styles.successTitle}>Complaint Registered Successfully!</ThemedText>
        <ThemedText style={styles.successSubtitle}>
          Your complaint has been submitted and will be reviewed
        </ThemedText>

        {/* Complaint Number Card */}
        <View style={styles.complaintNumberCard}>
          <ThemedText style={styles.complaintNumberLabel}>Complaint Number</ThemedText>
          <ThemedText style={styles.complaintNumber}>{complaintNumber}</ThemedText>
          <ThemedText style={styles.complaintNumberNote}>
            Please save this number for tracking your complaint
          </ThemedText>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={24} color="#016ACD" />
            <ThemedText style={styles.infoText}>
              You can use this complaint number to track the status of your complaint
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Back to Home Button */}
      <View style={styles.buttonContainer}>
        <AuthButton
          title="Back to Home"
          onPress={handleBackToHome}
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
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 20,
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  complaintNumberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  complaintNumberLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  complaintNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#016ACD',
    marginBottom: 8,
    letterSpacing: 1,
  },
  complaintNumberNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
});
