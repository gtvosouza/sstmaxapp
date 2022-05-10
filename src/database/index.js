const firebird = require('node-firebird');

const {
        FIREBIRD_DATABASE,
        FIREBIRD_USER,
        FIREBIRD_PASSWORD,
        FIREBIRD_HOST
} = process.env;
    
const options = {
        database: FIREBIRD_DATABASE,
        user: FIREBIRD_USER,
        password: FIREBIRD_PASSWORD,
        pageSize : 4096,
        host: FIREBIRD_HOST,
};

const pool = firebird.pool(5, options);

const execQuery = (query) => {
  return new Promise((resolver, rejeitar) => {
    pool.get((err, db) => {
      if (err) {
        console.log(err)
        rejeitar(err);
        return;
      }

      db.query(query, (erro, resultado) => {
        if (erro) {
          console.log(err)
          rejeitar(err);
          return;
        }

        db.detach();
        console.log(resultado)
        resolver(resultado);
      });
    });
  });
}

const execUpdateInsert = (query) => {
  return new Promise((resolver, rejeitar) => {
    
    firebird.attach(options, function(err, db) {
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

              console.log(result)
  
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
