import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthState } from '@/hooks/use-auth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import type { ZeroOptions } from '@rocicorp/zero';
import { expoSQLiteStoreProvider } from '@rocicorp/zero/expo-sqlite';
import { ZeroProvider } from '@rocicorp/zero/react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, ActivityIndicator, View } from 'react-native';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';
import { schema } from '@/zero/schema';
import { mutators } from '@/zero/mutators'

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, token, loading, initialized, checkAuth } = useAuthState();
  const router = useRouter();
  const segments = useSegments();

  // console.log('Auth Layout:', { user, token, loading, initialized, segments });

  // Memoize Zero options with user ID and token from auth state
  const opts: ZeroOptions<typeof schema> = useMemo(() => ({
    schema,
    userID: user?.id ?? 'anon',
    server: Platform.OS === 'web' ? 'http://localhost:4848' : 'http://10.5.48.18:4848',
    auth: token ?? undefined,
    mutators
  }), [user?.id, token]);

  // Check auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';

    // console.log('user:', user, 'inAuthGroup:', inAuthGroup);

    if (!user && !inAuthGroup) {
      // User is not signed in and not on auth screen, redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // User is signed in but on auth screen, redirect to main app
      router.replace('/(tabs)');
    }
  }, [user, initialized, segments, router]);

  // Show loading screen while checking auth
  if (!initialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6366F1' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ZeroProvider
      {...opts}
      kvStore={
        // On native, use expo-sqlite; on web, use IndexedDB
        Platform.OS !== 'web'
          ? expoSQLiteStoreProvider()
          : 'idb'
      }
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="create-ticket" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ZeroProvider>
  );
}
