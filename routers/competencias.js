const express = require("express");
const CompeController = require("../controllers/competencias");

const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/add-compe", [md_auth.ensureAuth], CompeController.addCompe);

module.exports = api;