importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/27b41c2d28af964a9b13.js",
    "revision": "c530825032c81f93277c3bb4910f97b0"
  },
  {
    "url": "/_nuxt/b4e50c370ef5ae3ab27d.js",
    "revision": "7fa74f6810800c0c69230c98b7b4b506"
  },
  {
    "url": "/_nuxt/cc5b6faa4895d3655822.js",
    "revision": "0b9d8991de81d066e208489347bdbc39"
  },
  {
    "url": "/_nuxt/ef8a1ea77eb8dea3f6ce.js",
    "revision": "dccbf6e721f80a2bc9f7364365765281"
  },
  {
    "url": "/_nuxt/fa9d793a4eaf842b1de1.js",
    "revision": "344006a421e4a965d9bf613a17cc1df7"
  }
], {
  "cacheId": "yandex-dialogs-client",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
