import { useEffect, useMemo, useState } from "react";
const API = "https://jsonplaceholder.typicode.com";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | completed | pending

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(`${API}/todos?_limit=20`);
      const data = await res.json();
      if (alive) setTodos(data);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "completed") return todos.filter(t => t.completed);
    if (filter === "pending") return todos.filter(t => !t.completed);
    return todos;
  }, [todos, filter]);

  const counts = useMemo(() => {
    const completed = todos.filter(t => t.completed).length;
    const pending = todos.length - completed;
    return { completed, pending, total: todos.length };
  }, [todos]);

  return (
    <div className="panel">
      <h2>Todo Tracker</h2>
      <div className="controls">
        <span className="badge">Total: {counts.total}</span>
        <span className="badge">Completed: {counts.completed}</span>
        <span className="badge">Pending: {counts.pending}</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed Only</option>
          <option value="pending">Pending Only</option>
        </select>
      </div>
      {loading && <p>Loading…</p>}
      <div className="list">
        {filtered.map(t => (
          <div key={t.id} className="item">
            <span>{t.title}</span>
            <input type="checkbox" checked={t.completed} readOnly />
          </div>
        ))}
      </div>
    </div>
  );
}
