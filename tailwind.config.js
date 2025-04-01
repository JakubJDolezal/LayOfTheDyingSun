// tailwind.config.js
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}', // Adjust based on your file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'serif'], // override serif or make a new key like 'reader'
        reader: ['Newsreader', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"], // or your own theme config
  },
}