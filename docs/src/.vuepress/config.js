const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Reactif.dev',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: 'Fast 5kB reactive & elegant functional library for rapidly building modern UIs on the web',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#530B6F' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { property: 'og:image', content: "https://i.imgur.com/1TJ2Q0w.jpg" }],
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "https://i.imgur.com/dpn5BAV.jpg"}],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "https://i.imgur.com/dpn5BAV.jpg"}],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "https://i.imgur.com/dpn5BAV.jpg"}],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: 'https://i.imgur.com/dpn5BAV.jpg',
    repo: 'https://github.com/tuhuynh27/reactif',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Guide',
        link: '/guide/introduction.html',
      },
      {
        text: 'Example',
        link: 'https://github.com/tuhuynh27/reactif/tree/master/example',
      },
      {
        text: 'Team',
        link: '/team/',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: [
            'introduction',
            'installation',
            'basic',
            'conditional',
            'list',
            'events',
            'forms',
            'lifecycle',
            'components',
            'routing',
            'state-management',
            'composition'
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
