const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Guia = require("../models/guia");

function signUpGuia(req, res) {
    const guia = new Guia();
    console.log("en sign up normal");
  
    const { name, lastName, email, password, repeatPassword } = req.body;
    guia.name = name;
    guia.lastname = lastName;
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
            guia.url=`${lastName.toLowerCase()}-${name.toLowerCase()}`
            console.log(guia);
  
            guia.save((err, userStored) => {
              if (err) {
                res.status(500).send({ message: "Error del servidor." });
                console.log("en sign up normal codifo 500");
                console.log(err);
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
              if (!userStored.name) {
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
    console.log("params de upload avatar");
    console.log(params);
  
    Guia.findById({ "_id": params.id }, (err, userData) => {
      if (err) {
        res.status(500).send({ message: "Error quinientos." });
        console.log(err);
      } else {
        if (!userData) {
          res.status(404).send({ message: "No se ha encontrado ningun usuario." });
          console.log(userData);
        } else {
          console.log(userData);
          let user = userData;
  
          if (req.files) {
            let filePath = req.files.avatar.path;
            let fileSplit = filePath.split("\\");
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
                { "_id": params.id },
                user,
                (err, userResult) => {
                  if (err) {
                    res.status(500).send({ message: "Error del upload findbyidandupdate." });
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
    const filePath = "/mnt/volumen_proguias/uploads/avatar/" + avatarName;
  
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

  function activoGuia(req, res) {
    const { id } = req.params;
    const { activo } = req.body;
  
    Guia.findByIdAndUpdate(id, { activo }, (err, userStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!userStored) {
          res.status(404).send({ message: "No se ha encontrado el usuario." });
        } else {
          if (activo === true) {
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

  function signUpAdminGuia(req, res) {
    const guia = new Guia();
    console.log("en sign up admin");
  
    const { name, lastname, email, role, password } = req.body;
    guia.name = name;
    guia.lastname = lastname;
    guia.email = email.toLowerCase();
    guia.role = role;
    guia.active = true;
    guia.url=`${lastname.toLowerCase()}-${name.toLowerCase()}`;
    console.log(guia);
  
    if (!password) {
      res.status(500).send({ message: "La contraseña es obligatoria. " });
    } else {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          res.status(500).send({ message: "Error al encriptar la contraseña." });
        } else {
          guia.password = hash;
  
          guia.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "El usuario ya existe." });
              console.log("Error 500:");
              console.log(err);
            } else {
              if (!userStored) {
                res
                  .status(500)
                  .send({ message: "Error al crear el nuevo usuario." });
                  console.log("No hay userStored");
                  console.log(err);
              } else {
                // res.status(200).send({ user: userStored });
                res
                  .status(200)
                  .send({ message: "Usuario creado correctamente." });
              }
            }
          });
        }
      });
    }
  }

  function getGuia(req, res) {
    const { url } = req.params;
  
    Guia.findOne({ url }, (err, guiaStored) => {
      if (err) {
        res.status(500).send({ code: 500, message: "Error del servidor." });
      } else {
        if (!guiaStored) {
          res
            .status(404)
            .send({ code: 404, message: "No se ha encontrado ningun Guia." });
        } else {
          res.status(200).send({ code: 200, guia: guiaStored });
        }
      }
    });
  }

  function getGuiaEmail(req, res) {
    const { email } = req.params;
  
    Guia.findOne({ email }, (err, guiaStored) => {
      if (err) {
        res.status(500).send({ code: 500, message: "Error del servidor." });
      } else {
        if (!guiaStored) {
          res
            .status(404)
            .send({ code: 404, message: "No se ha encontrado ningun Guia." });
        } else {
          res.status(200).send({ code: 200, guia: guiaStored });
        }
      }
    });
  }

  function getGuiasPag(req, res) {
    const { page = 1, limit = 10 } = req.query;
    // const expe = guia.exp;
  
    const options = {
      page,
      limit: parseInt(limit),
      // sort: { expe: "desc" }
      

    };
  
    Guia.paginate({activo: true}, options, (err, guiasStored) => {
      if (err) {
        res.status(500).send({ code: 500, message: "Error del servidor." });
      } else {
        if (!guiasStored) {
          res
            .status(404)
            .send({ code: 404, message: "No se ha encontrado ningun guía." });
        } else {
          res.status(200).send({ code: 200, guias: guiasStored });
        }
      }
    });
  }

   function findCompe(req, res) {
    const { id } = req.params;
    const { idCompe } = req.body;

    const query = { '_id': id, 'certs.name': idCompe}

    let certFound = Guia.findOne( query, (err, cert) => {
      if(err) {
        res.status(500).send({
          message: "Error del servidor."
        });
      } else {
        if(!cert) {
          res.status(201).send({
            cert: false
          });
        } else {
          res.status(200).send({
            cert: true
          });
        }
      }
    });
    
  }

function deleteCompe(req, res) {
  const { id } = req.params;
  const { idCompe } = req.body;
  
  Guia.updateMany( {'_id': id, 'certs': {$elemMatch:{name: idCompe}}}, {$pull : {certs: { name: idCompe } }}, (err, deleteCert) => {
    if(err) {
      res.status(500).send({
        message: "Error del servidor."
      });
    } else {
      if(!deleteCert) {
        res.status(404).send({
          message: "No se ha encontrado la certificacion."
        });
      } else {
        res.status(200).send({
          message: "Certificacion eliminada correctamente."
        });
      }
    }
    
  }
  );

  
}

function asignarCompe(req, res) {
    const { id } = req.params;
    const { idCompe } = req.body;
    const compe = {name: idCompe, activa: true};

    Guia.findByIdAndUpdate(id, { $push: {certs: compe}}, (err, certStored) => {
      if(err) {
        res.status(500).send({
          message: "Error del servidor."
        });
      } else {
        if(!certStored) {
          res.status(404).send({
            message: "No se ha encontrado la certificacion."
          });
        } else {
          res.status(200).send({
            message: "Certificacion agregada correctamente."
          });
        }
      }
    });

  }


function subirCompe(req, res) {
  const id = req.params.id;
  const idCompe = req.params.idCompe;
 
  if (req.files) {
    let filePath = req.files.compe.path;
    let fileSplit = filePath.split("\\");
    let fileName = fileSplit[2];


    let extSplit = fileName.split(".");
    let fileExt = extSplit[1];

    if (fileExt !== "pdf" && fileExt !== "png" && fileExt !== "jpg") {
      res.status(400).send({
        message:
          "La extension no es valida. (Extensiones permitidas: .pdf, .png y .jpg)"
      });
    } else {
      Guia.findOneAndUpdate({'_id': id, 'certs.name':  idCompe},{
          $set: {'certs.$.path':  fileName}
        }, (err, resultado) => {
          if(err){
          res.status(500).send({
            message: err
          });
        } else {
          if(!resultado){
            res.status(404).send({
              message: "No se encontró ningún guía."
            });
          } else {
            res.status(200).send({
              message: resultado
            });
          }
          
        }
      })
      
    }
  }
}

function getCompeDoc(req, res) {
  const compeName = req.params.compeName;
  const filePath = "/mtn/volumen_proguias/uploads/competencias/" + compeName;

  fs.exists(filePath, exists => {
    if (!exists) {
      res.status(404).send({ message: "La competencia que buscas no existe." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

function getCerts(req, res) {
  const { id } = req.params;
  const { idCompe } = req.body;

  Guia.find({'_id': id}, {'certs': {$elemMatch: {name: idCompe }}}, (err, certs) => {
    if(err){
      res.status(500).send({
        code: 500,
        message: err
      });
    } else {
      if(!certs) {
        res.status(404).send({
          code: 404,
          message: "No se han encontrado certificaciones"
        });
      } else {
        res.status(200).send({
          certs: certs[0].certs[0]
        });
      }
    }
  });
}

function certsPopuladas(req, res) {
  const { id } = req.params;

  Guia.find({'_id': id}, {'certs': 1}).populate('certs.name').exec(function (err, certs) {
    if(err){
      res.status(500).send({
        code: 500,
        message: err
      });
    } else {
      if(!certs) {
        res.status(404).send({
          code: 404,
          message: "No se han encontrado certificaciones"
        });
      } else {
        res.status(200).send({
          certs: certs[0].certs
        });
      }
    }
  });
}

// function borrarCompe(req, res) {
//     const { id } = req.params;
//     const { idCompe } = req.body;

//     Guia.findOneAndUpdate({'_id': id, 'certs': {$elemMatch: {name: idCompe}}})
// }

// '_id': id, 'certs': {$elemMatch: {name: idCompe}}
// $elemMatch: {'_id': id, 'certs.name': idCompe}





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
    activoGuia,
    deleteGuia,
    signUpAdminGuia,
    getGuia,
    getGuiaEmail,
    getGuiasPag,
    findCompe,
    asignarCompe,
    deleteCompe,
    subirCompe,
    getCompeDoc,
    getCerts,
    certsPopuladas
};


  

    // Guia.findOneAndUpdate({'_id': id, 'certs': {$elemMatch: {name: idCompe}}},{$push: {'path': fileName}}, (err, resultado) => {
    //   if(err) {