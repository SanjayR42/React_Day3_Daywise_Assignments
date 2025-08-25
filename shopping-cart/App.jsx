import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "https://fakestoreapi.com";

function List() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/products?limit=12`);
        const data = await res.json();
        if (alive) setItems(data);
      } catch (e) {
        setErr("Failed to load products.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <p>Loading…</p>;
  if (err) return <p>{err}</p>;

  return (
    <div className="grid">
      {items.map(p => (
        <Link key={p.id} to={`/product/${p.id}`} className="card">
          <img src={p.image} alt={p.title} />
          <strong>{p.title}</strong>
          <div>₹ {Math.round(p.price * 83)}</div>
        </Link>
      ))}
    </div>
  );
}

function Details() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);
        const data = await res.json();
        if (alive) setItem(data);
      } catch (e) {
        setErr("Could not load product details.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p>{err}</p>;

  return (
    <div>
      <a className="back" onClick={() => nav(-1)} href="#">← Back</a>
      <div className="card detail">
        <img src={item.image} alt={item.title} />
        <div>
          <h2>{item.title}</h2>
          <h3>₹ {Math.round(item.price * 83)}</h3>
          <p>{item.description}</p>
          <p>Rating: {item?.rating?.rate} ⭐ ({item?.rating?.count})</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/product/:id" element={<Details />} />
    </Routes>
  );
}
