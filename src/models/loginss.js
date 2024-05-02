const mongoose = require("mongoose");

const employeeSchemaL = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Login = new mongoose.model("Login", employeeSchemaL);

module.exports = Login;