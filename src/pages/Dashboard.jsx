import { useMemo, useState, useEffect } from 'react';
import { ArrowDownWideNarrow, CheckCircle2, Clock3, Plus, Search, SlidersHorizontal, Target } from 'lucide-react';
import { useTasks } from '../context/TaskContext.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskItem from '../components/TaskItem.jsx';

const todayString = () => new Date().toISOString().slice(0, 10);
const headings = { all: ['Your overview', 'All tasks'], today: ['One day at a time', 'Today'], upcoming: ['Look ahead', 'Upcoming tasks'], completed: ['Look how far you’ve come', 'Completed tasks'] };

export default function Dashboard({ activeView }) {
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All priorities');
  const [sortBy, setSortBy] = useState('Due date');
  useEffect(() => {
    const handler = (event) => addTask(event.detail);
    window.addEventListener('dayflow:add-task', handler);
    return () => window.removeEventListener('dayflow:add-task', handler);
  }, [addTask]);

  const today = todayString();
  const completed = tasks.filter((task) => task.completed).length;
  const todayTasks = tasks.filter((task) => task.dueDate === today && !task.completed);
  const activeTasks = tasks.filter((task) => !task.completed);
  const counts = {
    all: tasks.length,
    today: todayTasks.length,
    upcoming: tasks.filter((task) => task.dueDate > today && !task.completed).length,
    completed
  };
  const visibleTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      if (activeView === 'today' && task.dueDate !== today) return false;
      if (activeView === 'upcoming' && (!task.dueDate || task.dueDate <= today || task.completed)) return false;
      if (activeView === 'completed' && !task.completed) return false;
      if (activeView !== 'completed' && task.completed) return false;
      if (priorityFilter !== 'All priorities' && task.priority !== priorityFilter) return false;
      const term = search.trim().toLowerCase();
      if (term && !`${task.title} ${task.description} ${task.category}`.toLowerCase().includes(term)) return false;
      return true;
    });
    result.sort((a, b) => {
      if (sortBy === 'Priority') return ({ High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority]);
      if (sortBy === 'Recently added') return new Date(b.createdAt) - new Date(a.createdAt);
      return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
    });
    return result;
  }, [tasks, activeView, today, priorityFilter, search, sortBy]);

  const [eyebrow, title] = headings[activeView] || headings.all;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard">
      <header className="topbar"><div className="mobile-brand">dayflow<span>.</span></div><div className="topbar-date"><span className="live-dot" /> YOUR PERSONAL DAILY PLANNER</div><div className="today-date">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div></header>
      <section className="welcome-row"><div><p className="eyebrow">{eyebrow.toUpperCase()}</p><h1>{activeView === 'all' ? `${greeting} 👋` : title}</h1><p className="welcome-subtitle">{activeView === 'all' ? 'A fresh start. Make today count.' : activeView === 'today' ? 'Focus on what matters today.' : activeView === 'upcoming' ? 'A little planning goes a long way.' : 'Every finished task is a win.'}</p></div><button className="button button-primary add-task-button" onClick={() => setShowForm(true)}><Plus size={18} /> New task</button></section>

      <section className="stats-grid" aria-label="Task summary">
        <div className="stat-card stat-main"><span className="stat-icon"><Target size={19} /></span><span className="stat-label">Total tasks</span><strong>{tasks.length}</strong><small><span className="stat-accent">{activeTasks.length}</span> still to do</small></div>
        <div className="stat-card"><span className="stat-icon green"><CheckCircle2 size={19} /></span><span className="stat-label">Completed</span><strong>{completed}</strong><small>{progress}% of all tasks</small></div>
        <div className="stat-card"><span className="stat-icon purple"><Clock3 size={19} /></span><span className="stat-label">Due today</span><strong>{todayTasks.length}</strong><small>Keep your momentum</small></div>
        <div className="stat-card progress-stat"><span className="stat-label">Your progress</span><strong>{progress}<small>%</small></strong><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><small>Keep going, you're doing great!</small></div>
      </section>

      <section className="task-section">
        <div className="section-heading"><div><h2>{title}</h2><p>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} to show</p></div>{activeView === 'completed' && completed > 0 && <button className="text-button" onClick={clearCompleted}>Clear completed</button>}</div>
        <div className="filter-bar">
          <label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your tasks..." aria-label="Search tasks" /></label>
          <label className="filter-select"><SlidersHorizontal size={15} /><select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} aria-label="Filter by priority"><option>All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></label>
          <label className="filter-select"><ArrowDownWideNarrow size={15} /><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort tasks"><option>Due date</option><option>Priority</option><option>Recently added</option></select></label>
        </div>
        <div className="task-list">
          {visibleTasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)}
          {visibleTasks.length === 0 && <div className="empty-state"><span className="empty-illustration"><CheckCircle2 size={27} /></span><h3>{search || priorityFilter !== 'All priorities' ? 'No matching tasks' : activeView === 'completed' ? 'Nothing completed just yet' : 'Your list is clear'}</h3><p>{search || priorityFilter !== 'All priorities' ? 'Try changing your search or filters.' : 'Add a task to turn your plans into progress.'}</p>{activeView !== 'completed' && <button className="button button-primary" onClick={() => setShowForm(true)}><Plus size={17} /> Create your first task</button>}</div>}
        </div>
      </section>
      <footer className="dashboard-footer"><span>Made for a more intentional day.</span><span>{completed} of {tasks.length} tasks completed</span></footer>
      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
}