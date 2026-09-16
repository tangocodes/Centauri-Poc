import { useState } from 'react'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Input, Textarea, FormField } from '../ui/Input'
import { Select } from '../ui/Select'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../constants'
import type { TaskFormValues, TaskPriority, TaskStatus } from '../../types'

interface TaskFormProps {
  initialValues?: Partial<TaskFormValues>
  submitLabel?: string
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
  loading?: boolean
  apiError?: string
}

const EMPTY_VALUES: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
}

export function TaskForm({
  initialValues,
  submitLabel = 'Create Task',
  onSubmit,
  onCancel,
  loading,
  apiError = ''
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  })
  const [errors, setErrors] = useState<{ title?: string }>({})

  const validate = (): boolean => {
    const nextErrors: { title?: string } = {}
    if (values.title.trim() === '') {
      nextErrors.title = 'Title is required'
    } else if (values.title.trim().length < 3) {
      nextErrors.title = 'Title must be at least 3 characters'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = () => {
    // Guard against double-submits (belt & braces; native `disabled`
    // already blocks clicks, this also protects programmatic calls).
    if (loading) return
    if (!validate()) return
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
    })
  }

  console.log(loading,"taskform")
  return (
    <div className="card form-card">
      <div className="form-grid">
        <FormField
          label="Title"
          htmlFor="task-title"
          required
          error={errors.title}
          className="form-field-full"
        >
          <Input
            id="task-title"
            name="title"
            placeholder="e.g. Implement user authentication flow"
            value={values.title}
            invalid={Boolean(errors.title)}
            onChange={(event) => setValues({ ...values, title: event.target.value })}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="task-description"
          className="form-field-full"
        >
          <Textarea
            id="task-description"
            name="description"
            rows={5}
            placeholder="Add a short description of the task…"
            value={values.description}
            onChange={(event) =>
              setValues({ ...values, description: event.target.value })
            }
          />
        </FormField>

        <FormField label="Status" htmlFor="task-status">
          <Select
            id="task-status"
            name="status"
            value={values.status}
            options={STATUS_OPTIONS}
            onChange={(event) =>
              setValues({ ...values, status: event.target.value as TaskStatus })
            }
          />
        </FormField>

        <FormField label="Priority" htmlFor="task-priority">
          <Select
            id="task-priority"
            name="priority"
            value={values.priority}
            options={PRIORITY_OPTIONS}
            onChange={(event) =>
              setValues({ ...values, priority: event.target.value as TaskPriority })
            }
          />
        </FormField>
      </div>

      {apiError && (
        <div className="form-alert" role="alert">
          <Icon name="alert" size={16} />
          <span>{apiError}</span>
        </div>
      )}

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? 'Saving…' : submitLabel}
        </Button>
      </div>
      

    </div>
  )
}