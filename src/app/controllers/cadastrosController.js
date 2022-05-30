const express = require('express');

const client = require('../../database');
const router = express.Router();

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/riscos', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select FIRST 40 *
                        from CAD_RISCOS
                    where ativo = 'S'`;
                
        if (!!nome && nome != "") {
            query += " and NOME_RISCO LIKE '%" + nome + "%'"
        }

        const riscos =  await client.execQuery(query, req.user);
        
        if (riscos.length == 0) {
            return res.status(400).send({ error: 'Risco não encontrado'});
        }

        return res.send(riscos);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});

router.get('/funcoes', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select FIRST 40 *
                        from CAD_FUNCOES
                    where 1 = 1`;
                
        if (!!nome && nome != "") {
            query += " and NOME_FUNCAO LIKE '%" + nome + "%'"
        }

        const funcoes =  await client.execQuery(query, req.user);
        
        if (funcoes.length == 0) {
            return res.status(400).send({ error: 'Função não encontrado'});
        }

        return res.send(funcoes);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});

router.get('/tiporesponsavel', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select ID_RETORNAR,
                            DESCRICAO_CURTA
                        from AUXILIARES
                    where flag = 15`;
                
        if (!!nome && nome != "") {
            query += " and DESCRICAO_CURTA LIKE '%" + nome + "%'"
        }

        const tipos =  await client.execQuery(query, req.user);
        
        if (tipos.length == 0) {
            return res.status(400).send({ error: 'Tipo não encontrado'});
        }

        return res.send(tipos);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});


router.get('/nivelExposicao', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select ID_RETORNAR,
                            DESCRICAO_CURTA
                        from AUXILIARES
                    where flag = 37`;
                
        if (!!nome && nome != "") {
            query += " and DESCRICAO_CURTA LIKE '%" + nome + "%'"
        }

        const tipos =  await client.execQuery(query, req.user);
        
        if (tipos.length == 0) {
            return res.status(400).send({ error: 'Tipo não encontrado'});
        }

        return res.send(tipos);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});

router.get('/severidade', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select ID_RETORNAR,
                            DESCRICAO_CURTA
                        from AUXILIARES
                    where flag = 36`;
                
        if (!!nome && nome != "") {
            query += " and DESCRICAO_CURTA LIKE '%" + nome + "%'"
        }

        const tipos =  await client.execQuery(query, req.user);
        
        if (tipos.length == 0) {
            return res.status(400).send({ error: 'Tipo não encontrado'});
        }

        return res.send(tipos);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});


router.get('/probabilidade', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select ID_RETORNAR,
                            DESCRICAO_CURTA
                        from AUXILIARES
                    where flag = 35`;
                
        if (!!nome && nome != "") {
            query += " and DESCRICAO_CURTA LIKE '%" + nome + "%'"
        }

        const tipos =  await client.execQuery(query, req.user);
        
        if (tipos.length == 0) {
            return res.status(400).send({ error: 'Tipo não encontrado'});
        }

        return res.send(tipos);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});


router.get('/responsavel', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select *
                        from RESPONSAVEL
                    where 1 = 1`;
                
        if (!!nome && nome != "") {
            query += " and UPPER(NOME) LIKE '%" + nome.toUpperCase() + "%'"
        }

        const resp =  await client.execQuery(query,req.user);
        
        if (resp.length == 0) {
            return res.status(400).send({ error: 'Tipo não encontrado'});
        }

        return res.send(resp);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});

module.exports = app => app.use('/cadastro', router);