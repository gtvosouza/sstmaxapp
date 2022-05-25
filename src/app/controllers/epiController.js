const express = require('express');
const client = require('../../database');
const authMiddlware  = require('../middlewares/auth');
const libUtils = require('../../resources/libUtils');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresaRisco} = req.query;        

        if (idEmpresaRisco == undefined || idEmpresaRisco == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "idEmpresaRisco" obrigatório.'}));
        }
        

        let query = `select ID_EQUIPAMENTO_SEG,
                            DESCRICAO,
                            EPI_EPC,
                            CA_EPI,
                            NOME
                        from EQUIPAMENTOS_SEG
                     where ID_EMPRESA_RISCO = ${idEmpresaRisco} and
                        EPI_EPC = 'I'`;
        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed' + err});
    }
});

module.exports = app => app.use('/epi', router);