// Client-only storage adapter. No server or API is required.
const STORAGE_KEY = 'dayflow_tasks_v1';

export function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Could not save tasks to browser storage.', error);
  }
}

export function createTask(values) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: values.title.trim(),
    description: values.description.trim(),
    dueDate: values.dueDate,
    priority: values.priority,
    category: values.category,
    completed: false,
    createdAt: new Date().toISOString()
  };
}