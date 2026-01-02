import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import type { ZeroOptions } from '@rocicorp/zero';
import { expoSQLiteStoreProvider } from '@rocicorp/zero/expo-sqlite';
import { ZeroProvider } from '@rocicorp/zero/react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { schema } from '../zero/schema';

const opts: ZeroOptions = {
  schema,
  userID: 'anon',
  // cacheURL removed - using local-only storage for development
  server: Platform.OS === 'web' ? 'http://localhost:4848' : 'http://10.5.48.28:4848',
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  console.log('=== RootLayout ZeroProvider Setup ===');
  console.log('Platform.OS:', Platform.OS);
  console.log('Zero options:', opts);
  console.log('KV Store:', Platform.OS !== 'web' ? 'expo-sqlite' : 'idb');

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
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ZeroProvider>
  );
}
