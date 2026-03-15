PAGE: Landing Page Hero

SECTION: Hero Section
LAYOUT:
  - Container: max-w-7xl mx-auto px-6 lg:px-12 py-24
  - Grid: max-w-3xl flex flex-col gap-8
  - Button Group: flex flex-wrap gap-4
  - H1: "Career Applications, Perfected" [strike, --font-display, --worker-ash]
    - Style: text-5xl lg:text-7xl font-bold leading-tight
    NOTES: States: default | Intent: Fraunces variable font (wght 900, SOFT 80, WONK 1) creates extreme M3 Expressive contrast. Hero statement anchors emotional defiance register.
  - Text: "ATS-optimized resumes, compelling cover letters, and strategic job discovery—all in one platform." [march, --font-primary, --worker-ash]
    NOTES: States: default | Intent: March archetype for explanatory flow. Work Sans body text provides clarity against dark background.
  - Button: "Get Started" → /register [strike, --font-primary, --ink-gold]
    - Style: px-6 py-3 rounded-none font-bold uppercase tracking-wider bg-[var(--ink-gold)] text-[var(--surface-step-0)]
    NOTES: States: all | Intent: Primary Strike archetype with high-contrast inkGold on charcoal. M3 Expressive spring physics on hover reinforces action confidence. | Hover: bg-opacity-90 scale-105 | Focus: ring-2 ring-offset-2 ring-[var(--ink-gold)]
  - Button: "Learn More" → /about [strike, --font-primary, --worker-ash]
    - Style: px-6 py-3 rounded-none font-bold uppercase tracking-wider bg-[var(--ink-gold)] text-[var(--surface-step-0)]
    NOTES: States: all | Intent: Ghost variant provides lower-hierarchy alternative. Maintains M3 Expressive affordance without visual dominance. | Hover: bg-opacity-90 scale-105 | Focus: ring-2 ring-offset-2 ring-[var(--ink-gold)]

SECTION: Feature Strip
LAYOUT:
  - Container: max-w-7xl mx-auto px-6 lg:px-12 py-16
  - Grid: grid-cols-1 md:grid-cols-3 gap-6
  - Card: "ATS Optimization" → /features [placard, --font-primary, --surface-step-0]
    - Style: rounded-2xl border border-[var(--surface-step-2)] bg-[var(--surface-step-1)] p-6 shadow-sm transition-all duration-400
    - Icon: CheckCircle (lucide-react, 32px, --solidarity-red)
    - Title: "ATS Optimization" [strike, --font-display, --worker-ash, text-2xl]
    - Body: "Resumes optimized for applicant tracking systems to maximize interview callbacks." [march, --font-primary, --worker-ash, opacity-80]
    NOTES: States: default,hover,focus | Intent: Placard archetype for content framing. Asymmetric torn shape establishes tactile brand presence. | Hover: -translate-y-2 shadow-[var(--shadow-float)] border-[var(--solidarity-red)] | Focus: ring-2 ring-[var(--solidarity-red)] | Default Shadow: var(--shadow-pebble)
  - Card: "Smart Job Matching" → /features [placard, --font-primary, --surface-step-0]
    - Style: rounded-2xl border border-[var(--surface-step-2)] bg-[var(--surface-step-1)] p-6 shadow-sm transition-all duration-400
    - Icon: Target (lucide-react, 32px, --solidarity-red)
    - Title: "Smart Job Matching" [strike, --font-display, --worker-ash, text-2xl]
    - Body: "AI-powered job discovery aligned with your skills, values, and career goals." [march, --font-primary, --worker-ash, opacity-80]
    NOTES: States: default,hover,focus | Intent: Consistent Placard treatment for discovery. User scans features horizontally. | Hover: -translate-y-2 shadow-[var(--shadow-float)] border-[var(--solidarity-red)] | Focus: ring-2 ring-[var(--solidarity-red)] | Default Shadow: var(--shadow-pebble)
  - Card: "Curated Documents" → /features [placard, --font-primary, --surface-step-0]
    - Style: rounded-2xl border border-[var(--surface-step-2)] bg-[var(--surface-step-1)] p-6 shadow-sm transition-all duration-400
    - Icon: Files (lucide-react, 32px, --solidarity-red)
    - Title: "Curated Documents" [strike, --font-display, --worker-ash, text-2xl]
    - Body: "Craft compelling cover letters and application materials with AI guidance." [march, --font-primary, --worker-ash, opacity-80]
    NOTES: States: default,hover,focus | Intent: Final feature card completes visual trio. Placard consistency establishes cohesive discovery flow. | Hover: -translate-y-2 shadow-[var(--shadow-float)] border-[var(--solidarity-red)] | Focus: ring-2 ring-[var(--solidarity-red)] | Default Shadow: var(--shadow-pebble)

MOTION:
  - Easing: cubic-bezier(0.34, 1.56, 0.64, 1)

  Hero entrance (on page load):
    1. H1: translate-y-8 opacity-0 → translate-y-0 opacity-100
       Duration: 600ms, Delay: 0ms, Pattern: typeSpringSlam

    2. Body text: translate-y-8 opacity-0 → translate-y-0 opacity-90
       Duration: 800ms, Delay: 200ms, Pattern: dragSettle

    3. Button group: scale-95 opacity-0 → scale-100 opacity-100
       Duration: 800ms, Delay: 400ms, Pattern: dragSettle

  Feature cards (scroll-triggered):
    - Trigger: IntersectionObserver, 50% threshold
    - Stagger: 200ms per card (left to right)
    - Motion: translate-y-12 opacity-0 → translate-y-0 opacity-100
    - Duration: 800ms, Pattern: windFlutter

  Interactive states:
    - Button hover: scale-105, duration 300ms
    - Card hover: -translate-y-2, shadow-[var(--shadow-float)], duration 400ms
