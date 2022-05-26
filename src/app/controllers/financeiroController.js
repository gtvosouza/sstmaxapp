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

        let query = ` select VENCIMENTO,
                            VALOR,
                            CASE WHEN TIPO = 'c'
                                THEN 'PAGO'
                                ELSE 'ABERTO'
                            END TIPO,
                            NUMERO_BANCO
                        from LANCAMENTOS
                    where ID_EMPRESA = ${req.empresaID}   AND
                        TIPO_DOCUMENTO = 'B' AND
                        TIPO IN ('c','R') AND
                        DATA >= dateadd (-1 year to CURRENT_DATE)
                    order by DATA DESC
                        `;
        

        return res.send(await client.execQuery(query,  req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});
   


module.exports = app => app.use('/financeiro', router);