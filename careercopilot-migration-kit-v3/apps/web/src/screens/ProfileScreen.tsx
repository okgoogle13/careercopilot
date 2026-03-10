import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function ProfileScreen() {
  return (
    <section
      className="placeholder-screen"
      data-testid="profile-screen"
    >
      <Strike eyebrow="Generated Screen">
        This screen was generated from the LoginScreen migration pattern.
      </Strike>
      <Placard title="Profile Screen">
        <March>Semantic tokens only. Legacy fallback stays available until the flag flips.</March>
        <p className="status-copy">
          Generated placeholder for the /profile route. Connect feature-specific content in the next migration pass.
        </p>
      </Placard>
    </section>
  );
}
