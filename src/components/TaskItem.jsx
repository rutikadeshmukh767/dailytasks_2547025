import { CalendarDays, Check, Circle, Clock3, MoreHorizontal, Trash2 } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'No due date';
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TaskItem({ task, onToggle, onDelete }) {
  const overdue = task.dueDate && task.dueDate < new Date().toISOString().slice(0, 10) && !task.completed;
  return (
    <article className={`task-item ${task.completed ? 'is-complete' : ''}`}>
      <button className={`check-button ${task.completed ? 'checked' : ''}`} aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'} onClick={() => onToggle(task.id)}>
        {task.completed ? <Check size={15} strokeWidth={3} /> : <Circle size={19} />}
      </button>
      <div className="task-content">
        <div className="task-title-line"><h3>{task.title}</h3><span className={`priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span></div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className={`due-date ${overdue ? 'overdue' : ''}`}><CalendarDays size={13} /> {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}</span>
          <span className="category-tag">{task.category}</span>
        </div>
      </div>
      <button className="icon-button delete-button" title="Delete task" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}><Trash2 size={17} /></button>
    </article>
  );
}