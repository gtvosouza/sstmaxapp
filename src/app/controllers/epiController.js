const express = require('express');
const client = require('../../database');
const authMiddlware  = require('../middlewares/auth');
const libUtils = require('../../resources/libUtils');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresaRisco} = req.query;        

        if (idEmpresaRisco == undefined || idEmpresaRisco == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "idEmpresaRisco" obrigatório.'}));
        }
        

        let query = `select ID_EQUIPAMENTO_SEG,
                            DESCRICAO,
                            EPI_EPC,
                            CA_EPI,
                            NOME
                        from EQUIPAMENTOS_SEG
                     where ID_EMPRESA_RISCO = ${idEmpresaRisco} and
                        EPI_EPC = 'I'`;
        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed' + err});
    }
});


router.put('/', async(req, res) => {   
    try{   
        const {idEmpresaRisco} = req.query;        

        if (idEmpresaRisco == undefined || idEmpresaRisco == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "idEmpresaRisco" obrigatório.'}));
        }
        
        const { 
                CA_EPI, 
                DESCRICAO, 
                NOME,
                ID_EQUIPAMENTO_SEG                
              } = req.body;

        if (ID_EQUIPAMENTO_SEG == undefined || ID_EQUIPAMENTO_SEG == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "ID_EQUIPAMENTO_SEG" obrigatório.'}));
        }
        
        
        let query = `update EQUIPAMENTOS_SEG
                        set                   
                        ${libUtils.getUpdateFieldCondi('CA_EPI', CA_EPI, true)}
                        ${libUtils.getUpdateFieldCondi('DESCRICAO', DESCRICAO, true)}
                        ${libUtils.getUpdateFieldCondi('NOME', NOME, true)}
                        EFICAZ = EFICAZ                
                        where
                        ID_EQUIPAMENTO_SEG = ${ID_EQUIPAMENTO_SEG}
                        `;

        console.log(query)

        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.post('/', async(req, res) => {   
    try{   
        const {idEmpresaRisco} = req.query;        

        if (idEmpresaRisco == undefined || idEmpresaRisco == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "idEmpresaRisco" obrigatório.'}));
        }
        
        const { 
                CA_EPI, 
                DESCRICAO, 
                NOME                
            } = req.body;
          
       

        let query = ` insert into EQUIPAMENTOS_SEG
                                (CA_EPI, 
                                COND_FUNCTO, 
                                DESCRICAO, 
                                EFICAZ, 
                                EPI_EPC, 
                                HIGIENIZACAO, 
                                ID_EMPRESA_RISCO, 
                                MED_PROTECAO, 
                                NOME, 
                                PERIODI_TROCA, 
                                PRZ_VALID, 
                                USO_ININT)
                        values
                                (
                                ${libUtils.getInserValue(CA_EPI, true)}, 
                                NULL, 
                                ${libUtils.getInserValue(DESCRICAO, true)},  
                                NULL, 
                                'I', 
                                NULL, 
                                ${idEmpresaRisco}, 
                                NULL, 
                                ${libUtils.getInserValue(NOME, true)},  
                                NULL, 
                                NULL, 
                                NULL ) returning ID_EQUIPAMENTO_SEG
                        `;

        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});





module.exports = app => app.use('/epi', router);