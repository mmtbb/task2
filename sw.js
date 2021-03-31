var CACHE_NAME = 'V6';
var FILES = [
  '/',
  'index.html',
  'js/app.js',
  'js/promise.js',
  'js/jquery.min.js',
  'js/leaflet-indoor.js',
  'js/leaflet-src.js',
  'css/leaflet.css',
  'css/style.css',
   'export1.json'
];

self.addEventListener('install', function (event) {
  console.log('Installing Service Worker', event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Precaching static');
        cache.addAll(FILES);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('Activating Service Worker', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
          .then(function(res) {
            return caches.open('dynamic5')
              .then(function(cache) {
                cache.put(event.request.url, res.clone());
                return res;
              })
          });        
        }
      })
  );   
});





