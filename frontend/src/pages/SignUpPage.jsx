import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, User, Phone } from "lucide-react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const validatePassword = (pwd) => {
    const rules = [
      { regex: /.{6,}/, message: "At least 6 characters" },
      { regex: /[A-Z]/, message: "Contains uppercase letter" },
      { regex: /[a-z]/, message: "Contains lowercase letter" },
      { regex: /[0-9]/, message: "Contains a number" },
      { regex: /[^A-Za-z0-9]/, message: "Contains special character" },
    ];

    const failed = rules.filter((rule) => !rule.regex.test(pwd));
    return failed.length ? failed[0].message : null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      return setValidationError("Mobile number must be exactly 10 digits.");
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      return setValidationError(pwdError);
    }

    if (password !== confirmPassword) {
      return setValidationError("Passwords do not match.");
    }

    setValidationError("");

    try {
      await signup({
        name: name,
        email: email,
        mobile: mobile,
        password: password,
        confirmPassword: confirmPassword,
        role: "USER",
      });
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-black/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
    >
      <div className="p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text drop-shadow-md">
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Phone}
            type="text"
            placeholder="Mobile Number (10 digits)"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            togglePassword
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            togglePassword
          />

          {(validationError || error) && (
            <p className="text-red-500 font-semibold mt-2.5 drop-shadow-sm">
              {validationError || error}
            </p>
          )}

          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-xl shadow-lg hover:from-green-600
              hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-black/10 backdrop-blur-xl shadow-inner border-t border-white/20">
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-green-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
