import { Link } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { KovaLogo } from '@/components/ui/KovaLogo'
import { initials, timeOfDayGreeting } from '@/lib/greeting'

type HomeHeaderProps = {
  name: string
  /** Shows a red dot on the bell */
  hasUnread: boolean
}

/** Figma: Home Header — avatar, greeting, notifications bell. */
export function HomeHeader({ name, hasUnread }: HomeHeaderProps) {
  const letters = initials(name)

  return (
    <header className="flex items-center gap-3">
      <Link to="/settings" aria-label="Settings" className="shrink-0">
        {letters ? (
          <span className="bg-highlight text-on-highlight flex size-11 items-center justify-center rounded-full font-semibold">
            {letters}
          </span>
        ) : (
          // No name yet: show the Kova mark instead of empty initials
          <KovaLogo wordmark={false} size={44} />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-caption text-text-muted">{timeOfDayGreeting()}</span>
        <span className="truncate font-semibold">{name || 'Welcome back'}</span>
      </div>
      <Link
        to="/notifications"
        aria-label={hasUnread ? 'Notifications, new items' : 'Notifications'}
        className="bg-surface relative flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95"
      >
        <Icon name="bell" />
        {hasUnread && (
          <span className="bg-negative border-surface absolute top-2.5 right-2.5 size-2.5 rounded-full border-2" />
        )}
      </Link>
    </header>
  )
}
