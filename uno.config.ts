import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      primary: '#0D9488', // teal-600
      secondary: '#6366F1', // indigo-500
      dark: '#1f2937', // gray-800
    },
  },
});
