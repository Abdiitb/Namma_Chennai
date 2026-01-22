import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PayTaxesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Pay Tax Dues</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="cash" size={48} color="#F59E0B" />
          </View>
          <ThemedText style={styles.heroTitle}>Pay Your Tax Dues</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Quick and secure payment for property tax, water tax, and other municipal dues
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Available Services</ThemedText>
          
          <View style={styles.serviceCard}>
            <View style={[styles.serviceIcon, { backgroundColor: '#F59E0B20' }]}>
              <Ionicons name="home-outline" size={24} color="#F59E0B" />
            </View>
            <View style={styles.serviceInfo}>
              <ThemedText style={styles.serviceName}>Property Tax</ThemedText>
              <ThemedText style={styles.serviceDescription}>
                Pay your property tax online. View outstanding dues and payment history.
              </ThemedText>
            </View>
          </View>

          <View style={styles.serviceCard}>
            <View style={[styles.serviceIcon, { backgroundColor: '#06B6D420' }]}>
              <Ionicons name="water-outline" size={24} color="#06B6D4" />
            </View>
            <View style={styles.serviceInfo}>
              <ThemedText style={styles.serviceName}>Water Tax</ThemedText>
              <ThemedText style={styles.serviceDescription}>
                Pay water tax and view consumption bills. Get instant receipts.
              </ThemedText>
            </View>
          </View>

          <View style={styles.serviceCard}>
            <View style={[styles.serviceIcon, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="car-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.serviceInfo}>
              <ThemedText style={styles.serviceName}>Vehicle Tax</ThemedText>
              <ThemedText style={styles.serviceDescription}>
                Pay vehicle registration tax and road tax online.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
          <ThemedText style={styles.infoText}>
            This service is currently under development. Full payment functionality will be available soon.
          </ThemedText>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F59E0B20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
