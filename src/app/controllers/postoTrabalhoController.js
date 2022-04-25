const express = require('express');

const client = require('../../database');
const router = express.Router();

router.get('/', async(req, res) => {   
    try{       
        const {idAmbiente} = req.query;        

        if (idAmbiente == undefined || idAmbiente == 0) {
            return res.status(406).send({ error: 'Parametro "idAmbiente" obrigatório.'});
        }

        let query = 'SELECT * FROM POSTOS_TRAB where ID_AMBIENTE = ' + idAmbiente;

        return res.send(await client(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao executar consulta'});
    }
});

module.exports = app => app.use('/postotrabalho', router);