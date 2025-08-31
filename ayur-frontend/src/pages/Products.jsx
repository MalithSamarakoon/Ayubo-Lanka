import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function Products() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { addItem } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get(`/api/products`, { params: { q, limit: 50 } });
    setData(res.data);
    setLoading(false);
  };
  useEffect(() => { fetchProducts(); }, []);

  const buyNow = async (productId) => {
    await addItem(productId, 1);
    nav("/checkout");
  };

  return (
    <section>
      <div className="row between" style={{marginBottom:16}}>
        <div>
          <div className="kicker">Browse</div>
          <h2 style={{margin:"6px 0 0"}}>Products</h2>
        </div>
        <div className="row">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search products…" />
          <button className="btn btn-outline" onClick={fetchProducts}>Search</button>
        </div>
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="grid">
          {data.items.map(p => (
            <div className="card card-hover" key={p._id}>
              <Link to={`/p/${p._id}`} style={{display:"block"}}>
                <img src={p.imageUrl || "https://placehold.co/600x360?text=Product"} alt={p.name}/>
              </Link>
              <div className="card-body">
                <Link to={`/p/${p._id}`} style={{textDecoration:"none",color:"inherit"}}>
                  <h3>{p.name}</h3>
                </Link>
                <p className="muted">{p.category || "—"}</p>
                <div className="row between" style={{marginTop:6}}>
                  <div className="price">LKR {p.price}</div>
                  <div className="row">
                    <button className="btn btn-primary" onClick={()=>addItem(p._id, 1)}>Add to cart</button>
                    <button className="btn btn-outline" onClick={()=>buyNow(p._id)}>Buy now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
