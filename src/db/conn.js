const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/Our_Pets_Lr_Database").then(
 () =>
{
  console.log(`connection successful`);
}).catch((e) =>
{
  console.log(`no connection  `+e);
});
