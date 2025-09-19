import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 flex">
      {/* Sidebar */}
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

            {/* FIXED: correct route to match App.jsx */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/CheckAppoinments")}
              className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
            >
              Appointments
            </motion.button>
          </div>
        </div>

        {/* Logout */}
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

      {/* Main Content */}
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
