const express = require('express');
const client = require('../../database/');
const authMiddlware  = require('../middlewares/auth');
const libUtils = require('../../resources/libUtils');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {   
    try{       
        const {idEmpresa} = req.query;        

        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        let query = 'SELECT * FROM ES1060_AMB where ID_EMPRESA = ' + idEmpresa;
        return res.send(await client.execQuery(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed' + err});
    }
});

router.get('/caracteristicas', async(req, res) => {   
    try{       
        const carecteristicas = [
            {
                descricao : "Pé Direito (M)",
                opcoes: ["2,5m", "3m", "4m", "5m", "6m", "Outro"]            
            },
            {
                descricao : "Cobertura",
                opcoes: ["Galvanizada", "Fibrocimento", "Cerâmica", "Translúcidas", "Concreto", "Outro"]            
            },
            {
                descricao : "Parede",
                opcoes: ["Alvenaria", "Divisórias", "Vidro", "Madeira", "Gesso", "Metal", "Outro"]            
            },
            {
                descricao : "Iluminação",
                opcoes: ["Natural", "Artificial", "Artificial/natual", "Outro"]            
            },
            {
                descricao : "Ventilação",
                opcoes: ["Portas", "Janelas", "Ventiladores", "Natural", "Outro"]            
            },
            {
                descricao : "Piso",
                opcoes: ["Cerâmico", "Cimento Industrial", "Paviflex laminado", "Concreto", "Madeira", "Carpete"]            
            },
            {
                descricao : "EPC",
                opcoes: ["Coifa/Capela Exaustora", "Exaustor eólico", "Outros"]            
            },
        ]

        return res.send(carecteristicas);
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed' + err});
    }
});

router.get('/descricao', async(req, res) => {   
    try{       
        const {values} = req.body;    
      
        let descricao = "";

        values.forEach(element => {
            if(descricao == "")
                descricao += `${element.descricao}: ${element.valor};`
            else
            descricao += ` ${element.descricao}: ${element.valor};`            
        });

        return res.send(descricao);
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed' + err});
    }
});

router.put('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const {ID_AMBIENTE,
               DESCRICAO,
               LOCAL,
               TP_INSCRICAO,
               NUM_INSC,
               DATA_INICIO,
               DATA_FINAL,
               DESCRICAO_LONGA} = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }
        
        let query = `update ES1060_AMB
                        set DESCRICAO = '${DESCRICAO}',
                            DATA_INICIO = '${libUtils.formatDateDB(DATA_INICIO)}',
                            DESCRICAO_LONGA = '${DESCRICAO_LONGA}',
                            ID_EMPRESA = ${idEmpresa},
                            LOCAL = ${LOCAL},
                            NUM_INSC = '${NUM_INSC}',
                            TP_INSCRICAO = ${TP_INSCRICAO}`;

        query += libUtils.getLogAlteracao(req.userName);
        
        if (DATA_FINAL != undefined)
            query += `,DATA_FINAL = '${DATA_FINAL}`
         
            query += ` where
                        ID_AMBIENTE = ${ID_AMBIENTE}`
       
        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.post('/', async(req, res) => {   
    try{   
        const {idEmpresa} = req.query;        
        const {DESCRICAO,
               LOCAL,
               TP_INSCRICAO,
               NUM_INSC,
               DATA_INICIO,
               DATA_FINAL,
               DESCRICAO_LONGA} = req.body;
           
        if (idEmpresa == undefined || idEmpresa == 0) {
            return res.status(406).send(JSON.stringify({ error: 'Parametro "IdEmpresa" obrigatório.'}));
        }

        if (DATA_INICIO == undefined) {
            return res.status(406).send(JSON.stringify({ error: 'O Campo "Data Inicio" é obrigatório.'}));
        }
        
        if (DESCRICAO == undefined) {
            return res.status(406).send(JSON.stringify({ error: 'O Campo "Descrição" é obrigatório.'}));
        }

        if (LOCAL == undefined) {
            return res.status(406).send(JSON.stringify({ error: 'O Campo "Local" é obrigatório.'}));
        }
        
        if (TP_INSCRICAO == undefined) {
            return res.status(406).send(JSON.stringify({ error: 'O Campo "Tipo de Inscrição" é obrigatório.'}));
        }

        const maxSeq = await client.execQuery(`Select max(SEQ_EMPRESA) seq from ES1060_AMB where ID_EMPRESA = ${idEmpresa}`);

        let nextSeq = 1;

        if (maxSeq.length > 0) {
            nextSeq = Number(maxSeq[0].SEQ) + 1;
        }
        
        let query = `insert into ES1060_AMB
            (DATA_FINAL, DATA_INICIO, DATA_ULT_ENVIO, DESCRICAO, DESCRICAO_LONGA, 
            ENVIAR_REG, ID_EMPRESA, LOCAL, LOG_ALTERACAO, NUM_INSC, REG_ENVIADO, 
            SEQ_EMPRESA, TP_INSCRICAO)
            values
            (${DATA_FINAL == undefined ? 'null' : `'${libUtils.formatDateDB(DATA_FINAL)}'`}, '${libUtils.formatDateDB(DATA_INICIO)}', null, '${DESCRICAO}', ${DESCRICAO_LONGA == undefined ? 'null' : `'${DESCRICAO_LONGA}'`}, 
            null, ${idEmpresa}, ${LOCAL}, null, '${NUM_INSC}', null, 
            ${nextSeq}, ${TP_INSCRICAO}) returning ID_AMBIENTE`;
     
        return res.send(await client.execUpdateInsert(query, req.user));
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

module.exports = app => app.use('/ambiente', router);