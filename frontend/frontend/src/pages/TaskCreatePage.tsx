import { PageHeader } from '../components/ui/PageHeader'
import { BackButton } from '../components/ui/BackButton'
import { TaskForm } from '../components/task/TaskForm'
import { useApp } from '../context/appContext'
import { useEffect } from 'react'

export function TaskCreatePage() {
  const { navigate, saveTask, loading, apiError,clearErrorState,allUsers } = useApp()

  useEffect(()=>{
clearErrorState()
  },[])

  return (
    <div className="page-stack">
      <BackButton label="Back" onClick={() => navigate({ name: 'tasks' })} />

      <PageHeader
        title="New Task"
        subtitle="Create a task and assign it a status and priority."
      />

      <TaskForm
        onSubmit={ (values) => {
          // TODO: replace with a real create-task API call.
         saveTask(null, values)
         navigate({ name: 'tasks' })
        }}
        loading={loading}
        apiError={apiError}
        onCancel={() => navigate({ name: 'tasks' })}
        allUsersData = {allUsers}
      />
    </div>
  )
}