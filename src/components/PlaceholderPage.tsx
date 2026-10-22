import { Link } from 'react-router'
import { pageMap } from '@/app/pageMap'

type PlaceholderPageProps = {
  title: string
  /** Roadmap phase that will build this page (see project STATE) */
  phase: number
}

// Temporary stand-in for pages that haven't been built yet.
// Delete this component once every page is real.
export function PlaceholderPage({ title, phase }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <p className="text-text-muted text-sm">Coming in phase {phase}</p>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </header>

      <nav aria-label="App map" className="flex flex-col gap-6">
        {pageMap.map(({ group, pages }) => (
          <section key={group}>
            <h2 className="text-text-muted mb-2 text-xs font-medium tracking-wider uppercase">
              {group}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {pages.map((page) => (
                <li key={page.path}>
                  <Link
                    to={page.path}
                    className="border-border hover:border-accent hover:text-accent block rounded-full border px-3 py-1 text-sm"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </div>
  )
}
