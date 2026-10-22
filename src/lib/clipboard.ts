/**
 * Copies text. Uses the modern Clipboard API, which needs HTTPS (or localhost), and falls back to the
 * old hidden-textarea trick, so it also works when testing on a phone over plain http://192.168…
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the fallback
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  return ok
}

/** Reads the clipboard (for "Paste"). Returns '' if the browser won't allow it. */
export async function readText(): Promise<string> {
  try {
    return (await navigator.clipboard?.readText()) ?? ''
  } catch {
    return ''
  }
}
