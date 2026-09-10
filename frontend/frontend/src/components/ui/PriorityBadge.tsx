import type { TaskPriority } from '../../types'
import { PRIORITY_LABELS } from '../../constants'

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`badge priority-${priority}`}>{PRIORITY_LABELS[priority]}</span>
}