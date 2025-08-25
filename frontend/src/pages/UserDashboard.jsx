import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user: loggedUser } = useAuthStore();
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!loggedUser?._id) return;
        const res = await axios.get(
          `http://localhost:5000/api/user/${loggedUser._id}`
        );
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [loggedUser]);

  const handleDelete = async () => {
    await axios
      .delete(`http://localhost:5000/api/user/${loggedUser?._id}`)
      .then(() => navigate("/login"));
    console.log("Delete Account success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200"
    >
      {/* Header with Avatar */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center shadow-lg"
        >
          <User className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-green-500 to-emerald-700 text-transparent bg-clip-text">
          {user?.name}
        </h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      {/* Profile Information */}
      <div className="mt-8 grid gap-6">
        <motion.div
          className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-green-600 mb-3">
            Profile Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <p>
              <span className="font-semibold">Role:</span> {user?.role}
            </p>
            <p>
              <span className="font-semibold">Mobile:</span> {user?.mobile}
            </p>
            <p>
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              <span className="font-semibold">Last Login:</span>{" "}
              {formatDate(user?.lastLogin)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        {/* Update Profile */}
        <Link to={`/dashboard/${user?._id}`} className="flex-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
      font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Update Profile
          </motion.button>
        </Link>

        {/* Delete Account */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="w-full flex-1 py-3 px-4 bg-red-500 text-white 
          font-semibold rounded-lg shadow-md hover:bg-red-600
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Account
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
