import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const sanitizeUser = (userDoc) => ({
  _id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt,
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim() || !email || !email.trim() || !password || !password.trim()) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password.trim(), 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  req.session.userId = user._id.toString();
  req.session.save((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to create session" });
    }

    res.status(201).json({
      message: "Registration successful",
      user: sanitizeUser(user),
      session: {
        isAuthenticated: true,
        userId: user._id,
      },
    });
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.trim() || !password || !password.trim()) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password.trim(), user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  req.session.userId = user._id.toString();
  req.session.save((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to create session" });
    }

    res.json({
      message: "Login successful",
      user: sanitizeUser(user),
      session: {
        isAuthenticated: true,
        userId: user._id,
      },
    });
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.session) {
    return res.json({ message: "Logout successful" });
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to logout" });
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

const getSessionUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.userId).select("-password");

  if (!user) {
    req.session.destroy(() => {});
    res.status(401);
    throw new Error("Session expired. Please log in again.");
  }

  res.json({
    user: sanitizeUser(user),
    session: {
      isAuthenticated: true,
      userId: user._id,
    },
  });
});

export { getSessionUser, loginUser, logoutUser, registerUser };
