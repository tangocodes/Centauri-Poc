import type { TaskStatus } from '../../types'
import { STATUS_LABELS } from '../../constants'

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`badge status-${status}`}>
      <span className="badge-dot" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}