const firebird = require('node-firebird');
const {databases} = require('./clientesSSTMAX');

const {
        FIREBIRD_DATABASE,
        FIREBIRD_USER,
        FIREBIRD_PASSWORD,
        FIREBIRD_HOST
} = process.env;
    
const defaultOptions = {
        database: FIREBIRD_DATABASE,
        user: FIREBIRD_USER,
        password: FIREBIRD_PASSWORD,
        pageSize : 4096,
        host: FIREBIRD_HOST,
};


const options = (user) => {    
  if(user == undefined) {
    return defaultOptions
  } else {
    const database = databases.find(e => e.codigo == user.substring(0,4))

    if (database != undefined)       
      return database.options
    else    
      return defaultOptions
  }
}


const execQuery = (query, user) => {
  
  if (user == undefined) {
    return {error : "Usuário indefinido - CONTATE SUPORTE TÉCNICO"}
  }

  const pool = firebird.pool(5, options(user));

  return new Promise((resolver, rejeitar) => {
    pool.get((err, db) => {
      if (err) {    
        rejeitar(err);
        return;
      }

      db.query(query, (erro, resultado) => {
        if (erro) {          
          rejeitar(erro);
          return;
        }

        db.detach();
        resolver(resultado);
      });
    });
  });
}

const execUpdateInsert = (query, user) => {  
   
  if (user == undefined) {
    return {error : "Usuário indefinido - CONTATE SUPORTE TÉCNICO"}
  }

  return new Promise((resolver, rejeitar) => {
    
    firebird.attach(options(user), function(err, db) {
      if (err)
          throw err;
  
      // db = DATABASE
      db.transaction(firebird.ISOLATION_READ_COMMITED, function(err, transaction) {
          transaction.query(query, [], function(err, result) {
  
              if (err) {
                  transaction.rollback();
                  rejeitar(err);
                  return;
              }
  
              transaction.commit(function(err) {
                  if (err)
                      transaction.rollback();
                  else {
                      db.detach();
                      resolver(result);
                  }
              });
          });
      });
   });

  });
}
      
module.exports = {
                    execQuery,
                    execUpdateInsert
                 };
