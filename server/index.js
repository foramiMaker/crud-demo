const express = require("express");
const mongoose = require("mongoose");
const UserRoute = require("./routes/product.route.js");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use("/api/users", UserRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});
// mongoose
//   .connect(
//     "mongodb+srv://foramimaker:G6fUuVKRwaRbJr1w@cluster0.g3odp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//   )
//   .then(() => {
//     console.log("Connected!");
//     app.listen(5000, () => {
//       console.log("server is running port 5000");
//     });
//   })
//   .catch(() => {
//     console.log("connection failed");
//   });

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Connected!");
    app.listen(PORT, () => {
      console.log("server is running port 8080");
    });
  })
  .catch(() => {
    console.log("connection failed");
  });
