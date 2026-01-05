import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/auth-context';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';

export default function AuthLayout() {
    const { user } = useAuth();

    console.log('AuthLayout rendered. User:', user);

    useEffect(() => {
        if (user) {
            console.log('User found, redirecting to main app');
            router.replace('/(tabs)');
        }
    }, [user]);

    if (user) {
        return null;
    }

    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#fff' },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
            </Stack>
        </>
    );
}
