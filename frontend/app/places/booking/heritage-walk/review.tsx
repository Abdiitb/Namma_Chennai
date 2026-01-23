import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { PLACES_DATA } from '../../[place_unique_name]';
import {
  saveIndividualRegistration,
  saveFamilyRegistration,
  saveSchoolRegistration,
  saveCollegeRegistration,
  getAcknowledgementPDFUrl,
} from '@/services/heritage-walk-api';

type VisitorCategory = 'individual' | 'family' | 'school' | 'college';

export default function ReviewBookingScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const visitorCategory = params.visitor_category as VisitorCategory;
  const visitDate = params.visit_date as string;
  const place = PLACES_DATA[placeUniqueName];

  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [refId, setRefId] = useState<string | null>(null);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    try {
      const baseData = {
        name: params.name as string,
        address: params.address as string,
        mobile: params.mobile as string,
        visitorType: visitorCategory,
        aadhar: params.aadhar as string,
        age: parseInt(params.age as string),
        visitDayTime: visitDate,
        language: params.guideLanguage as string || 'English',
        signLanguage: parseInt(params.signLanguageRequired as string || '0'),
      };

      let response;

      if (visitorCategory === 'individual') {
        response = await saveIndividualRegistration(baseData);
      } else if (visitorCategory === 'family') {
        response = await saveFamilyRegistration({
          ...baseData,
          familyMembers: parseInt(params.familyMembers as string),
          childrenBelow5: parseInt(params.childrenBelow5 as string || '0'),
          children6to17: parseInt(params.children6to17 as string || '0'),
          adults: parseInt(params.adults as string),
        });
      } else if (visitorCategory === 'school') {
        response = await saveSchoolRegistration({
          ...baseData,
          schoolname: params.schoolname as string,
          grade: params.grade as string,
          noofstudents: parseInt(params.noofstudents as string),
          approxage: parseInt(params.approxage as string),
        });
      } else if (visitorCategory === 'college') {
        response = await saveCollegeRegistration({
          ...baseData,
          Collegename: params.Collegename as string,
          department: params.department as string,
          years: parseInt(params.years as string),
          noofStudents: parseInt(params.noofStudents as string),
          Aproxage: parseInt(params.Aproxage as string),
        });
      }

      if (response && response.status === 'success') {
        setBookingId(response.Data.Id);
        setRefId(response.Data.refId);
        
        // Navigate to confirmation screen with all booking details
        router.replace({
          pathname: '/places/booking/heritage-walk/confirmation',
          params: {
            place_unique_name: placeUniqueName,
            visitor_category: visitorCategory,
            visit_date: visitDate,
            bookingId: response.Data.Id.toString(),
            refId: response.Data.refId,
            name: params.name as string,
            mobile: params.mobile as string,
            address: params.address as string,
            aadhar: params.aadhar as string,
            age: params.age as string,
            signLanguageRequired: params.signLanguageRequired as string,
            guideLanguage: params.guideLanguage as string || 'English',
            // Category-specific params
            ...(visitorCategory === 'family' && {
              familyMembers: params.familyMembers as string,
              childrenBelow5: params.childrenBelow5 as string || '0',
              children6to17: params.children6to17 as string || '0',
              adults: params.adults as string,
            }),
            ...(visitorCategory === 'school' && {
              schoolname: params.schoolname as string,
              grade: params.grade as string,
              noofstudents: params.noofstudents as string,
              approxage: params.approxage as string,
            }),
            ...(visitorCategory === 'college' && {
              Collegename: params.Collegename as string,
              department: params.department as string,
              years: params.years as string,
              noofStudents: params.noofStudents as string,
              Aproxage: params.Aproxage as string,
            }),
          },
        });
      } else {
        throw new Error('Booking failed');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert(
        'Booking Failed',
        error.message || 'Failed to complete booking. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (bookingId) {
      const pdfUrl = getAcknowledgementPDFUrl(bookingId);
      Linking.openURL(pdfUrl).catch((err) => {
        Alert.alert('Error', 'Failed to open PDF. Please try again later.');
      });
    }
  };

  if (!place) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Place not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Review Booking</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Place Info */}
        <View style={styles.bookingCard}>
          <ThemedText style={styles.placeName}>{place.title}</ThemedText>
          <ThemedText style={styles.address}>{place.address}</ThemedText>
          <View style={styles.dateTimeRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <ThemedText style={styles.dateTimeText}>
              {formatDate(visitDate)} • 08:00 AM - 09:00 AM
            </ThemedText>
          </View>
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Personal Details</ThemedText>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Name</ThemedText>
            <ThemedText style={styles.detailValue}>{params.name}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Mobile</ThemedText>
            <ThemedText style={styles.detailValue}>{params.mobile}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Address</ThemedText>
            <ThemedText style={styles.detailValue}>{params.address}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Aadhaar</ThemedText>
            <ThemedText style={styles.detailValue}>{params.aadhar}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Age</ThemedText>
            <ThemedText style={styles.detailValue}>{params.age}</ThemedText>
          </View>
        </View>

        {/* Category-specific Details */}
        {visitorCategory === 'family' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Family Details</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Total Members</ThemedText>
              <ThemedText style={styles.detailValue}>{params.familyMembers}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Children below 5</ThemedText>
              <ThemedText style={styles.detailValue}>{params.childrenBelow5 || '0'}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Children 6-17</ThemedText>
              <ThemedText style={styles.detailValue}>{params.children6to17 || '0'}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Adults</ThemedText>
              <ThemedText style={styles.detailValue}>{params.adults}</ThemedText>
            </View>
          </View>
        )}

        {visitorCategory === 'school' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>School Details</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>School Name</ThemedText>
              <ThemedText style={styles.detailValue}>{params.schoolname}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Grade</ThemedText>
              <ThemedText style={styles.detailValue}>{params.grade}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Number of Students</ThemedText>
              <ThemedText style={styles.detailValue}>{params.noofstudents}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Approximate Age</ThemedText>
              <ThemedText style={styles.detailValue}>{params.approxage}</ThemedText>
            </View>
          </View>
        )}

        {visitorCategory === 'college' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>College Details</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>College Name</ThemedText>
              <ThemedText style={styles.detailValue}>{params.Collegename}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Department</ThemedText>
              <ThemedText style={styles.detailValue}>{params.department}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Year of Study</ThemedText>
              <ThemedText style={styles.detailValue}>
                {params.years === '1' ? 'First Year' : params.years === '2' ? 'Second Year' : params.years === '3' ? 'Third Year' : 'Final Year'}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Number of Students</ThemedText>
              <ThemedText style={styles.detailValue}>{params.noofStudents}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Approximate Age</ThemedText>
              <ThemedText style={styles.detailValue}>{params.Aproxage}</ThemedText>
            </View>
          </View>
        )}

        {/* Accessibility */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Accessibility & Language</ThemedText>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Sign Language Required</ThemedText>
            <ThemedText style={styles.detailValue}>
              {params.signLanguageRequired === '1' ? 'Yes' : 'No'}
            </ThemedText>
          </View>
          {params.signLanguageRequired !== '1' && (
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Guide Language</ThemedText>
              <ThemedText style={styles.detailValue}>{params.guideLanguage || 'English'}</ThemedText>
            </View>
          )}
        </View>

        {/* Important Note */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={20} color="#1F2937" />
          <ThemedText style={styles.noteText}>
            Please review all details carefully. After confirmation, you will receive a booking acknowledgement that must be presented at the venue.
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmitBooking}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.submitButtonText}>Confirm Booking</ThemedText>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  noteBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
