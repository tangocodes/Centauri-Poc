import { getInitials } from '../../lib/format'

interface AvatarProps {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, color, size = 'md' }: AvatarProps) {
  return (
    <span
      className={`avatar avatar-${size}`}
      style={color ? { backgroundColor: color } : undefined}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}