import type { ReactNode } from 'react'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../constants'
import { FilterChips } from './FilterChips'
import type { TaskFilters, TaskPriority, TaskStatus } from '../../types'

interface TaskFiltersProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
  action?: ReactNode
}

const STATUS_FILTER_OPTIONS = [{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]
const PRIORITY_FILTER_OPTIONS = [{ value: 'all', label: 'All priorities' }, ...PRIORITY_OPTIONS]

export function TaskFilters({ filters, onChange, action }: TaskFiltersProps) {
  const setStatus = (value: string) =>
    onChange({ ...filters, status: value as TaskStatus | 'all' })

  const setPriority = (value: string) =>
    onChange({ ...filters, priority: value as TaskPriority | 'all' })

  return (
    <div className="task-filter-bar">
      <div className="task-toolbar">
        <div className="toolbar-filters">
          <Input
            type="search"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            icon={<Icon name="search" size={16} />}
            aria-label="Search tasks"
          />
          <Select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(event) => setStatus(event.target.value)}
            options={STATUS_FILTER_OPTIONS}
          />
          <Select
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(event) => setPriority(event.target.value)}
            options={PRIORITY_FILTER_OPTIONS}
          />
        </div>
        {action && <div className="toolbar-action">{action}</div>}
      </div>

      {/* Every applied filter shows up here and can be cleared on its own. */}
      <FilterChips filters={filters} onChange={onChange} />
    </div>
  )
}