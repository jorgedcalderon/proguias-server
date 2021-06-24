const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompeSchema = Schema({
    name: String,
    foto: String,
    order: Number,
    activa: Boolean
});

module.exports = mongoose.model("Compe", CompeSchema);