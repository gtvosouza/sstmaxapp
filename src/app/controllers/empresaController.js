const express = require('express');

const client = require('../../database/');
const router = express.Router();
const libUtils = require('../../resources/libUtils');

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/descricao', async(req, res) => {   
    try{       
        const {id, nome} = req.query;        

        let query = 'SELECT ID_EMPRESA, NOME_EMPRESA FROM EMPRESAS where 1 = 1';

        if (!!id && id > 0) {
            query += ' and ID_EMPRESA = ' + id
        }

        if (!!nome && nome != "") {
            query += " and NOME_EMPRESA LIKE '%" + nome + "%'"
        }

        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.get('/', async(req, res) => {   
    try{       
        const {id, nome, idFormaPagto} = req.query;        

        let query = `select FIRST 100 ID_EMPRESA,
                            NOME_EMPRESA,
                            CNPJ,
                            LAUDO_DATA_ENTREGA,                            
                            (Select DESCRICAO_CURTA
                                FROM VIEW_FORMAS_PAGTO
                                WHERE ID_RETORNAR = ep.id_forma_pagto) AS FORMA_PAGTO,
                            (Select DESCRICAO_CURTA
                                FROM VIEW_GRAU_RISCO
                                WHERE ID_RETORNAR = ep.id_grau_risco) AS GRAU_RISCO
                          from EMPRESAS ep
                     where 1 = 1   `;

        if (!!id && id > 0) {
            query += ' and ID_EMPRESA = ' + id
        }

        if (!!idFormaPagto && idFormaPagto > 0) {
            query += ' and ID_FORMA_PAGTO = ' + idFormaPagto
        }

        if (!!nome && nome != "") {
            query += " and NOME_EMPRESA LIKE '%" + nome + "%'"
        }

        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.get('/id', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        
        
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(400).send({ error: 'IdEmpresa não informada'});
        }

        let query = `select ID_EMPRESA,
                            NOME_EMPRESA,
                            CNPJ,
                            ENDERECO,
                            NUMERO,
                            BAIRRO,
                            CIDADE,
                            ULTIMO_LAUDO,
                            TELEFONES,
                            EMAIL,
                            CONTATO,
                            CPF_RESPONSAVEL,
                            RESP_EMPRESA_NOME,
                            CAST(OBSERVACAO AS VARCHAR(1000)) AS OBSERVACAO,
                            TRIM(UF) UF,
                            (Select DESCRICAO_CURTA
                                FROM VIEW_FORMAS_PAGTO
                            WHERE ID_RETORNAR = ep.id_forma_pagto) AS FORMA_PAGTO,
                            (Select DESCRICAO_CURTA
                                FROM VIEW_GRAU_RISCO
                            WHERE ID_RETORNAR = ep.id_grau_risco) AS GRAU_RISCO,
                            (Select Count(*)
                                from FUNCIONARIOS
                            where ID_EMPRESA = ep.id_empresa AND
                                DATA_DEMISSAO IS NULL) as QTDE_FUNCIONARIOS,
                            (Select Count(*)
                                from ES1060_AMB
                            where ID_EMPRESA = ep.id_empresa ) as QTDE_AMBIENTE,
                            (Select Count(*)
                                from EMPRESAS_FUNCOES
                            where ID_EMPRESA = ep.id_empresa and
                                    (INATIVA IS NULL or INATIVA <> 'S')) as QTDE_FUNCOES,
                            (Select Count(*)
                                from EMPRESAS_RESP
                            where ID_EMPRESA = ep.id_empresa) as QTDE_RESPONSAVEIS
                        from EMPRESAS ep
                    where ep.ID_EMPRESA = ${idEmpresa} `;

        const empresas =  await client.execQuery(query, req.user);
        
        if (empresas.length == 0) {
            return res.status(400).send({ error: 'Empresa não encontrada'});
        }

        return res.send(empresas[0]);
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const {OBSERVACAO,
               CONTATO,
               TELEFONES,
               RESP_EMPRESA_NOME,
               CPF_RESPONSAVEL,
               CIDADE,
               UF,
               CEP,
               ENDERECO,
               NUMERO,
               BAIRRO,
               COMPLEMENTO,
               ULTIMO_LAUDO} = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
        
        let query = `update EMPRESAS
                     set
                        ${libUtils.getUpdateFieldCondi('OBSERVACAO', OBSERVACAO, true)}
                        ${libUtils.getUpdateFieldCondi('CONTATO', CONTATO, true)}
                        ${libUtils.getUpdateFieldCondi('TELEFONES', TELEFONES, true)}
                        ${libUtils.getUpdateFieldCondi('RESP_EMPRESA_NOME', RESP_EMPRESA_NOME, true)}
                        ${libUtils.getUpdateFieldCondi('CPF_RESPONSAVEL', CPF_RESPONSAVEL, true)}
                        ${libUtils.getUpdateFieldCondi('CIDADE', CIDADE, true)}
                        ${libUtils.getUpdateFieldCondi('UF', UF, true)}
                        ${libUtils.getUpdateFieldCondi('CEP', CEP, true)}
                        ${libUtils.getUpdateFieldCondi('ENDERECO', ENDERECO, true)}
                        ${libUtils.getUpdateFieldCondi('NUMERO', NUMERO, true)}
                        ${libUtils.getUpdateFieldCondi('BAIRRO', BAIRRO, true)}
                        ${libUtils.getUpdateFieldCondi('COMPLEMENTO', COMPLEMENTO, true)}
                        ${libUtils.getUpdateFieldCondi('ULTIMO_LAUDO', ULTIMO_LAUDO, true)}                        
                        CIPA = CIPA
                     where
                        ID_EMPRESA = ${idEmpresa}
                     `;
                        
        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

module.exports = app => app.use('/empresa', router);