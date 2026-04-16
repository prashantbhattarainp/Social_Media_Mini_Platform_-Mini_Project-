import User from "../models/user.model.js";
import { asyncHandler } from "./errorMiddleware.js";

const requireAuth = asyncHandler(async (req, res, next) => {
  const userId = req.session?.userId;

  if (!userId) {
    res.status(401);
    throw new Error("Not authorized. Please log in.");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    req.session.destroy(() => {});
    res.status(401);
    throw new Error("Session expired. Please log in again.");
  }

  req.user = user;
  next();
});

const protect = requireAuth;

export { protect, requireAuth };
