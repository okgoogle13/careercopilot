import { Nabla, Roboto_Flex, Roboto_Serif } from 'next/font/google';

// TIER 1: THE HOLOGRAM
export const fontHologram = Nabla({
  subsets: ['latin'],
  variable: '--font-hologram',
  display: 'swap',
  // Nabla is a color font, requires specific palette support in CSS
});

// TIER 2 & 4: HERO + DATA
export const fontHero = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-hero',
  display: 'swap',
  axes: ['wdth', 'YTUC', 'XTRA', 'GRAD', 'opsz'] // Essential for the "Architect" config
});

// TIER 3: THE VOICE (Human)
export const fontHuman = Roboto_Serif({
  subsets: ['latin'],
  variable: '--font-human',
  display: 'swap',
  axes: ['wdth', 'GRAD', 'opsz']
});
