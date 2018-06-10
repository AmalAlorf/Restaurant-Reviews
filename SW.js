// Define the cache name 
let cacheName = 'restaurantCache';
//Define what are the URLs need to cache 
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
//starting to define the life cycle of service worker with caching 
//1. install the srvice worker
self.addEventListener('install', function(event) {
    console.log('Service worker is installed');
    event.waitUntil(
        //opening the cach and adding all defined URLS
        caches.open(cacheName).then(function(cache) {
            console.log('cache is opened and cacahing the URLs');
            return cache.addAll(urlsToCache);
        }))
});

//2. active the srvice worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            // active of service worker will not be done until promise is done
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    console.log('Service worker is activated');
                    if (cacheName === 'restaurantCache') {
                        console.log('Return the cache');
                        return cacheName
                    } else {
                        // Delete the cache
                        console.log('Deleting the cache')
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
// 3. fetching steps
self.addEventListener('fetch', function(event) {
    // console.log('Service Worker is fetching', event);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // If I found the same response in the cache, return it, and also update the cache entry 
                console.log(' Matching  with data in the cache');
                caches.open(cacheName)
                    .then(function(cache) {
                        cache.add(event.request); //save the response in the cache
                        return response;
                    })
            } else {
                // If I didn't find a response in the cache fetching from the internet
                console.log(' UnMatching with data in the cache ')
                return fetch(event.request)

                .catch(function() {
                    console.log('Service Worker Error fetching ')
                })
            }
        })
    )
})