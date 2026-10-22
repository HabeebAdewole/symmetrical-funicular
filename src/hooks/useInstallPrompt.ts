import { useEffect, useState } from 'react'

// Chrome/Edge/Android fire `beforeinstallprompt` when the app is installable.
// We hold on to that event so a Kova button can open the install dialog later.
// Safari (iOS) never fires it, so iPhone users get "Share → Add to Home Screen" instructions instead.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS Safari's older, non-standard flag
  ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault() // stop Chrome's mini-infobar; we'll show our own button
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null) // the event can only be used once
  }

  return {
    /** Already running as an installed app */
    installed,
    /** Show an "Install Kova" button (Chrome/Edge/Android) */
    canInstall: deferred !== null && !installed,
    /** Show "Share → Add to Home Screen" help (iPhone/iPad) */
    showIosHint: !installed && isIos(),
    install,
  }
}
