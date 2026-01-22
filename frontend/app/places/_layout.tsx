import { Stack } from 'expo-router';

export default function PlacesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[place_unique_name]" />
      <Stack.Screen 
        name="booking/select-guests" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="booking/select-datetime" 
        options={{ 
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="booking/review" 
        options={{ 
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}
