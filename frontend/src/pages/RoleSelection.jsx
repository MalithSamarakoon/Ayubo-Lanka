import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/frontend_assets/ayur8.jpg";

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      name: "Doctor",
      color: "from-green-400 to-green-600",
      path: "/doctor-signup",
    },
    {
      name: "Supplier",
      color: "from-green-300 to-green-500",
      path: "/supplier-signup",
    },
    {
      name: "User",
      color: "from-green-200 to-green-400",
      path: "/signup",
    },
  ];

  return (
    <div
              className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url(${bgImage})`,
              }}
            >
              <div className="absolute inset-0 bg-white/20"></div>
        
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white/10 backdrop-blur-2xl rounded-3xl">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-12 text-gray-800 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Who are you registering as?
        <span className="block text-green-500 mt-2">
          Doctor, Supplier or User?
        </span>
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {roles.map((role, index) => (
          <motion.div
            key={role.name}
            className={`p-10 rounded-3xl shadow-lg cursor-pointer text-center font-semibold text-lg text-gray-900 bg-gradient-to-br ${role.color} hover:shadow-2xl transition-transform transform`}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => navigate(role.path)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 120 }}
          >
            {role.name}
          </motion.div>
        ))}
      </div>
    </div>
    </div>
  );
}
