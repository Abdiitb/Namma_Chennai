import { AuthProvider } from '@/context/auth-context';
import { useAuth } from '@/context/auth-context';
import { ThemeProvider } from '@react-navigation/native';
import { YellowBlackTheme, ThemeColors } from '@/constants/theme';
import { expoSQLiteStoreProvider } from '@rocicorp/zero/expo-sqlite';
import { ZeroProvider } from '@rocicorp/zero/react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { schema } from '@/zero/schema';
import { mutators } from '@/zero/mutators';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Only provide context and providers, no conditional rendering here
  return (
    <AuthProvider>
      <InnerRootLayout />
    </AuthProvider>
  );
}

function InnerRootLayout() {
  const { user } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ThemeColors.background }} edges={['top', 'left', 'right', 'bottom']}>
      <ZeroProvider
        schema={schema}
        mutators={mutators}
        userID={user ? user.id : 'anon'}
        auth={user?.token ?? ''}
        server={Platform.OS === 'web' ? 'http://localhost:4848' : 'http://10.64.83.0:4848'}
        kvStore={Platform.OS !== 'web' ? expoSQLiteStoreProvider() : 'idb'}
      >
        <ThemeProvider value={YellowBlackTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="create-ticket" options={{ presentation: 'modal' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </ZeroProvider>
    </SafeAreaView>
  );
}
