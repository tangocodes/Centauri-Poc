import { PageHeader } from '../components/ui/PageHeader'
import { Button, IconButton } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { ErrorState } from '../components/ui/ErrorState'
import { TaskForm } from '../components/task/TaskForm'
import { useApp } from '../context/appContext'

export function TaskEditPage({ taskId }: { taskId: string }) {
  const { tasks, navigate, saveTask } = useApp()
  const task = tasks.find((item) => item.id === taskId)

  if (!task) {
    return (
      <div className="page-stack">
        <ErrorState
          title="Task not found"
          description="This task may have been deleted."
          action={
            <Button variant="secondary" onClick={() => navigate({ name: 'tasks' })}>
              Back to tasks
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="page-stack">
      <IconButton
        label="Back to task"
        size="sm"
        onClick={() => navigate({ name: 'task-detail', taskId })}
      >
        <Icon name="chevronLeft" size={18} />
      </IconButton>

      <PageHeader
        title="Edit Task"
        subtitle="Update the details of this task."
      />

      <TaskForm
        initialValues={{
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
        }}
        submitLabel="Save Changes"
        onSubmit={(values) => {
          // TODO: replace with a real update-task API call.
          saveTask(task.id, values)
          navigate({ name: 'task-detail', taskId })
        }}
        onCancel={() => navigate({ name: 'task-detail', taskId })}
      />
    </div>
  )
}