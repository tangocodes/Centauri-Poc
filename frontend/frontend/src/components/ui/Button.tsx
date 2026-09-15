import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode

}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} {...rest} disabled={disabled}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: 'default' | 'danger' | 'primary'
  size?: 'sm' | 'md'
}

export function IconButton({
  label,
  variant = 'default',
  size = 'md',
  className,
  disabled, 
  ...rest
}: IconButtonProps) {
  const classes = ['icon-btn', `icon-btn-${variant}`, `icon-btn-${size}`, className]
    .filter(Boolean)
    .join(' ')

  // Default to type="button"; callers can override via `type` prop.
  const { type = 'button' } = rest
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      aria-label={label}
      title={label}
      disabled={disabled}
      
    >
      {rest.children}
    </button>
  )
}