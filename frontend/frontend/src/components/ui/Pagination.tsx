import { Icon } from './Icon'
import { Button } from './Button'

interface PaginationProps {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

function pageList(current: number, count: number): (number | '…')[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1)
  }
  const pages = new Set<number>([1, 2, count - 1, count, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b)
  const result: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) result.push('…')
    result.push(p)
    prev = p
  }
  return result
}

export function Pagination({ page, pageCount, total, pageSize, onChange }: PaginationProps) {
  if (total === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="pagination">
      <p className="pagination-info">
        Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> tasks
      </p>
      <nav className="pagination-controls" aria-label="Pagination">
        <Button
          variant="secondary"
          size="sm"
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <Icon name="chevronLeft" size={16} />
          Prev
        </Button>

        {pageList(page, pageCount).map((item, index) =>
          item === '…' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pagination-page ${item === page ? 'is-active' : ''}`}
              onClick={() => onChange(item)}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}

        <Button
          variant="secondary"
          size="sm"
          className="pagination-btn"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
        >
          Next
          <Icon name="chevronRight" size={16} />
        </Button>
      </nav>
    </div>
  )
}