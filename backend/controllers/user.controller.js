
import { sendUserApprovedEmail } from "../mailer.js";
import { User } from "../models/user.model.js";

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await sendUserApprovedEmail(user);
    res.json({ message: "User approved and notified", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ message: "User approved and notified", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
