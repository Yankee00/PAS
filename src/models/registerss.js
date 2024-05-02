const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verification: {
      type: Boolean,
      default: false,
    },
});

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
