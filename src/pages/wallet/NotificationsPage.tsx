import { useNavigate } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { TopBar } from '@/components/ui/TopBar'
import { useNotifications, type Notification } from '@/hooks/useNotifications'
import { cx } from '@/lib/cx'
import { formatRelativeTime } from '@/lib/format'
import { useWalletStore } from '@/store/walletStore'

const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0)).getTime()

function NotificationRow({ item, onOpen }: { item: Notification; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="active:bg-surface-raised -mx-2 flex w-full items-start gap-3 rounded-md px-2 py-3.5 text-left transition-colors"
    >
      <span
        className={cx(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          item.unread ? 'bg-highlight text-on-highlight' : 'bg-surface-raised text-text',
        )}
      >
        <Icon name={item.icon} size={20} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cx('text-small', item.unread ? 'font-bold' : 'font-semibold')}>
          {item.title}
        </span>
        <span className="text-small text-text-muted">{item.body}</span>
        <span className="text-caption text-text-muted">{formatRelativeTime(item.time)}</span>
      </span>
      {item.unread && (
        <span aria-label="Unread" className="bg-primary mt-1.5 size-2 shrink-0 rounded-full" />
      )}
    </button>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const markRead = useWalletStore((s) => s.markNotificationsRead)
  const { notifications, unreadCount } = useNotifications()

  const today = startOfToday()
  const groups = [
    { label: 'Today', items: notifications.filter((n) => n.time >= today) },
    { label: 'Earlier', items: notifications.filter((n) => n.time < today) },
  ].filter((g) => g.items.length > 0)

  const open = (item: Notification) => {
    markRead([item.id])
    navigate(item.link)
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Notifications" onBack={() => navigate(-1)} />
      <div className="flex flex-col gap-3 px-5 pb-4">
        {groups.length === 0 && (
          <p className="text-text-muted py-12 text-center">You’re all caught up.</p>
        )}
        {groups.map((group, i) => (
          <section key={group.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-caption text-text-muted">{group.label}</h2>
              {i === 0 && unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markRead(notifications.map((n) => n.id))}
                  className="text-small text-primary font-semibold"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="bg-surface divide-border divide-y rounded-lg px-4">
              {group.items.map((item) => (
                <NotificationRow key={item.id} item={item} onOpen={() => open(item)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
