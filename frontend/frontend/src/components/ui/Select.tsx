import type { SelectHTMLAttributes } from 'react'
import { Icon } from './Icon'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
}

export function Select({
  options,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <div className="select-wrap">
      <select className={`select ${className ?? ''}`} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="select-chevron" aria-hidden="true">
        <Icon name="chevronDown" size={16} />
      </span>
    </div>
  )
}