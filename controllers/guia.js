const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Guia = require("../models/guia");

function signUpGuia(req, res) {
    const guia = new Guia();
  
    const { name, lastname, email, password, repeatPassword } = req.body;
    guia.name = name;
    guia.lastname = lastname;
    guia.email = email.toLowerCase();
    guia.role = "guia";
    guia.active = false;
  
    if (!password || !repeatPassword) {
      res.status(404).send({ message: "Las contraseñas son obligatorias." });
    } else {
      if (password !== repeatPassword) {
        res.status(404).send({ message: "Las contraseñas no son iguales." });
      } else {
        bcrypt.hash(password, null, null, function(err, hash) {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al encriptar la contraseña." });
          } else {
            guia.password = hash;
  
            guia.save((err, userStored) => {
              if (err) {
                res.status(500).send({ message: "El usuario ya existe." });
              } else {
                if (!userStored) {
                  res.status(404).send({ message: "Error al crear el usuario." });
                } else {
                  res.status(200).send({ user: userStored });
                }
              }
            });
          }
        });
      }
    }
  }

function signInGuia(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;
    const guia = true;
  
    Guia.findOne({ email }, (err, userStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!userStored) {
          res.status(404).send({ message: "Usuario no encontrado." });
        } else {
          bcrypt.compare(password, userStored.password, (err, check) => {
            if (err) {
              res.status(500).send({ message: "Error del servidor." });
            } else if (!check) {
              res.status(404).send({ message: "La contraseña es incorrecta." });
            } else {
              if (!userStored.active) {
                res
                  .status(200)
                  .send({ code: 200, message: "El usuario no se ha activado." });
              } else {
                res.status(200).send({
                  accessToken: jwt.createAccessToken(userStored, guia),
                  refreshToken: jwt.createRefreshToken(userStored)
                });
              }
            }
          });
        }
      }
    });
  }

  function getGuias(req, res) {
    Guia.find().then(users => {
      if (!users) {
        res.status(404).send({ message: "No se ha encontrado ningun usuario." });
      } else {
        res.status(200).send({ users });
      }
    });
  }
  
  function getGuiasActive(req, res) {
    const query = req.query;
  
    Guia.find({ active: query.active }).then(users => {
      if (!users) {
        res.status(404).send({ message: "No se ha encontrado ningun usuario." });
      } else {
        res.status(200).send({ users });
      }
    });
  }
  
  function uploadAvatar(req, res) {
    const params = req.params;
  
    Guia.findById({ _id: params.id }, (err, userData) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!userData) {
          res.status(404).send({ message: "Nose ha encontrado ningun usuario." });
        } else {
          let user = userData;
  
          if (req.files) {
            let filePath = req.files.avatar.path;
            let fileSplit = filePath.split("/");
            let fileName = fileSplit[2];
  
            let extSplit = fileName.split(".");
            let fileExt = extSplit[1];
  
            if (fileExt !== "png" && fileExt !== "jpg") {
              res.status(400).send({
                message:
                  "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)"
              });
            } else {
              user.avatar = fileName;
              Guia.findByIdAndUpdate(
                { _id: params.id },
                user,
                (err, userResult) => {
                  if (err) {
                    res.status(500).send({ message: "Error del servidor." });
                  } else {
                    if (!userResult) {
                      res
                        .status(404)
                        .send({ message: "No se ha encontrado ningun usuario." });
                    } else {
                      res.status(200).send({ avatarName: fileName });
                    }
                  }
                }
              );
            }
          }
        }
      }
    });
  }
  
  function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;
  
    fs.exists(filePath, exists => {
      if (!exists) {
        res.status(404).send({ message: "El avatar que buscas no existe." });
      } else {
        res.sendFile(path.resolve(filePath));
      }
    });
  }
  
  async function updateGuia(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;
  
    if (userData.password) {
      await bcrypt.hash(userData.password, null, null, (err, hash) => {
        if (err) {
          res.status(500).send({ message: "Error al encriptar la contraseña." });
        } else {
          userData.password = hash;
        }
      });
    }
  
    Guia.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!userUpdate) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ningun usuario." });
        } else {
          res.status(200).send({ message: "Usuario actualizado correctamente." });
        }
      }
    });
  }
  
  function activateGuia(req, res) {
    const { id } = req.params;
    const { active } = req.body;
  
    Guia.findByIdAndUpdate(id, { active }, (err, userStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!userStored) {
          res.status(404).send({ message: "No se ha encontrado el usuario." });
        } else {
          if (active === true) {
            res.status(200).send({ message: "Usuario activado correctamente." });
          } else {
            res
              .status(200)
              .send({ message: "Usuario desactivado correctamente." });
          }
        }
      }
    });
  }
  
  function deleteGuia(req, res) {
    const { id } = req.params;
  
    Guia.findByIdAndRemove(id, (err, userDeleted) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!userDeleted) {
          res.status(404).send({ message: "Usuario no encontrado." });
        } else {
          res
            .status(200)
            .send({ message: "El usuario ha sido eliminado correctamente." });
        }
      }
    });
  }



module.exports = 
{
    signUpGuia,
    signInGuia,
    getGuias,
    getGuiasActive,
    uploadAvatar,
    getAvatar,
    updateGuia,
    activateGuia,
    deleteGuia
};