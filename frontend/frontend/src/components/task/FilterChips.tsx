import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { PRIORITY_LABELS, STATUS_LABELS } from '../../constants'
import { EMPTY_FILTERS } from '../../lib/tasks'
import type { TaskFilters } from '../../types'

interface FilterChipsProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
  /** Surface the search term as its own chip. Off for the Dashboard preview. */
  showSearchChip?: boolean
  /** Offer one "Clear all" action once more than one chip is visible. */
  showClearAll?: boolean
}

/**
 * Shared, read-only summary of the filters currently applied: each active
 * filter becomes a chip with its own remove button, so a single filter can be
 * cleared without resetting the rest. Used by All Tasks and the Dashboard.
 *
 * The chip bodies are plain spans (no click handler) which keeps the remove
 * button valid HTML and stops accidental clearing.
 */
export function FilterChips({
  filters,
  onChange,
  showSearchChip = true,
  showClearAll = true,
}: FilterChipsProps) {
  const chips: ReactNode[] = []
  const search = filters.search.trim()

  if (showSearchChip && search !== '') {
    chips.push(
      <span key="search" className="badge filter-chip filter-chip-search">
        <Icon name="search" size={12} />
        <span className="filter-chip-label">Search: “{search}”</span>
        <button
          type="button"
          className="filter-chip-clear"
          aria-label={`Clear search filter: ${search}`}
          title="Clear search filter"
          onClick={() => onChange({ ...filters, search: '' })}
        >
          <Icon name="x" size={12} />
        </button>
      </span>,
    )
  }

  if (filters.status !== 'all') {
    chips.push(
      <span key="status" className={`badge filter-chip status-${filters.status}`}>
        <span className="badge-dot" aria-hidden="true" />
        <span className="filter-chip-label">{STATUS_LABELS[filters.status]}</span>
        <button
          type="button"
          className="filter-chip-clear"
          aria-label={`Clear status filter: ${STATUS_LABELS[filters.status]}`}
          title="Clear status filter"
          onClick={() => onChange({ ...filters, status: 'all' })}
        >
          <Icon name="x" size={12} />
        </button>
      </span>,
    )
  }

  if (filters.priority !== 'all') {
    chips.push(
      <span key="priority" className={`badge filter-chip priority-${filters.priority}`}>
        <Icon name="flag" size={12} />
        <span className="filter-chip-label">{PRIORITY_LABELS[filters.priority]}</span>
        <button
          type="button"
          className="filter-chip-clear"
          aria-label={`Clear priority filter: ${PRIORITY_LABELS[filters.priority]}`}
          title="Clear priority filter"
          onClick={() => onChange({ ...filters, priority: 'all' })}
        >
          <Icon name="x" size={12} />
        </button>
      </span>,
    )
  }

  if (chips.length === 0) return null

  return (
    <div className="filter-chips" role="group" aria-label="Applied filters">
      {chips}
      {showClearAll && chips.length > 1 && (
        <Button variant="ghost" size="sm" onClick={() => onChange({ ...EMPTY_FILTERS })}>
          <Icon name="x" size={14} />
          Clear all
        </Button>
      )}
    </div>
  )
}
