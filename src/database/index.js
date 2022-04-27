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

const executar = (query) => {
  return new Promise((resolver, rejeitar) => {
    pool.get((err, db) => {
      if (err) {
        rejeitar(err);
        return;
      }

      db.query(query, (erro, resultado) => {
        if (erro) {
          console.log('aaaaaaaaaa')
          rejeitar(err);
          return;
        }

        db.detach();
        resolver(resultado);
      });
    });
  });
}
      

module.exports = executar;
