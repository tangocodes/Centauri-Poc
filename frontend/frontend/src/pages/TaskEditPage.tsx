import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { BackButton } from '../components/ui/BackButton'
import { ErrorState } from '../components/ui/ErrorState'
import { TaskForm } from '../components/task/TaskForm'
import { useApp } from '../context/appContext'
import { useEffect } from 'react'

export function TaskEditPage({ taskId }: { taskId: number }) {
  const { tasks, navigate, saveTask ,loading , apiError,clearErrorState ,allUsers } = useApp()
  const task = tasks.find((item) => item.id === taskId)
  
  console.log(task)
  

  useEffect(()=>{
    clearErrorState()
  },[])
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
      
      <BackButton
        label="Back"
        onClick={() => navigate({ name: 'task-detail', taskId })}
      />

      <PageHeader
        title="Edit Task"
        subtitle="Update the details of this tasks."
      />

      <TaskForm
        initialValues={{
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedToId:String(task.assignedToId?.id)  
        }}
        submitLabel="Save Changes"
        onSubmit={(values) => {
          // TODO: replace with a real update-task API call.
          console.log("clicked")
          saveTask(task.id, values)
        
         // navigate({ name: 'task-detail', taskId })
        }}
        loading={loading}
        allUsersData={allUsers}
        onCancel={() => navigate({ name: 'task-detail', taskId })}
        apiError={apiError}
      />
    </div>
  )
}