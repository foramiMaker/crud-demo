const User = require("../models/product.model.js");
const Booking = require("../models/booking.model.js");
// const Orders = require("../models/order.model.js")
const csv = require("csvtojson");
const CsvParser = require("json2csv").Parser;
// const server = http.createServer(express);
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_ekV0HR5il0Avnp", // replace with your Razorpay key id
  key_secret: "rPPqnXyVxl8lMuBhkzSpGtQD", // replace with your Razorpay key secret
});

// const chat = (req, res) => {

//   wss.on("connection", (ws) => {
//     console.log("New client connected");

//     // Handle incoming messages from clients
//     ws.on("message", (message) => {
//       console.log("Received query:", message);

//       // Basic chatbot query handling logic
//       let responseMessage;
//       const userMessage = message.toLowerCase();

//       if (userMessage.includes("hello") || userMessage.includes("hi")) {
//         responseMessage = chatbotResponses.greeting;
//       } else if (userMessage.includes("help")) {
//         responseMessage = chatbotResponses.help;
//       } else if (userMessage.includes("services")) {
//         responseMessage = chatbotResponses.services;
//       } else {
//         responseMessage = chatbotResponses.default;
//       }

//       // Send response back to the client
//       ws.send(
//         JSON.stringify({ type: "chatbotResponse", message: responseMessage })
//       );
//     });

//     ws.on("close", () => {
//       console.log("Client disconnected");
//     });
//   });
// };

// Endpoint to create Razorpay order
const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (e.g., Rs 500 should be passed as 50000)
      currency,
      receipt: `receipt_${Math.floor(Math.random() * 1000000)}`, // Unique receipt id
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    console.log("req", req);
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const Updateuser = await User.findByIdAndUpdate(id, req.body);
    if (!Updateuser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(Updateuser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const Deleteuser = await User.findByIdAndDelete(id);
    if (!Deleteuser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "user delete successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportUser = async (req, res) => {
  try {
    const users = [];
    const userData = await User.find({});

    userData.forEach((user) => {
      const { id, name, email, mobile } = user;
      users.push({ id, name, email, mobile });
    });
    const csvFields = ["id", "name", "email", "mobile"];
    const csvParser = new CsvParser({ fields: csvFields });
    const csvData = csvParser.parse(users);

    res.setHeader("content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment;filename=usersData.csv");
    res.status(200).end(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const importUser = async (req, res) => {
  try {
    const userData = [];
    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        for (let x = 0; x < response.length; x++) {
          userData.push({
            name: response[x].name,
            email: response[x].email,
            mobile: response[x].mobile,
          });
        }
        await User.insertMany(userData);
      });
    res.send({ status: 200, success: true, msg: "Csv Imported" });
  } catch {}
};

const bookingUser = async (req, res) => {
  try {
    let { name, email, mobile, date, slot, amount } = req.body;

    // Convert the date to YYYY-MM-DD format
    const parsedDate = new Date(date);
    const formattedDate = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate()
      )
    )
      .toISOString()
      .split("T")[0];
    // const formattedDate = new Date(
    //   (parsedDate.getUTCFullYear(),
    //   parsedDate.getUTCMonth(),
    //   parsedDate.getUTCDate())
    // );
    // Check if the slot is already booked for the given date
    const existingBooking = await Booking.findOne({
      date: formattedDate,
      slot,
    });
    if (existingBooking) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const booking = await Booking.create({
      name,
      email,
      mobile,
      date: formattedDate,
      slot,
      amount,
      isSlot: true,
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await Booking.find({ date });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const detail = await Booking.find({});
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  exportUser,
  importUser,
  bookingUser,
  getBookingsByDate,
  getBooking,
};
