import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createTask, loadTasks, saveTasks } from '../api.js';

const TaskContext = createContext(null);
export const useTasks = () => useContext(TaskContext);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => loadTasks());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (values) => setTasks((current) => [createTask(values), ...current]);
  const updateTask = (id, changes) =>
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...changes } : task));
  const toggleTask = (id) =>
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  const deleteTask = (id) => setTasks((current) => current.filter((task) => task.id !== id));
  const clearCompleted = () => setTasks((current) => current.filter((task) => !task.completed));

  const value = useMemo(() => ({ tasks, addTask, updateTask, toggleTask, deleteTask, clearCompleted }),
    [tasks]);
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}