import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Button'
import { timeAgo } from '../../lib/format'
import type { Notification } from '../../types'

interface NotificationItemProps {
  notification: Notification
  /** Mark the notification as read (and/or jump to its task). */
  onOpen: (notification: Notification) => void
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
  /** Tighter layout used inside the header popover. */
  compact?: boolean
}

/**
 * One notification row, shared by the header popover and the full page.
 *
 * The message is a button (so keyboard users can activate it) while the row
 * actions are separate buttons — avoiding nested interactive elements.
 */
export function NotificationItem({
  notification,
  onOpen,
  onMarkRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const hasTask = notification.taskId !== null

  return (
    <li
      className={`notification-item ${notification.isRead ? '' : 'is-unread'} ${
        compact ? 'notification-item--compact' : ''
      }`}
    >
      <span className="notification-item-icon" aria-hidden="true">
        <Icon name={notification.isRead ? 'bell' : 'mail'} size={compact ? 15 : 17} />
      </span>

      <div className="notification-item-body">
        <button
          type="button"
          className="notification-item-message"
          onClick={() => onOpen(notification)}
          title={hasTask ? 'Open the related task' : notification.message}
        >
          {notification.message}
        </button>

        <span className="notification-item-meta">
          <Icon name="clock" size={12} />
          {timeAgo(notification.createdAt)}
          {hasTask && (
            <>
              <span className="notification-item-sep" aria-hidden="true">
                ·
              </span>
              Task #{notification.taskId}
            </>
          )}
        </span>
      </div>

      <div className="notification-item-actions">
        {!notification.isRead && (
          <IconButton
            label="Mark as read"
            size="sm"
            onClick={() => onMarkRead(notification.id)}
          >
            <Icon name="check" size={14} />
          </IconButton>
        )}
        {hasTask && (
          <IconButton
            label="Open related task"
            size="sm"
            onClick={() => onOpen(notification)}
          >
            <Icon name="eye" size={14} />
          </IconButton>
        )}
        <IconButton
          label="Delete notification"
          size="sm"
          variant="danger"
          onClick={() => onDelete(notification.id)}
        >
          <Icon name="x" size={14} />
        </IconButton>
      </div>
    </li>
  )
}
