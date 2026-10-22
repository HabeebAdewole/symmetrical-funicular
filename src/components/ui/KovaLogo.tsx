/** Kova mark (K in a rounded square, colour follows --color-primary) + optional wordmark. */
export function KovaLogo({ wordmark = true, size = 36 }: { wordmark?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden={wordmark} role="img">
        {!wordmark && <title>Kova</title>}
        <rect width="36" height="36" rx="11" className="fill-primary" />
        <path
          d="M13 10v16M13 18l9-8M13 18l9 8"
          className="stroke-on-primary"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {wordmark && <span className="text-h2 font-bold">Kova</span>}
    </span>
  )
}
