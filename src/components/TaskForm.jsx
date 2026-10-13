import { useState } from 'react';
import { CalendarDays, Flag, Plus, X } from 'lucide-react';

const initial = { title: '', description: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'Medium', category: 'Personal' };

export default function TaskForm({ onClose }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');

  function change(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    window.dispatchEvent(new CustomEvent('dayflow:add-task', { detail: values }));
    setValues(initial);
    setError('');
    onClose?.();
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-heading">
          <div><span className="eyebrow">MAKE IT HAPPEN</span><h2 id="task-form-title">Create a task</h2></div>
          <button className="icon-button" type="button" aria-label="Close" onClick={onClose}><X size={19} /></button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label>Task title<input name="title" value={values.title} onChange={change} placeholder="What needs to get done?" autoFocus maxLength={100} /></label>
          <label>Description <span className="optional">(optional)</span><textarea name="description" value={values.description} onChange={change} placeholder="Add a few details..." rows="3" maxLength={400} /></label>
          <div className="form-grid">
            <label><span className="label-icon"><CalendarDays size={15} /> Due date</span><input type="date" name="dueDate" value={values.dueDate} onChange={change} /></label>
            <label><span className="label-icon"><Flag size={15} /> Priority</span><select name="priority" value={values.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></label>
          </div>
          <label>Category<select name="category" value={values.category} onChange={change}><option>Personal</option><option>Work</option><option>Study</option><option>Health</option><option>Other</option></select></label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Plus size={17} /> Add task</button></div>
        </form>
      </section>
    </div>
  );
}