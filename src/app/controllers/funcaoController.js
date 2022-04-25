const express = require('express');

const client = require('../../database');
const router = express.Router();

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        

        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send({ error: 'Parametro "IdEmpresa" obrigatório.'});
        }

        let query = "select * from EMPRESAS_FUNCOES where ID_EMPRESA = " + idEmpresa + " AND (INATIVA IS NULL or INATIVA <> 'S')" ;

        
        return res.send(await client(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao executar consulta'});
    }
});

module.exports = app => app.use('/funcao', router);