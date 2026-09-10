import type { Task, TaskFilters } from '../types'

export const EMPTY_FILTERS: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
}

export function isFilterActive(filters: TaskFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all'
  )
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const search = filters.search.trim().toLowerCase()
  return tasks.filter((task) => {
    const matchesSearch =
      search === '' ||
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search)
    const matchesStatus =
      filters.status === 'all' || task.status === filters.status
    const matchesPriority =
      filters.priority === 'all' || task.priority === filters.priority
    return matchesSearch && matchesStatus && matchesPriority
  })
}

export function sortByMostRecent(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getTaskStats(tasks: Task[]) {
  return {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
  }
}