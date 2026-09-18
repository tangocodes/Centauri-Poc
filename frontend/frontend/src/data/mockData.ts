import type { UserProfile } from '../types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MOCK DATA LAYER
 * Static data used only to visualize the UI. Replace the consumers of this
 * module (see src/context/AppContext.tsx) with API-backed data later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// function hoursAgo(hours: number): string {
//   return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
// }

// function daysAgo(days: number, extraHours = 0): string {
//   return hoursAgo(days * 24 + extraHours)
// }

export const currentUser: UserProfile = {
  id: 'u-1',
  name: 'Mohammed Shaik',
  email: 'Mohammed.Shaik@centauri.io',
  role: 'Full Stack Developer',
  department: 'Product',
  location: 'Remote — New York, US',
  timezone: 'America/New_York (UTC-05:00)',
  bio: 'Leading the Centauri task management platform from concept to launch.',
  joinedAt: '2023-05-12T09:00:00.000Z',
  avatarColor: '#2563eb',
}

// const taskComments = {
//   auth: [
//     {
//       id: 'c-1',
//       author: 'Daniel Okafor',
//       role: 'Backend Engineer',
//       content:
//         'Auth endpoints are wired to the NestJS API. JWT refresh tokens still need to land.',
//       createdAt: hoursAgo(3),
//     },
//     {
//       id: 'c-2',
//       author: 'Sarah Mitchell',
//       role: 'Product Manager',
//       content: "Let's target finishing refresh tokens this sprint.",
//       createdAt: hoursAgo(1),
//     },
//   ],
//   design: [
//     {
//       id: 'c-3',
//       author: 'Priya Sharma',
//       role: 'Product Designer',
//       content:
//         'Approved in Monday’s design review. Handing over to engineering.',
//       createdAt: daysAgo(7, 2),
//     },
//   ],
//   pagination: [
//     {
//       id: 'c-4',
//       author: 'Priya Sharma',
//       role: 'Product Designer',
//       content:
//         'Reproduced in staging — only happens when the page size exceeds 20.',
//       createdAt: daysAgo(2, 4),
//     },
//     {
//       id: 'c-5',
//       author: 'Daniel Okafor',
//       role: 'Backend Engineer',
//       content: 'Root cause found — off-by-one in the SQL limit clause. FIX incoming.',
//       createdAt: daysAgo(1, 1),
//     },
//   ],
//   migration: [
//     {
//       id: 'c-6',
//       author: 'Kenji Tanaka',
//       role: 'DevOps Engineer',
//       content: 'Zero-downtime migration plan documented in the wiki.',
//       createdAt: daysAgo(12),
//     },
//   ],
//   audit: [
//     {
//       id: 'c-7',
//       author: 'Kenji Tanaka',
//       role: 'DevOps Engineer',
//       content: 'Blocking release until contrast ratios pass WCAG AA.',
//       createdAt: hoursAgo(8),
//     },
//   ],
// }

