import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { useUserStore } from '@/stores/userStore';

export function OnboardingRoute() {
  const isNewUser = useUserStore((state) => state.isNewUser);

  if (isNewUser) {
    return <OnboardingPage />;
  }

  return <OnboardingPage />;
}

export default OnboardingRoute;
