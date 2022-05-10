const express = require('express');

const client = require('../../database');
const libUtils = require('../../resources/libUtils');
const router = express.Router();

//const authMiddlware  = require('../middlewares/auth');
//router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idAmbiente} = req.query;        

        if (idAmbiente == undefined || idAmbiente == 0) {
            return res.status(406).send({ error: 'Parametro "idAmbiente" obrigatório.'});
        }

        let query = 'SELECT * FROM POSTOS_TRAB where ID_AMBIENTE = ' + idAmbiente;

        return res.send(await client.execQuery(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao executar consulta'});
    }
});

router.put('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const {ID_POSTO_TRAB,
               DBA,
               DESCRICAO,
               ID_AMBIENTE,
               ILUMINACAO_MAX,
               LUX,
               OBSERVACAO} = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        if (ID_AMBIENTE == undefined || ID_AMBIENTE == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "ID Ambiente" obrigatório.'}));
        }
        
        if (DESCRICAO == undefined || DESCRICAO == '') {
            return res.status(406).send(JSON.stringify({ error: 'O campo "Descrição" é obrigatório.'}));
        }
        
        let query = `update POSTOS_TRAB
                     set
                        ${libUtils.getUpdateFieldCondi('DBA', DBA, false)}
                        DESCRICAO = '${DESCRICAO}',
                        ${libUtils.getUpdateFieldCondi('ILUMINACAO_MAX', ILUMINACAO_MAX, false)}
                        ${libUtils.getUpdateFieldCondi('LUX', LUX, false)}
                        ${libUtils.getUpdateFieldCondi('OBSERVACAO', OBSERVACAO, true)}
                        ID_AMBIENTE = ${ID_AMBIENTE}
                     where
                        ID_POSTO_TRAB = ${ID_POSTO_TRAB}
                     `;
       
        return res.send(await client.execUpdateInsert(query));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});


router.post('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        

        const {ID_POSTO_TRAB,
               DBA,
               DESCRICAO,
               ID_AMBIENTE,
               ILUMINACAO_MAX,
               LUX,
               OBSERVACAO} = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = `insert into POSTOS_TRAB
                        (DBA, DESCRICAO, ID_AMBIENTE, ILUMINACAO_MAX, LUX, OBSERVACAO)
                     values
                        ( ${libUtils.getInserValue(DBA, false)}, 
                          '${DESCRICAO}', 
                          ${ID_AMBIENTE}, 
                          ${libUtils.getInserValue(ILUMINACAO_MAX, false)}, 
                          ${libUtils.getInserValue(LUX, false)}, 
                          ${libUtils.getInserValue(OBSERVACAO, true)}) returning  ID_POSTO_TRAB`;

        console.log(query)
        return res.send(await client.execUpdateInsert(query));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});


module.exports = app => app.use('/postotrabalho', router);