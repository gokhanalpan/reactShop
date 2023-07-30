import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

//get all products
// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//get top products
// GET /api/products/top

const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({}).sort({ rating: -1 }).limit(3);
  if (topProducts.length > 0) {
    res.status(200).json(topProducts);
  } else {
    res.status(404);
    throw new Error("No products found");
  }
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

//review a product
//POST /api/products/:id/reviews
//private

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json("Review added");
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getproductById,
  getProducts,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
