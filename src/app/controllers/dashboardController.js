const express = require('express');

const client = require('../../database');
const router = express.Router();
const libUtils = require('../../resources/libUtils');

const authMiddlware  = require('../middlewares/auth');
router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       

        if (req.empresaID  == undefined || req.empresaID  == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = ` 
        SELECT
            (select COUNT(*)
               from FUNCIONARIOS
            where ID_EMPRESA = ${req.empresaID}  AND
                  DATA_DEMISSAO IS NULL) AS FUNCIONARIOS_ATIVOS,
            
                  CAST((select SUM(VALOR)
                  from LANCAMENTOS
               where ID_EMPRESA = ${req.empresaID}   AND
                     TIPO_DOCUMENTO = 'B' AND
                     TIPO = 'R' AND
                     DATA >= dateadd (-1 year to CURRENT_DATE)) AS NUMERIC(15,2)) AS FINANCEIRO,
            
            (select COUNT(*)
               from GER_ESOCIAL
            where ID_EMPRESA = ${req.empresaID}  AND
                  ENVIADO = 'S') AS ESOCIAL,
            
            (select COUNT(*)
               from EMPRESAS_FUNCOES
            where ID_EMPRESA = ${req.empresaID}  AND
                  (INATIVA IS NULL or (INATIVA = 'N'))) AS FUNCOES
        
        FROM RDB$DATABASE`;
        
        const result = await client.execQuery(query,  req.user)

        return res.send(result[0]);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});
   

router.get('/consultas', async(req, res) => {   
    try{       

        if (req.empresaID  == undefined || req.empresaID  == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
        var currentTime = new Date();        
        var year = currentTime.getFullYear()
        
        let query = `
                    select MES,
                    COUNT(REG) as QTDE
                    FROM (select EXTRACT (MONTH FROM DATA) as MES,
                        1 AS REG
                    from CONSULTAS
                    where ID_EMPRESA = ${req.empresaID} and
                        DATA >= '01/01/${year}')
                    GROUP BY 1`;
        
        const result = await client.execQuery(query,  req.user)
        
        const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (result.length > 0) {
            result.forEach(e => {
                data[e.MES -1] = e.QTDE
            });

        }


        return res.send(data);
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});
   

module.exports = app => app.use('/dashboard', router);