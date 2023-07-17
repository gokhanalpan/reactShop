import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import generateToken from "../util/generateToken.js";

// login user
// post /api/user/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  const user = await User.findOne({ email: email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      name: user.name,
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Incorrect email or password");
  }
});
//logout user - clear cookie
// post /api/user/logout
const logoutUser = asyncHandler(async (req, res) => {
  //clear the jwt cookie

  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out" });
});

//register user
// post /api/user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//get user profile
// get /api/user/profile

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      name: user.name,
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Cant find user with this id");
  }
});

//update user profile
// PUT /api/user/profile

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    (user.name = req.body.name || user.name),
      (user.email = req.body.email || user.email);

    if (req.body.password) {
      user.password = req.body.password;
    }

    const uptadedUser = await user.save();
    res.status(201).json({
      _id: uptadedUser._id,
      name: uptadedUser.name,
      email: uptadedUser.email,
      isAdmin: uptadedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//get all users
//GET /api/user

const getAllusers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users && users.length > 0) {
    res.status(200).json(users);
  } else {
    throw new Error("No users found");
  }
});

//get user by ıd
//GET /api/user/:id

const getUserById = asyncHandler(async (req, res) => {
  res.send("get all users");
});

//delete user
//DELETE /api/user/:id

const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete user");
});

//update user by id
//PUT /api/user/:id

const updateUserById = asyncHandler(async (req, res) => {
  res.send("update  user by ıd");
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllusers,
  getUserById,
  updateUserById,
};
