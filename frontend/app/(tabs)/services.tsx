import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ServicesScreen() {
  const services = [
    { icon: 'cash-outline', name: 'Pay Tax Dues', description: 'Property, Water & Vehicle Tax', color: '#F59E0B', route: '/services/pay-taxes' },
    { icon: 'document-outline', name: 'Get Documents', description: 'Certificates & Records', color: '#06B6D4', route: '/services/get-documents' },
    { icon: 'water-outline', name: 'Water Supply', description: 'Billing & Connections', color: '#06B6D4' },
    { icon: 'flash-outline', name: 'Electricity', description: 'Power & Utilities', color: '#F59E0B' },
    { icon: 'trash-outline', name: 'Waste Management', description: 'Collection & Disposal', color: '#EC4899' },
    { icon: 'car-outline', name: 'Transport', description: 'Public Transit & Routes', color: '#8B5CF6' },
    { icon: 'school-outline', name: 'Education', description: 'Schools & Programs', color: '#10B981' },
    { icon: 'medical-outline', name: 'Healthcare', description: 'Hospitals & Clinics', color: '#EF4444' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Other Services</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Ionicons name="grid" size={48} color="#016ACD" />
          <ThemedText style={styles.infoTitle}>City Services</ThemedText>
          <ThemedText style={styles.infoSubtitle}>
            Access various municipal services and information
          </ThemedText>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((service, index) => {
            const ServiceWrapper = service.route ? Pressable : View;
            const wrapperProps = service.route ? {
              onPress: () => router.push(service.route!),
              style: styles.serviceCard,
            } : {
              style: styles.serviceCard,
            };
            
            return (
              <ServiceWrapper key={index} {...wrapperProps}>
                <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}20` }]}>
                  <Ionicons name={service.icon as any} size={32} color={service.color} />
                </View>
                <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
                <ThemedText style={styles.serviceDescription}>{service.description}</ThemedText>
              </ServiceWrapper>
            );
          })}
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
          <ThemedText style={styles.noteText}>
            This is a temporary services screen. Full service catalog will be available soon.
          </ThemedText>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  noteCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
