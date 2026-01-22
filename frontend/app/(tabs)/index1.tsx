import { StyleSheet, View, ScrollView, Pressable, TextInput, Image, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { HomeHeader } from '@/components/home-header';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: '1', title: 'Raise a\nComplaint', icon: 'alert-circle-outline' as const, color: '#EC4899' },
  { id: '2', title: 'Pay\nTax dues', icon: 'card-outline' as const, color: '#F59E0B' },
  { id: '3', title: 'Get\nDocuments', icon: 'document-outline' as const, color: '#06B6D4' },
  { id: '4', title: 'More\nServices', icon: 'apps-outline' as const, color: '#8B5CF6' },
];

const EVENTS = [
  {
    id: '1',
    title: 'Cleaning Chennai',
    location: 'Besant Nagar, 500m away',
    image: 'https://via.placeholder.com/200x150/FFB347/FFFFFF?text=Cleaning+Event',
    isLive: true,
  },
  {
    id: '2',
    title: 'Chennai Marathon',
    location: 'Marina Beach, 2km away',
    image: 'https://via.placeholder.com/200x150/FF6B6B/FFFFFF?text=Marathon',
    isLive: false,
  },
];

const PLACES = [
  {
    id: '1',
    title: 'Kapaleeshwarar Temple',
    image: 'https://via.placeholder.com/200x150/D4A5A5/FFFFFF?text=Temple',
  },
  {
    id: '2',
    title: 'Marina Beach',
    image: 'https://via.placeholder.com/200x150/A8D5BA/FFFFFF?text=Beach',
  },
];

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const handleQuickAction = (actionId: string) => {
    if (actionId === '1') {
      router.push('/create-ticket');
    } else if (actionId === '2') {
      router.push('/(tabs)/explore');
    } else if (actionId === '3') {
      router.push('/(tabs)/discover');
    } else {
      router.push('/(tabs)/explore');
    }
  };

  const handleEventPress = (eventId: string) => {
    // Navigate to event details
  };

  return (
    <View style={styles.container}>
      <HomeHeader 
        userName={user?.name || 'Citizen'} 
        onProfilePress={() => logout()}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Find services, places..."
            placeholderTextColor="#9CA3AF"
          />
          <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />
        </View>

        {/* Carousel Banner */}
        <View style={styles.carouselContainer}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.carouselImage}
          />
          <View style={styles.carouselOverlay}>
            <ThemedText style={styles.carouselTitle}>சிங்கார</ThemedText>
            <ThemedText style={styles.carouselSubtitle}>சென்னை!</ThemedText>
            <Pressable style={styles.viewMoreButton}>
              <ThemedText style={styles.viewMoreText}>View More</ThemedText>
            </Pressable>
          </View>
          
          {/* Carousel Dots */}
          <View style={styles.carouselDots}>
            {[0, 1, 2, 3, 4].map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === carouselIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick actions</ThemedText>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => handleQuickAction(action.id)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={action.color} />
                </View>
                <ThemedText style={styles.quickActionText}>{action.title}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Events Happening Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Events happening</ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAll}>View All</ThemedText>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.eventsScroll}
            contentContainerStyle={styles.eventsContent}
          >
            {EVENTS.map((event) => (
              <Pressable
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event.id)}
              >
                <Image
                  source={{ uri: event.image }}
                  style={styles.eventImage}
                />
                {event.isLive && (
                  <View style={styles.liveBadge}>
                    <Ionicons name="radio-button-on" size={12} color="#EF4444" />
                    <ThemedText style={styles.liveBadgeText}>Live</ThemedText>
                  </View>
                )}
                <View style={styles.eventInfo}>
                  <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                  <ThemedText style={styles.eventLocation}>{event.location}</ThemedText>
                </View>
                <Pressable style={styles.viewButton}>
                  <ThemedText style={styles.viewButtonText}>View</ThemedText>
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Places Around You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Places around you</ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAll}>View Map</ThemedText>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.placesScroll}
            contentContainerStyle={styles.placesContent}
          >
            {PLACES.map((place) => (
              <View key={place.id} style={styles.placeCard}>
                <Image
                  source={{ uri: place.image }}
                  style={styles.placeImage}
                />
                <ThemedText style={styles.placeTitle}>{place.title}</ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  carouselContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#FFFFFF',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  carouselSubtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  viewMoreButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  carouselDots: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 14,
  },
  eventsScroll: {
    marginHorizontal: -16,
  },
  eventsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eventCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 11,
    color: '#6B7280',
  },
  viewButton: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#000000',
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placesScroll: {
    marginHorizontal: -16,
  },
  placesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  placeCard: {
    width: 140,
  },
  placeImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  placeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
});
