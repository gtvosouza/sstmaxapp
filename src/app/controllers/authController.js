const express = require('express');
const client = require('../../database');
const {databases} = require('../../database/clientesSSTMAX');

const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const router = express.Router();

function generateToken(params = {}){

    console.log(params)
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

router.post('/app', async(req, res) => {   
    try{       
        const {usuario, senha} = req.body;        
       
        if(usuario.length != 8) {
            return res.status(400).send({ error: 'Usuário não encontrado'});
        } else {
            const codUser = usuario.substring(4,8);

            const query = "select ID_USUARIO, NOME_USUARIO, UPPER(SENHA) as SENHA, trim(COALESCE(USUARIO_WEB, 'N')) as USUARIO_WEB  from USUARIOS where ID_USUARIO = " + codUser;
            const user = await client.execQuery(query, usuario);
    
            if (user.length == 0) {
                return res.status(400).send({ error: 'Usuário não encontrado'});
             } else {
                if (user[0].SENHA != senha.toUpperCase()) {
                    return res.status(400).send({ error: 'Senha incorreta'});
                }else {
                    if (user[0].USUARIO_WEB != "S") {
                        return res.status(400).send({ error: 'Usuário sem direito de acessar app'});
                    } else {
                        const accessToken = generateToken({ id: user[0].ID_USUARIO, nome: user[0].NOME_USUARIO, usuario });
                     
                        const userReturn = {
                                            id : user[0].ID_USUARIO,
                                            nome: user[0].NOME_USUARIO,
                                            usuario
                                            }

                        return res.send({ user : userReturn, 
                                          accessToken,
                                        });
                    } 
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

        if(usuario.length != 12) {
            return res.status(400).send({ error: 'Usuário não encontrado'});
        } else {
            const cliente = databases.find(e => e.codigo == usuario.substring(0,4));
            

            if (cliente == undefined) {                
                return res.status(400).send({ error: 'Usuário não encontrado'});
            } else {
                
                const idEmpresa = usuario.substring(4,12);

                const query = "select ID_EMPRESA, NOME_EMPRESA, TRIM(REPLACE(LEFT(CNPJ,10),  '.', '')) as SENHA from EMPRESAS where ID_EMPRESA = " + idEmpresa;
                const emp = await client.execQuery(query, usuario);
                
                if (emp.length == 0) {
                    return res.status(400).send({ error: 'Usuário não encontrado'});
                } else {
                    if (emp[0].SENHA != senha.toUpperCase()) {
                        return res.status(400).send({ error: 'Senha incorreta'});
                    }else {
                        const accessToken = generateToken({ id: emp[0].ID_EMPRESA, nome: emp[0].NOME_EMPRESA, usuario, empresa: idEmpresa, cliente: cliente.nome  });
                        
                        const userReturn = {
                                                id : emp[0].ID_EMPRESA,
                                                nome: emp[0].NOME_EMPRESA,
                                                cliente: cliente.nome,
                                                usuario
                                                }

                        return res.send({ user : userReturn, 
                                        accessToken,
                                        });
                    
                    }
                }
            }
        }

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed', errorDescription: err});
    }
});

router.post('/validaToken', async(req, res) => {   
    try{       
        const authHeader = req.headers.authorization;
                   
        const parts = authHeader.split(' ');

        const [ scheme, token ] = parts;
        jwt.verify(token, authConfig.secret, async (err, decoded) => {
            if (err)  return res.status(401).send({ error: 'Token invalid'});
           
            const idEmpresa = decoded.usuario.substring(4,12);

            const query = "select ID_EMPRESA, NOME_EMPRESA, TRIM(REPLACE(LEFT(CNPJ,10),  '.', '')) as SENHA from EMPRESAS where ID_EMPRESA = " + idEmpresa;
            const emp = await client.execQuery(query, decoded.usuario);
           
            const userReturn = {
                                    id : emp[0].ID_EMPRESA,
                                    nome: emp[0].NOME_EMPRESA,
                                    cliente: decoded.cliente,
                                    usuario: decoded.usuario
                                    }

            return res.send({ user : userReturn, 
                              accessToken: token,
                            });

        });   

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed', errorDescription: err});
    }
});

module.exports = app => app.use('/auth', router);