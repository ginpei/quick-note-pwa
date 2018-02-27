const paths = [
  '/',
  '/js.js',
  '/css.css',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.css',
]

// self.addEventListener('install', (event) => {
//   event.waitUntil(caches.open('static').then((cache) => {
//     cache.addAll(paths)
//   }))
// })

// self.addEventListener('activate', (event) => {
//   console.log('SW activated!')
// })

function isCacheTarget (sUrl) {
  return paths.includes(sUrl) || paths.includes(new URL(sUrl).pathname)
}

self.addEventListener('fetch', (event) => {
  // - offline -> returns cache even if not cached
  // - online && not cached -> fetch then cache and return it
  // - online && cached -> return it while fetching and updating cache

  const req = event.request
  if (!isCacheTarget(req.url)) {
    return
  }

  event.respondWith((async () => {
    let res = await caches.match(req.url)

    let pFetched = null
    if (navigator.onLine) {
      // for browser-sync
      // (this doesn't affect production env, however)
      const init = {}
      if (new URL(req.url).pathname === '/') {
        init.headers = { Accept: 'text/html' }
      }

      pFetched = fetch(req.url, init)
        .then(async (res) => {
          const cache = await caches.open('static')
          await cache.put(req.url, res)
          const cachedRes = await caches.match(req.url)
          return cachedRes
        })
    }

    // wait if online and not cached
    if (pFetched && !res) {
      res = await pFetched
    }

    return res
  })())
})
