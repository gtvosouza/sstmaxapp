const express = require('express');

const client = require('../../database');
const router = express.Router();

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        

        console.log(idEmpresa);

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
        

        return res.send(await client.execQuery(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});


router.get('/all', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        

        console.log(idEmpresa);

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
                     Where fn.ID_EMPRESA = ${idEmpresa} and
                           fn.data_demissao is null
                     ORDER BY NOME_FUNCIONARIO`;
        

        return res.send(await client.execQuery(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});
module.exports = app => app.use('/funcionario', router);