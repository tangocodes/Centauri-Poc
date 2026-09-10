import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface ErrorStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn’t load this content. Please try again.',
  action,
}: ErrorStateProps) {
  return (
    <div className="error-state">
      <span className="error-state-icon">
        <Icon name="alert" size={28} />
      </span>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-description">{description}</p>
      {action && <div className="error-state-action">{action}</div>}
    </div>
  )
}