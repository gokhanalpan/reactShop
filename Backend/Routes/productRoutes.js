import express from "express";
const router = express.Router();
import {
  getProducts,
  getproductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts);
router.get("/top", getTopProducts);
router.get("/:id", getproductById);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", deleteProductById);
router.post("/:id/reviews", protect, createProductReview);

export default router;
