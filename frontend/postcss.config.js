export default {
  plugins: {
    autoprefixer: {},
    '@csstools/postcss-global-data': {
      files: ['./src/infrastructure/ui/app/css/media.css'],
    },
    'postcss-custom-media': {},
  },
}
