const express = require('express');

const client = require('../../database/');
const router = express.Router();

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        

        console.log(idEmpresa);

        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = 'SELECT * FROM ES1060_AMB where ID_EMPRESA = ' + idEmpresa;

        return res.send(await client(query));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/ambiente', router);