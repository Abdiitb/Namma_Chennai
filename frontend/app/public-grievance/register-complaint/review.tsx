import { View, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AuthButton } from '@/components/auth-button';
import { registerComplaint, RegisterComplaintRequest } from '@/services/pgr-api';
import { Alert } from 'react-native';

export default function ReviewScreen() {
  const params = useLocalSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const complaintData: RegisterComplaintRequest = {
        ComplainantName: params.name as string || undefined,
        MobileNo: params.shareMobile === '1' ? (params.mobileNumber as string) : undefined,
        Email: params.shareEmail === '1' ? (params.email as string) : undefined,
        ComplaintTitle: params.complaintSubType as string,
        ComplaintType: params.complaintSubTypeId as string,
        ComplaintDetails: params.complaintDetails as string,
        StreetId: params.roadId as string,
        latitude: parseFloat(params.latitude as string),
        longtitude: parseFloat(params.longitude as string),
        Landmark: params.landmark as string || undefined,
        gender: params.gender as string || undefined,
        Comp_Image: params.photoUri as string || undefined,
      };

      const response = await registerComplaint(complaintData);

      if (response.complaintNumber && response.complaintNumber !== 'N/A') {
        router.replace({
          pathname: '/public-grievance/register-complaint/success',
          params: {
            complaintNumber: response.complaintNumber,
          },
        });
      } else {
        Alert.alert('Error', 'Failed to register complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Complaint Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>
          4. Complaint Details
        </ThemedText>

        {/* Review Card */}
        <View style={styles.reviewCard}>
          {/* Personal Details */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionHeader}>Personal Details</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Name:</ThemedText>
              <ThemedText style={styles.detailValue}>{params.name}</ThemedText>
            </View>
            {params.shareMobile === '1' && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Mobile Number:</ThemedText>
                <ThemedText style={styles.detailValue}>{params.mobileNumber}</ThemedText>
              </View>
            )}
            {params.shareEmail === '1' && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Email Address:</ThemedText>
                <ThemedText style={styles.detailValue}>{params.email}</ThemedText>
              </View>
            )}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Gender:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {(params.gender as string)?.charAt(0).toUpperCase() + (params.gender as string)?.slice(1)}
              </ThemedText>
            </View>
          </View>

          {/* Location Details */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionHeader}>Complaint Location</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Street:</ThemedText>
              <ThemedText style={styles.detailValue}>{params.street}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Latitude:</ThemedText>
              <ThemedText style={styles.detailValue}>{params.latitude}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Longitude:</ThemedText>
              <ThemedText style={styles.detailValue}>{params.longitude}</ThemedText>
            </View>
            {params.landmark && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Landmark:</ThemedText>
                <ThemedText style={styles.detailValue}>{params.landmark}</ThemedText>
              </View>
            )}
          </View>

          {/* Complaint Details */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionHeader}>Complaint Information</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Complaint Type:</ThemedText>
              <ThemedText style={styles.detailValue}>{params.complaintType}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Complaint Title:</ThemedText>
              <ThemedText style={styles.detailValue}>{params.complaintSubType}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Description:</ThemedText>
              <ThemedText style={styles.detailValue}>{params.complaintDetails}</ThemedText>
            </View>
          </View>

          {/* Photo */}
          {params.photoUri && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionHeader}>Image / Video</ThemedText>
              <Image source={{ uri: params.photoUri as string }} style={styles.reviewImage} />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <Pressable style={styles.previousButton} onPress={() => router.back()}>
            <ThemedText style={styles.previousButtonText}>Previous</ThemedText>
          </Pressable>
          <AuthButton
            title={submitting ? 'Submitting...' : 'Submit'}
            onPress={handleSubmit}
            loading={submitting}
            style={{ flex: 1, backgroundColor: '#016ACD' }}
            textColor="#fff"
            disabled={submitting}
          />
        </View>
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
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  reviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  previousButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
