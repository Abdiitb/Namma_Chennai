import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { PLACES_DATA } from '../[place_unique_name]';
import { useState, useEffect } from 'react';

export default function ReviewBookingScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const guests = parseInt(params.guests as string) || 1;
  const date = params.date as string;
  const time = params.time as string;
  const place = PLACES_DATA[placeUniqueName];

  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ticketPrice = 30; // ₹30 per ticket
  const totalAmount = guests * ticketPrice;

  const getDateLabel = () => {
    const dateLabels: Record<string, string> = {
      '21': 'Wed, 21 Jan',
      '22': 'Thu, 22 Jan',
      '23': 'Fri, 23 Jan',
      '24': 'Sat, 24 Jan',
      '25': 'Sun, 25 Jan',
      '26': 'Mon, 26 Jan',
    };
    return dateLabels[date] || `${date} Jan`;
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
        <ThemedText style={styles.headerTitle}>Review your booking</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Timer */}
        <View style={styles.timerContainer}>
          <ThemedText style={styles.timerText}>
            Complete your booking in <ThemedText style={styles.timerBold}>{formatTimer(timer)}</ThemedText> mins
          </ThemedText>
        </View>

        {/* Booking Details Card */}
        <View style={styles.bookingCard}>
          <View style={styles.placeHeader}>
            <Image source={place.image} style={styles.placeImageSmall} />
            <ThemedText style={styles.placeName}>{place.title}</ThemedText>
          </View>

          <ThemedText style={styles.address}>{place.address}</ThemedText>

          <View style={styles.bookingDateTime}>
            <ThemedText style={styles.dateTimeText}>{getDateLabel()} {time}</ThemedText>
          </View>

          <View style={styles.ticketRow}>
            <View style={styles.ticketInfo}>
              <ThemedText style={styles.ticketDetails}>
                {guests} × {place.title} Adult
              </ThemedText>
              <Pressable>
                <ThemedText style={styles.removeText}>Remove</ThemedText>
              </Pressable>
            </View>
            <ThemedText style={styles.ticketPrice}>₹{totalAmount}</ThemedText>
          </View>

          <View style={styles.mTicketRow}>
            <Ionicons name="ticket-outline" size={20} color="#6B7280" />
            <ThemedText style={styles.mTicketText}>
              M-Ticket: Entry using the QR code in your app
            </ThemedText>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Order amount</ThemedText>
            <ThemedText style={styles.summaryValue}>₹{totalAmount}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabelGrand}>Grand Total</ThemedText>
            <ThemedText style={styles.summaryValueGrand}>₹{totalAmount}</ThemedText>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceSection}>
          <ThemedText style={styles.invoiceTitle}>Invoice Details</ThemedText>
          
          <View style={styles.invoiceRow}>
            <View style={styles.invoiceInfo}>
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <ThemedText style={styles.invoiceText}>Sangeeth Kumar</ThemedText>
            </View>
            <ThemedText style={styles.invoicePrice}>₹{totalAmount}</ThemedText>
          </View>

          <View style={styles.invoiceDetailRow}>
            <ThemedText style={styles.invoiceDetailLabel}>Phone Number</ThemedText>
            <ThemedText style={styles.invoiceDetailValue}>+91-9047180229</ThemedText>
          </View>

          <View style={styles.invoiceDetailRow}>
            <ThemedText style={styles.invoiceDetailLabel}>Email</ThemedText>
            <ThemedText style={styles.invoiceDetailValue}>e.sangeethkumar@gmail.com</ThemedText>
          </View>

          <View style={styles.invoiceDetailRow}>
            <ThemedText style={styles.invoiceDetailLabel}>Location</ThemedText>
            <ThemedText style={styles.invoiceDetailValue}>Karnataka</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View style={styles.footer}>
        <Pressable style={styles.payButton} onPress={() => {
          // Handle payment
          router.push('/(tabs)');
        }}>
          <ThemedText style={styles.payButtonText}>Pay now</ThemedText>
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
  timerContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  timerBold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  placeImageSmall: {
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  address: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  bookingDateTime: {
    marginBottom: 16,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketDetails: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  removeText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  ticketPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  mTicketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mTicketText: {
    fontSize: 13,
    color: '#6B7280',
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryLabelGrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryValueGrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  invoiceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  invoiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  invoicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  invoiceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  invoiceDetailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  invoiceDetailValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  payButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
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
