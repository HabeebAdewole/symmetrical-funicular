// Shown while a lazy page's code is still downloading on first load.
export function AppLoading() {
  return (
    <div role="status" className="bg-bg flex min-h-dvh items-center justify-center">
      <span className="border-border border-t-accent size-8 animate-spin rounded-full border-2" />
      <span className="sr-only">Loading Kova…</span>
    </div>
  )
}
