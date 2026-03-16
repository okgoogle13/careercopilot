import { Navigate } from 'react-router-dom';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { useUserStore } from '@/stores/userStore';

export function OnboardingRoute() {
  const isNewUser = useUserStore((state) => state.isNewUser);

  if (isNewUser) {
    return (
      <Navigate
        to="/welcome"
        replace
      />
    );
  }

  return <OnboardingPage />;
}

export default OnboardingRoute;
