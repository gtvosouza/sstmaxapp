const express = require('express');

const client = require('../../database');
const router = express.Router();
const libUtils = require('../../resources/libUtils');

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       

        if (req.empresaID  == undefined || req.empresaID  == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = `select ep.NOME_EMPRESA,
                            fn.NOME_FUNCIONARIO,
                            es.DATA_DOC,
                            es.DATA_ENVIO,
                            es.PROTOCOLO,
                            es.RECIBO,
                            es.ID_EVENTO
                        from GER_ESOCIAL es
                        inner join EMPRESAS ep on ep.ID_EMPRESA = es.ID_EMPRESA
                        inner join FUNCIONARIOS fn on fn.ID_FUNCIONARIO = es.ID_FUNCIONARIO
                    where es.ID_EMPRESA = ${req.empresaID} and
                        es.recibo is not null`;
        

        return res.send(await client.execQuery(query,  req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});
   


module.exports = app => app.use('/esocial', router);