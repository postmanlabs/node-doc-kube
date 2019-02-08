const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER || null,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'caturl',
  password: process.env.DB_PASSWORD || null,
  port: process.env.DB_PORT || 5432
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
    clientConnect
};
