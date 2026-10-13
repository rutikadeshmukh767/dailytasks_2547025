import { CalendarDays, CheckCheck, CircleUserRound, LayoutDashboard, ListTodo, Sparkles } from 'lucide-react';

const nav = [
  { id: 'all', label: 'All tasks', icon: LayoutDashboard },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'upcoming', label: 'Upcoming', icon: ListTodo },
  { id: 'completed', label: 'Completed', icon: CheckCheck }
];

export default function Sidebar({ active, onChange, counts }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); onChange('all'); }}>
        <span className="brand-mark"><CheckCheck size={21} /></span><span>dayflow<span className="brand-dot">.</span><small>MAKE SPACE FOR WHAT MATTERS</small></span>
      </a>
      <div className="nav-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Task views">
        {nav.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onChange(id)}><Icon size={18} /><span>{label}</span><span className="nav-count">{counts[id] ?? 0}</span></button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="focus-card"><span className="focus-icon"><Sparkles size={18} /></span><strong>Small steps, big days.</strong><p>Progress is built one task at a time.</p></div>
        <div className="profile"><span className="avatar"><CircleUserRound size={22} /></span><span><strong>Your workspace</strong><small>Personal planner</small></span></div>
      </div>
    </aside>
  );
}