import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  ssr: false,
  loadingIndicator: {
    name: 'circle',
    color: '#1565C0',
    background: '#212121',
  },
  axios: {
    baseURL: process.env.BASE_URL, // Used as fallback if no runtime config is provided
  }, 
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - time',
    title: 'time',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@mdi/font/css/materialdesignicons.min.css', '~/assets/animation.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/apexchart.js',
      mode: 'client',
    },
    {
      src: '~/plugins/loading.js',
      mode: 'client',
    },
    {
      src: '~/plugins/axios.js',
      mode: 'client',
    },
    {
      src: '~/plugins/messageAlert.js',
      mode: 'client',
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', { iconfont: 'mdi' }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next'],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  /*
   ** Server Middleware
   */
  serverMiddleware: {
    '/api': '~/api/',
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/user/login',
            method: 'post',
            propertyName: 'token',
          },
          logout: false,
          user: {
            url: '/api/user/me',
            method: 'GET',
            propertyName: false,
          },
        },
        tokenRequired: true,
        tokenType: 'Bearer',
      },
    },
  },
  router: {
    middleware: ['auth', 'admin-protect'],
  },
}