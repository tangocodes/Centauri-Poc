import type { Notification } from '../types'

/**
 * Base URL of the standalone Notification microservice, mirroring the
 * `VITE_API_URL` convention used for the Task API.
 */
export const NOTIFICATION_SERVICE_URL =
  import.meta.env.VITE_NOTIFICATION_SERVICE_URL ?? 'http://localhost:3001'

/** How often the bell re-polls the microservice for new notifications (ms). */
export const NOTIFICATION_POLL_MS = 30_000

export interface NotificationResult<T> {
  ok: boolean
  status: number
  /** True when the JWT was rejected, so the caller can sign the user out. */
  unauthorized: boolean
  data: T | null
}

/**
 * Thin fetch wrapper around the microservice. It never throws for HTTP errors —
 * callers get a discriminated result so they can decide between a toast, an
 * inline error state, or a forced sign-out on 401.
 */
async function request<T>(
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<NotificationResult<T>> {
  const response = await fetch(`${NOTIFICATION_SERVICE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  })

  const unauthorized = response.status === 401

  if (!response.ok) {
    return { ok: false, status: response.status, unauthorized, data: null }
  }

  if (response.status === 204) {
    return { ok: true, status: response.status, unauthorized, data: null }
  }

  return {
    ok: true,
    status: response.status,
    unauthorized,
    data: (await response.json()) as T,
  }
}

/** Notifications of the signed-in user (already scoped by the JWT). */
export function fetchNotifications(token: string) {
  return request<Notification[]>(token, '/notifications')
}

/** Mark a single notification as read. */
export function markNotificationRead(token: string, id: number) {
  return request<Notification>(token, `/notifications/${id}/read`, {
    method: 'PATCH',
  })
}

/** Permanently remove a notification. */
export function deleteNotification(token: string, id: number) {
  return request<{ message: string; id: number }>(token, `/notifications/${id}`, {
    method: 'DELETE',
  })
}

/** Newest first. The service sorts too; this keeps the UI order deterministic. */
export function sortByNewest(notifications: Notification[]): Notification[] {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function unreadCount(notifications: Notification[]): number {
  return notifications.filter((notification) => !notification.isRead).length
}

/** "3 new notifications" / "1 new notification" */
export function unreadLabel(count: number): string {
  return `${count} new notification${count === 1 ? '' : 's'}`
}

/** Compact badge text: anything above nine collapses to "9+". */
export function badgeCount(count: number): string {
  return count > 9 ? '9+' : String(count)
}
