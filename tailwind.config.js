/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
      "./app.vue",
    ],
    theme: {
      extend: {
        colors: {
          'brand-primary': '#6D28D9', // Ajuste para o roxo principal
          'brand-primary-light': '#8B5CF6',
          'brand-background': '#F3F4F6', // Fundo claro principal
          'brand-header': '#1F2937',   // Fundo escuro do header
          'brand-card': '#FFFFFF',      // Fundo do card
          'brand-text-dark': '#E5E7EB', // Texto no fundo escuro
          'brand-text-light': '#1F2937', // Texto no fundo claro
        },
      },
    },
    plugins: [],
  }