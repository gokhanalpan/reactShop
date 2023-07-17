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

//create a product
// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: "sample prd",
    brand: "sample brand",
    category: "sample category",
    price: 0,
    image: "/images/sample",
    description: "sample desc",
    rating: 0,
    numReviews: 0,
    countInStock: 0,
  });

  const newPrd = await product.save();
  res.status(201).json(newPrd);
});

//delete a product
//DELETE /api/products/:id
const deleteProductById = asyncHandler(async (req, res) => {
  const deleteDoc = await Product.findByIdAndDelete(req.params.id);
  if (deleteDoc) {
    res.status(201).json(deleteDoc);
  } else {
    res.status(404);
    throw new Error("Document not found");
  }
});

//update a product
//PUT /api/products/:id
//private , admin

const updateProduct = asyncHandler(async (req, res) => {
  const { name, image, brand, category, description, price, countInStock } =
    req.body;

  const prd = await Product.findById(req.params.id);
  if (prd) {
    (prd.name = name),
      (prd.image = image),
      (prd.brand = brand),
      (prd.category = category),
      (prd.description = description),
      (prd.price = price),
      (prd.countInStock = countInStock);
    const result = await prd.save();
    res.status(201).json(result);
  } else {
    res.status(404);
    throw new Error("Document not found");
  }
});

export {
  getproductById,
  getProducts,
  deleteProductById,
  createProduct,
  updateProduct,
};
