import { useEffect, useMemo, useState } from "react";

const API = "https://fakestoreapi.com";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const endpoint = useMemo(() => {
    if (category === "all") return `${API}/products`;
    return `${API}/products/category/${encodeURIComponent(category)}`;
  }, [category]);

  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const [catsRes, prodRes] = await Promise.all([
          categories.length ? Promise.resolve(null) : fetch(`${API}/products/categories`),
          fetch(endpoint)
        ]);
        if (!alive) return;
        if (catsRes) {
          const cats = await catsRes.json();
          setCategories(["all", ...cats]);
        }
        const data = await prodRes.json();
        setProducts(data);
      } catch (e) {
        setErr("Failed to load products. Please retry.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchData();
    return () => { alive = false; };
  }, [endpoint]);

  return (
    <div>
      <div className="topbar">
        <h2 style={{ marginRight: 8 }}>Catalog</h2>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {err && <button onClick={() => setCategory(c => c)}>Retry</button>}
      </div>

      {loading && <p>Loading…</p>}
      {!loading && err && <p>{err}</p>}

      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.title} />
            <strong>{p.title}</strong>
            <span>₹ {Math.round(p.price * 83)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
