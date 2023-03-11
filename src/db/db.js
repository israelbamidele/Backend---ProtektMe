const mongoose = require("mongoose");

const url = process.env.DB_URL;

const connectDB = async function () {
  try {
    await mongoose.connect(url, { useNewUrlParser: true });
    mongoose.set("strictQuery", false);
    console.log("DB connected!!");
  } catch (err) {
    console.log("DB connection fail");
    console.log(err);
  }
};

module.exports = connectDB;
