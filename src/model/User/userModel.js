const { mongo, default: mongoose } = require("mongoose");
const validator = require("validator");
const { Schema, model } = require("mongoose");

const userSchema = Schema({
  email: {
    type: String,
    required: [true, "input your email"],
    unique: [true, "Email already exists"],
    validate: [validator.isEmail, "please input a valid email"],
  },
  firstName: {
    type: String,
    required: [true, "Input your firstname"],
  },
  lastName: {
    type: String,
    required: [true, "Input your lastname"],
  },
  middleName: {
    type: String,
    required: false,
  },
  occupation: {
    type: String,
    required: [true, "Input your occupation"],
  },
  password: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  photo: {
    type: String,
  },
  forums: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Forum",
    },
  ],
});

const User = model("User", userSchema);
module.exports = User;
