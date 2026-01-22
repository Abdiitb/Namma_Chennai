import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { PLACES_DATA } from '../[place_unique_name]';

export default function SelectDateTimeScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const guests = parseInt(params.guests as string) || 1;
  const place = PLACES_DATA[placeUniqueName];

  const [selectedDate, setSelectedDate] = useState<string>('21');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  // Generate dates for the next week
  const dates = [
    { day: '21', label: 'Wed' },
    { day: '22', label: 'Thu' },
    { day: '23', label: 'Fri' },
    { day: '24', label: 'Sat' },
    { day: '25', label: 'Sun' },
    { day: '26', label: 'Mon' },
  ];

  // Time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  ];

  const periods = ['Morning', 'Noon', 'Evening'];

  const handleProceed = () => {
    if (selectedTime) {
      router.push({
        pathname: '/places/booking/review',
        params: {
          place_unique_name: placeUniqueName,
          guests: guests.toString(),
          date: selectedDate,
          time: selectedTime,
        },
      });
    }
  };

  const getSelectedDateLabel = () => {
    const dateObj = dates.find(d => d.day === selectedDate);
    return dateObj ? `${dateObj.label}, ${dateObj.day} Jan` : '';
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
        <ThemedText style={styles.headerTitle}>{place.title}</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Guest Selection Summary */}
        <Pressable
          style={styles.guestSummary}
          onPress={() => router.push({
            pathname: '/places/booking/select-guests',
            params: { place_unique_name: placeUniqueName },
          })}
        >
          <ThemedText style={styles.guestSummaryLabel}>Select number of guests</ThemedText>
          <View style={styles.guestSummaryValue}>
            <ThemedText style={styles.guestSummaryText}>{guests}</ThemedText>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </View>
        </Pressable>

        {/* Date Selection */}
        <View style={styles.section}>
          <View style={styles.dateContainer}>
            <ThemedText style={styles.monthLabel}>JAN</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
              {dates.map((date) => (
                <Pressable
                  key={date.day}
                  style={[
                    styles.dateButton,
                    selectedDate === date.day && styles.dateButtonSelected,
                  ]}
                  onPress={() => setSelectedDate(date.day)}
                >
                  <ThemedText
                    style={[
                      styles.dateText,
                      selectedDate === date.day && styles.dateTextSelected,
                    ]}
                  >
                    {date.day} {date.label}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Time Period Filters */}
        <View style={styles.section}>
          <View style={styles.periodContainer}>
            {periods.map((period) => (
              <Pressable
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonSelected,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <ThemedText
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.periodTextSelected,
                  ]}
                >
                  {period}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time) => (
              <Pressable
                key={time}
                style={[
                  styles.timeSlotButton,
                  selectedTime === time && styles.timeSlotButtonSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <ThemedText
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.viewMoreButton}>
            <ThemedText style={styles.viewMoreText}>View More</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.proceedButton,
            !selectedTime && styles.proceedButtonDisabled,
          ]}
          onPress={handleProceed}
          disabled={!selectedTime}
        >
          <ThemedText
            style={[
              styles.proceedButtonText,
              !selectedTime && styles.proceedButtonTextDisabled,
            ]}
          >
            Proceed to book
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
  guestSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 24,
  },
  guestSummaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  guestSummaryValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestSummaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  section: {
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    writingDirection: 'vertical-lr',
    transform: [{ rotate: '180deg' }],
    width: 30,
    textAlign: 'center',
  },
  datesScroll: {
    flex: 1,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  dateButtonSelected: {
    backgroundColor: '#1F2937',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  periodButtonSelected: {
    backgroundColor: '#1F2937',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  timeSlotButton: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  timeSlotButtonSelected: {
    backgroundColor: '#1F2937',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  viewMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  proceedButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  proceedButtonTextDisabled: {
    color: '#9CA3AF',
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
