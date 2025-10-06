import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fmt = (n) => `Rs. ${Number(n||0).toLocaleString()}`;

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  useEffect(() => {
    if (!order) navigate("/collection", { replace: true }); // fallback
  }, [order, navigate]);

  const total = useMemo(
    () => order?.items?.reduce((s, it) => s + (Number(it.price)||0) * (Number(it.qty)||0), 0) || 0,
    [order]
  );

  const downloadPDF = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Order Receipt", 14, 18);
    doc.setFontSize(12);
    doc.text(`Order No: ${order.orderNo || order._id}`, 14, 26);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleString()}`, 14, 33);

    const s = order.shipping || {};
    doc.text("Shipping:", 14, 44);
    doc.text(`${s.name || ""}`, 14, 52);
    doc.text(`${s.address || ""}`, 14, 59);
    doc.text(`${s.city || ""} ${s.postalCode || ""}`, 14, 66);
    doc.text(`${s.district || ""} | Tel: ${s.telephone || ""}`, 14, 73);

    autoTable(doc, {
      startY: 85,
      head: [["Item", "Qty", "Price", "Subtotal"]],
      body: (order.items||[]).map(it => [
        it.name, `${it.qty}`, fmt(it.price), fmt((Number(it.price)||0)*(Number(it.qty)||0))
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    const y = doc.lastAutoTable.finalY || 85;
    doc.text(`Total: ${fmt(total)}`, 200, y + 10, { align: "right" });
    doc.save(`order_${order.orderNo || order._id}.pdf`);
  };

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-black">
      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-emerald-700">✓</div>
      <h1 className="text-3xl font-extrabold text-center mb-2">Thank you for your purchase</h1>
      <p className="text-center text-gray-600 mb-8">
        We&apos;ve received your order. Your order number is <b>{order.orderNo || order._id}</b>.
      </p>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="divide-y">
          {(order.items||[]).map((it, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {it.image ? <img src={it.image} alt={it.name} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded" />}
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.qty}</div>
                </div>
              </div>
              <div className="font-semibold">{fmt((Number(it.price)||0)*(Number(it.qty)||0))}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4 mt-4 border-t">
          <span className="font-semibold">Total</span>
          <span className="font-extrabold">{fmt(total)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-8">
        <button onClick={()=>navigate("/collection")} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Back to Home</button>
        <button onClick={downloadPDF} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Download Receipt (PDF)</button>
      </div>
    </div>
  );
}
