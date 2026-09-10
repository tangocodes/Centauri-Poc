import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/Icon'

type StatTone = 'blue' | 'green' | 'amber' | 'slate'

interface StatCardProps {
  label: string
  value: number
  icon: IconName
  tone: StatTone
  trend: string
}

export function StatCard({ label, value, icon, tone, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className={`stat-icon stat-icon-${tone}`}>
        <Icon name={icon} size={20} />
      </span>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-trend">{trend}</p>
      </div>
    </div>
  )
}