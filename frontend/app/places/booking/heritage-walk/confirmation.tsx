import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Alert } from 'react-native';
import { getAcknowledgementPDFUrl } from '@/services/heritage-walk-api';

type VisitorCategory = 'individual' | 'family' | 'school' | 'college';

export default function BookingConfirmationScreen() {
  const params = useLocalSearchParams();
  const bookingId = parseInt(params.bookingId as string);
  const visitorCategory = params.visitor_category as VisitorCategory;
  const visitDate = params.visit_date as string;

  // Handle missing booking data
  if (!bookingId || !visitDate || !params.name) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <ThemedText style={styles.errorText}>Booking details not found</ThemedText>
          <Pressable 
            style={styles.homeButton} 
            onPress={() => router.replace('/(tabs)/home')}
          >
            <ThemedText style={styles.homeButtonText}>Back to Home</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCurrentDate = (): string => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfUrl = getAcknowledgementPDFUrl(bookingId);
      const canOpen = await Linking.canOpenURL(pdfUrl);
      if (canOpen) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert('Error', 'Unable to open PDF. Please try again later.');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View style={styles.card}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Logo Placeholder - You can replace this with actual logo */}
            <View style={styles.logoContainer}>
              <Ionicons name="business-outline" size={48} color="#1F2937" />
            </View>
            <ThemedText style={styles.corporationText}>GREATER CHENNAI CORPORATION</ThemedText>
            
            <ThemedText style={styles.confirmedTitle}>Booking Confirmed!</ThemedText>
            
            <ThemedText style={styles.successMessage}>
              Your visit to the Ripon Buildings has been successfully scheduled. We look forward to welcoming you!
            </ThemedText>
            
            <View style={styles.divider} />
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            {/* Left Column - Booking Details */}
            <View style={styles.leftColumn}>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>ID:</ThemedText>
                <ThemedText style={styles.detailValue}>{bookingId}</ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Name:</ThemedText>
                <ThemedText style={styles.detailValue}>{params.name}</ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Aadhaar ID:</ThemedText>
                <ThemedText style={styles.detailValue}>{params.aadhar}</ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Visitor Type:</ThemedText>
                <ThemedText style={styles.detailValue}>{visitorCategory}</ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Visiting Date:</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDateForDisplay(visitDate)}</ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Registered Date:</ThemedText>
                <ThemedText style={styles.detailValue}>{getCurrentDate()}</ThemedText>
              </View>
            </View>

            {/* Vertical Divider */}
            <View style={styles.verticalDivider} />

            {/* Right Column - Guidelines */}
            <View style={styles.rightColumn}>
              <ThemedText style={styles.guidelinesTitle}>Guidelines for Participants:</ThemedText>
              
              <View style={styles.guidelinesList}>
                <View style={styles.guidelineItem}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.guidelineText}>
                    Individuals are responsible for their own belongings.
                  </ThemedText>
                </View>
                
                <View style={styles.guidelineItem}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.guidelineText}>
                    Littering on the campus is strictly prohibited.
                  </ThemedText>
                </View>
                
                <View style={styles.guidelineItem}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.guidelineText}>
                    No food or eatables are allowed inside the campus.
                  </ThemedText>
                </View>
                
                <View style={styles.guidelineItem}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.guidelineText}>
                    Families/Schools/Colleges are responsible for the children/students accompanying you for the heritage walk.
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Divider */}
          <View style={styles.divider} />
        </View>

        {/* Download Button */}
        <Pressable style={styles.downloadButton} onPress={handleDownloadPDF}>
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <ThemedText style={styles.downloadButtonText}>Download Acknowledgement</ThemedText>
        </Pressable>

        {/* Home Button */}
        <Pressable 
          style={styles.homeButton} 
          onPress={() => router.replace('/(tabs)/home')}
        >
          <ThemedText style={styles.homeButtonText}>Back to Home</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    padding: 24,
    marginBottom: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  corporationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  confirmedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#10B981',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  detailsSection: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 16,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 16,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 16,
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#1F2937',
    marginRight: 8,
    marginTop: 2,
  },
  guidelineText: {
    fontSize: 13,
    color: '#1F2937',
    flex: 1,
    lineHeight: 18,
  },
  downloadButton: {
    backgroundColor: '#1F2937',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
    marginTop: 16,
    marginBottom: 24,
  },
});
