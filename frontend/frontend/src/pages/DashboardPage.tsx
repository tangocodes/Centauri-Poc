import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { StatCard } from '../components/dashboard/StatCard'
import { TaskFilters } from '../components/task/TaskFilters'
import { TaskList } from '../components/task/TaskList'
import { Modal } from '../components/ui/Modal'
import { useApp } from '../context/appContext'
import { EMPTY_FILTERS, filterTasks, getTaskStats, sortByMostRecent } from '../lib/tasks'
import type { TaskFilters as TaskFiltersType } from '../types'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const { user, tasks, navigate, deleteTask } = useApp()
  const [filters, setFilters] = useState<TaskFiltersType>(EMPTY_FILTERS)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const stats = useMemo(() => getTaskStats(tasks), [tasks])
  const filtered = useMemo(() => sortByMostRecent(filterTasks(tasks, filters)), [tasks, filters])
  const recent = filtered.slice(0, 5)

  const deleteTarget = tasks.find((task) => task.id === deleteTargetId)

  const handleDelete = () => {
    if (!deleteTargetId) return
    deleteTask(deleteTargetId)
    setDeleteTargetId(null)
  }

  return (
    <div className="page-stack">
      <section className="greeting">
        <h2 className="greeting-title">
          {greeting()}, {user.name.split(' ')[0]}
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
          trend="Across all projects"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon="play"
          tone="blue"
          trend="Actively being worked on"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon="checkCircle"
          tone="green"
          trend="Ship it! 🎉"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon="hourglass"
          tone="amber"
          trend="Awaiting attention"
        />
      </section>

      <section className="section-block">
        <div className="section-head">
          <h3 className="section-title">Recent tasks</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'tasks' })}>
            View all
            <Icon name="chevronRight" size={15} />
          </Button>
        </div>

        <TaskFilters
          filters={filters}
          onChange={setFilters}
          action={
            <Button
              onClick={() => navigate({ name: 'create-task' })}
              icon={<Icon name="plus" size={16} />}
            >
              Create Task
            </Button>
          }
        />

        <TaskList
          tasks={recent}
          showAssignee
          onView={(taskId) => navigate({ name: 'task-detail', taskId })}
          onEdit={(taskId) => navigate({ name: 'edit-task', taskId })}
          onDelete={setDeleteTargetId}
          emptyTitle="No tasks match your filters"
          emptyDescription="Try clearing your search or filters."
        />
      </section>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTargetId(null)}
        title="Delete task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete task
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <p className="modal-text">
            This will permanently delete{' '}
            <strong>“{deleteTarget.title}”</strong>. This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  )
}