import { Stack } from 'expo-router';

export default function TicketsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="tickets" />
      <Stack.Screen name="ticket-details" />
      <Stack.Screen name="assigned-ticket-detail" />
    </Stack>
  );
}
