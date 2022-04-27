const express = require('express');

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


        return res.send(await client(query));
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


        return res.send(await client(query));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao Carregar Registro'});
    }
});

module.exports = app => app.use('/risco', router);