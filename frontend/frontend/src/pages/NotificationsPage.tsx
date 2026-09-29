import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { NotificationItem } from '../components/notification/NotificationItem'
import { useApp } from '../context/appContext'
import { badgeCount, unreadCount } from '../lib/notifications'
import type { Notification } from '../types'

type NotificationFilter = 'all' | 'unread'

const FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
]

/**
 * Full notification inbox backed by the Notification microservice. The data is
 * owned by the app context so this page, the header bell and the sidebar badge
 * all read from the same JWT-scoped list.
 */
export function NotificationsPage() {
  const {
    notifications,
    notificationsLoading,
    notificationsError,
    navigate,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    showToast,
  } = useApp()
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const unread = unreadCount(notifications)
  const visible = useMemo(
    () =>
      filter === 'unread'
        ? notifications.filter((notification) => !notification.isRead)
        : notifications,
    [filter, notifications],
  )

  const openNotification = (notification: Notification) => {
    if (!notification.isRead) markNotificationAsRead(notification.id)

    if (notification.taskId === null) {
      showToast('This notification is not linked to a task', 'info')
      return
    }

    navigate({ name: 'task-detail', taskId: notification.taskId })
  }

  const renderList = () => {
    if (notificationsLoading && notifications.length === 0) {
      return <LoadingState label="Loading notifications…" />
    }

    if (notificationsError !== '' && notifications.length === 0) {
      return (
        <ErrorState
          title="Could not load notifications"
          description={notificationsError}
          action={
            <Button variant="secondary" onClick={getNotifications}>
              <Icon name="refresh" size={15} />
              Try again
            </Button>
          }
        />
      )
    }

    if (visible.length === 0) {
      return (
        <EmptyState
          icon="inbox"
          title={filter === 'unread' ? 'Nothing unread' : 'No notifications yet'}
          description={
            filter === 'unread'
              ? 'You have read every notification in your inbox.'
              : 'You will be notified here when a task is assigned to you.'
          }
        />
      )
    }

    return (
      <ul className="notification-list notification-list--page">
        {visible.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onOpen={openNotification}
            onMarkRead={markNotificationAsRead}
            onDelete={removeNotification}
          />
        ))}
      </ul>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Notifications"
        subtitle="Task assignments and updates sent to you by the notification service."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={getNotifications}
              disabled={notificationsLoading}
              icon={<Icon name="refresh" size={15} />}
            >
              Refresh
            </Button>
            <Button
              onClick={markAllNotificationsAsRead}
              disabled={unread === 0}
              icon={<Icon name="check" size={15} />}
            >
              Mark all read
            </Button>
          </>
        }
      />

      {notificationsError !== '' && notifications.length > 0 && (
        <p className="notification-warning">
          <Icon name="alert" size={15} />
          {notificationsError}
        </p>
      )}

      <div className="card notification-card">
        <div className="notification-toolbar">
          <div className="notification-filters" role="group" aria-label="Filter notifications">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`notification-filter ${
                  filter === option.value ? 'is-active' : ''
                }`}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
                {option.value === 'unread' && unread > 0 && (
                  <span className="notification-filter-count">{badgeCount(unread)}</span>
                )}
              </button>
            ))}
          </div>
          <span className="notification-total">
            {notifications.length} notification{notifications.length === 1 ? '' : 's'}
          </span>
        </div>

        {renderList()}
      </div>
    </div>
  )
}
