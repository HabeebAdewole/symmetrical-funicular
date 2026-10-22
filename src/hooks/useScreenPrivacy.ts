import { useEffect, useRef } from 'react'

export type PrivacyRisk = 'background' | 'blur' | 'screenshot' | 'print'

/**
 * Warns a screen that it might be about to be captured, so it can hide secrets.
 *
 * Websites CANNOT block screenshots: only native apps can (Android's FLAG_SECURE).
 * What we can do is react to the moments that usually come right before a leak:
 *  - background: the app was switched away from (the phone's app switcher saves a snapshot of the screen)
 *  - blur:       the window lost focus (desktop screenshot tools like Snipping Tool steal focus)
 *  - screenshot: a screenshot shortcut was pressed (PrintScreen, or ⌘⇧3/4/5 on a Mac)
 *  - print:      someone is printing or saving the page as a PDF
 */
export function useScreenPrivacy(onRisk: (risk: PrivacyRisk) => void, enabled = true) {
  // Keep the latest callback without re-attaching listeners every render
  const callback = useRef(onRisk)
  useEffect(() => {
    callback.current = onRisk
  })

  useEffect(() => {
    if (!enabled) return
    const fire = (risk: PrivacyRisk) => callback.current(risk)

    const onVisibility = () => document.visibilityState === 'hidden' && fire('background')
    const onBlur = () => fire('blur')
    const onPrint = () => fire('print')
    const onKey = (e: KeyboardEvent) => {
      const macShot = e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)
      if (e.key === 'PrintScreen' || macShot) fire('screenshot')
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onVisibility)
    window.addEventListener('blur', onBlur)
    window.addEventListener('beforeprint', onPrint)
    // keyup: Windows only reports PrintScreen when the key is released
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onVisibility)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('beforeprint', onPrint)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
    }
  }, [enabled])
}
