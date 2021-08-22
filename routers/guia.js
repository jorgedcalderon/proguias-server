const express = require("express");
const GuiaController = require("../controllers/guia");
const multipart = require("connect-multiparty");

const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({ uploadDir: "/mnt/volumen_proguias/uploads/avatar" });
const md_upload_compe = multipart({ uploadDir: "/mnt/volumen_proguias/uploads/competencias" });

const api = express.Router();

api.post("/sign-up-guia", GuiaController.signUpGuia);
api.post("/sign-in-guia", GuiaController.signInGuia);
api.post("/sign-up-admin-guia", [md_auth.ensureAuth], GuiaController.signUpAdminGuia);
api.post("/find-compe/:id", [md_auth.ensureAuth], GuiaController.findCompe);
api.post("/get-certs/:id", [md_auth.ensureAuth], GuiaController.getCerts );
api.post("/certs-populadas/:id", [md_auth.ensureAuth], GuiaController.certsPopuladas);

api.get("/guias", [md_auth.ensureAuth], GuiaController.getGuias);
api.get("/guias-active", [md_auth.ensureAuth], GuiaController.getGuiasActive);
api.get("/get-guia/:url", GuiaController.getGuia);
api.get("/get-guia-email/:email", GuiaController.getGuiaEmail);
api.get("/get-avatar-guia/:avatarName", GuiaController.getAvatar);
api.get("/get-guias-pag", GuiaController.getGuiasPag);
api.get("/get-compe-doc/:compeName", GuiaController.getCompeDoc );



api.put(
  "/upload-avatar-guia/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  GuiaController.uploadAvatar
);
api.put("/subir-compe-doc/:id/:idCompe", [md_auth.ensureAuth, md_upload_compe], GuiaController.subirCompe);
api.put("/update-guia/:id", [md_auth.ensureAuth], GuiaController.updateGuia);
api.put(
  "/activate-guia/:id",
  [md_auth.ensureAuth],
  GuiaController.activateGuia
);
api.put("/activo-guia/:id", [md_auth.ensureAuth], GuiaController.activoGuia);
api.put("/delete-guia-compe/:id", [md_auth.ensureAuth], GuiaController.deleteCompe);
api.put("/add-guia-compe/:id", [md_auth.ensureAuth], GuiaController.asignarCompe);

api.delete("/delete-guia/:id", [md_auth.ensureAuth], GuiaController.deleteGuia);

// api.put("/add-competencia/:id", [md_auth.ensureAuth], GuiaController.addCompetencia);
// api.put("/upload-cert/:id", [md_auth.ensureAuth], GuiaController.uploadCert)



module.exports = api;