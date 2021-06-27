const express = require("express");
const CompeController = require("../controllers/competencias");

const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/add-compe", [md_auth.ensureAuth], CompeController.addCompe);
api.get("/get-compes", CompeController.getCompes);
api.get("/get-compes-activa", [md_auth.ensureAuth], CompeController.getCompesActiva);
api.put("/update-compe/:id", [md_auth.ensureAuth], CompeController.updateCompe);
api.put("/activate-compe/:id", [md_auth.ensureAuth], CompeController.activateCompe);
api.delete("/delete-compe/:id", [md_auth.ensureAuth], CompeController.deleteCompe);

module.exports = api;