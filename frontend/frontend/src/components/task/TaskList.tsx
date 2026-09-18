import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Button'
import { StatusBadge } from '../ui/StatusBadge'
import { PriorityBadge } from '../ui/PriorityBadge'
import { EmptyState } from '../ui/EmptyState'
import { formatDate  } from '../../lib/format'
import type { Task } from '../../types'
import { useApp } from '../../context/appContext'
import { Avatar } from '../ui/Avatar'


interface TaskListProps {

  tasks: Task[]   
  onView: (taskId: number) => void
  onEdit: (taskId: number) => void
  onDelete: (taskId: number) => void
  emptyTitle?: string
  emptyDescription?: string
  showAssignee?: boolean

}

export function TaskList({
  tasks,
  onView,
  onEdit,
  onDelete,
  emptyTitle = 'No tasks found',
  emptyDescription = 'Try adjusting your search or filters, or create a new task.',
  showAssignee = true,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="card">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    )
  }

  const {user} = useApp()

  return (
    <>
      {/* Desktop table */}
      <div className="card table-card desktop-only">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              {showAssignee && <th>Assignee</th>}
              <th>Created</th>
              <th className="col-actions" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <button
                    type="button"
                    className="task-title-link"
                    onClick={() => onView(task.id)}
                  >
                    {task.title}
                  </button>
                  <p className="task-desc-preview">{task.description}</p>
                </td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                {showAssignee && (
                  <td>
                    <span className="assignee-cell">
                      <Avatar name={user.name} color="#de3242" size="sm" />
                      {user.name}
                    </span>
                  </td>
                )}
                <td className="cell-date">{formatDate(task.createdAt)}</td>
                <td className="col-actions">
                  <div className="row-actions">
                    <IconButton label="View task" onClick={() => onView(task.id)}>
                      <Icon name="eye" size={17} />
                    </IconButton>
                    <IconButton label="Edit task" onClick={() => onEdit(task.id)}>
                      <Icon name="edit" size={17} />
                    </IconButton>
                    <IconButton
                      label="Delete task"
                      variant="danger"
                      onClick={() => onDelete(task.id)}
                    >
                      <Icon name="trash" size={17} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mobile-only task-cards">
        {tasks.map((task) => (
          <div key={task.id} className="card task-card">
            <div className="task-card-top">
              <button
                type="button"
                className="task-title-link"
                onClick={() => onView(task.id)}
              >
                {task.title}
              </button>
              <div className="row-actions">
                <IconButton label="View task" onClick={() => onView(task.id)}>
                  <Icon name="eye" size={17} />
                </IconButton>
                <IconButton label="Edit task" onClick={() => onEdit(task.id)}>
                  <Icon name="edit" size={17} />
                </IconButton>
                <IconButton
                  label="Delete task"
                  variant="danger"
                  onClick={() => onDelete(task.id)}
                >
                  <Icon name="trash" size={17} />
                </IconButton>
              </div>
            </div>
            <p className="task-desc-preview">{task.description}</p>
            <div className="task-card-badges">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="task-card-meta">
              <span className="meta-chip">
                <Icon name="calendar" size={14} />
                {formatDate(task.createdAt)}
              </span>
              {/* {showAssignee && (
                <span className="meta-chip">
                  <Avatar name={task.assignee} color={avatarColor(task.assignee)} size="sm" />
                  {task.assignee}
                </span>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}