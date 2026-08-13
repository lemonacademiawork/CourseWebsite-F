---
name: Citrus Atelier
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4c4636'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#7e7764'
  outline-variant: '#cfc6b0'
  surface-tint: '#715c00'
  primary: '#715c00'
  on-primary: '#ffffff'
  primary-container: '#f4d35e'
  on-primary-container: '#6e5a00'
  inverse-primary: '#e4c451'
  secondary: '#94492c'
  on-secondary: '#ffffff'
  secondary-container: '#fe9d7a'
  on-secondary-container: '#773318'
  tertiary: '#486459'
  on-tertiary: '#ffffff'
  tertiary-container: '#bddcce'
  on-tertiary-container: '#466257'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe17a'
  primary-fixed-dim: '#e4c451'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#554500'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59b'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#763217'
  tertiary-fixed: '#cae9db'
  tertiary-fixed-dim: '#afcdc0'
  on-tertiary-fixed: '#042018'
  on-tertiary-fixed-variant: '#314c42'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The design system is built on a "Modern Craft Studio" aesthetic. It balances the precision of a high-end digital academy with the tactile, warm soul of a creative workshop. The visual direction avoids the clinical nature of traditional EdTech, instead favoring an editorial and artistic atmosphere that inspires creation.

The style is a blend of **Soft Minimalism** and **Tactile Modernism**. It utilizes expansive whitespace (creamy off-whites), organic elevation, and a sophisticated typographic hierarchy to guide students through their creative journey. The emotional goal is to feel premium, calm, and deeply encouraging.

## Colors

This color palette is inspired by natural pigments and Mediterranean light.
- **Primary (Lemon Zest):** A soft, sophisticated citrus yellow used for high-visibility actions and progress highlights.
- **Secondary (Terracotta):** A warm earthy tone used for secondary actions and artistic accents.
- **Tertiary (Sage):** A grounding, organic green used for success states and community-oriented elements.
- **Background (Cream):** A warm off-white `#FDFBF7` serves as the primary canvas to reduce eye strain and feel more like high-quality paper than a screen.
- **Typography (Deep Charcoal):** `#2D2D2D` provides high contrast while remaining softer and more "ink-like" than pure black.

## Typography

The typography strategy employs a classic serif/sans-serif pairing to distinguish between "Inspiration" and "Instruction."
- **Headlines:** Use *Playfair Display*. Its high stroke contrast and elegant terminals provide a literary, premium feel. 
- **Body & Interface:** Use *Inter*. It offers exceptional legibility at smaller sizes and a clean, neutral character that doesn't compete with the artistic headlines.
- **Labels:** Use uppercase *Inter* with slight letter-spacing for navigation and metadata to create a structured, organized feel within the creative chaos.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** with generous inner padding to reinforce the "Studio" vibe. 
- **Rhythm:** Use an 8px base unit. Component internal padding should favor larger values (e.g., 24px or 32px) to ensure elements have "room to breathe."
- **Desktop:** 12-column grid with 24px gutters.
- **Mobile:** Single column with 20px side margins. 
- **Safe Areas:** Large-scale sections should be separated by substantial vertical white space (80px-120px) to allow the user's mind to reset between different types of content.

## Elevation & Depth

Depth is achieved through **Organic Ambient Shadows** and **Tonal Layering** rather than harsh borders.
- **Surface Strategy:** The base layer is the Cream background. Raised cards use a white background with a very soft, multi-layered shadow (0px 4px 20px rgba(45, 45, 45, 0.05)).
- **Interactions:** On hover, cards should lift slightly (y-offset decreases, blur increases) to simulate a physical paper or canvas being picked up.
- **Dividers:** Instead of solid lines, use low-opacity Sand (`#E9D8C4`) strokes or subtle organic flourishes to separate sections.

## Shapes

The shape language is defined by **Soft, Intentional Curves**.
- **Standard Radius:** 16px for most containers and cards to evoke a friendly, approachable feel.
- **Large Radius:** 24px or 32px for featured hero cards or large image containers.
- **Small Radius:** 8px for input fields and smaller utility buttons.
- **Buttons:** Use a hybrid approach; primary buttons can be slightly more rounded (Pill-shaped) than functional interface cards to make them feel more tactile and "clickable."

## Components

### Course Cards
Cards utilize a white background against the off-white page. They feature a 16px corner radius and a subtle "Sage" or "Terracotta" tag for category identification. The course title uses *Playfair Display* for a premium editorial look.

### Dashboard Navigation
The sidebar is minimalist. It uses the Sand tone for the background to separate it from the main content area. Active states are indicated by a Lemon primary color vertical bar and a subtle shift in text weight.

### Progress Indicators
Progress is tracked using thick, soft-rounded bars. The "track" is a light version of Sand, and the "fill" is Lemon primary. This provides a high-contrast but warm visual cue of achievement.

### Buttons
- **Primary (Enroll):** Lemon background with Charcoal text. Bold and high-contrast.
- **Secondary (Start Learning):** Terracotta background with White text. Warm and inviting.
- **Ghost:** Charcoal outline (1px) with transparent center for less critical actions.

### Data Tables
Tables for admin use should be "Border-light." Rows are separated by 1px Sand lines. Use the Charcoal text for headers in *Label-md* style. Row hover states should use a very faint Lemon tint.

### Community Gallery
Use an asymmetrical masonry grid or a clean square grid with 24px gaps. Each item in the gallery should have a slight 4px radius and a subtle "lifting" animation on hover to celebrate the student's work.
