// Fades out the splash screen that index.html shows before any JavaScript runs.

/**
 * How long the splash stays at least, from the moment the page starts loading.
 * The animation (index.html) finishes at ~2.3s; this leaves a short beat on the finished logo before fading.
 * Change this one number to make the splash longer or shorter.
 */
const MIN_VISIBLE_MS = 2900

let hidden = false

export function hideSplash() {
  const splash = document.getElementById('splash')
  if (hidden || !splash) return
  hidden = true

  // performance.now() counts from when the page started loading
  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now())

  setTimeout(() => {
    // Hand the phone's status bar colour back to the current theme
    const dark = document.documentElement.dataset.theme === 'dark'
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#0B0D0C' : '#F4F6F5')

    splash.classList.add('splash--hide')
    // Remove it from the page once the fade-out has finished
    splash.addEventListener('transitionend', () => splash.remove(), { once: true })
    setTimeout(() => splash.remove(), 800) // safety net if transitionend never fires
  }, wait)
}
