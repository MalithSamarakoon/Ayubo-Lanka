import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import { User } from "./models/user.model.js";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // ✅ Await the connection inside try/catch
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: "ADMIN" });
    if (existingAdmin) {
      console.log("⚠️ Super Admin already exists:", existingAdmin.email);
      return;
    }

    const hashedPassword = await bcryptjs.hash("Admin@123", 10);

    const superAdmin = new User({
      name: "Super Admin",
      email: "ayubolankaitp@gmail.com",
      mobile: "0712345678",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
    });

    await superAdmin.save();

    console.log("🎉 Super Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding Super Admin:", err);
    process.exit(1);
  }
};

seedSuperAdmin();


