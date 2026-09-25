import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Input'
import { Avatar } from '../ui/Avatar'
import { Icon } from '../ui/Icon'
import { useApp } from '../../context/appContext'
import { timeAgo, avatarColor } from '../../lib/format'
import type { TaskComment, TaskCommentPost } from '../../types'

interface CommentSectionProps {
  taskId: number
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const { user, addComment,taskComments,getComments } = useApp()
  const [draft, setDraft] = useState('')


  const handleSubmit = () => {
    const content = draft.trim()

    const value : TaskCommentPost = {
      taskId : taskId,
      content : content
    }
    if (!content) return
    addComment(value)
    setDraft('')
  }

  useEffect(()=>{
   
    getComments(taskId)

  },[])

  return (
    <div className="card comments-card">
      <div className="comments-header">
        <h3 className="card-title">Comments</h3>
        <span className="comment-count">
          {taskComments?.length} {taskComments?.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <div className="comments-list">
        {taskComments?.length === 0 && (
          <p className="comments-empty">
            No comments yet. Start the discussion below.
          </p>
        )}
        {taskComments?.map((comment) => (
          <div key={comment.id} className="comment">
            <Avatar name={comment.author.name} color={avatarColor(comment.author.name)} size="sm" />
            <div className="comment-body">
              <div className="comment-meta">
                <span className="comment-author">{comment.author.name}</span>
                <span className="comment-role">{comment.author.role}</span>
                <span className="comment-time">{timeAgo(comment.createdAt)}</span>
              </div>
              <p className="comment-text">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="comment-composer">
        {user &&<Avatar name={user?.name} color={avatarColor(user?.name)} size="sm" />}
        <div className="comment-composer-input">
          <Textarea
            rows={2}
            placeholder="Add a comment…"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="comment-composer-actions">
            <Button
              size="sm"
              disabled={draft.trim() === ''}
              onClick={handleSubmit}
            >
              <Icon name="message" size={15} />
              Add comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}