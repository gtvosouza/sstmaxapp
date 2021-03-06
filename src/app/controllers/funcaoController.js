const express = require('express');  
const libUtils = require('../../resources/libUtils');

const client = require('../../database');
const router = express.Router();

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa, nome, idFuncaoEmpresa} = req.query;        

        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send({ error: 'Parametro "IdEmpresa" obrigatório.'});
        }
               
        let query = `select ef.ID_EMPRESA_FUNCAO,                
                            ef.ID_FUNCAO,
                            ef.NOME_FUNCAO,
                            ef.SETOR,
                            ef.CBO,
                            ef.COD_GFIP,
                            ef.FERAM_UTILI,
                            ef.ID_AMBIENTE,
                            ab.DESCRICAO as NOME_AMBIENTE,
                            CAST(ef.ATIVIDADES AS VARCHAR(3000)) AS ATIVIDADES,
                            ef.INATIVA,
                            ef.INSALUBRIDADE,
                            ef.PERICULOSIDADE,
                            ef.NAO_SAIR_PPRA,
                            ef.NAO_SAIR_PCMSO,
                            ef.NAO_SAIR_LTCAT 
                        from EMPRESAS_FUNCOES ef
                        left join ES1060_AMB ab on ab.ID_AMBIENTE = ef.ID_AMBIENTE
                    where ef.ID_EMPRESA = ${idEmpresa} AND 
                            (ef.INATIVA IS NULL or ef.INATIVA <> 'S')` ;
        
        if (idFuncaoEmpresa != undefined) {
            query += ' and ID_EMPRESA_FUNCAO = ' + idFuncaoEmpresa;
        }

        if (!!nome && nome != "") {
            query += " and NOME_FUNCAO LIKE '%" + nome + "%'"
        }

        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao executar consulta ' + err});
    }
});

router.put('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const { ID_EMPRESA_FUNCAO,                
                ID_FUNCAO,
                NOME_FUNCAO,
                SETOR,
                CBO,
                COD_GFIP,
                ATIVIDADES,
                FERAM_UTILI,
                ID_AMBIENTE,
                INATIVA,
                INSALUBRIDADE,
                PERICULOSIDADE,
                NAO_SAIR_PPRA,
                NAO_SAIR_PCMSO,
                NAO_SAIR_LTCAT } = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
        
        let query = `update EMPRESAS_FUNCOES
                        set
                        ID_EMPRESA = ${idEmpresa},
                        ID_FUNCAO = ${ID_FUNCAO},
                        ${libUtils.getUpdateFieldCondi('SETOR', SETOR, true)}
                        ${libUtils.getUpdateFieldCondi('CBO', CBO, true)}
                        ${libUtils.getUpdateFieldCondi('ATIVIDADES', ATIVIDADES, true)}
                        ${libUtils.getUpdateFieldCondi('COD_GFIP', COD_GFIP, true)}
                        ${libUtils.getUpdateFieldCondi('FERAM_UTILI', FERAM_UTILI, true)}
                        ${libUtils.getUpdateFieldCondi('ID_AMBIENTE', ID_AMBIENTE, false)}
                        ${libUtils.getUpdateFieldCondi('INSALUBRIDADE', INSALUBRIDADE, true)}
                        ${libUtils.getUpdateFieldCondi('PERICULOSIDADE', PERICULOSIDADE, true)}   
                        ${libUtils.getUpdateFieldBool('NAO_SAIR_PPRA', NAO_SAIR_PPRA)}
                        ${libUtils.getUpdateFieldBool('NAO_SAIR_PCMSO', NAO_SAIR_PCMSO)}
                        ${libUtils.getUpdateFieldBool('NAO_SAIR_LTCAT', NAO_SAIR_LTCAT)}
                        ${libUtils.getUpdateFieldBool('INATIVA', INATIVA)}
                        NOME_FUNCAO = '${NOME_FUNCAO}'                     
                        where
                        ID_EMPRESA_FUNCAO = ${ID_EMPRESA_FUNCAO}
                        `;

        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.post('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const { ID_FUNCAO,
                NOME_FUNCAO,
                SETOR,
                CBO,
                COD_GFIP,
                ATIVIDADES,
                FERAM_UTILI,
                ID_AMBIENTE,
                NAO_SAIR_PPRA, 
                NAO_SAIR_PCMSO, 
                NAO_SAIR_LTCAT, 
                INSALUBRIDADE,
                PERICULOSIDADE} = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = `insert into EMPRESAS_FUNCOES
                            (ID_EMPRESA, 
                             ID_FUNCAO, 
                             NOME_FUNCAO, 
                             CARGO, 
                             SETOR, 
                             ID_GRAU_RISCO, 
                             CBO, 
                             ATIVIDADES, 
                             COD_GFIP, 
                             ATUALIZAR, 
                             AVISAR_ANIVER, 
                             FERAM_UTILI, 
                             ID_AMBIENTE, 
                             DATA_CRIACAO, 
                             INSALU_PERICU, 
                             NAO_SAIR_PPRA, 
                             NAO_SAIR_PCMSO, 
                             NAO_SAIR_LTCAT, 
                             INATIVA, 
                             INSALUBRIDADE, 
                             PERICULOSIDADE)
                    values
                            (${idEmpresa}, 
                             ${ID_FUNCAO}, 
                             '${NOME_FUNCAO}',
                             NULL, 
                             ${libUtils.getInserValue(SETOR, true)}, 
                             NULL, 
                             ${libUtils.getInserValue(CBO, true)}, 
                             ${libUtils.getInserValue(ATIVIDADES, true)},  
                             ${libUtils.getInserValue(COD_GFIP, true)}, 
                             NULL, 
                             NULL, 
                             ${libUtils.getInserValue(FERAM_UTILI, true)}, 
                             ${libUtils.getInserValue(ID_AMBIENTE, false)}, 
                             '${libUtils.getDateDB()}',   
                             NULL, 
                             ${libUtils.getInserValueBoolean(NAO_SAIR_PPRA)},
                             ${libUtils.getInserValueBoolean(NAO_SAIR_PCMSO)},
                             ${libUtils.getInserValueBoolean(NAO_SAIR_LTCAT)},
                             NULL,
                             ${libUtils.getInserValue(INSALUBRIDADE, true)},  
                             ${libUtils.getInserValue(PERICULOSIDADE, true)}) returning ID_EMPRESA_FUNCAO
                        `;

        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

module.exports = app => app.use('/funcao', router);