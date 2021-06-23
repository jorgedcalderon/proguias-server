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

module.exports = {
    addCompe
};