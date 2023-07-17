import express from "express";
const router = express.Router();

import {
  logoutUser,
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllusers,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.post("/login", loginUser);

router.post("/", registerUser);

router.post("/logout", logoutUser);

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.get("/",protect, admin, getAllusers);

router.delete("/:id",protect, admin, deleteUser);

router.get("/:id",protect, admin, getUserById);

router.put("/:id",protect, updateUserById);

export default router;
