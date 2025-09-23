// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "../store/authStore";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [roleStats, setRoleStats] = useState({
    user: 0,
    doctor: 0,
    supplier: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/role-stats");
        const s = res.data?.stats || {};
        setRoleStats({
          user: s.user || 0,
          doctor: s.doctor || 0,
          supplier: s.supplier || 0,
        });
      } catch (e) {
        console.error("Failed to load role stats", e);
      }
    };
    load();
  }, []);

  const pieData = [
    { name: "Users", value: roleStats.user },
    { name: "Doctors", value: roleStats.doctor },
    { name: "Suppliers", value: roleStats.supplier },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 flex">
      {/* LEFT SIDEBAR */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-black/10 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col justify-between shadow-2xl"
      >
        <div>
          <h2 className="text-2xl font-extrabold mb-8 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text drop-shadow-md">
            Admin Panel
          </h2>

          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/user-management")}
              className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
            >
              User Management
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/product-dashboard")}
              className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
            >
              Inventory
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/admin/orders")}
              className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
            >
              Orders
            </motion.button>

            {/* correct route to match App.jsx */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/CheckAppoinments")}
              className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
            >
              Appointments
            </motion.button>

            {/* NEW: Support & Inquiries hub */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/admin/support-center")}
              className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
            >
              Support & Inquiries
            </motion.button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 mt-6 py-3 px-4 
            bg-gradient-to-r from-red-500 to-rose-600 
            rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </motion.div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text drop-shadow-md">
          Welcome, Admin
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-8 bg-black/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              User Overview
            </h3>
            <p className="text-gray-600">
              Manage registered users, and track activity.
            </p>

            <div className="w-full" style={{ height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/40 rounded-lg p-3">
                <div className="text-sm text-gray-600">Users</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {roleStats.user}
                </div>
              </div>
              <div className="bg-white/40 rounded-lg p-3">
                <div className="text-sm text-gray-600">Doctors</div>
                <div className="text-2xl font-bold text-blue-600">
                  {roleStats.doctor}
                </div>
              </div>
              <div className="bg-white/40 rounded-lg p-3">
                <div className="text-sm text-gray-600">Suppliers</div>
                <div className="text-2xl font-bold text-amber-600">
                  {roleStats.supplier}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-8 bg-black/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Inventory Status
            </h3>
            <p className="text-gray-600">
              Track stock, suppliers, and update product details.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-8 bg-black/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Orders</h3>
            <p className="text-gray-600">
              View, process, and manage customer orders efficiently.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-8 bg-black/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Reports & Analytics
            </h3>
            <p className="text-gray-600">
              Generate insights on sales, trends, and performance.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
