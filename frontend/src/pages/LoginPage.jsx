// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localErr, setLocalErr] = useState("");

  const navigate = useNavigate();
  const { login, isLoading, error: storeErr } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalErr("");

    const em = email.trim();
    const pw = password;

    if (!em || !pw) {
      setLocalErr("Please enter email and password.");
      return;
    }

    try {
      // login() should POST to your backend and return the user on success
      const user = await login(em, pw);

      if (!user) {
        // store will have set a message; still show a fallback
        setLocalErr("Login failed.");
        return;
      }

      // optional verification gate
      if (user.isVerified === false) {
        navigate("/verify-email");
        return;
      }

      const role = String(user.role || "").toUpperCase();
      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error logging in";
      setLocalErr(msg);
      console.error("LOGIN ERROR:", err?.response?.status, err?.response?.data);
    }
  };

  const errorMsg = localErr || storeErr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-black/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} noValidate>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="flex items-center mb-6">
            <Link to="/forgot-password" className="text-sm text-green-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          {errorMsg && <p className="text-red-500 font-semibold mb-3">{errorMsg}</p>}

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg
                       hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500
                       focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-black/10 backdrop-blur-xl shadow-xl overflow-hidden border border-white/20">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
