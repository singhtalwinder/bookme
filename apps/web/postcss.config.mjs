/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'oklab-function': true,
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;

