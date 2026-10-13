import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useTasks } from './context/TaskContext.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('all');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { tasks } = useTasks();
  const today = new Date().toISOString().slice(0, 10);
  const counts = {
    all: tasks.length,
    today: tasks.filter((task) => task.dueDate === today && !task.completed).length,
    upcoming: tasks.filter((task) => task.dueDate > today && !task.completed).length,
    completed: tasks.filter((task) => task.completed).length
  };
  const selectView = (view) => { setActiveView(view); setMobileOpen(false); };
  return (
    <div className="app-shell">
      <button className="mobile-menu-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <div className={`sidebar-wrap ${mobileOpen ? 'sidebar-wrap-open' : ''}`}><Sidebar active={activeView} onChange={selectView} counts={counts} /></div>
      <main className="main-area"><Dashboard activeView={activeView} /></main>
    </div>
  );
}