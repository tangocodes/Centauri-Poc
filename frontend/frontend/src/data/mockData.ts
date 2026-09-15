import type { Task, UserProfile } from '../types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MOCK DATA LAYER
 * Static data used only to visualize the UI. Replace the consumers of this
 * module (see src/context/AppContext.tsx) with API-backed data later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function daysAgo(days: number, extraHours = 0): string {
  return hoursAgo(days * 24 + extraHours)
}

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

const taskComments = {
  auth: [
    {
      id: 'c-1',
      author: 'Daniel Okafor',
      role: 'Backend Engineer',
      content:
        'Auth endpoints are wired to the NestJS API. JWT refresh tokens still need to land.',
      createdAt: hoursAgo(3),
    },
    {
      id: 'c-2',
      author: 'Sarah Mitchell',
      role: 'Product Manager',
      content: "Let's target finishing refresh tokens this sprint.",
      createdAt: hoursAgo(1),
    },
  ],
  design: [
    {
      id: 'c-3',
      author: 'Priya Sharma',
      role: 'Product Designer',
      content:
        'Approved in Monday’s design review. Handing over to engineering.',
      createdAt: daysAgo(7, 2),
    },
  ],
  pagination: [
    {
      id: 'c-4',
      author: 'Priya Sharma',
      role: 'Product Designer',
      content:
        'Reproduced in staging — only happens when the page size exceeds 20.',
      createdAt: daysAgo(2, 4),
    },
    {
      id: 'c-5',
      author: 'Daniel Okafor',
      role: 'Backend Engineer',
      content: 'Root cause found — off-by-one in the SQL limit clause. FIX incoming.',
      createdAt: daysAgo(1, 1),
    },
  ],
  migration: [
    {
      id: 'c-6',
      author: 'Kenji Tanaka',
      role: 'DevOps Engineer',
      content: 'Zero-downtime migration plan documented in the wiki.',
      createdAt: daysAgo(12),
    },
  ],
  audit: [
    {
      id: 'c-7',
      author: 'Kenji Tanaka',
      role: 'DevOps Engineer',
      content: 'Blocking release until contrast ratios pass WCAG AA.',
      createdAt: hoursAgo(8),
    },
  ],
}

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Implement user authentication flow',
    description:
      'Build the login, logout, and password reset flows on top of the NestJS auth module, including JWT handling.',
    status: 'in-progress',
    priority: 'high',
    createdAt: daysAgo(2, 3),
    updatedAt: hoursAgo(1),
   // comments: taskComments.auth,
  },
  {
    id: 't-2',
    title: 'Design dashboard wireframes',
    description:
      'Create high-fidelity wireframes for the dashboard, task list, and task detail screens.',
    status: 'completed',
    priority: 'medium',
    // assignee: 'Priya Sharma',
    // createdBy: 'Sarah Mitchell',
    createdAt: daysAgo(9),
    updatedAt: daysAgo(6, 1),
   // comments: taskComments.design,
  },
  {
    id: 't-3',
    title: 'Set up CI/CD pipeline',
    description:
      'Configure automated builds, tests, and deployments for both the backend and frontend repositories.',
    status: 'pending',
    priority: 'urgent',
    // assignee: 'Daniel Okafor',
    // createdBy: 'Kenji Tanaka',
    createdAt: daysAgo(1, 2),
    updatedAt: daysAgo(1, 2),
    //comments: [],
  },
  {
    id: 't-4',
    title: 'Fix pagination bug on tasks API',
    description:
      'Incorrect total count on the last page when filtering by status. Add regression coverage.',
    status: 'in-progress',
    priority: 'high',
    // assignee: 'Priya Sharma',
    // createdBy: 'Daniel Okafor',
    createdAt: daysAgo(4, 5),
    updatedAt: daysAgo(1, 1),
    //comments: taskComments.pagination,
  },
  {
    id: 't-5',
    title: 'Write integration tests for auth module',
    description:
      'Cover the full register → login → refresh → logout lifecycle against the test database.',
    status: 'todo',
    priority: 'medium',
    // assignee: 'Daniel Okafor',
    // createdBy: 'Sarah Mitchell',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
   // comments: [],
  },
  {
    id: 't-6',
    title: 'Update onboarding email copy',
    description:
      'Rewrite the welcome sequence to match the new product positioning and tone of voice.',
    status: 'pending',
    priority: 'low',
    // assignee: 'Sarah Mitchell',
    // createdBy: 'Sarah Mitchell',
    createdAt: daysAgo(3, 6),
    updatedAt: daysAgo(3, 6),
    //comments: [],
  },
  {
    id: 't-7',
    title: 'Migrate database to PostgreSQL',
    description:
      'Move production data from SQLite to PostgreSQL with a zero-downtime migration strategy.',
    status: 'completed',
    priority: 'high',
    // assignee: 'Kenji Tanaka',
    // createdBy: 'Daniel Okafor',
    createdAt: daysAgo(14, 2),
    updatedAt: daysAgo(3),
   // comments: taskComments.migration,
  },
  {
    id: 't-8',
    title: 'Add 2FA support',
    description:
      'Support TOTP-based two-factor authentication for admin accounts during login.',
    status: 'todo',
    priority: 'high',
    // assignee: 'Kenji Tanaka',
    // createdBy: 'Sarah Mitchell',
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
   // comments: [],
  },
  {
    id: 't-9',
    title: 'Refactor notification service',
    description:
      'Extract the notification delivery into its own module with pluggable email and webhook providers.',
    status: 'in-progress',
    priority: 'medium',
    // assignee: 'Maria Lopez',
    // createdBy: 'Kenji Tanaka',
    createdAt: daysAgo(5, 2),
    updatedAt: daysAgo(1, 5),
   // comments: [],
  },
  {
    id: 't-10',
    title: 'Prepare Q3 product roadmap',
    description:
      'Compile the Q3 roadmap deck with priorities, estimates, and dependency notes for leadership review.',
    status: 'pending',
    priority: 'medium',
    // assignee: 'Sarah Mitchell',
    // createdBy: 'Sarah Mitchell',
    createdAt: daysAgo(2, 9),
    updatedAt: daysAgo(2, 9),
   // comments: [],
  },
  {
    id: 't-11',
    title: 'Improve mobile navigation UX',
    description:
      'Redesign the mobile drawer navigation and bottom bar for one-handed reachability.',
    status: 'todo',
    priority: 'low',
    // assignee: 'Maria Lopez',
    // createdBy: 'Priya Sharma',
    createdAt: daysAgo(7, 4),
    updatedAt: daysAgo(5),
  //  comments: [],
  },
  {
    id: 't-12',
    title: 'Audit accessibility compliance',
    description:
      'Run a full WCAG 2.1 AA audit across the dashboard and task screens; fix all critical issues.',
    status: 'in-progress',
    priority: 'urgent',
    // assignee: 'Priya Sharma',
    // createdBy: 'Sarah Mitchell',
    createdAt: daysAgo(1, 6),
    updatedAt: hoursAgo(8),
   // comments: taskComments.audit,
  },
]