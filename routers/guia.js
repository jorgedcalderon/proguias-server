const express = require("express");
const GuiaController = require("../controllers/guia");
const multipart = require("connect-multiparty");

const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" });

const api = express.Router();

api.post("/sign-up-guia", GuiaController.signUpGuia);
api.post("/sign-in-guia", GuiaController.signInGuia);

api.get("/guias", [md_auth.ensureAuth], GuiaController.getGuias);
api.get("/guias-active", [md_auth.ensureAuth], GuiaController.getGuiasActive);
api.get("/get-guia/:url", GuiaController.getGuia);
api.get("/get-guia-email/:email", GuiaController.getGuiaEmail);

api.put(
  "/upload-avatar-guia/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  GuiaController.uploadAvatar
);
api.get("/get-avatar-guia/:avatarName", GuiaController.getAvatar);
api.put("/update-guia/:id", [md_auth.ensureAuth], GuiaController.updateGuia);
api.put(
  "/activate-guia/:id",
  [md_auth.ensureAuth],
  GuiaController.activateGuia
);
api.delete("/delete-guia/:id", [md_auth.ensureAuth], GuiaController.deleteGuia);
api.post("/sign-up-admin-guia", [md_auth.ensureAuth], GuiaController.signUpAdminGuia);
// api.put("/add-competencia/:id", [md_auth.ensureAuth], GuiaController.addCompetencia);
// api.put("/upload-cert/:id", [md_auth.ensureAuth], GuiaController.uploadCert)

api.get("/get-guias-pag", GuiaController.getGuiasPag);

module.exports = api;