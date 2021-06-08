const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchame = Schema({
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: String,
  active: Boolean,
  avatar: String,
  exp: Number,
  licencia: String,
  idiomas: String,
  fono: String,
  certs: [
    {
      name: String,
      vigencia: Date
    }
  ]
});

module.exports = mongoose.model("User", UserSchame);
