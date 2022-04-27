const express = require('express');

const client = require('../../database/');
const router = express.Router();

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        
        
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }       

        let query = `Select rp.NOME_RESP,
                            rp.DATA_INI,
                            rp.DATA_FIM,
                            au.DESCRICAO_CURTA
                    from EMPRESAS_RESP rp                                            
                    inner join AUXILIARES au on au.ID_RETORNAR = rp.ID_TIPO_RESP and 
                                                au.flag = 15                         
                    Where rp.ID_EMPRESA = ${idEmpresa} `;


        return res.send(await client(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar Registro'});
    }
});

module.exports = app => app.use('/responsavel', router);