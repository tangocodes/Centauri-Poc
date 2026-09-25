import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Avatar } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/EmptyState'
import { Select } from '../components/ui/Select'
import { StatusBadge } from '../components/ui/StatusBadge'
import { StatCard } from '../components/dashboard/StatCard'
import { MyTasksPreview } from '../components/dashboard/MyTasksPreview'
import { TaskDistribution } from '../components/dashboard/TaskDistribution'
import { FilterChips } from '../components/task/FilterChips'
import { useApp } from '../context/appContext'
import {
  EMPTY_FILTERS,
  filterTasks,
  getTaskStats,
  isFilterActive,
  sortByMostRecent,
} from '../lib/tasks'
import { avatarColor, formatDate } from '../lib/format'
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants'
import type { Task, TaskFilters, TaskPriority, TaskStatus } from '../types'

/** Rows surfaced in the dashboard preview lists. */
const PREVIEW_LIMIT = 5

const MY_TASK_STATUS_OPTIONS = [{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]
const MY_TASK_PRIORITY_OPTIONS = [{ value: 'all', label: 'All priorities' }, ...PRIORITY_OPTIONS]

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** A task is "mine" when its assignee id matches the logged-in user. */
function isAssignedToMe(task: Task, userId: string | undefined): boolean {
  if (!userId) return false
  return task.assignedToId !== null && String(task.assignedToId.id) === String(userId)
}

export function DashboardPage() {
  const { user, tasks, navigate } = useApp()
  // Search is unused here: the Dashboard preview only filters by status/priority.
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS)

  /** Every task assigned to the logged-in user, newest first. */
  const assignedTasks = useMemo(
    () => sortByMostRecent(tasks.filter((task) => isAssignedToMe(task, user?.id))),
    [tasks, user],
  )

  // Every number below is derived from the tasks already held in AppContext.
  const stats = useMemo(() => {
    const { total, inProgress, completed } = getTaskStats(tasks)
    return {
      total,
      inProgress,
      completed,
      // Deliberately unfiltered: the summary card counts all of my tasks.
      assignedToMe: assignedTasks.length,
    }
  }, [tasks, assignedTasks])

  const filtersActive = isFilterActive(filters)

  /** Assignee first, then the status/priority filter, then the cap. */
  const myTasks = useMemo(
    () => filterTasks(assignedTasks, filters).slice(0, PREVIEW_LIMIT),
    [assignedTasks, filters],
  )

  const distribution = useMemo(() => {
    let assignedToMe = 0
    let assignedToOthers = 0
    let unassigned = 0

    for (const task of tasks) {
      if (!task.assignedToId) unassigned += 1
      else if (isAssignedToMe(task, user?.id)) assignedToMe += 1
      else assignedToOthers += 1
    }

    return { assignedToMe, assignedToOthers, unassigned }
  }, [tasks, user])

  const recentlyCreated = useMemo(() => sortByMostRecent(tasks).slice(0, PREVIEW_LIMIT), [tasks])

  const goToTasks = () => navigate({ name: 'tasks' })

  return (
    <div className="page-stack">
      <section className="greeting">
        <h2 className="greeting-title">
          {greeting()}, {user?.name.split(' ')[0] ?? 'there'}
          <span aria-hidden="true"> 👋</span>
        </h2>
        <p className="greeting-subtitle">
          Here’s what’s happening with your tasks today.
        </p>
      </section>

      <section className="stats-row">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon="list"
          tone="blue"
          trend="Everything in your workspace"
        />
        <StatCard
          label="My Tasks"
          value={stats.assignedToMe}
          icon="user"
          tone="slate"
          trend="Assigned to you"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon="play"
          tone="amber"
          trend="Actively being worked on"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon="checkCircle"
          tone="green"
          trend="Done and dusted 🎉"
        />
      </section>

      <section className="dash-grid">
        <article className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="section-title">My Tasks</h3>
              <p className="card-subtitle">The work currently assigned to you.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={goToTasks}>
              View all
              <Icon name="chevronRight" size={15} />
            </Button>
          </div>

          <div className="dash-filters">
            <Select
              aria-label="Filter my tasks by status"
              value={filters.status}
              onChange={(event) =>
                setFilters({ ...filters, status: event.target.value as TaskStatus | 'all' })
              }
              options={MY_TASK_STATUS_OPTIONS}
            />
            <Select
              aria-label="Filter my tasks by priority"
              value={filters.priority}
              onChange={(event) =>
                setFilters({ ...filters, priority: event.target.value as TaskPriority | 'all' })
              }
              options={MY_TASK_PRIORITY_OPTIONS}
            />
          </div>

          {/* Applied filters are echoed as chips and can be cleared individually. */}
          <FilterChips filters={filters} onChange={setFilters} showSearchChip={false} />

          <MyTasksPreview
            tasks={myTasks}
            onView={(taskId) => navigate({ name: 'task-detail', taskId })}
            emptyTitle={filtersActive && assignedTasks.length > 0 ? 'No matching tasks' : undefined}
            emptyDescription={
              filtersActive && assignedTasks.length > 0 ? 'Try changing your filters.' : undefined
            }
          />
        </article>

        <TaskDistribution
          assignedToMe={distribution.assignedToMe}
          assignedToOthers={distribution.assignedToOthers}
          unassigned={distribution.unassigned}
        />
      </section>

      <article className="card dash-card">
        <div className="dash-card-head">
          <div>
            <h3 className="section-title">Recently Created</h3>
            <p className="card-subtitle">The latest tasks added to your workspace.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={goToTasks}>
            View all
            <Icon name="chevronRight" size={15} />
          </Button>
        </div>

        {recentlyCreated.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No tasks yet"
            description="New tasks will appear here as soon as they are created."
          />
        ) : (
          <ul className="dash-list">
            {recentlyCreated.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  className="dash-row"
                  onClick={() => navigate({ name: 'task-detail', taskId: task.id })}
                >
                  <span className="dash-row-main">
                    <span className="dash-row-title">{task.title}</span>
                    <span className="dash-row-meta">
                      Created by {task.createdById?.name ?? 'Unknown'} ·{' '}
                      {formatDate(task.createdAt)}
                    </span>
                  </span>
                  <span className="dash-row-side">
                    <StatusBadge status={task.status} />
                    <span className="meta-chip">
                      {task.assignedToId ? (
                        <>
                          <Avatar
                            name={task.assignedToId.name}
                            color={avatarColor(task.assignedToId.name)}
                            size="sm"
                          />
                          {task.assignedToId.name}
                        </>
                      ) : (
                        <>
                          <Icon name="user" size={14} />
                          Unassigned
                        </>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  )
}
