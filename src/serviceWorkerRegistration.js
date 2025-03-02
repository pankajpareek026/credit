// serviceWorkerRegistration.js

// This is the default service worker registration code.
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname === '127.0.0.1'
);

export function register() {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL('https://creditc.vercel.app/', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${'https://creditc.vercel.app/'}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
      } else {
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registered: ', registration);
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker file exists
  fetch(swUrl)
    .then((response) => {
      if (
        response.status === 404 ||
        response.headers.get('content-type')?.indexOf('javascript') === -1
      ) {
        // No service worker found, maybe not a PWA
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister();
        });
      } else {
        // Valid service worker found, register it
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. PWA will work offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
