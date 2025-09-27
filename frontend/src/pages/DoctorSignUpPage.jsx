import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader,
  Lock,
  Mail,
  Phone,
  User,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const DoctorSignUpPage = () => {
  const [name, setName] = useState("");
  const [doctorLicenseNumber, setDoctorLicenseNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
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

    const cleanedName = name.trim();
    const prefixedName = /^dr\.?\s*/i.test(cleanedName)
      ? cleanedName.replace(/^dr\.?\s*/i, "Dr. ")
      : `Dr. ${cleanedName}`;

    try {
      await signup({
        role: "DOCTOR",
        name: prefixedName,
        doctorLicenseNumber,
        specialization,
        email,
        mobile,
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
          Doctor Registration
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            icon={FileText}
            type="text"
            placeholder="Doctor License Number"
            value={doctorLicenseNumber}
            onChange={(e) => setDoctorLicenseNumber(e.target.value)}
            required
          />

          <div className="mb-4 relative">
            <FileText
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
              size={18}
            />
            <select
              className="w-full bg-white text-gray-700 placeholder-gray-400 border border-white/20 rounded-lg shadow-sm py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="" disabled>
                Select Specialization
              </option>
              <option value="General Ayurveda">General Ayurveda</option>
              <option value="Women’s Health">Women’s Health</option>
              <option value="Child Health">Child Health</option>
              <option value="Detox & Panchakarma">Detox & Panchakarma</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Geriatric Care">Geriatric Care</option>
              <option value="Ayurvedic Surgery">Ayurvedic Surgery</option>
            </select>
          </div>

          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            icon={Phone}
            type="text"
            placeholder="Mobile Number (10 digits)"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
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

          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            togglePassword
            required
          />

          <center>
            {(validationError || error) && (
              <p className="text-red-500 font-semibold mt-2">
                {validationError || error}
              </p>
            )}
          </center>

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
              "Sign Up as Doctor"
            )}
          </motion.button>
        </form>
      </div>
      <center>
        <div className="px-8 py-4 bg-black/10 backdrop-blur-xl shadow-inner border-t border-white/20">
          <p className="text-sm text-gray-600">
            Already registered?{" "}
            <Link to={"/login"} className="text-green-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </center>
    </motion.div>
  );
};

export default DoctorSignUpPage;
