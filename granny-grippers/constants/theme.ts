export const COLORS = {
  // Brand — burnt amber/sienna (warm, premium, distinctive)
  brand:        '#C05E14',
  brandLight:   'rgba(192,94,20,0.12)',
  brandBorder:  'rgba(192,94,20,0.32)',

  // Success — deep forest green (Start, Connected)
  success:      '#166534',
  successLight: 'rgba(22,101,52,0.12)',

  // Danger — deep brick red (Stop, Disconnected)
  danger:       '#B91C1C',
  dangerLight:  'rgba(185,28,28,0.12)',

  // Warning — deep amber (caution states)
  warning:      '#A15C07',
  warningLight: 'rgba(161,92,7,0.12)',

  // Info
  info:         '#0C6E9E',

  // Backgrounds — warm cream / paper
  bg:           '#FAF7F3',
  surface:      '#FFFFFF',
  surfaceMuted: '#F2EDE5',

  // Borders — warm brown tint
  border:       'rgba(26,18,10,0.10)',
  borderStrong: 'rgba(26,18,10,0.22)',

  // Text — warm brown family
  textPrimary:   '#1A140C',
  textSecondary: '#4A3B2C',
  textMuted:     '#8C7B6A',
} as const;

// Dark mode counterparts — warm near-black, NOT cold gray
export const DARK_COLORS = {
  brand:        '#E07020',   // brighter amber on dark bg
  brandLight:   'rgba(224,112,32,0.22)',
  brandBorder:  'rgba(224,112,32,0.40)',

  success:      '#16A34A',
  successLight: 'rgba(22,163,74,0.22)',

  danger:       '#DC2626',
  dangerLight:  'rgba(220,38,38,0.22)',

  warning:      '#D97706',
  warningLight: 'rgba(217,119,6,0.22)',

  info:         '#38BDF8',

  bg:           '#1A1310',   // very deep warm brown-black
  surface:      '#26201A',   // warm dark card surface
  surfaceMuted: '#352C22',   // warm dark muted

  border:       'rgba(250,247,243,0.12)',
  borderStrong: 'rgba(250,247,243,0.24)',

  textPrimary:   '#FAF7F3',
  textSecondary: '#D4C8BA',
  textMuted:     '#A0907E',
} as const;

export const RADIUS  = { sm: 10, md: 14, lg: 18, xl: 26 } as const;
export const SPACING = { xs: 4, sm: 8, md: 14, lg: 20, xl: 28, xxl: 36 } as const;

export const COLOR_VARIANT_MAP = {
  success: { bg: COLORS.successLight, text: COLORS.success, border: COLORS.success },
  danger:  { bg: COLORS.dangerLight,  text: COLORS.danger,  border: COLORS.danger  },
  warning: { bg: COLORS.warningLight, text: COLORS.warning, border: COLORS.warning },
  brand:   { bg: COLORS.brandLight,   text: COLORS.brand,   border: COLORS.brandBorder },
  neutral: { bg: COLORS.surfaceMuted, text: COLORS.textSecondary, border: COLORS.border },
} as const;
