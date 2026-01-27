import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { ThemedText } from '@/components/themed-text';
import { getGccOnlineServiceBySlug } from '@/constants/gcc-online-services';

export default function ServiceDetailScreen() {
  const params = useLocalSearchParams<{ serviceSlug?: string | string[] }>();
  const serviceSlug = Array.isArray(params.serviceSlug) ? params.serviceSlug[0] : params.serviceSlug;

  const service = serviceSlug ? getGccOnlineServiceBySlug(serviceSlug) : undefined;

  if (!service) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Service</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyTitle}>Service not found</ThemedText>
          <ThemedText style={styles.emptySubtitle}>Please go back and select a service again.</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{service.title}</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={[styles.iconContainer, { backgroundColor: `${service.color}20` }]}>
            <Ionicons name={service.icon as any} size={44} color={service.color} />
          </View>
          <ThemedText style={styles.heroTitle}>{service.title}</ThemedText>
          <ThemedText style={styles.heroSubtitle}>{service.description}</ThemedText>

          <Pressable
            style={styles.openOnGccButton}
            onPress={async () => {
              try {
                await openBrowserAsync(service.gccUrl, {
                  presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
                });
              } catch (error) {
                console.error('Failed to open URL:', error);
              }
            }}
          >
            <Ionicons name="open-outline" size={18} color="#1F2937" />
            <ThemedText style={styles.openOnGccText}>Open on GCC</ThemedText>
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Modules</ThemedText>
          <View style={styles.modulesGrid}>
            {service.modules.map((m) => (
              <Pressable
                key={m.slug}
                style={styles.moduleCard}
                onPress={() => {
                  // Special handling for Public Grievance - route to app flow instead of module page
                  if (service.slug === 'public-grievance-redressal' && m.slug === 'register-complaint') {
                    router.push('/public-grievance/register-complaint/personal-details');
                  } else {
                    router.push(`/services/${service.slug}/${m.slug}`);
                  }
                }}
              >
                <ThemedText style={styles.moduleTitle}>{m.title}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000000', flex: 1 },
  placeholder: { width: 32 },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 24 },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#000000', textAlign: 'center', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 18, marginBottom: 14 },
  openOnGccButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  openOnGccText: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 12 },
  modulesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moduleCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  moduleTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  emptyState: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center' },
});

