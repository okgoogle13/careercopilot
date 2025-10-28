if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/dev-sw.js?dev-sw', { scope: '/', type: 'classic' })
    .then(() => console.log('[dev] Service worker registered'))
    .catch((error) => console.error('[dev] Service worker registration failed:', error))
}