import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader,
  Lock,
  Mail,
  MapPin,
  Phone,
  Building2,
  Package,
} from "lucide-react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const SupplierSignUpPage = () => {
  const [name, setName] = useState("");
  const [companyAddress, setcompanyAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [productCategory, setProductCategory] = useState("");
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

    for (let rule of rules) {
      if (!rule.regex.test(pwd)) {
        return rule.message;
      }
    }
    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      return setValidationError("Mobile number must be exactly 10 digits.");
    }
    if (password !== confirmPassword) {
      return setValidationError("Passwords do not match.");
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      return setValidationError(pwdError);
    }

    setValidationError("");

    try {
      await signup({
        role: "SUPPLIER",
        name,
        companyAddress,
        email,
        mobile,
        productCategory,
        password,
        confirmPassword,
      });
      navigate("/approval-pending");
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
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text drop-shadow-lg">
          Supplier Registration
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={Building2}
            type="text"
            placeholder="Company Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            icon={MapPin}
            type="text"
            placeholder="Company Address"
            value={companyAddress}
            onChange={(e) => setcompanyAddress(e.target.value)}
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
            icon={Package}
            type="text"
            placeholder="Product Category"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
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
            <p className="text-red-500 font-semibold mt-2">
              {validationError || error}
            </p>
          )}

          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-2xl hover:from-green-600 hover:to-emerald-700 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up as Supplier"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-black/10 backdrop-blur-xl shadow-inner border-t border-white/20">
        <p className="text-sm text-gray-600">
          Already registered?{" "}
          <Link to={"/login"} className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SupplierSignUpPage;
