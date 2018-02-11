self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('static').then((cache) => {
    cache.addAll([
      '/',
      '/index.html',
      '/js.js',
      '/css.css',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.css',
    ])
  }))
})

// self.addEventListener('activate', (event) => {
//   console.log('SW activated!')
// })

self.addEventListener('fetch', (event) => {
  const req = event.request
  event.respondWith(caches.match(req).then((res) => {
    return res || fetch(req)
  }))
})