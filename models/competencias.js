const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Schema = mongoose.Schema({
    name: String,
    foto: Date,
    order: Number,
    activa: Boolean
});

module.exports = mongoose.model("Compe", CompeSchema);