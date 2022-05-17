const express = require('express');
const client = require('../../database');

const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const router = express.Router();


function generateToken(params = {}){
    return token = jwt.sign(params, authConfig.secret, {
        expiresIn: 43200,        
    });
}

router.post('/', async(req, res) => {   
    try{       
        const {usuario, senha} = req.body;        
                
        const query = "select ID_USUARIO, NOME_USUARIO, SENHA, trim(COALESCE(USUARIO_WEB, 'N')) as USUARIO_WEB  from USUARIOS where upper(NOME_USUARIO) = '"+ usuario.toUpperCase() + "'";
        const user = await client.execQuery(query);

        if (user.length == 0) {
           return res.status(400).send({ error: 'Usuário não encontrado'});
        } else {
            if (user[0].USUARIO_WEB != "S") {
                return res.status(400).send({ error: 'Usuário sem direito de acessar app'});
            } else {
                if (user[0].SENHA.toUpperCase() != senha.toUpperCase()) {
                    return res.status(400).send({ error: 'Senha inválida'});
                } else {                   
                    const accessToken = generateToken({ id: user[0].ID_USUARIO, nome: user[0].NOME_USUARIO  });
                     
                    const userReturn = {
                                        id : user[0].ID_USUARIO,
                                        nome: user[0].NOME_USUARIO
                                        }

                    return res.send({ user : userReturn, 
                                      accessToken,
                                    });
                }   
            }

        }
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed', errorDescription: err});
    }
});



router.post('/client', async(req, res) => {   
    try{       
        const {usuario, senha} = req.body;        
                
        /*const query = "select ID_USUARIO, NOME_USUARIO, SENHA, trim(COALESCE(USUARIO_WEB, 'N')) as USUARIO_WEB  from USUARIOS where upper(NOME_USUARIO) = '"+ usuario.toUpperCase() + "'";
        const user = await client.execQuery(query);

        if (user.length == 0) {
           return res.status(400).send({ error: 'Usuário não encontrado'});
        } else {
            if (user[0].USUARIO_WEB != "S") {
                return res.status(400).send({ error: 'Usuário sem direito de acessar app'});
            } else {
                if (user[0].SENHA.toUpperCase() != senha.toUpperCase()) {
                    return res.status(400).send({ error: 'Senha inválida'});
                } else {                   
                    const accessToken = generateToken({ id: user[0].ID_USUARIO, nome: user[0].NOME_USUARIO  });
                     
                    const userReturn = {
                                        id : user[0].ID_USUARIO,
                                        nome: user[0].NOME_USUARIO
                                        }

                    return res.send({ user : userReturn, 
                                      accessToken,
                                    });
                }   
            }

        }*/
      

        const accessToken = generateToken({ id: 1, nome: "Gustavo"  });
                   
        return res.send({ user : { firstName:"Gustavo",
                                   lastName: "Souza"}, 
                          accessToken,
                        });

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed', errorDescription: err});
    }
});

module.exports = app => app.use('/auth', router);