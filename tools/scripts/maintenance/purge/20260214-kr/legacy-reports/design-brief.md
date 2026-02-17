CareerCopilot Design System 2.0

Theme: Authentic Intelligence (Expressive Cyber-Pop)

1. Mood Board: Authentic Intelligence

Keywords: Emotive • Fluid • Depth-Aware • Humanist • Unexpected • Pop

1.1 The Vibe (Visual Metaphor)

    •	Concept: "The Intelligent Workspace." It feels like a premium tool, but one that is alive. It breathes.
    •	Lighting: The interface is not "dark mode"; it is "deep space." It glows.
    •	The "Expressive Moment": We break the grid for moments of AI insight. When the AI speaks, the UI changes shape and font to signal a shift from "Data" to "Wisdom."

1.2 The Palette (Deep Space & Cyber-Pop)

    •	The Canvas (Tinted): The background is no longer black/grey. It is a very deep, desaturated Violet (#16131E). This creates a subconscious link between the background and the brand color.
    •	The Pop:
    ◦	Primary: #C4BFFF (Soft Electric Purple)
    ◦	Tertiary: #FFAEDC (Bubblegum Pink - used for "Magic")
    ◦	Secondary: #56DBBE (Mint - used for Success)

1.3 Typography (The Triad System)

We now use a three-font system to separate Structure (UI), Content (Reading), and Magic (Expressive moments).
1 Structure (UI): Roboto Flex
◦ Role: The reliable skeleton. Navigation, Labels, Data.
◦ Vibe: Efficient, modern.
2 Content (Voice): Roboto Serif
◦ Role: The human voice. AI responses, Resumes, Cover Letters.
◦ Vibe: Editorial, trustworthy, academic yet warm.
3 Magic (Expressive): Syne (New Addition)
◦ Role: The "Pop." Used only for "AI Insight" headers, "You're Hired" moments, or major feature announcements.
◦ Vibe: Art-school cool, geometric, unignorable.

2. Project Style Guide (M3_EXPRESSIVE.md)

1. Typography Strategy

Rule: Use Variable axes (wdth, GRAD) to animate text, making it feel like a living organism.

A. Font Import

HTML

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght,GRAD@8..144,25..151,100..1000,-200..150&family=Roboto+Serif:opsz,wght@8..144,400&family=Syne:wght@700;800&display=swap" rel="stylesheet">

B. Structure: Roboto Flex (Headings & UI)

Headings should feel "open" and confident. We use the Width axis to stretch them slightly.
• Usage: Page Titles, Card Headers, Buttons.
• Base Style:CSS font-family: 'Roboto Flex', sans-serif;
• font-weight: 650;
• font-variation-settings: 'wdth' 110, 'GRAD' 0; /_ 110 = Slightly Expanded _/
• letter-spacing: -0.02em;
•
• Interaction (The "Breathing" Hover):When hovering over a primary button or card, the text expands and gets heavier.CSS selector:hover {
• font-variation-settings: 'wdth' 120, 'GRAD' 50;
• transition: font-variation-settings 0.4s cubic-bezier(0.2, 0, 0, 1);
• }
•

C. Magic: Syne (The Expressive Moment)

    •	Usage: Only for the "AHA!" moments. E.g., The title of a card revealing a perfect job match, or the AI's opening greeting.
    •	Style:CSS font-family: 'Syne', sans-serif;
    •	font-weight: 700;
    •	font-size: 1.5rem; /* Needs to be large to work */
    •	color: var(--tertiary); /* Pink */
    •

2. Shape System ([DEPRECATED_STYLE] & Asymmetric)

We move away from standard rectangles to distinct shapes that tell the user what is "System" and what is "AI."
Token
Radius / Value
Usage
shape-md
12px
Inputs, Inner Chips
shape-lg
24px
Standard Cards. (Increased from 16px for friendliness)
shape-ai
28px 28px 4px 28px
AI Chat Bubbles. (Top-Left, Top-Right, Bottom-Right, Bottom-Left). The sharp corner points to the user (or origin).
shape-magic
clip-path: polygon(...)
The Starburst. (See JSON for expressive shape). Used for "Insight" badges.

3. Motion (Liquid Physics)

We reject the mechanical ease-out. We use Emphasized Decelerate. Things move quickly into place but slow down gracefully, like a card sliding across a velvet table.
• Token: motion-emphasized
• Value: cubic-bezier(0.2, 0.0, 0, 1.0)
• Duration: 400ms (Slightly slower to allow the eye to follow the morph).

4. Component Guidelines

The "Authentic Intelligence" Chat Card

This is the core "Expressive" component.
• Shape: shape-ai (Asymmetric).
• Background: surfaceContainerHigh (The Tinted Grey).
• Border: 2px Gradient Border (Purple to Pink) via mask-image or background-origin.
• Title Font: Syne (Bold, Extra-Bold).
• Body Font: Roboto Serif (Legible, Human).
• Motion: On load, it scales up using motion-emphasized.

3. Updated Color Theme JSON

Changes: The neutral and neutral-variant palettes have been shifted from Hue 0 (Grey) to approx Hue 265 (Deep Violet). This creates the "Tinted" dark mode.
JSON

{
"description": "Cyber-Pop Expressive (Tinted Neutrals)",
"seed": "#8A79F8",
"coreColors": {
"primary": "#8A79F8",
"secondary": "#56DBBE",
"tertiary": "#FFAEDC"
},
"extendedColors": [],
"schemes": {
"dark": {
"primary": "#C4BFFF",
"surfaceTint": "#C4BFFF",
"onPrimary": "#412DAB",
"primaryContainer": "#5844C3",
"onPrimaryContainer": "#E4DFFF",
"secondary": "#56DBBE",
"onSecondary": "#00382E",
"secondaryContainer": "#005143",
"onSecondaryContainer": "#7AF8DA",
"tertiary": "#FFAEDC",
"onTertiary": "#58144B",
"tertiaryContainer": "#712F62",
"onTertiaryContainer": "#FFD7EE",
"error": "#FFB4AB",
"onError": "#690005",
"background": "#16131E",
"onBackground": "#E8E0E9",
"surface": "#16131E",
"onSurface": "#E8E0E9",
"surfaceVariant": "#49454F",
"onSurfaceVariant": "#CAC4D0",
"outline": "#938F99",
"outlineVariant": "#49454F",
"inverseSurface": "#E6E1E5",
"inverseOnSurface": "#313033",
"surfaceContainerLowest": "#0F0D13",
"surfaceContainerLow": "#1D1B22",
"surfaceContainer": "#211F26",
"surfaceContainerHigh": "#2B2930",
"surfaceContainerHighest": "#36343B"
}
},
"palettes": {
"primary": {
"0": "#000000",
"10": "#10006E",
"20": "#28177D",
"30": "#412DAB",
"40": "#5844C3",
"80": "#C4BFFF",
"90": "#E4DFFF",
"100": "#FFFFFF"
},
"secondary": {
"0": "#000000",
"10": "#00211A",
"20": "#00382E",
"40": "#006C59",
"80": "#56DBBE",
"90": "#7AF8DA",
"100": "#FFFFFF"
},
"tertiary": {
"0": "#000000",
"10": "#23001F",
"20": "#3B0031",
"40": "#712F62",
"80": "#FFAEDC",
"90": "#FFD7EE",
"100": "#FFFFFF"
},
"neutral": {
"0": "#000000",
"10": "#1D1B22",
"20": "#322F37",
"30": "#49464E",
"40": "#605D66",
"50": "#797680",
"60": "#93909A",
"70": "#AEAAB4",
"80": "#CAC5D0",
"90": "#E8E0E9",
"95": "#F6EEF8",
"99": "#FFFBFF",
"100": "#FFFFFF"
},
"neutral-variant": {
"0": "#000000",
"10": "#1E1A22",
"20": "#332F38",
"30": "#4A454F",
"40": "#625D67",
"50": "#7B7580",
"60": "#958F9A",
"80": "#CBC4D0",
"90": "#E8E0EB",
"100": "#FFFFFF"
}
}
}
