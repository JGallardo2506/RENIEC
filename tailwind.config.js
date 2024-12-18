module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        gradient: 'gradient 3s ease infinite', // Animación de gradiente
      },
      keyframes: {
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
