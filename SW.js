// Define the cache name 
let cacheName = 'restaurantCache';
// //Define what are the URLs need to cache 
let urlsToCache = [
    '/',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
];
// //starting to define the life cycle of service worker with caching 
// //1. install the srvice worker
self.addEventListener('install', function(event) {
    console.log('Service worker is installed');
    event.waitUntil(
        //opening the cach and adding all defined URLS
        caches.open(cacheName)
        .then(function(cache) {
            console.log('cache is opened and cacahing the URLs');
            return cache.addAll(urlsToCache);
        })
    );
});
// //2. active the srvice worker
self.addEventListener('activate', function(event) {
        console.log('Service Worker is activated');
        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                // active of service worker will not be done until promise is done
                return Promise.all(
                    cacheNames.filter(function(cacheName) {
                        if (cacheName !== 'restaurantCache') {
                            console.log('Deleting the cache')
                            return caches.delete(cacheName);
                        } else {
                            return cacheName;
                        }
                    })
                );
            }))
    })
    // // 3. fetching steps
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                console.log(' Matching  with data in the cache');
                return response;
            }
            return fetch(event.request.clone())
                .then(function(response) {
                    caches.open(cacheName)
                        .then(function(cache) {
                            cache.put(event.request, response.clone()); //save the response in the cache
                            console.log(' New Data Cached');
                            return response;
                        })
                })
                .catch(function() {
                    console.log('Service Worker Error fetching the data')
                }) //end of catch
        }) // end of match
    ); //end of response
}); // end of fetching step