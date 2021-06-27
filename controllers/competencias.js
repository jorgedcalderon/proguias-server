const Compe = require("../models/competencias");

function addCompe(req, res) {
    const body = req.body;
    const compe = new Compe(body);

    compe.save((err, compeStored) => {
        if (err) {
            res.status(500).send({ 
                code: 500,
                message: "Error del servidor."
            });
        } else {
            if(!compeStored) {
                res.status(400).send({
                    code: 400,
                    message: "No se ha podido crear la competencia."
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: "Competencia creada."
                });
            }
        }
    });
}

function getCompes(req, res) {
    Compe.find()
      .sort({ order: "asc" })
      .exec((err, compeStored) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor." });
        } else {
          if (!compeStored) {
            res.status(404).send({
              message: "No se ha encontrado ninguna competencia."
            });
          } else {
            res.status(200).send({ compe: compeStored });
          }
        }
      });
  }
  
  function updateCompe(req, res) {
    let compeData = req.body;
    const params = req.params;
  
    Compe.findByIdAndUpdate(params.id, compeData, (err, compeUpdate) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!compeUpdate) {
          res.status(404).send({ message: "No se ha encontrado ninguna competencia." });
        } else {
          res.status(200).send({ message: "Competencia actualizada." });
        }
      }
    });
  }
  
  function activateCompe(req, res) {
    const { id } = req.params;
    const { activa } = req.body;
  
    Compe.findByIdAndUpdate(id, { activa: activa }, (err, compeStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!compeStored) {
          res.status(404).send({ message: "No se ha encontrado la competencia." });
        } else {
          if (activa === true) {
            res.status(200).send({ message: "Competencia activada correctamente." });
          } else {
            res.status(200).send({ message: "Competencia desactivado correctamente." });
          }
        }
      }
    });
  }

  
  function deleteCompe(req, res) {
    const { id } = req.params;
  
    Compe.findByIdAndRemove(id, (err, compeDeleted) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!compeDeleted) {
          res.status(404).send({ message: "Competencia no encontrada." });
        } else {
          res
            .status(200)
            .send({ message: "La competencia ha sido eliminada correctamente." });
        }
      }
    });
  }

  function getCompesActiva(req, res) {
    const query = req.query;
  
    Compe.find({ activa: query.activa }).then(compes => {
      if (!compes) {
        res.status(404).send({ message: "No se ha encontrado ninguna competencia." });
      } else {
        res.status(200).send({ compes: compes });
      }
    });
}



module.exports = {
    addCompe,
    getCompes,
    updateCompe,
    activateCompe,
    deleteCompe,
    getCompesActiva
};