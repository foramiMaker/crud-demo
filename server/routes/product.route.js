const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

const user = require("../models/product.model.js");
const booking = require("../models/booking.model.js");
const {
  bookingUser,
  getBookingsByDate,
  getBooking,
} = require("../controllers/product.controllers.js");

const {
  createOrder,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  exportUser,
  importUser,
} = require("../controllers/product.controllers.js");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/export", exportUser);
router.get("/bookings", getBookingsByDate);
router.get("/bookingdetails", getBooking);
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.post("/booking", bookingUser);
router.post("/create-order", createOrder);
router.post("/import", upload.single("file"), importUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
