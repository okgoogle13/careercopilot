import { useMode } from '@/hooks/use-mode';

export const TokenTest = () => {
  const { mode, isGalleryMode, isLaboratoryMode } = useMode();

  return (
    <div
      className="
      bg-eucalypt-smoke
      text-parchment
      rounded-pebble
      p-lg
      shadow-rest
      hover:shadow-hover
      transition-all duration-medium ease-viscous
      font-field-note text-body-large
    "
    >
      <h2 className="font-proclamation text-display-small text-wattle-gold mb-4">
        Token System Test
      </h2>

      <div className="space-y-2">
        <p>
          Current Mode: <span className="font-annotation text-clinical-sage">{mode}</span>
        </p>
        <p>Gallery Mode: {isGalleryMode ? '✅' : '❌'}</p>
        <p>Laboratory Mode: {isLaboratoryMode ? '✅' : '❌'}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="
          bg-wattle-gold
          hover:bg-wattle-gold-glow
          text-specimen-night
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
          bg-waratah-crimson
          hover:bg-waratah-crimson-glow
          text-parchment
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
};
