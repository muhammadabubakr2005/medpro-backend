require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
// const cors = require('cors');
const userRoutes=require("./Routes/userRoutes");
const medicineRoutes=require("./Routes/medicineRoutes");
const orderRoutes=require("./Routes/orderRoutes");
const supportRoutes=require("./Routes/supportRoutes");
const cartRoutes=require("./Routes/cartRoutes");
const categoryRoutes=require("./Routes/categoryRoutes");
const deliveryRoutes=require("./Routes/deliveryRoutes");
const notificationRoutes=require("./Routes/notificationRoutes");
const prescriptionRoutes=require("./Routes/prescriptionRoutes");
const reviewRoutes=require("./Routes/reviewRoutes");


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// app.use(cors());
mongoose
.connect(process.env.MONGO_URI) 
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));


// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express is connected with MongoDB!");
});

app.use("/users", userRoutes);
app.use("/medicines", medicineRoutes);
app.use("/orders", orderRoutes);
app.use("/support", supportRoutes);
app.use("/cart", cartRoutes);
app.use("/category", categoryRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/notification", notificationRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/review", reviewRoutes);
// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
