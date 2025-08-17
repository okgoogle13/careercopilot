// src/components/ProfileCard.tsx
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * A component that displays the user's profile information
 */
export default function ProfileCard(): JSX.Element {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load profile'));
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) {
    return <div className="profile-card loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-card error">Error: {error.message}</div>;
  }

  if (!profile) {
    return <div className="profile-card empty">No profile data available</div>;
  }

  return (
    <div className="profile-card">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
      </div>
    </div>
  );
}
