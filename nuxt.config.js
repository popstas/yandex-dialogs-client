const nodeExternals = require('webpack-node-externals');
const bodyParser = require('body-parser');

module.exports = {
  // mode: 'spa',
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    production: process.env.NODE_ENV === "production",
    isProxy: process.env.IS_PROXY === "1"
  },

  modules: [
    '@nuxtjs/axios',
    ['@nuxtjs/pwa', { icon: false }]
  ],

  css: [
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/display.css'
  ],

  plugins: [
    '@/plugins/element-ui',
    '@/plugins/vue-awesome'
  ],

  serverMiddleware: [
    bodyParser.json(),
    { path: '/api/request', handler: '~/api/index.js' },
  ],

  axios: {
    baseURL: process.env.baseUrl
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'yandex-dialogs-client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Клиент для работы с навыками Яндекс.Диалогов Алисы локально' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient, isServer  }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vue-awesome/]
          })
        ]
      }
    }
  }
}
