import { router } from 'expo-router';

// Redirect to the registration flow
export default function GrievanceIndex() {
  router.replace('/public-grievance/register-complaint/personal-details');
  return null;
}

