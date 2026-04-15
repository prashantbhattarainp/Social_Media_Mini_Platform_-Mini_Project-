import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { formatUserPublic } from "../utils/serializers.js";

const MIN_PASSWORD_LENGTH = 6;

const saveSession = (req) =>
  new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const destroySession = (req) =>
  new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const clearSessionCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("mini.sid", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
};

const register = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email and password are required");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400);
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  req.session.userId = user._id.toString();
  await saveSession(req);

  return res.status(201).json({
    message: "Registration successful",
    user: formatUserPublic(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  req.session.userId = user._id.toString();
  await saveSession(req);

  return res.status(200).json({
    message: "Login successful",
    user: formatUserPublic(user),
  });
});

const logout = asyncHandler(async (req, res) => {
  if (!req.session?.userId) {
    clearSessionCookie(res);
    return res.status(200).json({ message: "Logout successful" });
  }

  await destroySession(req);
  clearSessionCookie(res);

  return res.status(200).json({ message: "Logout successful" });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: formatUserPublic(req.user),
  });
});

export { login, logout, me, register };