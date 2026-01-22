import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexScreen() {
  useEffect(() => {
    // Redirect to home tab on mount
    router.replace('/(tabs)/home');
  }, []);

  return null;
}
