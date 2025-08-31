import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function ProductView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const res = await api.get(`/api/products/${id}`);
      setP(res.data);
      setLoading(false);
    })();
  }, [id]);

  const addToCart = async () => { await addItem(id, qty); };
  const buyNow = async () => { await addItem(id, qty); nav("/checkout"); };

  if (loading) return <p>Loading…</p>;
  if (!p) return <p>Not found.</p>;

  return (
    <section className="narrow">
      <div className="row" style={{gap:24, alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div className="card">
            <img src={p.imageUrl || "https://placehold.co/900x560?text=Product"} alt={p.name}
                 style={{width:"100%",height:400,objectFit:"cover"}} />
          </div>
        </div>
        <div style={{flex:1}}>
          <div className="kicker">Product</div>
          <h2 style={{margin:"6px 0 8px"}}>{p.name}</h2>
          <div className="muted" style={{marginBottom:10}}>{p.category || "—"}</div>
          <div className="price" style={{fontSize:22,marginBottom:14}}>LKR {p.price}</div>
          {p.description && <p className="muted" style={{lineHeight:1.6}}>{p.description}</p>}

          <div className="row" style={{marginTop:16}}>
            <label style={{width:140}}>Quantity
              <input type="number" min="1" value={qty}
                     onChange={e=>setQty(e.target.value)} style={{marginTop:6}} />
            </label>
          </div>

          <div className="row" style={{marginTop:16}}>
            <button className="btn btn-primary" onClick={addToCart}>Add to cart</button>
            <button className="btn btn-outline" onClick={buyNow}>Buy now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
