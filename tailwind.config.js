module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes').light,
          primary: '#191E24',
          accent: '#3b82f680',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes').dark,
          primary: '#ECF2FF',
          accent: '#3b82f680',
          'base-content': '#ffffff',
        },
      },
    ],
  },
};
