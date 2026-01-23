import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { ThemedText } from '@/components/themed-text';
import { getGccOnlineServiceModuleBySlug } from '@/constants/gcc-online-services';

export default function ServiceModuleScreen() {
  const params = useLocalSearchParams<{ serviceSlug?: string | string[]; moduleSlug?: string | string[] }>();
  const serviceSlug = Array.isArray(params.serviceSlug) ? params.serviceSlug[0] : params.serviceSlug;
  const moduleSlug = Array.isArray(params.moduleSlug) ? params.moduleSlug[0] : params.moduleSlug;

  const { service, module } =
    serviceSlug && moduleSlug ? getGccOnlineServiceModuleBySlug(serviceSlug, moduleSlug) : { service: undefined, module: undefined };

  const title = module?.title ?? 'Module';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{title}</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>
            This is a temporary page. We’ll implement the real module flow next.
          </ThemedText>

          {service?.title ? (
            <View style={styles.metaRow}>
              <Ionicons name="layers-outline" size={16} color="#6B7280" />
              <ThemedText style={styles.metaText}>{service.title}</ThemedText>
            </View>
          ) : null}

          <Pressable
            style={[styles.button, !module?.gccUrl ? styles.buttonDisabled : null]}
            disabled={!module?.gccUrl}
            onPress={async () => {
              if (module?.gccUrl) {
                try {
                  await openBrowserAsync(module.gccUrl, {
                    presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
                  });
                } catch (error) {
                  console.error('Failed to open URL:', error);
                }
              }
            }}
          >
            <Ionicons name="open-outline" size={18} color={module?.gccUrl ? '#111827' : '#9CA3AF'} />
            <ThemedText style={[styles.buttonText, !module?.gccUrl ? styles.buttonTextDisabled : null]}>
              Open module on GCC
            </ThemedText>
          </Pressable>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  metaText: { fontSize: 13, color: '#6B7280' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  buttonDisabled: { backgroundColor: '#F9FAFB' },
  buttonText: { fontSize: 13, fontWeight: '700', color: '#111827' },
  buttonTextDisabled: { color: '#9CA3AF' },
});

