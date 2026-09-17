import { createPortal } from 'react-dom'
import { useCallback, useEffect, useState } from 'react'
import type { ToastItem, ToastType } from '../../types'
import { useApp } from '../../context/appContext'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { IconButton } from './Button'
import '../../index.css'

const TOAST_ICONS: Record<ToastType, IconName> = {
  success: 'checkCircle',
  error: 'alert',
  info: 'bell',
}

const AUTO_DISMISS_MS: Record<ToastType, number> = {
  success: 1500,
  error: 1500,
  info: 1500,
}

/** Accent colors duplicated from the CSS tokens as an inline fallback so the
 * toast is always styled even if the stylesheet fails to reach it. */
const TYPE_ACCENT: Record<ToastType, string> = {
  success: '#16a34a',
  error: '#dc2626',
  info: '#2563eb',
}

/** Matches the .toast.is-leaving animation duration in index.css. */
const EXIT_MS = 200

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: number) => void
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [leaving, setLeaving] = useState(false)
  const duration = AUTO_DISMISS_MS[toast.type]

  const dismiss = useCallback(() => {
    setLeaving(true)
    window.setTimeout(() => onDismiss(toast.id), EXIT_MS)
  }, [onDismiss, toast.id])

  useEffect(() => {
    const timer = window.setTimeout(dismiss, duration)
    return () => window.clearTimeout(timer)
  }, [dismiss, duration])

  return (
    <div
      className={`toast toast-${toast.type} ${leaving ? 'is-leaving' : ''}`}
      role="status"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        boxSizing: 'border-box',
        padding: '14px 44px 14px 14px',
        background: '#ffffff',
        color: '#0f172a',
        borderRadius: 12,
        border: '1px solid #e6e9f0',
        borderLeft: `4px solid ${TYPE_ACCENT[toast.type]}`,
        boxShadow: '0 12px 32px rgba(16, 24, 40, 0.16)',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      <span className="toast-icon">
        <Icon name={TOAST_ICONS[toast.type]} size={18} />
      </span>
      <p className="toast-message">{toast.message}</p>
      <IconButton
        label="Dismiss notification"
        size="sm"
        onClick={dismiss}
        className="toast-close"
      >
        <Icon name="x" size={14} />
      </IconButton>
      <span
        className="toast-progress"
        style={{ animationDuration: `${duration}ms` }}
        aria-hidden="true"
      />
    </div>
  )
}

export function ToastContainer() {
  const { toasts, dismissToast } = useApp()

  return createPortal(
    <div
      className="toast-viewport"
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
        width: 'min(380px, calc(100vw - 48px))',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>,
    document.body,
  )
}