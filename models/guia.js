const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

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
  activo: Boolean,
  role: String,
  avatar: String,
  expe: Number,
  licencia: String,
  idiomas: String,
  fono: String,
  url: {
    type: String,
    unique: true
  }, 
  certs: [
    {
      name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compe',
        unique: true
      },
      path: String,
      vigencia: Date,
      activa: Boolean
    }
  ]
});
GuiaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Guia", GuiaSchema);