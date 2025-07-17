const CACHE_NAME = 'growthtracker-v1';
const STATIC_CACHE_NAME = 'growthtracker-static-v1';
const API_CACHE_NAME = 'growthtracker-api-v1';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // Add other static assets as needed
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/auth/user',
  '/api/dashboard/stats',
  '/api/habits',
  '/api/goals',
  '/api/journal-entries',
  '/api/transactions'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const staticCache = await caches.open(STATIC_CACHE_NAME);
        await staticCache.addAll(STATIC_ASSETS);
        console.log('Service Worker: Static assets cached');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('Service Worker: Failed to cache static assets', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(name => 
            name.startsWith('growthtracker-') && 
            ![CACHE_NAME, STATIC_CACHE_NAME, API_CACHE_NAME].includes(name)
          )
          .map(name => caches.delete(name));
        
        await Promise.all(deletePromises);
        console.log('Service Worker: Old caches cleaned up');
        
        // Claim all clients immediately
        self.clients.claim();
      } catch (error) {
        console.error('Service Worker: Failed to clean up old caches', error);
      }
    })()
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets and navigation
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful GET responses for specific endpoints
    if (networkResponse.ok && API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for API request');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a generic offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This feature is not available offline' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const url = new URL(request.url);
  
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for static request');
    
    // For navigation requests, return the cached root page
    if (request.mode === 'navigate') {
      const cachedRoot = await caches.match('/');
      if (cachedRoot) {
        return cachedRoot;
      }
    }
    
    // Return a generic offline page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GrowthTracker - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f8fafc;
              color: #475569;
              text-align: center;
            }
            .container {
              max-width: 400px;
              margin: 100px auto;
              padding: 40px 20px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 20px;
              background: linear-gradient(135deg, #10b981, #3b82f6);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            h1 { color: #1e293b; margin-bottom: 10px; }
            p { margin-bottom: 20px; }
            button {
              background: linear-gradient(135deg, #10b981, #3b82f6);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">
              <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h1>You're Offline</h1>
            <p>GrowthTracker needs an internet connection to work properly. Please check your connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Here you could sync any pending data
    console.log('Service Worker: Performing background sync');
    
    // Example: sync pending journal entries, habit completions, etc.
    // This would involve checking IndexedDB for pending operations
    // and sending them to the server when online
    
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received');
  
  const options = {
    body: 'Don\'t forget to log your progress today!',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-64.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open GrowthTracker',
        icon: '/manifest-icon-64.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/manifest-icon-64.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'GrowthTracker';
  }
  
  event.waitUntil(
    self.registration.showNotification('GrowthTracker', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
