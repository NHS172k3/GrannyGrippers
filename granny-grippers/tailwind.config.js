/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // ── Brand — burnt amber/sienna ────────────────────────────────────────
        brand:               '#C05E14',
        'brand-light':       'rgba(192,94,20,0.12)',
        'brand-border':      'rgba(192,94,20,0.32)',
        'dark-brand':        '#E07020',
        'dark-brand-light':  'rgba(224,112,32,0.22)',

        // ── Success — deep forest green ───────────────────────────────────────
        success:             '#166534',
        'success-light':     'rgba(22,101,52,0.12)',
        'dark-success':      '#16A34A',
        'dark-success-light':'rgba(22,163,74,0.22)',

        // ── Danger — deep brick red ───────────────────────────────────────────
        danger:              '#B91C1C',
        'danger-light':      'rgba(185,28,28,0.12)',
        'dark-danger':       '#DC2626',
        'dark-danger-light': 'rgba(220,38,38,0.22)',

        // ── Warning — deep amber ──────────────────────────────────────────────
        warning:             '#A15C07',
        'warning-light':     'rgba(161,92,7,0.12)',
        'dark-warning':      '#D97706',
        'dark-warning-light':'rgba(217,119,6,0.22)',

        info:                '#0C6E9E',

        // ── Light mode backgrounds — warm cream / paper ───────────────────────
        'gg-bg':             '#FAF7F3',
        surface:             '#FFFFFF',
        'surface-muted':     '#F2EDE5',

        // ── Dark mode backgrounds — warm near-black ───────────────────────────
        'dark-bg':           '#1A1310',
        'dark-surface':      '#26201A',
        'dark-surface-muted':'#352C22',

        // ── Light mode text — warm brown family ───────────────────────────────
        'text-primary':      '#1A140C',
        'text-secondary':    '#4A3B2C',
        'text-muted':        '#8C7B6A',

        // ── Dark mode text ────────────────────────────────────────────────────
        'dark-text-primary':  '#FAF7F3',
        'dark-text-secondary':'#D4C8BA',
        'dark-text-muted':    '#A0907E',

        // ── Borders — warm brown tints ────────────────────────────────────────
        'gg-border':         'rgba(26,18,10,0.10)',
        'gg-border-strong':  'rgba(26,18,10,0.22)',
        'dark-border':       'rgba(250,247,243,0.12)',
        'dark-border-strong':'rgba(250,247,243,0.24)',
      },
      fontFamily: {
        'nunito':          ['Nunito_400Regular'],
        'nunito-medium':   ['Nunito_500Medium'],
        'nunito-semibold': ['Nunito_600SemiBold'],
        'nunito-bold':     ['Nunito_700Bold'],
      },
    },
  },
  plugins: [],
};
