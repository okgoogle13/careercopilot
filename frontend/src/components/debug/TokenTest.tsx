import { useMode } from '@/hooks/use-mode';

export const TokenTest = () => {
<<<<<<< HEAD
  const { mode, isGalleryMode, isLaboratoryMode } = useMode();
=======
  const { mode, isKrDarkMode } = useMode();
>>>>>>> restoration-KR-Rage-Figma-v2.0

  return (
    <div
      className="
<<<<<<< HEAD
      bg-eucalypt-smoke
      text-parchment
=======
      bg-concrete-grey
      text-paper-white
>>>>>>> restoration-KR-Rage-Figma-v2.0
      rounded-pebble
      p-lg
      shadow-rest
      hover:shadow-hover
      transition-all duration-medium ease-viscous
      font-field-note text-body-large
    "
    >
<<<<<<< HEAD
      <h2 className="font-proclamation text-display-small text-wattle-gold mb-4">
=======
      <h2 className="font-proclamation text-display-small text-ink-gold mb-4">
>>>>>>> restoration-KR-Rage-Figma-v2.0
        Token System Test
      </h2>

      <div className="space-y-2">
        <p>
          Current Mode: <span className="font-annotation text-clinical-sage">{mode}</span>
        </p>
<<<<<<< HEAD
        <p>Gallery Mode: {isGalleryMode ? '✅' : '❌'}</p>
        <p>Laboratory Mode: {isLaboratoryMode ? '✅' : '❌'}</p>
=======
        <p>KrDark Mode: {isKrDarkMode ? '✅' : '❌'}</p>
>>>>>>> restoration-KR-Rage-Figma-v2.0
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="
<<<<<<< HEAD
          bg-wattle-gold
          hover:bg-wattle-gold-glow
          text-specimen-night
=======
          bg-ink-gold
          hover:bg-ink-gold-glow
          text-asphalt-black
>>>>>>> restoration-KR-Rage-Figma-v2.0
          rounded-leaf
          px-5 py-2.5
          font-field-note font-semibold
          transition-all duration-short ease-viscous
          shadow-glow-gold
        "
        >
          Primary Button
        </button>

        <button
          className="
<<<<<<< HEAD
          bg-waratah-crimson
          hover:bg-waratah-crimson-glow
          text-parchment
=======
          bg-solidarity-red
          hover:bg-solidarity-red-glow
          text-paper-white
>>>>>>> restoration-KR-Rage-Figma-v2.0
          rounded-petal
          px-4 py-2
          font-field-note font-medium
          transition-all duration-short ease-precise
        "
        >
          Tertiary Button
        </button>
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> restoration-KR-Rage-Figma-v2.0
