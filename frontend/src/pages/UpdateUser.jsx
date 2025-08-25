import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Phone } from "lucide-react"; // icons
import Loader from "../components/LoadingSpinner";

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    mobile: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${id}`);
        if (res.data.user) {
          setInputs({
            name: res.data.user.name || "",
            email: res.data.user.email || "",
            mobile: res.data.user.mobile || ""
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
    setIsLoading(true);
    try {
      await axios.patch(`http://localhost:5000/api/user/${id}`, inputs);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
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
        <p className="text-gray-500 mt-1">Edit your personal information below</p>
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
