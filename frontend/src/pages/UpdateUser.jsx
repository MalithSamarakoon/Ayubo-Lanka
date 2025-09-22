import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Phone, DollarSign, ArrowLeft } from "lucide-react";
import Loader from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";


function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    mobile: "",
    experience: "",
    consultationFee: "",
    description: "",
    availability: "not_available",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${id}`);
        if (res.data.user) {
          const userData = res.data.user;
          console.log("User Data:", userData);
          setUserRole(userData.role);
          setInputs({
            name: userData.name || "",
            email: userData.email || "",
            mobile: userData.mobile || "",
            experience: userData.experience || "",
            consultationFee: userData.consultationFee || "",
            description: userData.description || "",
            availability: userData.availability || "not_available",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHandler();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(inputs.mobile)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    if (userRole === "DOCTOR") {
      if (Number(inputs.consultationFee) <= 0) {
        toast.error("Consultation fee must be a positive number");
        return;
      }
      if (Number(inputs.experience) <= 0) {
        toast.error("Experience must be a positive number");
        return;
      }
    }
    setIsLoading(true);
    console.log("Submitting data:", inputs);
    try {
      await axios.patch(`http://localhost:5000/api/user/${id}`, {
        ...inputs,
        role: userRole,
      });
      toast.success("User updated successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200"
    >
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-200 hover:bg-gray-300 hover:text-green-600"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center text-center mb-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center shadow-lg mb-3"
        >
          <User className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 text-transparent bg-clip-text">
          Update Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Edit your personal information below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          icon={User}
          type="text"
          name="name"
          placeholder="Full Name"
          value={inputs.name}
          onChange={handleChange}
        />
        <Input
          icon={Mail}
          type="email"
          name="email"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChange}
        />
        <Input
          icon={Phone}
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={inputs.mobile}
          onChange={handleChange}
        />

        {userRole === "DOCTOR" && (
          <>
            <Input
              icon={DollarSign}
              type="number"
              name="consultationFee"
              placeholder="Consultation Fee"
              value={inputs.consultationFee}
              onChange={handleChange}
            />

            <input
              type="number"
              name="experience"
              placeholder="Experience (in years)"
              value={inputs.experience}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 mt-1 placeholder-gray-400 text-gray-700"
            />

            <textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-3 rounded-lg border border-gray-300 mt-3"
            />
            <select
              name="availability"
              value={inputs.availability}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 mt-3"
            >
              <option value="weekday">Weekday</option>
              <option value="weekend">Weekend</option>
              <option value="not_available">Not available</option>
            </select>
          </>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isLoading ? <Loader size={24} /> : "Update Profile"}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default UpdateUser;
