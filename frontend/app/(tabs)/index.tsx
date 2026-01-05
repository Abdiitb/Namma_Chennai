import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { HomeHeader } from '@/components/home-header';
import { ServiceCard } from '@/components/service-card';
import { QuickActions } from '@/components/quick-actions';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { SERVICES, QUICK_ACTIONS } from '@/constants/services';

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
        {/* Services Grid */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Namma Chennai Services</ThemedText>
          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <View key={service.id} style={styles.serviceItem}>
                <ServiceCard
                  title={service.title}
                  icon={service.icon}
                  iconColor={service.iconColor}
                  iconBgColor={service.iconBgColor}
                  onPress={() => handleServicePress(service.id)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <QuickActions 
          title="Quick Report"
          items={QUICK_ACTIONS}
          onItemPress={handleQuickAction}
        />

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAll}>See All →</ThemedText>
            </Pressable>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Pothole Repair Completed</ThemedText>
              <ThemedText style={styles.activitySubtitle}>Anna Nagar, Chennai</ThemedText>
              <ThemedText style={styles.activityTime}>2 hours ago</ThemedText>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="time" size={24} color="#F59E0B" />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Street Light Issue - In Progress</ThemedText>
              <ThemedText style={styles.activitySubtitle}>T. Nagar, Chennai</ThemedText>
              <ThemedText style={styles.activityTime}>Yesterday</ThemedText>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>156</ThemedText>
            <ThemedText style={styles.statLabel}>Issues Resolved</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>23</ThemedText>
            <ThemedText style={styles.statLabel}>In Progress</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>4.8</ThemedText>
            <ThemedText style={styles.statLabel}>Avg. Rating</ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  serviceItem: {
    width: '33.33%',
    padding: 6,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
