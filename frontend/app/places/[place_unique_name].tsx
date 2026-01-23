import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

// Place data - in a real app, this would come from an API or database
export const PLACES_DATA: Record<string, {
  id: string;
  title: string;
  unique_name: string;
  image: any;
  description: string;
  address: string;
  hours: string;
  amenities: string[];
}> = {
  'victoria-public-hall': {
    id: '1',
    title: 'Victoria Public Hall',
    unique_name: 'victoria-public-hall',
    image: require('@/assets/images/e106eefd9b743fb246e8a5b539e805c405bd7e60.png'),
    description: 'Historic public hall in Chennai known for its architectural beauty and cultural significance. A popular venue for events and gatherings.',
    address: 'Periamet, Kannappar Thidal, Poongavanapuram, Chennai - 600003',
    hours: '10:00 AM - 06:00 PM',
    amenities: ['Parking', 'Access', 'Photos', 'Restroom'],
  },
  'rippon-building': {
    id: '2',
    title: 'Rippon Building',
    unique_name: 'rippon-building',
    image: require('@/assets/images/a4d85bf7b4201ba079e7d0088dfce906c968b21c.png'),
    description: 'Registration for Heritage Walk at Ripon Buildings\n\nGreater Chennai Corporation (GCC) invites you to a walking tour of the historic Ripon Buildings and its campus.',
    address: 'Periamet, Kannappar Thidal, Poongavanapuram, Chennai - 600003',
    hours: '10:00 AM - 06:00 PM',
    amenities: ['Parking', 'Access', 'Photos', 'Restroom'],
  },
};

const AMENITY_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  'Parking': { icon: 'car-outline', color: '#6B7280' },
  'Access': { icon: 'accessibility-outline', color: '#6B7280' },
  'Photos': { icon: 'camera-outline', color: '#6B7280' },
  'Restroom': { icon: 'water-outline', color: '#6B7280' },
};

function HeritageWalkSchedule() {
  return (
    <View style={styles.heritageWalkSection}>
      <ThemedText style={styles.heritageWalkTitle}>Heritage Walk Schedule</ThemedText>
      <View style={styles.heritageWalkInfo}>
        <View style={styles.heritageWalkRow}>
          <Ionicons name="calendar-outline" size={20} color="#1F2937" />
          <ThemedText style={styles.heritageWalkText}>
            Available days: Tuesday, Thursday, Saturday, and Sunday
          </ThemedText>
        </View>
        <View style={styles.heritageWalkRow}>
          <Ionicons name="time-outline" size={20} color="#1F2937" />
          <ThemedText style={styles.heritageWalkText}>
            Time slot: 8:00 AM to 9:00 AM
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function PlaceDetailsScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const place = PLACES_DATA[placeUniqueName];

  if (!place) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <ThemedText style={styles.errorText}>Place not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Image
          source={place.image}
          style={styles.heroImage}
        />

        {/* Place Info Card */}
        <View style={styles.infoCard}>
          <ThemedText style={styles.placeTitle}>{place.title}</ThemedText>
          <ThemedText style={styles.descriptionText}>{place.description}</ThemedText>

          {/* Heritage Walk Information - Only for Ripon Building */}
          {placeUniqueName === 'rippon-building' && <HeritageWalkSchedule />}

          {/* Location */}
          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="location" size={20} color="#10B981" />
            </View>
            <ThemedText style={styles.infoText}>{place.address}</ThemedText>
          </View>

          {/* Operating Hours */}
          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={20} color="#F59E0B" />
            </View>
            <ThemedText style={styles.infoText}>{place.hours}</ThemedText>
          </View>

          {/* Amenities Section */}
          <View style={styles.amenitiesSection}>
            <ThemedText style={styles.sectionTitle}>Amenities</ThemedText>
            <View style={styles.amenitiesGrid}>
              {place.amenities.map((amenity, index) => {
                const amenityData = AMENITY_ICONS[amenity] || { icon: 'ellipse-outline', color: '#6B7280' };
                return (
                  <View key={index} style={styles.amenityItem}>
                    <View style={styles.amenityIcon}>
                      <Ionicons name={amenityData.icon as any} size={24} color={amenityData.color} />
                    </View>
                    <ThemedText style={styles.amenityLabel}>{amenity}</ThemedText>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Book Entry Tickets Button */}
          <Pressable
            style={styles.bookButton}
            onPress={() => {
              // Route to Heritage Walk booking flow for Rippon Building
              if (placeUniqueName === 'rippon-building') {
                router.push({
                  pathname: '/places/booking/heritage-walk/category-selection',
                  params: { place_unique_name: placeUniqueName },
                });
              } else {
                // Use regular booking flow for other places
                router.push({
                  pathname: '/places/booking/select-guests',
                  params: { place_unique_name: placeUniqueName },
                });
              }
            }}
          >
            <ThemedText style={styles.bookButtonText}>Book Entry Tickets</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 50,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 0,
  },
  placeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginTop: 24,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  heritageWalkSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  heritageWalkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  heritageWalkInfo: {
    gap: 12,
  },
  heritageWalkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  heritageWalkText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  amenitiesSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    alignItems: 'center',
    width: 80,
  },
  amenityIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  amenityLabel: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonText: {
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
