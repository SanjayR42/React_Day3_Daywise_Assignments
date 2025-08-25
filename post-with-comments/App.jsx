import { useEffect, useState } from "react";
const API = "https://jsonplaceholder.typicode.com";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(`${API}/posts`);
      const data = await res.json();
      if (alive) {
        setPosts(data);
        setActiveId(data[0]?.id ?? null);
      }
      setLoadingPosts(false);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let alive = true;
    (async () => {
      setLoadingComments(true);
      const res = await fetch(`${API}/posts/${activeId}/comments`);
      const data = await res.json();
      if (alive) setComments(data);
      setLoadingComments(false);
    })();
    return () => { alive = false; };
  }, [activeId]);

  return (
    <>
      <div className="panel">
        <h3>Posts</h3>
        {loadingPosts && <p>Loading…</p>}
        {posts.map(p => (
          <div key={p.id} className={`post ${activeId === p.id ? "active" : ""}`} onClick={() => setActiveId(p.id)}>
            <strong>{p.title}</strong>
            <p>{p.body.slice(0,120)}…</p>
          </div>
        ))}
      </div>
      <div className="panel">
        <h3>Comments</h3>
        {loadingComments && <p>Loading…</p>}
        {comments.map(c => (
          <div key={c.id} className="comment">
            <strong>{c.name}</strong> — {c.email}
            <p>{c.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
