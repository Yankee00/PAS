const mongoose = require("mongoose");

const opt_ka_schema_1O1 = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

const otpobj = new mongoose.model("onetimepassword", opt_ka_schema_1O1);

module.exports = otpobj;
