import { StyleSheet, View, ScrollView, Pressable, Image, TextInput, ImageBackground, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';

const QUICK_ACTIONS = [
  { id: '1', title: 'Raise a\nComplaint', icon: 'ticket-outline' as const, color: '#EC4899' },
  { id: '2', title: 'Pay\nTax dues', icon: 'cash-outline' as const, color: '#F59E0B' },
  { id: '3', title: 'Get\nDocuments', icon: 'document-outline' as const, color: '#06B6D4' },
  { id: '4', title: 'More\nServices', icon: 'apps-outline' as const, color: '#8B5CF6' },
];

const EVENTS = [
  {
    id: '1',
    title: 'Cleaning Chennai',
    location: 'Besant Nagar | 500m away',
    image: require('@/assets/images/0cb5d24ab67a80376c347300d7a28648e883199f.png'),
    isLive: true,
  },
  {
    id: '2',
    title: 'Chennai Marathon',
    location: 'Marina Beach | 2km away',
    image: require('@/assets/images/ab6d991c841b95c1ea7bbde309cf192c7a4a99f8.png'),
    isLive: false,
  },
];

const PLACES = [
  {
    id: '1',
    title: 'Victoria Public Hall',
    unique_name: 'victoria-public-hall',
    image: require('@/assets/images/e106eefd9b743fb246e8a5b539e805c405bd7e60.png'),
  },
  {
    id: '2',
    title: 'Rippon Building',
    unique_name: 'rippon-building',
    image: require('@/assets/images/a4d85bf7b4201ba079e7d0088dfce906c968b21c.png'),
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { width: screenWidth } = useWindowDimensions();
  // Account for container padding (16px on each side)
  const cardWidth = screenWidth - 32;
  const welcomeCardHeight = (cardWidth * 9) / 16; // 16:9 aspect ratio

  const handleQuickAction = (actionId: string) => {
    if (actionId === '1') {
      router.push('/create-ticket');
    } else if (actionId === '2') {
      router.push('/services/property-tax');
    } else if (actionId === '3') {
      router.push('/services/birth-and-death');
    } else {
      router.push('/(tabs)/services');
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handlePlacePress = (uniqueName: string) => {
    router.push(`/places/${uniqueName}`);
  };

  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleSearchPress = () => {
    // Navigate to search screen or handle search
  };

  const handleAnnouncementPress = () => {
    // Navigate to announcements or handle notification
  };

  const handleProfilePress = () => {
    // Navigate to profile screen
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {/* Profile Picture */}
        <Pressable style={styles.profileContainer} onPress={handleProfilePress}>
          <View style={styles.profileAvatar}>
            <ThemedText style={styles.profileInitials}>{getUserInitials()}</ThemedText>
          </View>
        </Pressable>

        {/* Empty space that takes up remaining width */}
        <View style={styles.spacer} />

        {/* Language Toggle */}
        <Pressable style={styles.languageButton} onPress={toggleLanguage}>
          <ThemedText style={styles.languageText}>{language === 'en' ? 'த' : 'en'}</ThemedText>
        </Pressable>

        {/* Announcement Icon */}
        <Pressable style={styles.announcementButton} onPress={handleAnnouncementPress}>
          <Ionicons name="megaphone-outline" size={20} color="#313131" />
        </Pressable>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <ImageBackground 
          source={require('@/assets/images/26045d6fec840ea9852a622a9275fb6e73aca097.png')}
          style={[styles.welcomeCard, { width: cardWidth, height: welcomeCardHeight }]}
          imageStyle={styles.welcomeCardImage}
        >
          <View style={styles.welcomeCardContent}>
            <ThemedText style={styles.welcomeTitle}>Welcome to Namma Chennai</ThemedText>
            <ThemedText style={styles.welcomeSubtitle}>
              Your gateway to city services and information
            </ThemedText>
          </View>
        </ImageBackground>

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
                  source={event.image}
                  style={styles.eventImage}
                />
                {event.isLive && (
                  <View style={styles.liveBadge}>
                    <View style={styles.liveIndicator} />
                    <ThemedText style={styles.liveBadgeText}>Live</ThemedText>
                  </View>
                )}
                <View style={styles.eventInfo}>
                  <View style={styles.eventTextContainer}>
                    <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                    <ThemedText style={styles.eventLocation}>{event.location}</ThemedText>
                  </View>
                  <Pressable 
                    style={styles.viewButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEventPress(event.id);
                    }}
                  >
                    <ThemedText style={styles.viewButtonText}>View</ThemedText>
                  </Pressable>
                </View>
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
              <Pressable
                key={place.id}
                style={styles.placeCard}
                onPress={() => handlePlacePress(place.unique_name)}
              >
                <Image
                  source={place.image}
                  style={styles.placeImage}
                />
                <View style={styles.placeInfo}>
                  <View style={styles.placeTextContainer}>
                    <ThemedText style={styles.placeTitle}>{place.title}</ThemedText>
                  </View>
                  <Pressable 
                    style={styles.viewButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handlePlacePress(place.unique_name);
                    }}
                  >
                    <ThemedText style={styles.viewButtonText}>View</ThemedText>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
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
    gap: 12,
  },
  profileContainer: {
    marginRight: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  spacer: {
    flex: 1,
  },
  languageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginRight: 8,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#313131',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  announcementButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  welcomeCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'flex-end',
  },
  welcomeCardImage: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  welcomeCardContent: {
    padding: 24,
    paddingBottom: 32,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
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
    width: 246,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventImage: {
    width: '100%',
    height: 246,
    resizeMode: 'cover',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  eventInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTextContainer: {
    flex: 1,
    marginRight: 12,
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
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    minWidth: 60,
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
    width: 246,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  placeImage: {
    width: '100%',
    height: 246,
    resizeMode: 'cover',
  },
  placeInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  placeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
});
