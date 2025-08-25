import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-md">
        {/* User Management Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigation("/admin/users")}
          className="py-6 px-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg text-xl font-semibold hover:shadow-2xl transition"
        >
          User Management
        </motion.button>

        {/* Inventory Management Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigation("/admin/inventory")}
          className="py-6 px-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg text-xl font-semibold hover:shadow-2xl transition"
        >
          Inventory Management
        </motion.button>
      </div>
    </div>
  );
}

export default AdminDashboard;
