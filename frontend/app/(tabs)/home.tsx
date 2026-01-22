import { StyleSheet, View, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';

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
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const handleQuickAction = (actionId: string) => {
    if (actionId === '1') {
      router.push('/create-ticket');
    } else if (actionId === '2') {
      router.push('/(tabs)/services');
    } else if (actionId === '3') {
      router.push('/(tabs)/discover');
    } else {
      router.push('/(tabs)/services');
    }
  };

  const handleEventPress = (eventId: string) => {
    // Navigate to event details
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
        <View style={styles.welcomeCard}>
          <Ionicons name="home" size={48} color="#016ACD" />
          <ThemedText style={styles.welcomeTitle}>Welcome to Namma Chennai</ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Your gateway to city services and information
          </ThemedText>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
