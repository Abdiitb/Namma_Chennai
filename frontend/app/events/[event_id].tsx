import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

// Event data - in a real app, this would come from an API or database
const EVENTS_DATA: Record<string, {
  id: string;
  title: string;
  location: string;
  image: any;
  isLive: boolean;
  description: string;
  date: string;
  time: string;
  organizer: string;
  attendees: number;
  category: string;
}> = {
  '1': {
    id: '1',
    title: 'Cleaning Chennai',
    location: 'Besant Nagar | 500m away',
    image: require('@/assets/images/0cb5d24ab67a80376c347300d7a28648e883199f.png'),
    isLive: true,
    description: 'Join us for a community cleaning drive in Besant Nagar. Help keep our neighborhood clean and beautiful. We will be cleaning the streets, parks, and public spaces. All volunteers are welcome!',
    date: 'March 15, 2024',
    time: '6:00 AM - 9:00 AM',
    organizer: 'Chennai Corporation',
    attendees: 150,
    category: 'Community Service',
  },
  '2': {
    id: '2',
    title: 'Chennai Marathon',
    location: 'Marina Beach | 2km away',
    image: require('@/assets/images/ab6d991c841b95c1ea7bbde309cf192c7a4a99f8.png'),
    isLive: false,
    description: 'The annual Chennai Marathon brings together runners from all over the city. Choose from 5K, 10K, or full marathon distances. This event promotes fitness and community spirit. Register now to secure your spot!',
    date: 'March 20, 2024',
    time: '5:00 AM - 11:00 AM',
    organizer: 'Chennai Runners Club',
    attendees: 500,
    category: 'Sports & Fitness',
  },
};

export default function EventDetailsScreen() {
  const params = useLocalSearchParams();
  const eventId = params.event_id as string;
  const event = EVENTS_DATA[eventId];

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <ThemedText style={styles.errorText}>Event not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Event Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Image */}
        <Image
          source={event.image}
          style={styles.eventImage}
        />

        {/* Live Badge */}
        {event.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveIndicator} />
            <ThemedText style={styles.liveBadgeText}>Live</ThemedText>
          </View>
        )}

        {/* Event Info Card */}
        <View style={styles.infoCard}>
          <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <ThemedText style={styles.locationText}>{event.location}</ThemedText>
          </View>

          <View style={styles.divider} />

          {/* Event Details */}
          <View style={styles.detailSection}>
            <ThemedText style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.descriptionText}>{event.description}</ThemedText>
          </View>

          <View style={styles.detailSection}>
            <ThemedText style={styles.sectionTitle}>Event Information</ThemedText>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#1F2937" />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Date</ThemedText>
                <ThemedText style={styles.infoValue}>{event.date}</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#1F2937" />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Time</ThemedText>
                <ThemedText style={styles.infoValue}>{event.time}</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={20} color="#1F2937" />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Organizer</ThemedText>
                <ThemedText style={styles.infoValue}>{event.organizer}</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#1F2937" />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Attendees</ThemedText>
                <ThemedText style={styles.infoValue}>{event.attendees} registered</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="pricetag-outline" size={20} color="#1F2937" />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Category</ThemedText>
                <ThemedText style={styles.infoValue}>{event.category}</ThemedText>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <Pressable style={styles.joinButton}>
            <ThemedText style={styles.joinButtonText}>Join Event</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
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
    color: '#1F2937',
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
    paddingBottom: 24,
  },
  eventImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  joinButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  joinButtonText: {
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
    marginTop: 16,
  },
});
