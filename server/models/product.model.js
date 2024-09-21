const mongoose = require("mongoose");

const UserScema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter user name"],
    },
    email: {
      type: String,
      required: true,
      default: 0,
    },
    mobile: {
      type: String,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User",UserScema);
module.exports=User;
