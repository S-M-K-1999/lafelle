import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { verifyToken, verifyMainUser } from "../middlewares/auth.middleware.js";

const router = express.Router();


// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // ❌ Remove this line - pre-save hook handles it
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Just pass the plain password
//     const user = new User({ name, email, password, role });
//     await user.save();

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Signup failed", error });
//   }
// });

// ✅ Create new user (only main admin can call)
router.post("/create-user", verifyToken, verifyMainUser, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password, role });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Normal user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Profile route (same as before)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
