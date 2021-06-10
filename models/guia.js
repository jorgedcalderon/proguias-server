const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuiaSchema = Schema({
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  active: Boolean,
  role: String,
  avatar: String,
  expe: Number,
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

module.exports = mongoose.model("Guia", GuiaSchema);