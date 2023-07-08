import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

//get all products
// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//get a product
//GET /api/products/:id
const getproductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Prd not found");
  }
});

export { getproductById, getProducts };
