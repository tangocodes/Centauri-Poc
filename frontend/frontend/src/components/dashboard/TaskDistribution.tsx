interface TaskDistributionProps {
  assignedToMe: number
  assignedToOthers: number
  unassigned: number
}

type DistributionTone = 'primary' | 'slate' | 'amber'

/**
 * Shows how the workspace's tasks are spread between the logged-in user,
 * other people and unassigned work. Counts come from the tasks already
 * loaded in AppContext — no extra fetch and no charting dependency.
 */
export function TaskDistribution({
  assignedToMe,
  assignedToOthers,
  unassigned,
}: TaskDistributionProps) {
  const total = assignedToMe + assignedToOthers + unassigned

  const segments: {
    key: string
    label: string
    value: number
    tone: DistributionTone
  }[] = [
    { key: 'mine', label: 'Assigned to me', value: assignedToMe, tone: 'primary' },
    { key: 'others', label: 'Assigned to others', value: assignedToOthers, tone: 'slate' },
    { key: 'unassigned', label: 'Unassigned', value: unassigned, tone: 'amber' },
  ]

  const percent = (value: number) =>
    total === 0 ? 0 : Math.round((value / total) * 100)

  return (
    <article className="card dash-card">
      <div className="dash-card-head">
        <div>
          <h3 className="section-title">Task Distribution</h3>
          <p className="card-subtitle">Where the work currently sits.</p>
        </div>
      </div>

      {/* Proportions use flex-grow so the bar always fills exactly 100%. */}
      <div
        className="dist-stack"
        role="img"
        aria-label={`${total} tasks: ${assignedToMe} assigned to me, ${assignedToOthers} assigned to others, ${unassigned} unassigned`}
      >
        {segments.map((segment) => (
          <span
            key={segment.key}
            className={`dist-bar dist-tone-${segment.tone}`}
            style={{ flexGrow: segment.value }}
          />
        ))}
      </div>

      {total === 0 && <p className="dash-note">No tasks have been created yet.</p>}

      <ul className="dist-list">
        {segments.map((segment) => (
          <li key={segment.key} className="dist-item">
            <span className="dist-item-label">
              <span className={`dist-dot dist-tone-${segment.tone}`} aria-hidden="true" />
              {segment.label}
            </span>
            <span className="dist-item-value">
              {segment.value}
              <span className="dist-item-pct">{percent(segment.value)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
