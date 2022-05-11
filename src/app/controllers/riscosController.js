const express = require('express');
const libUtils = require('../../resources/libUtils');

const client = require('../../database/');
const router = express.Router();

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa, idFuncao} = req.query;        
        
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
        if (idFuncao == undefined || idFuncao == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdFuncao" obrigatório.'}));
        }

        let query = `  Select er.ID_EMPRESA_RISCO,
                                rc.NOME_RISCO,
                                rc.CLASSIFICACAO,
                                er.DATA_INI
                        From EMPRESAS_RISCOS er                                        
                        inner join CAD_RISCOS rc on er.ID_RISCO = rc.ID_CAD_RISCO      
                        where ID_EMPRESA = ${idEmpresa} and
                            ID_FUNCAO = ${idFuncao} and
                            er.DATA_FIM IS NULL`;


        return res.send(await client.execQuery(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar Registro'});
    }
});

router.get('/id', async(req, res) => {   
    try{       
        const {idEmpresaRisco} = req.query;        
        
        if (idEmpresaRisco == undefined || idEmpresaRisco == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "idEmpresaRisco" obrigatório.'}));
        }

        let query = `    Select er.ID_EMPRESA_RISCO,
                                er.ID_FUNCAO,
                                er.ID_RISCO,
                                rc.NOME_RISCO,
                                er.TIPO_AVALIACAO,
                                er.UNIDADE_MEDIDA,
                                er.INTENSIDADE,
                                er.TECNICA,
                                er.LIMITE_TOLER,
                                er.DATA_INI,
                                er.DATA_FIM,
                                er.FONTE_GERADORA,
                                er.UTILIZA_EPI,
                                er.UTILIZA_EPC
                        From EMPRESAS_RISCOS er                                        
                        inner join CAD_RISCOS rc on er.ID_RISCO = rc.ID_CAD_RISCO      
                        where er.ID_EMPRESA_RISCO = ${idEmpresaRisco}`;


        return res.send(await client.execQuery(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar Registro'});
    }
});

router.put('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const { ID_EMPRESA_RISCO,
                ID_FUNCAO,
                ID_RISCO,
                TIPO_AVALIACAO,
                UNIDADE_MEDIDA,
                INTENSIDADE,
                TECNICA,
                LIMITE_TOLER,
                DATA_INI,
                DATA_FIM,
                FONTE_GERADORA,
                UTILIZA_EPI,
                UTILIZA_EPC } = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        if (DATA_INI == undefined || DATA_INI == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "Data Inicial" obrigatório.'}));
        }

        if (ID_RISCO == undefined || ID_RISCO == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "ID Risco" obrigatório.'}));
        }

        if (ID_FUNCAO == undefined || ID_FUNCAO == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "ID Função" obrigatório.'}));
        }
                
        let query = `update EMPRESAS_RISCOS
                        set ${libUtils.getUpdateFieldCondi('TIPO_AVALIACAO', TIPO_AVALIACAO, false)}
                            ${libUtils.getUpdateFieldCondi('ID_RISCO', ID_RISCO, false)}
                            ${libUtils.getUpdateFieldCondi('INTENSIDADE', INTENSIDADE, true)}
                            ${libUtils.getUpdateFieldCondi('TECNICA', TECNICA, true)}
                            ${libUtils.getUpdateFieldCondi('LIMITE_TOLER', LIMITE_TOLER, true)}
                            ${libUtils.getUpdateFieldCondi('UNIDADE_MEDIDA', UNIDADE_MEDIDA, true)}
                            ${libUtils.getUpdateFieldCondi('DATA_INI', DATA_INI, true)}
                            ${libUtils.getUpdateFieldCondi('DATA_FIM', DATA_FIM, true)}
                            ${libUtils.getUpdateFieldCondi('FONTE_GERADORA', FONTE_GERADORA, true)}
                            ${libUtils.getUpdateFieldBoolInt('UTILIZA_EPI', UTILIZA_EPI)}
                            ${libUtils.getUpdateFieldBoolInt('UTILIZA_EPC', UTILIZA_EPC)}
                            ID_FUNCAO = ${ID_FUNCAO},
                            ID_EMPRESA = ${idEmpresa}
                     where ID_EMPRESA_RISCO = ${ID_EMPRESA_RISCO}
                        `;

        return res.send(await client.execUpdateInsert(query));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.post('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const { 
            ID_FUNCAO,
            ID_RISCO,
            TIPO_AVALIACAO,
            UNIDADE_MEDIDA,
            INTENSIDADE,
            TECNICA,
            LIMITE_TOLER,
            DATA_INI,
            DATA_FIM,
            FONTE_GERADORA,
            UTILIZA_EPI,
            UTILIZA_EPC } = req.body;
        
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        if (DATA_INI == undefined || DATA_INI == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "Data Inicial" obrigatório.'}));
        }

        if (ID_RISCO == undefined || ID_RISCO == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "ID Risco" obrigatório.'}));
        }

        if (ID_FUNCAO == undefined || ID_FUNCAO == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "ID Função" obrigatório.'}));
        }

        let query = `insert into EMPRESAS_RISCOS
                        (ID_EMPRESA, 
                         ID_FUNCAO, 
                         ID_RISCO, 
                         ID_TECNICA_UTIL, 
                         INTENSIDADE, 
                         DATA_INI, 
                         DATA_FIM, 
                         CA_EPI_1, 
                         CA_EPI_2, 
                         CA_EPI_3, 
                         CA_EPI_4, 
                         CA_EPI_5, 
                         CA_EPI_6, 
                         CARACTERIZACAO, 
                         INSALUBRIDADE, 
                         PERICULOSIDADE, 
                         APOSENTADORIA, 
                         EPC_EFICAZ, 
                         EPI_EFICAZ, 
                         ATUALIZAR, 
                         TIPO_RISCO, 
                         TECNICA, 
                         UTILIZA_EPI, 
                         UTILIZA_EPC, 
                         TIPO_AVALIACAO, 
                         UNIDADE_MEDIDA, 
                         HIERARQUIA_EPC, 
                         ENVIAR_REG, 
                         REG_ENVIADO, 
                         DATA_ULT_ENVIO, 
                         MED_CONTROLES, 
                         CARACT_EXPO, 
                         EFICAZ, 
                         LIMITE_TOLER, 
                         FONTE_GERADORA, 
                         ID_PROBABILIDADE, 
                         ID_SEVERIDADE, 
                         ID_NIVEL_EXPO, 
                         SITUACAO_OPER, 
                         TEMPORALIDADE, 
                         INCIDENCIA, 
                         CLASSE)
                    values
                        (${idEmpresa}, 
                         ${ID_FUNCAO}, 
                         ${ID_RISCO}, 
                         NULL, 
                         ${libUtils.getInserValue(INTENSIDADE, true)}, 
                        '${libUtils.formatDateDB(DATA_INI)}', 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         ${libUtils.getInserValue(TECNICA, true)}, 
                         ${libUtils.getInserValueBooleanInt(UTILIZA_EPI)}, 
                         ${libUtils.getInserValueBooleanInt(UTILIZA_EPC)}, 
                         ${libUtils.getInserValue(TIPO_AVALIACAO, false)}, 
                         ${libUtils.getInserValue(UNIDADE_MEDIDA, false)},  
                         NULL, 
                         'S', 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         ${libUtils.getInserValue(LIMITE_TOLER, false)},  
                         ${libUtils.getInserValue(FONTE_GERADORA, true)},   
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL, 
                         NULL) returning ID_EMPRESA_RISCO
                        `;

        return res.send(await client.execUpdateInsert(query));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});


module.exports = app => app.use('/risco', router);