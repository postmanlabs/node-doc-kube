const { Client } = require('pg');

const client = new Client({
  user: process.env.PGUSER || null,
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGNAME || 'caturl',
  password: process.env.PGPASSWORD || null,
  port: process.env.PGPORT || 5432
})

const clientConnect = () => {
    
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack);
        } else {
            console.log('connected to the db');
        }
    });
    
};

const query = (text, values, cb) => {
    client.connect(function(err, client, done) {
      client.query(text, values, function(err, result) {
        done();
        cb(err, result);
      })
    });
}

const createTables = () => {

    const queryText =
        `CREATE TABLE IF NOT EXISTS
        urls (
            id SERIAL PRIMARY KEY,
            originalurl VARCHAR(128) NOT NULL,
            catpath VARCHAR(128) NOT NULL
        )`;
  
    client.query(queryText)
        .then((res) => {
            console.log(res);
            // client.end();
        })
        .catch((err) => {
            console.log(err);
            // client.end();
        });
        
};

module.exports = {
    createTables,
    client,
    clientConnect,
    query
};
