import { useMode } from '@/hooks/use-mode';

export const TokenTest = () => {
  const { mode, isKrDarkMode } = useMode();

  return (
    <div
      className="
      bg-concrete-grey
      text-paper-white
      rounded-pebble
      p-lg
      shadow-rest
      hover:shadow-hover
      transition-all duration-medium ease-viscous
      font-field-note text-body-large
    "
    >
      <h2 className="font-proclamation text-display-small text-ink-gold mb-4">
        Token System Test
      </h2>

      <div className="space-y-2">
        <p>
          Current Mode: <span className="font-annotation text-clinical-sage">{mode}</span>
        </p>
        <p>KrDark Mode: {isKrDarkMode ? '✅' : '❌'}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="
          bg-ink-gold
          hover:bg-ink-gold-glow
          text-asphalt-black
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
          bg-solidarity-red
          hover:bg-solidarity-red-glow
          text-paper-white
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
