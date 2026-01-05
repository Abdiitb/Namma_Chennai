import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/auth-context';
import { useAuth } from '@/context/auth-context';
import { ThemeProvider } from '@react-navigation/native';
import { YellowBlackTheme, ThemeColors } from '@/constants/theme';
import type { ZeroOptions } from '@rocicorp/zero';
import { expoSQLiteStoreProvider } from '@rocicorp/zero/expo-sqlite';
import { ZeroProvider } from '@rocicorp/zero/react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';
import { schema } from '@/zero/schema';
import { mutators } from '@/zero/mutators';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Only provide context and providers, no conditional rendering here
  return (
    <AuthProvider>
      <InnerRootLayout colorScheme={colorScheme ?? 'light'} />
    </AuthProvider>
  );
}

function InnerRootLayout({ colorScheme }: { colorScheme: string }) {
  const { user } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ThemeColors.black }} edges={['top', 'left', 'right', 'bottom']}>
      <ZeroProvider
        schema={schema}
        mutators={mutators}
        userID={user ? user.id : 'anon'}
        auth={user?.token ?? ''}
        server={Platform.OS === 'web' ? 'http://localhost:4848' : 'http://10.64.50.83:4848'}
        kvStore={Platform.OS !== 'web' ? expoSQLiteStoreProvider() : 'idb'}
      >
        <ThemeProvider value={YellowBlackTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="create-ticket" options={{ presentation: 'modal' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </ZeroProvider>
    </SafeAreaView>
  );
}
