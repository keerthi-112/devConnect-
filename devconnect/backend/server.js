require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const projectRoutes = require("./routes/project");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", projectRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});