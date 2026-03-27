/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: '#FF7B5C',
        'brand-light': 'rgba(255,123,92,0.13)',
        'brand-border': 'rgba(255,123,92,0.25)',
        success: '#4ECDC4',
        'success-light': 'rgba(78,205,196,0.13)',
        danger: '#FF4757',
        'danger-light': 'rgba(255,71,87,0.13)',
        warning: '#FFA502',
        'warning-light': 'rgba(255,165,2,0.13)',
        info: '#3B8BD4',
        'gg-bg': '#F8F9FA',
        surface: '#FFFFFF',
        'surface-muted': '#F1F3F5',
        'text-primary': '#1A1D23',
        'text-secondary': '#6B7280',
        'text-muted': '#A4B0BE',
        'gg-border': 'rgba(0,0,0,0.08)',
        'gg-border-strong': 'rgba(0,0,0,0.14)',
      },
      fontFamily: {
        'nunito': ['Nunito_400Regular'],
        'nunito-medium': ['Nunito_500Medium'],
        'nunito-semibold': ['Nunito_600SemiBold'],
        'nunito-bold': ['Nunito_700Bold'],
      },
    },
  },
  plugins: [],
};
