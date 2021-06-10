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



module.exports = 
{
    signUpGuia,
    signInGuia
};