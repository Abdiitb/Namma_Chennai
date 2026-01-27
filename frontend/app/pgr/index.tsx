import { router } from 'expo-router';

// Redirect to the registration flow
export default function PGRIndex() {
  router.replace('/pgr/register-complaint/personal-details');
  return null;
}
