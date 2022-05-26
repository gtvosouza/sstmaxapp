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

        let query = `select af.ID_AGENDA_FONE,
                            af.NOME_FUNCIONARIO,
                            af.NOME_FUNCAO,
                            af.DATA_AGENDA,
                            af.HORA_AGENDA,
                            au.DESCRICAO_CURTA TIPO_EXAME
                        from AGENDA_FONE af
                        inner join FUNCIONARIOS fn on fn.ID_FUNCIONARIO = af.ID_FUNCIONARIO
                        inner join AUXILIARES au on au.id_retornar = af.id_tipo_exame AND au.flag = 5
                    where af.id_empresa = ${req.empresaID} AND
                        af.DATA_AGENDA >= CURRENT_DATE`;
        

        return res.send(await client.execQuery(query,  req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Erro ao carregar dados'});
    }
});
   


module.exports = app => app.use('/agenda', router);