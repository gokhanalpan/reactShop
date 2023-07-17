import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import productRoutes from "./Routes/productRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import UploadRoutes from "./Routes/uploadRoutes.js";
import products from "./data/products.js";
const port = process.env.PORT || 5000;
connectDB();

const app = express();
//body parser middleare

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", UploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirName = path.resolve();
console.log(__dirName);
app.use("/uploads", express.static(path.join(__dirName, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
