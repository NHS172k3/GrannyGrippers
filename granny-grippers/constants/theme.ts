export const COLORS = {
  brand: '#FF7B5C',
  brandLight: '#FF7B5C20',
  brandBorder: '#FF7B5C40',

  success: '#4ECDC4',
  successLight: '#4ECDC420',
  danger: '#FF4757',
  dangerLight: '#FF475720',
  warning: '#FFA502',
  warningLight: '#FFA50220',
  info: '#3B8BD4',

  bg: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F3F5',
  border: 'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.14)',

  textPrimary: '#1A1D23',
  textSecondary: '#6B7280',
  textMuted: '#A4B0BE',
} as const;

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const COLOR_VARIANT_MAP = {
  success: { bg: COLORS.successLight, text: COLORS.success, border: COLORS.success },
  danger: { bg: COLORS.dangerLight, text: COLORS.danger, border: COLORS.danger },
  warning: { bg: COLORS.warningLight, text: COLORS.warning, border: COLORS.warning },
  brand: { bg: COLORS.brandLight, text: COLORS.brand, border: COLORS.brandBorder },
  neutral: { bg: COLORS.surfaceMuted, text: COLORS.textSecondary, border: COLORS.border },
} as const;
