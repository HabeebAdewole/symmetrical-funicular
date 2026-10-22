import { useEffect } from 'react'
import { usePreferencesStore } from '@/store/preferencesStore'

const darkQuery = '(prefers-color-scheme: dark)'

/**
 * Sets <html data-theme="light|dark"> from the user's preference.
 * "system" follows the OS setting and updates live if the OS switches (e.g. at sunset).
 * Call once, near the top of the app.
 */
export function useApplyTheme() {
  const theme = usePreferencesStore((state) => state.theme)

  useEffect(() => {
    const media = window.matchMedia(darkQuery)
    const apply = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      document.documentElement.dataset.theme = resolved
      // Keeps the mobile browser's address bar the same colour as the app
      // (skipped while the emerald splash is showing; hideSplash() sets it afterwards)
      if (!document.getElementById('splash')) {
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', resolved === 'dark' ? '#0B0D0C' : '#F4F6F5')
      }
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])
}
