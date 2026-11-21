---
name: StockAR Precision ERP
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#45464d'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-tabular:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-performance, ultra-clean aesthetic tailored for enterprise-grade industrial inventory and logistics management. The design language moves away from bloated SaaS conventions, ditching gradient fills, hyper-saturated status badges, and decorative drop shadows in favor of surgical precision, functional minimalism, and deliberate whitespace.

The emotional objective is clarity under pressure: warehouse controllers, supply chain directors, and plant managers interact with thousands of line items daily; the interface must feel quiet, authoritative, and frictionless.

- **Style Definition:** High-density functional minimalism paired with architectural structure.
- **Visual Discipline:** Form strictly follows function. Visual hierarchy is established through typographic contrast, intentional proportional spacing, and subtle monolithic borders rather than container fills.
- **Aesthetic Tenet:** Strip every unnecessary decorative element. If a line, fill, or icon does not convey operational data or afford immediate physical interaction, it is eliminated.

## Colors

The color palette is deliberately subdued, built upon a spectrum of cold zinc neutrals, anchored by a deep industrial slate (`#0f172a`) as the primary commanding tone, with an understated electric cobalt (`#2563eb`) reserved strictly for active interactive states and critical system actions.

- **Primary (`#0f172a`):** Used for primary buttons, active structural navigation, authoritative headers, and high-emphasis data points.
- **Secondary / Action Accent (`#2563eb`):** Applied with disciplined restraint. Reserved for primary focus rings, selected table rows, active status indicators, and interactive links. Never used as large background washes.
- **Surface & Backgrounds:** The base canvas operates at pure white (`#ffffff`) or near-white zinc (`#fafafa`). Containers use `#ffffff` with fine 1px neutral borders (`#e4e4e7` / `#f4f4f5`) to define planes, completely avoiding tinted background blocks.
- **Semantic Status Signals:** Statuses must never rely on loud, heavy badge backgrounds. Instead, communicate status via a single 6px neutral/colored dot alongside low-contrast neutral text:
  - Nominal / In Stock: `#10b981` (Emerald)
  - Critical / Low Stock: `#ef4444` (Rose)
  - In Transit / Pending: `#f59e0b` (Amber)
  - Archived / Idle: `#71717a` (Zinc)

## Typography

The typographic hierarchy prioritizes rapid scanning, scannable industrial codes, and numeric tabular precision.

- **Primary Hierarchy (`Geist`):** Delivers geometric precision and tight tracking for dashboard headers, layout titles, and dense form elements. It reduces visual drag across tabular layouts.
- **Monospaced Hierarchy (`JetBrains Mono`):** Dedicated to SKUs, serial codes, rack/bin designations, lot numbers, timestamps, and financial or quantity metrics. Tabular figures must be enabled by default (`tnum`) across all inventory tables to guarantee that numerical values align vertically without shift.
- **Scale Usage:**
  - `headline-xl` is reserved for macro-level views (e.g., Facility Overview, Master Stock Directory).
  - `label-caps` is utilized exclusively for metadata keys, table column headers (all-caps), and section markers.
  - `label-tabular` governs stock counts, delta changes, and unit values.

## Layout & Spacing

The layout model is anchored on an 8px base rhythmic grid paired with a high-whitespace, 12-column fluid grid system.

- **Canvas & Structure:**
  - Desktop screens leverage a fixed 240px or 64px collapsed vertical navigation rail, with the main content area expanding fluidly up to an unbounded canvas with `2rem` outer padding.
  - Generous internal padding prevents visual fatigue: dashboard modules use `space-lg` (`1.5rem`) internal breathing room rather than compact crowding.
- **Breakpoints & Adaptations:**
  - **Desktop (1280px+):** Full 12-column matrix with `1.5rem` gutters. Tables show multi-tier metadata (SKU, Category, Bin, Qty, Status, Velocity).
  - **Tablet (768px - 1279px):** 8-column layout. Secondary table columns collapse into expandable drawers or inline tooltips; gutters compress to `1rem`.
  - **Mobile (<768px):** Single-column layout. Margin shrinks to `1rem`. Tables switch to stacked, high-contrast monospace summary strips with swipe gestures for bin verification.

## Elevation & Depth

This design system rejects heavy drop shadows, fuzzy ambient glows, and skeuomorphic gradients. Elevation is communicated through micro-borders and disciplined tonal surfaces.

