import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { LoadingState } from '../components/ui/LoadingState'
import { Pagination } from '../components/ui/Pagination'
import { Modal } from '../components/ui/Modal'
import { TaskFilters } from '../components/task/TaskFilters'
import { TaskList } from '../components/task/TaskList'
import { useApp } from '../context/appContext'
import { EMPTY_FILTERS, filterTasks, sortByMostRecent } from '../lib/tasks'
import type { TaskFilters as TaskFiltersType } from '../types'

const PAGE_SIZE = 6

export function TasksPage() {
  const { tasks, navigate, deleteTask } = useApp()
  const [filters, setFilters] = useState<TaskFiltersType>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulated fetch to showcase the LoadingState. Remove once wired to the API.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [])

  // Reset to the first page whenever the filters change.
  const changeFilters = (next: TaskFiltersType) => {
    setPage(1)
    setFilters(next)
  }

  const filtered = useMemo(
    () => sortByMostRecent(filterTasks(tasks, filters)),
    [tasks, filters],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const deleteTarget = tasks.find((task) => task.id === deleteTargetId)

  const handleDelete = () => {
    if (!deleteTargetId) return
    deleteTask(deleteTargetId)
    setDeleteTargetId(null)
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="All Tasks"
        subtitle="Search, filter, and manage every task in your workspace."
        actions={
          <Button
            onClick={() => navigate({ name: 'create-task' })}
            icon={<Icon name="plus" size={16} />}
          >
            Create Task
          </Button>
        }
      />

      <TaskFilters filters={filters} onChange={changeFilters} />

      {loading ? (
        <div className="card">
          <LoadingState label="Loading tasks…" />
        </div>
      ) : (
        <>
          <TaskList
            tasks={visible}
            showAssignee
            onView={(taskId) => navigate({ name: 'task-detail', taskId })}
            onEdit={(taskId) => navigate({ name: 'edit-task', taskId })}
            onDelete={setDeleteTargetId}
            emptyTitle="No tasks found"
            emptyDescription="Try adjusting your search or filters, or create a new task."
          />

          <Pagination
            page={safePage}
            pageCount={pageCount}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}

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