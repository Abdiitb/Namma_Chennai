import { router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {

  const colorScheme = useColorScheme();
  const { user } = useAuth();

  console.log('TabLayout rendered. User:', user, 'Color Scheme:', colorScheme);

  console.log('User:', user)

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to /auth');
      router.replace('/(auth)');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD600',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#1A1A1A',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="issues"
        options={{
          title: 'Issues',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'warning' : 'warning-outline'} size={24} color={color} />
          ),

        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tabs
        }}
      />

      <Tabs.Screen
        name="(tickets)/ticket-details"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />

      {/* Citizen: Show "My Tickets" tab */}
      <Tabs.Screen
        name="(tickets)/tickets"
        options={{
          title: 'My Tickets',
          href: user?.role === 'citizen' ? '/(tabs)/(tickets)/tickets' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Staff/Supervisor: Show "Assigned Tickets" tab */}
      <Tabs.Screen
        name="(tickets)/tickets-assigned"
        options={{
          title: 'Tickets',
          href: user?.role !== 'citizen' ? '/(tabs)/(tickets)/tickets-assigned' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tickets)/assigned-ticket-detail"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
    </Tabs>
  );
}
