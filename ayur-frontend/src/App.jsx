import { NavLink, Routes, Route } from "react-router-dom";
import { FaLeaf, FaShoppingCart } from "react-icons/fa";
import Products from "./pages/Products.jsx";
import ProductView from "./pages/ProductView.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import Purchased from "./pages/Purchased.jsx";
import { useCart } from "./context/CartContext.jsx";

export default function App() {
  const { count } = useCart();

  return (
    <div className="app">
      <nav className="topnav">
        <div className="brand">
          <div className="logo"></div>
          <h1>Ayur Shop</h1>
        </div>
        <div className="links">
          <NavLink to="/">Products</NavLink>
          <NavLink to="/purchased">Purchased</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/cart">
            <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
              <FaShoppingCart/> Cart
              {count>0 && <span className="badge">{count}</span>}
            </span>
          </NavLink>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/p/:id" element={<ProductView />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/purchased" element={<Purchased />} />
        </Routes>
      </main>
    </div>
  );
}
