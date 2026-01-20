import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { HomeHeader } from '@/components/home-header';
import { ServiceCard } from '@/components/service-card';
import { QuickActions } from '@/components/quick-actions';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { SERVICES, QUICK_ACTIONS } from '@/constants/services';
import { ThemeColors } from '@/constants/theme';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  console.log('HomeScreen rendered for user:', user);

  const handleServicePress = (serviceId: string) => {
    // Navigate to appropriate screen based on service
    if (serviceId === '3') {
      router.push('/(tabs)/(tickets)/tickets');
    } else if (serviceId === '1') {
      router.push('/(tabs)/issues');
    }
  };

  const handleQuickAction = (actionId: string) => {
    // Handle quick action - navigate to report issue with pre-selected category
    router.push('/(tabs)/issues');
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
        {/* Quick Actions Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        </View>
        
        <QuickActions 
          title=""
          items={QUICK_ACTIONS}
          onItemPress={handleQuickAction}
        />

        {/* Namma Chennai Services - 2x2 Grid */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Namma Chennai Services</ThemedText>
          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <View key={service.id} style={styles.serviceItem}>
                <ServiceCard
                  title={service.title}
                  subtitle={service.subtitle}
                  icon={service.icon}
                  iconColor={service.iconColor}
                  iconBgColor={service.iconBgColor}
                  onPress={() => handleServicePress(service.id)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Recent News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent news</ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAll}>See All →</ThemedText>
            </Pressable>
          </View>
          
          {/* News Card with Image */}
          <View style={styles.newsCard}>
            <View style={styles.newsImagePlaceholder}>
              <Ionicons name="image-outline" size={32} color={ThemeColors.textSecondary} />
            </View>
            <View style={styles.newsContent}>
              <ThemedText style={styles.newsTitle}>Removal of Garbage from Off Buckingham Canal</ThemedText>
              <ThemedText style={styles.newsDescription} numberOfLines={2}>
                Greater Chennai Corporation has successfully completed the garbage removal drive...
              </ThemedText>
            </View>
          </View>

          {/* Activity Cards */}
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: ThemeColors.iconBgGreen }]}>
              <Ionicons name="checkmark-circle" size={20} color={ThemeColors.iconColorGreen} />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Pothole Repair Completed</ThemedText>
              <ThemedText style={styles.activitySubtitle}>Anna Nagar, Chennai</ThemedText>
              <ThemedText style={styles.activityTime}>2 hours ago</ThemedText>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: ThemeColors.iconBgYellow }]}>
              <Ionicons name="time" size={20} color={ThemeColors.iconColorYellow} />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Street Light Issue - In Progress</ThemedText>
              <ThemedText style={styles.activitySubtitle}>T. Nagar, Chennai</ThemedText>
              <ThemedText style={styles.activityTime}>Yesterday</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
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
    color: ThemeColors.textBold,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 13,
    color: ThemeColors.primary,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  serviceItem: {
    width: '50%',
    padding: 6,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  newsImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: ThemeColors.iconBgGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  newsContent: {
    flex: 1,
    justifyContent: 'center',
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ThemeColors.textBold,
    marginBottom: 8,
    lineHeight: 20,
  },
  newsDescription: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 18,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ThemeColors.iconBgGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textBold,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
});
