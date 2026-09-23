import { Button } from './Button'
import { Icon } from './Icon'

interface BackButtonProps {
  label?: string
  onClick: () => void
  className?: string
}

export function BackButton({ label = 'Back', onClick, className }: BackButtonProps) {
  const classes = ['page-back', className].filter(Boolean).join(' ')

  return (
    <Button
      variant="secondary"
      size="sm"
      className={classes}
      icon={<Icon name="chevronLeft" size={16} />}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
