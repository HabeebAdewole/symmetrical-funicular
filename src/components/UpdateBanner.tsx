import { useRegisterSW } from 'virtual:pwa-register/react'
import { Icon } from '@/components/icons/Icon'

const HOUR = 60 * 60 * 1000

/**
 * Registers the service worker and shows "New version available" when an update has downloaded.
 *
 * Installed PWAs only look for updates now and then, so we also ask for one:
 * every hour, and every time the app comes back to the foreground.
 */
export function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      const check = () => registration.update().catch(() => {}) // offline: try again later
      setInterval(check, HOUR)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check()
      })
    },
  })

  if (!needRefresh) return null

  return (
    <div
      role="status"
      className="animate-sheet-up fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] px-4 pb-[max(env(safe-area-inset-bottom),1rem)]"
    >
      <div className="bg-text text-bg shadow-card flex items-center gap-3 rounded-lg p-3 pl-4">
        <Icon name="import" size={20} className="shrink-0" />
        <p className="text-small flex-1 font-semibold">New version of Kova available</p>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="text-small px-2 py-2 opacity-70"
        >
          Later
        </button>
        <button
          type="button"
          // Activates the waiting service worker, then reloads into the new version
          onClick={() => updateServiceWorker(true)}
          className="bg-highlight text-on-highlight text-small rounded-full px-4 py-2 font-bold"
        >
          Update
        </button>
      </div>
    </div>
  )
}
