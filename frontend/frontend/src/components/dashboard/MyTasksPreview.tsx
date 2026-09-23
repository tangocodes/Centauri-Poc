import { EmptyState } from '../ui/EmptyState'
import { StatusBadge } from '../ui/StatusBadge'
import { PriorityBadge } from '../ui/PriorityBadge'
import { Icon } from '../ui/Icon'
import { formatDate } from '../../lib/format'
import type { Task } from '../../types'

interface MyTasksPreviewProps {
  /** Tasks already filtered to the logged-in user and capped by the caller. */
  tasks: Task[]
  onView: (taskId: number) => void
}

/**
 * Compact, dashboard-only task preview. Intentionally lighter than the
 * All Tasks <TaskList /> so the Dashboard reads as an overview, not a table.
 */
export function MyTasksPreview({ tasks, onView }: MyTasksPreviewProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="inbox"
        title="No tasks assigned to you"
        description="Tasks assigned to you will show up here."
      />
    )
  }

  return (
    <ul className="dash-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <button type="button" className="dash-row" onClick={() => onView(task.id)}>
            <span className="dash-row-main">
              <span className="dash-row-title">{task.title}</span>
              <span className="dash-row-desc">
                {task.description || 'No description provided.'}
              </span>
            </span>
            <span className="dash-row-side">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              <span className="meta-chip">
                <Icon name="calendar" size={14} />
                {formatDate(task.createdAt)}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
