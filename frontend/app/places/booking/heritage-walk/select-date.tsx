import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { getAllBookingCounts, BookingCounts } from '@/services/heritage-walk-api';

type VisitorCategory = 'individual' | 'family' | 'school' | 'college';

const MAX_BOOKINGS_PER_DAY = 150;

// Get next available Tuesday, Thursday, Saturday, and Sunday dates
function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  const daysToCheck = 30; // Check next 30 days
  
  for (let i = 0; i < daysToCheck; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();
    
    // Sunday = 0, Tuesday = 2, Thursday = 4, Saturday = 6
    if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
      dates.push(date);
    }
  }
  
  return dates.slice(0, 12); // Return first 12 available dates
}

function formatDate(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SelectDateScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const visitorCategory = params.visitor_category as VisitorCategory;
  
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingCounts, setBookingCounts] = useState<BookingCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingCounts();
  }, []);

  const loadBookingCounts = async () => {
    try {
      setLoading(true);
      const dates = getAvailableDates();
      setAvailableDates(dates);
      
      const counts = await getAllBookingCounts();
      setBookingCounts(counts);
    } catch (error) {
      console.error('Failed to load booking counts:', error);
      // Still show dates even if counts fail
      setAvailableDates(getAvailableDates());
    } finally {
      setLoading(false);
    }
  };

  const getBookingCountForDate = (date: Date): number => {
    if (!bookingCounts) return 0;
    const dateStr = formatDateForAPI(date);
    return bookingCounts.counts[dateStr] || 0;
  };

  const isDateAvailable = (date: Date): boolean => {
    const count = getBookingCountForDate(date);
    return count < MAX_BOOKINGS_PER_DAY;
  };

  const handleContinue = () => {
    if (selectedDate) {
      router.push({
        pathname: '/places/booking/heritage-walk/personal-details',
        params: {
          place_unique_name: placeUniqueName,
          visitor_category: visitorCategory,
          visit_date: formatDateForAPI(selectedDate),
        },
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Select Date</ThemedText>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
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
        <ThemedText style={styles.headerTitle}>Select Date</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.subtitle}>
          Available days: Tuesday, Thursday, Saturday, and Sunday
        </ThemedText>
        <ThemedText style={styles.timeSlotInfo}>
          Time slot: 8:00 AM to 9:00 AM (Fixed)
        </ThemedText>

        <View style={styles.datesContainer}>
          {availableDates.map((date, index) => {
            const isAvailable = isDateAvailable(date);
            const isSelected = selectedDate?.getTime() === date.getTime();
            const count = getBookingCountForDate(date);
            const slotsRemaining = MAX_BOOKINGS_PER_DAY - count;

            return (
              <Pressable
                key={index}
                style={[
                  styles.dateCard,
                  !isAvailable && styles.dateCardDisabled,
                  isSelected && styles.dateCardSelected,
                ]}
                onPress={() => isAvailable && setSelectedDate(date)}
                disabled={!isAvailable}
              >
                <ThemedText
                  style={[
                    styles.dateText,
                    !isAvailable && styles.dateTextDisabled,
                    isSelected && styles.dateTextSelected,
                  ]}
                >
                  {formatDate(date)}
                </ThemedText>
                {isAvailable ? (
                  <ThemedText
                    style={[
                      styles.slotsText,
                      isSelected && styles.slotsTextSelected,
                    ]}
                  >
                    {slotsRemaining} slots available
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.slotsTextDisabled}>
                    Fully booked
                  </ThemedText>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            !selectedDate && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedDate}
        >
          <ThemedText
            style={[
              styles.continueButtonText,
              !selectedDate && styles.continueButtonTextDisabled,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  timeSlotInfo: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  datesContainer: {
    gap: 12,
  },
  dateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  dateCardDisabled: {
    opacity: 0.5,
    borderColor: '#D1D5DB',
  },
  dateCardSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  dateTextDisabled: {
    color: '#9CA3AF',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  slotsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  slotsTextSelected: {
    color: '#D1D5DB',
  },
  slotsTextDisabled: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
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
