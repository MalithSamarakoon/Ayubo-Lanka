import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

 const roles = [
  { name: "Doctor", color: "from-blue-500 to-cyan-500", path: "/signup/doctor" },
  { name: "Supplier", color: "from-green-500 to-emerald-500", path: "/signup/supplier" },
  { name: "User", color: "from-purple-500 to-pink-500", path: "/signup/user" },
];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-10 text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Are you registering as a
        <span className="block text-cyan-400">Doctor, Supplier or User?</span>
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {roles.map((role, index) => (
          <motion.div
            key={role.name}
            className={`p-8 rounded-2xl shadow-xl bg-gradient-to-br ${role.color} cursor-pointer text-center font-semibold text-lg hover:scale-105 transform transition`}
            whileHover={{ y: -10 }}
            onClick={() => navigate(role.path)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {role.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