- **Border-Driven Architecture:** All card containers, dialogs, and table structures exist on a single 1px hairline perimeter (`#e4e4e7` in standard lighting). Contrast between planes is determined by pure white container fills (`#ffffff`) hovering over off-white staging grounds (`#fafafa`).
- **Layer Stacking (Z-Index Elevation):**
  - **Level 0 (Floor):** Canvas background (`#fafafa` / `#f4f4f5`).
  - **Level 1 (Panels & Cards):** Flat `#ffffff` surface, bounded by 1px solid `#e4e4e7`. No shadow.
  - **Level 2 (Hover States & Flyouts):** Flat `#ffffff` surface with a subtle 1px border (`#d4d4d8`) and an imperceptible micro-shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.04)`.
  - **Level 3 (Modals & Overlays):** Solid `#ffffff` container enclosed by 1px `#cbd5e1`, supported by an understated structural shadow: `0 8px 24px -4px rgba(15, 23, 42, 0.08)`. Modals deploy over a sheer, low-opacity scrim (`rgba(15, 23, 42, 0.25)`) with an instantaneous 2px backdrop blur.

## Shapes

The geometry of the interface relies on sharp, architectural micro-radii to communicate efficiency and industrial precision.

- **Default Curvature (`0.25rem` / 4px):** Used across all functional inputs, standard buttons, notification cards, and data table containers.
- **Mid-Tier Elements (`0.5rem` / 8px):** Applied exclusively to floating modals, slide-out configuration panels, and complex flyout menus.
- **Pill Geometry:** Circular or fully rounded forms (`rounded-full`) are strictly forbidden except for:
  - 6px status indicators (dots).
  - Avatar initials or warehouse locator tags where spherical geometry serves as an immediate visual differentiator from square interactive components.

## Components

### Buttons
- **Primary:** Background `#0f172a`, foreground `#ffffff`, 0.25rem corner radius, padding `0.5rem 1rem`. Typography is `body-md` (medium weight). On hover: `#1e293b`. Focus ring: 2px offset with `#2563eb`.
- **Secondary / Outlined:** Background `#ffffff`, border 1px solid `#e4e4e7`, foreground `#0f172a`. Hover: `#f4f4f5` background with `#d4d4d8` border.
- **Ghost / Tertiary:** No border, background transparent, foreground `#71717a`. Hover: `#f4f4f5`, foreground `#0f172a`.
- **Destructive:** Border 1px solid `#fecaca`, background `#ffffff`, foreground `#dc2626`. Hover: background `#fef2f2`.

### Data Tables (Core Inventory View)
- **Header:** Background `#fafafa`, 1px solid border bottom (`#e4e4e7`). Typography: `label-caps`, color `#71717a`. Padding: `0.75rem 1rem`.
- **Rows:** Background `#ffffff`, border-bottom 1px solid `#f4f4f5`. Row hover: `#fafafa` with immediate ease. Padding: `0.75rem 1rem`.
- **Numeric Cells:** Rigorously styled with `label-tabular` in `JetBrains Mono` and right-aligned.

### Status Indicators & Pills
- Status elements abandon saturated, solid-colored background blocks.
- **Structure:** Transparent or subtle `#f4f4f5` background, 1px solid `#e4e4e7` border, 4px border radius. Internal layout houses a 6px circular indicator dot followed by standard `body-sm` text in `#3f3f46`.
- **Active State:** A single `#10b981` dot + "In Stock". Critical State: A single `#ef4444` dot + "Depleted".

### Input Fields & Controls
- **Inputs:** Background `#ffffff`, border 1px solid `#e4e4e7`, height 36px, horizontal padding `0.75rem`, font `body-md`. Focus state uses border color `#0f172a` with zero outer glowing halos, or a crisp 1px `#2563eb` outline.
- **Checkboxes & Radios:** 16px square/circle with 1px `#d4d4d8` border. Selected state fills with `#0f172a` housing a pure white checkmark.

### Dashboard Metric Cards
- Background pure `#ffffff`, bounded by 1px solid `#e4e4e7`, zero elevation shadows. Padding is `space-lg` (`1.5rem`).
- Typography layout: Top label in `label-caps` (`#71717a`), primary metric below in `headline-xl` or `headline-lg` (`#0f172a`), secondary trend text underneath in `label-tabular` (`#10b981` for upward efficiency, `#71717a` for neutral drift).

### Warehouse Locator & SKU Badges
- Dedicated component for stock locations (e.g., `WH-02 // AISLE-4B // BIN-12`). Rendered in `label-code` (`JetBrains Mono`), background `#f4f4f5`, border 1px solid `#e4e4e7`, padding `2px 6px`.