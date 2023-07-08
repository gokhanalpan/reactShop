import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin user",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: true,
  },
  {
    name: "normal user",
    email: "normal@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "one user",
    email: "one@email.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: false,
  },
];

export default users;
