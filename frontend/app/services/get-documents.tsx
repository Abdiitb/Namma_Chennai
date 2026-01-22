import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function GetDocumentsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Get Documents</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="document" size={48} color="#06B6D4" />
          </View>
          <ThemedText style={styles.heroTitle}>Get Your Documents</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Request and download official documents, certificates, and records from the corporation
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Available Documents</ThemedText>
          
          <View style={styles.documentCard}>
            <View style={[styles.documentIcon, { backgroundColor: '#06B6D420' }]}>
              <Ionicons name="document-text-outline" size={24} color="#06B6D4" />
            </View>
            <View style={styles.documentInfo}>
              <ThemedText style={styles.documentName}>Birth Certificate</ThemedText>
              <ThemedText style={styles.documentDescription}>
                Apply for and download your birth certificate online. Fast and secure delivery.
              </ThemedText>
            </View>
          </View>

          <View style={styles.documentCard}>
            <View style={[styles.documentIcon, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="document-text-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.documentInfo}>
              <ThemedText style={styles.documentName}>Death Certificate</ThemedText>
              <ThemedText style={styles.documentDescription}>
                Request death certificates for official purposes. Digital copies available.
              </ThemedText>
            </View>
          </View>

          <View style={styles.documentCard}>
            <View style={[styles.documentIcon, { backgroundColor: '#F59E0B20' }]}>
              <Ionicons name="home-outline" size={24} color="#F59E0B" />
            </View>
            <View style={styles.documentInfo}>
              <ThemedText style={styles.documentName}>Property Documents</ThemedText>
              <ThemedText style={styles.documentDescription}>
                Get property ownership certificates, encumbrance certificates, and more.
              </ThemedText>
            </View>
          </View>

          <View style={styles.documentCard}>
            <View style={[styles.documentIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="school-outline" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.documentInfo}>
              <ThemedText style={styles.documentName}>Educational Certificates</ThemedText>
              <ThemedText style={styles.documentDescription}>
                Request duplicate mark sheets, degree certificates, and transcripts.
              </ThemedText>
            </View>
          </View>

          <View style={styles.documentCard}>
            <View style={[styles.documentIcon, { backgroundColor: '#EC489920' }]}>
              <Ionicons name="card-outline" size={24} color="#EC4899" />
            </View>
            <View style={styles.documentInfo}>
              <ThemedText style={styles.documentName}>Income Certificate</ThemedText>
              <ThemedText style={styles.documentDescription}>
                Apply for income certificates required for various government schemes.
              </ThemedText>
            </View>
          </View>

          <View style={styles.documentCard}>
            <View style={[styles.documentIcon, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="medical-outline" size={24} color="#EF4444" />
            </View>
            <View style={styles.documentInfo}>
              <ThemedText style={styles.documentName}>Caste Certificate</ThemedText>
              <ThemedText style={styles.documentDescription}>
                Request caste certificates for educational and employment purposes.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
          <ThemedText style={styles.infoText}>
            This service is currently under development. Full document request functionality will be available soon.
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
    backgroundColor: '#06B6D420',
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
  documentCard: {
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
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  documentDescription: {
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
