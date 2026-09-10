import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  icon?: ReactNode
}

export function Input({ invalid, icon, className, ...rest }: InputProps) {
  const classes = ['input-wrap', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      {icon && <span className="input-icon">{icon}</span>}
      <input
        className={`input ${invalid ? 'input-invalid' : ''} ${icon ? 'has-icon' : ''}`}
        {...rest}
      />
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ invalid, className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={`input textarea ${invalid ? 'input-invalid' : ''} ${className ?? ''}`}
      {...rest}
    />
  )
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={`checkbox ${className ?? ''}`}>
      <input type="checkbox" {...rest} />
      <span className="checkbox-box" aria-hidden="true" />
      <span>{label}</span>
    </label>
  )
}

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className ?? ''}`}>
      <label className="form-label" htmlFor={htmlFor}>
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      {children}
      {error ? (
        <p className="field-message field-message-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-message">{hint}</p>
      ) : null}
    </div>
  )
}