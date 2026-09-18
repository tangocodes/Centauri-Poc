import {  useState } from 'react'
import { Button, IconButton } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
// import { Avatar } from '../components/ui/Avatar'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PriorityBadge } from '../components/ui/PriorityBadge'
import { ErrorState } from '../components/ui/ErrorState'
import { Modal } from '../components/ui/Modal'
// import { CommentSection } from '../components/task/CommentSection'
import { useApp } from '../context/appContext'
import { formatDateTime } from '../lib/format'

export function TaskDetailPage({ taskId }: { taskId: number }) {



  
  const {  tasks,navigate, deleteTask  } = useApp()
  const [confirmDelete, setConfirmDelete] = useState(false)


 
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

  const handleDelete = () => {
    // TODO: replace with a real delete-task API call.
    deleteTask(task.id)
    setConfirmDelete(false)
    navigate({ name: 'tasks' })
  }


 
  return (
    <div className="page-stack">
      <IconButton label="Back to tasks" size="sm" onClick={() => navigate({ name: 'tasks' })}>
        <Icon name="chevronLeft" size={18} />
      </IconButton>

      <div className="card detail-card">
        <div className="detail-top">
          <div className="detail-title-row">
            <h2 className="detail-title">{task?.title}</h2>
            <div className="detail-badges">
              <StatusBadge status={task?.status} />
              <PriorityBadge priority={task?.priority} />
            </div>
          </div>

          <div className="detail-actions">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate({ name: 'edit-task', taskId })}
            >
              <Icon name="edit" size={15} />
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={15} />
              Delete
            </Button>
          </div>
        </div>

        <div className="detail-meta-grid">
          <div className="meta-item">
            <span className="meta-item-icon">
              <Icon name="checkCircle" size={16} />
            </span>
            <div>
              <span className="meta-item-label">Status</span>
              <span className="meta-item-value">
                <StatusBadge status={task?.status} />
              </span>
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-item-icon">
              <Icon name="flag" size={16} />
            </span>
            <div>
              <span className="meta-item-label">Priority</span>
              <span className="meta-item-value">
                <PriorityBadge priority={task?.priority} />
              </span>
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-item-icon">
              <Icon name="calendar" size={16} />
            </span>
            <div>
              <span className="meta-item-label">Created</span>
              <span className="meta-item-value">{formatDateTime(task.createdAt)}</span>
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-item-icon">
              <Icon name="clock" size={16} />
            </span>
            <div>
              <span className="meta-item-label">Last updated</span>
              <span className="meta-item-value">{formatDateTime(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="detail-section-title">Description</h3>
          <p className="detail-description">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <div className="detail-section">
          <h3 className="detail-section-title">People</h3>
          <div className="detail-people">
            <span className="person-chip">
              {/* <Avatar name={task.assignee} color={avatarColor(task.assignee)} size="sm" /> */}
              <span>
                {/* <strong>{task.assignee}</strong> */}
                <small>Assignee</small>
              </span>
            </span>
            <span className="person-chip">
              {/* <Avatar name={task.createdBy} color={avatarColor(task.createdBy)} size="sm" /> */}
              <span>
                {/* <strong>{task.createdBy}</strong> */}
                <small>Created by</small>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* <CommentSection taskId={task.id} comments={task.comments} /> */}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete task
            </Button>
          </>
        }
      >
        <p className="modal-text">
          This will permanently delete <strong>“{task.title}”</strong>. This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  )

   
   
 
}
 

   
  
