import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const incoming = location.state?.flash || "";
  const [flash, setFlash] = useState(incoming);

  useEffect(() => {
    if (incoming) {
      // state clear (refresh/revisit වල message නැවත නොපෙන්වෙන්න)
      navigate(location.pathname, { replace: true });
      const t = setTimeout(() => setFlash(""), 3000); // 3sට අදිශප්‍රාප්ත
      return () => clearTimeout(t);
    }
  }, [incoming, location.pathname, navigate]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {flash && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
          {flash}
        </div>
      )}

      {/* 🛒 Cart items / totals / actions… */}
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>
      {/* your cart table/list here */}
    </div>
  );
};

export default Cart;
