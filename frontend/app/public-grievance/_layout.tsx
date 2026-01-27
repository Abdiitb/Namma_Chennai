import { Stack } from 'expo-router';

export default function GrievanceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register-complaint/personal-details" />
      <Stack.Screen name="register-complaint/location-details" />
      <Stack.Screen name="register-complaint/complaint-type" />
      <Stack.Screen name="register-complaint/review" />
      <Stack.Screen name="register-complaint/success" />
    </Stack>
  );
}

