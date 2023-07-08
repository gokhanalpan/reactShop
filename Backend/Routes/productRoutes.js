import express from "express";
const router = express.Router();
import {
  getProducts,
  getproductById,
} from "../controllers/productController.js";

router.route("/").get(getProducts);

router.get("/:id", getproductById);

export default router;
