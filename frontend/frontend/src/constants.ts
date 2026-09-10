import type { TaskPriority, TaskStatus } from './types'

export const TASK_STATUSES: readonly TaskStatus[] = [
  'todo',
  'in-progress',
  'completed',
  'pending',
]

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  completed: 'Completed',
  pending: 'Pending',
}

export const PRIORITIES: readonly TaskPriority[] = [
  'low',
  'medium',
  'high',
  'urgent',
]

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const STATUS_OPTIONS = TASK_STATUSES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}))

export const PRIORITY_OPTIONS = PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}))