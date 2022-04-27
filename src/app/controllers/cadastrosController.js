const express = require('express');

const client = require('../../database');
const router = express.Router();


router.get('/riscos', async(req, res) => {   
    try{       
        const {nome} = req.query;            
        
        let query = `select FIRST 40 *
                        from CAD_RISCOS
                    where ativo = 'S'`;
                
        if (!!nome && nome != "") {
            query += " and NOME_RISCO LIKE '%" + nome + "%'"
        }

        const riscos =  await client(query);
        
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

        const funcoes =  await client(query);
        
        if (funcoes.length == 0) {
            return res.status(400).send({ error: 'fUNÇÃO não encontrado'});
        }

        return res.send(funcoes);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar'});
    }
});

module.exports = app => app.use('/cadastro', router);