const express = require('express');
const libUtils = require('../../resources/libUtils');

const client = require('../../database/');
const router = express.Router();

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa, nome} = req.query;        
        
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }       

        let query = `Select rp.ID_EMPRESA_RESP,
                            rp.NOME_RESP,
                            rp.DATA_INI,
                            rp.DATA_FIM,
                            rp.ID_RESPONSAVEL,
                            rp.ID_TIPO_RESP,
                            au.DESCRICAO_CURTA
                    from EMPRESAS_RESP rp                                            
                    inner join AUXILIARES au on au.ID_RETORNAR = rp.ID_TIPO_RESP and 
                                                au.flag = 15                         
                    Where rp.ID_EMPRESA = ${idEmpresa} `;
                       
                    if (!!nome && nome != "") {
                        query += " and NOME_RESP LIKE '%" + nome + "%'"
                    }
            

        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar Registro'});
    }
});

router.put('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const { ID_EMPRESA_RESP,
                DADOS_RESP,
                DATA_FIM,
                DATA_INI,
                ID_RESPONSAVEL,
                ID_TIPO_RESP,
                NOME_RESP,
                NUMERO_PIS} = req.body;
           

        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
        
        if (ID_EMPRESA_RESP == undefined || ID_EMPRESA_RESP == 0) {
            return res.status(406).send(JSON.stringify({ error: 'O campo "ID Empresa Responsável" é obrigatório.'}));
        }

        if (DATA_INI == undefined || DATA_INI == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "Data Inicial" obrigatório.'}));
        }
        
        if (NOME_RESP == undefined || NOME_RESP == '') {
            return res.status(406).send(JSON.stringify({ error: 'O campo "Nome" é obrigatório.'}));
        }

        if (ID_TIPO_RESP == undefined || ID_TIPO_RESP == 0) {
            return res.status(406).send(JSON.stringify({ error: 'O campo "Tipo" é obrigatório.'}));
        }
        
        if (ID_RESPONSAVEL == undefined || ID_RESPONSAVEL == 0) {
            return res.status(406).send(JSON.stringify({ error: 'O campo "Responsável" é obrigatório.'}));
        }
        
        let query = `update empresas_resp
                     set
                        ${libUtils.getUpdateFieldCondi('DADOS_RESP', DADOS_RESP, true)}
                        ${libUtils.getUpdateFieldCondi('DATA_FIM', libUtils.formatDateDB(DATA_FIM), true)}
                        ${libUtils.getUpdateFieldCondi('DATA_INI', libUtils.formatDateDB(DATA_INI), true)}
                        NOME_RESP = '${NOME_RESP}',
                        ${libUtils.getUpdateFieldCondi('NUMERO_PIS', libUtils.formatDateDB(NUMERO_PIS), true)} 
                        ID_TIPO_RESP = ${ID_TIPO_RESP},
                        ID_EMPRESA =  ${idEmpresa},
                        ID_RESPONSAVEL =  ${ID_RESPONSAVEL}
                     where
                        ID_EMPRESA_RESP = ${ID_EMPRESA_RESP}`;
       
        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});


router.post('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        

        const { DADOS_RESP,
                DATA_FIM,
                DATA_INI,
                ID_RESPONSAVEL,
                ID_TIPO_RESP,
                NOME_RESP,
                NUMERO_PIS} = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
              
        if (DATA_INI == undefined || DATA_INI == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "Data Inicial" obrigatório.'}));
        }
        
        if (NOME_RESP == undefined || NOME_RESP == '') {
            return res.status(406).send(JSON.stringify({ error: 'O campo "Nome" é obrigatório.'}));
        }

        if (ID_TIPO_RESP == undefined || ID_TIPO_RESP == 0) {
            return res.status(406).send(JSON.stringify({ error: 'O campo "Tipo" é obrigatório.'}));
        }
        
        if (ID_RESPONSAVEL == undefined || ID_RESPONSAVEL == 0) {
            return res.status(406).send(JSON.stringify({ error: 'O campo "Responsável" é obrigatório.'}));
        }

        let query = `insert into empresas_resp
                            (DADOS_RESP, DATA_FIM, DATA_INI, ID_EMPRESA, ID_RESPONSAVEL, ID_TIPO_RESP, 
                            NOME_RESP, NUMERO_PIS)
                     values
                            (${libUtils.getInserValue(DADOS_RESP, true)}, 
                            ${DATA_FIM == undefined || DATA_FIM == "" ? 'NULL' : libUtils.getInserValue(libUtils.formatDateDB(DATA_FIM), true)}, 
                            ${libUtils.getInserValue(libUtils.formatDateDB(DATA_INI), true)},  
                            ${idEmpresa}, 
                            ${ID_RESPONSAVEL}, 
                            ${ID_TIPO_RESP}, 
                            '${NOME_RESP}', 
                            ${libUtils.getInserValue(libUtils.formatDateDB(NUMERO_PIS), true)}) returning ID_EMPRESA_RESP `;
                       
        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});


module.exports = app => app.use('/responsavel', router);