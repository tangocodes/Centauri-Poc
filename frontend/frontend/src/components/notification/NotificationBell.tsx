import { useEffect, useState } from 'react'
import { Button, IconButton } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { EmptyState } from '../ui/EmptyState'
import { LoadingState } from '../ui/LoadingState'
import { NotificationItem } from './NotificationItem'
import { useApp } from '../../context/appContext'
import { badgeCount, unreadCount, unreadLabel } from '../../lib/notifications'
import type { Notification } from '../../types'

/** How many notifications the popover previews before "View all". */
const PREVIEW_LIMIT = 6

/**
 * Header bell that previews the notifications served by the Notification
 * microservice. The list itself lives in the app context (JWT-scoped), so the
 * badge stays in sync with the Notifications page and the background poll.
 */
export function NotificationBell() {
  const {
    notifications,
    notificationsLoading,
    navigate,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  } = useApp()
  const [open, setOpen] = useState(false)

  const count = unreadCount(notifications)
  const preview = notifications.slice(0, PREVIEW_LIMIT)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const openNotification = (notification: Notification) => {
    if (!notification.isRead) markNotificationAsRead(notification.id)
    if (notification.taskId === null) return

    setOpen(false)
    navigate({ name: 'task-detail', taskId: notification.taskId })
  }

  const viewAll = () => {
    setOpen(false)
    navigate({ name: 'notifications' })
  }

  return (
    <div className="notification-bell">
      <IconButton
        label={count > 0 ? `Notifications (${count} unread)` : 'Notifications'}
        className="header-bell"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Icon name="bell" size={19} />
        {count > 0 && <span className="header-bell-count">{badgeCount(count)}</span>}
      </IconButton>

      {open && (
        <>
          <div className="dropdown-backdrop" onClick={() => setOpen(false)} />
          <div className="notification-popover" role="dialog" aria-label="Notifications">
            <div className="notification-popover-head">
              <div>
                <h3 className="notification-popover-title">Notifications</h3>
                <p className="notification-popover-subtitle">
                  {count > 0 ? unreadLabel(count) : 'You are all caught up'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsAsRead}
                disabled={count === 0}
              >
                <Icon name="check" size={14} />
                Mark all read
              </Button>
            </div>

            <div className="notification-popover-body">
              {notificationsLoading && notifications.length === 0 ? (
                <LoadingState label="Loading notifications…" />
              ) : preview.length === 0 ? (
                <EmptyState
                  icon="inbox"
                  title="No notifications yet"
                  description="You will be notified here when a task is assigned to you."
                />
              ) : (
                <ul className="notification-list">
                  {preview.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      compact
                      onOpen={openNotification}
                      onMarkRead={markNotificationAsRead}
                      onDelete={removeNotification}
                    />
                  ))}
                </ul>
              )}
            </div>

            <div className="notification-popover-foot">
              <Button
                variant="secondary"
                size="sm"
                className="notification-view-all"
                onClick={viewAll}
              >
                View all notifications
                <Icon name="chevronRight" size={15} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
