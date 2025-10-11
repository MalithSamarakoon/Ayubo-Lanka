import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import bgImage from "../assets/frontend_assets/ayur8.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, error, setError } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = await login(email, password);

    if (user) {
      if (user.role === "SUPER_ADMIN") {
        toast.success("Admin logged in successfully");
        navigate("/admin-dashboard");
        setError(null);
      } else {
        toast.success("User logged in successfully");
        navigate("/home");
        setError(null);
      }
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-white/20"></div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full mx-4 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              togglePassword
              required
            />

            <div className="flex items-center mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-green-400 hover:text-emerald-400"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-red-500 font-semibold text-center mb-4">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg
                         hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                         focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border-t border-white/10 px-8 py-4 text-center">
          <p className="text-sm text-gray-900">
            Don’t have an account?{" "}
            <Link
              to="/role-selection"
              className="text-green-400 hover:text-emerald-400 hover:underline"
              onClick={() => setError(null)}
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
