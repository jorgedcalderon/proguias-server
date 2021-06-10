const express = require("express");
const GuiaController = require("../controllers/guia");
const multipart = require("connect-multiparty");

const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" });

const api = express.Router();

api.post("/sign-up-guia", GuiaController.signUpGuia);
api.post("/sign-in-guia", GuiaController.signInGuia);

module.exports = api;