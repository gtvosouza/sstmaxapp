const express = require('express');

const client = require('../../database');
const router = express.Router();
const libUtils = require('../../resources/libUtils');

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        


        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = ` Select fn.NOME_FUNCIONARIO,
                            cf.NOME_FUNCAO,
                            cf.SETOR
                     from FUNCIONARIOS fn
                     inner join  EMPRESAS_FUNCOES cf   on cf.id_funcao = fn.ID_FUNCAO and
                                                         cf.ID_EMPRESA = fn.ID_EMPRESA
                     Where fn.ID_EMPRESA = ${idEmpresa} and
                           fn.data_demissao is null
                     ORDER BY NOME_FUNCIONARIO`;
        

        return res.send(await client.execQuery(query,  req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});
   
router.get('/all', async(req, res) => {   
    try{       
        const {idEmpresa, idFuncionario}  = req.query;        

        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = ` Select fn.ID_FUNCIONARIO,
                             fn.NOME_FUNCIONARIO,
                             fn.ID_FUNCAO,
                             fn.DATA_NASC,
                             fn.DATA_ADMISSAO,
                             fn.SEXO,
                             fn.CPF,
                             fn.MATRICULA_ESOCIAL,
                             cf.NOME_FUNCAO,
                             cf.SETOR
                     from FUNCIONARIOS fn
                     inner join  EMPRESAS_FUNCOES cf   on cf.id_funcao = fn.ID_FUNCAO and
                                                         cf.ID_EMPRESA = fn.ID_EMPRESA
                    `;
        if(idFuncionario != undefined){
            query += ` where ID_FUNCIONARIO = ${idFuncionario}` 
        } else {
            query += ` Where fn.ID_EMPRESA = ${idEmpresa} and
                             fn.data_demissao is null`;
        }

        query += ` ORDER BY NOME_FUNCIONARIO`;

        console.log(query)

        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});

// APENAS WEB
router.post('/', async(req, res) => {   
    try{   
        const { NOME_FUNCIONARIO,
                ID_FUNCAO,
                DATA_NASC,
                DATA_ADMISSAO,
                SEXO,
                CPF,
                MATRICULA_ESOCIAL,
                SETOR} = req.body;
           
        if (req.empresaID == undefined || req.empresaID == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = `insert into FUNCIONARIOS
                        (ID_EMPRESA, 
                         NOME_FUNCIONARIO, 
                         CADASTRO_DATA, 
                         CADASTRO_SITUACAO, 
                         ID_FUNCAO, 
                         SETOR, 
                         CARGO, 
                         DATA_NASC, 
                         DATA_ADMISSAO, 
                         DATA_DEMISSAO, 
                         SEXO, 
                         RG, 
                         CPF, 
                         CTPS_NUMERO, 
                         CTPS_SERIE, 
                         CTPS_UF, 
                         NIT, 
                         ATUALIZAR, 
                         EMAIL, 
                         ID_AGENDA, 
                         ID_USUARIO_MODIFICOU, 
                         INSS, 
                         PROXIMO_EXAME, 
                         DIGITAL, 
                         ID_STESA, 
                         LOG_ALTERACAO, 
                         LOG_CRIACAO, 
                         FREE_LANCE, 
                         ENDERECO, 
                         CIDADE, 
                         CELULAR, 
                         MATRICULA_ESOCIAL, 
                         PCD, 
                         OBS_FUNC, 
                         ID_FUNCAO_EMPRESA, 
                         COVID, 
                         TERMO_LGPD)
                    values
                        (${req.empresaID},  
                        '${NOME_FUNCIONARIO}', 
                        CURRENT_DATE, 
                        NULL, 
                        ${ID_FUNCAO}, 
                        ${libUtils.getInserValue(SETOR, true)}, 
                        null, 
                        '${libUtils.formatDateDB(DATA_NASC)}', 
                        '${libUtils.formatDateDB(DATA_ADMISSAO)}', 
                        NULL, 
                        '${SEXO}', 
                        NULL, 
                        '${CPF}', 
                        '', 
                        '', 
                        '', 
                        '', 
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
                        '${MATRICULA_ESOCIAL}', 
                        NULL, 
                        NULL, 
                        NULL, 
                        NULL, 
                        NULL)  returning ID_FUNCIONARIO
                        `;
        console.log(query)
        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});


router.put('/', async(req, res) => {   
    try{   
        console.log(req.empresaID)
        const { ID_FUNCIONARIO,
                NOME_FUNCIONARIO,
                ID_FUNCAO,
                DATA_NASC,
                DATA_ADMISSAO,
                SEXO,
                CPF,
                MATRICULA_ESOCIAL,
                SETOR} = req.body;
           
        if (req.empresaID == undefined || req.empresaID == 0) {
                    return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
        
        let query = `update FUNCIONARIOS
                        set
                        ${libUtils.getUpdateFieldCondi('ID_FUNCAO', ID_FUNCAO, false)}
                        ${libUtils.getUpdateFieldCondi('DATA_NASC', libUtils.formatDateDB(DATA_NASC), true)}
                        ${libUtils.getUpdateFieldCondi('DATA_ADMISSAO', libUtils.formatDateDB(DATA_ADMISSAO), true)}
                        ${libUtils.getUpdateFieldCondi('SEXO', SEXO, true)}
                        ${libUtils.getUpdateFieldCondi('CPF', CPF, false)}
                        ${libUtils.getUpdateFieldCondi('SETOR', SETOR, true)}
                        ${libUtils.getUpdateFieldCondi('MATRICULA_ESOCIAL', MATRICULA_ESOCIAL, true)}
                        NOME_FUNCIONARIO = '${NOME_FUNCIONARIO}'                     
                        where
                        ID_FUNCIONARIO = ${ID_FUNCIONARIO}
                        `;
        await client.execUpdateInsert(query, req.user)

        return res.send({message: "Funcionário atualizado com sucesso"});
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});
module.exports = app => app.use('/funcionario', router);