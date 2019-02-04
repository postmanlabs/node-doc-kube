const { Client } = require('pg');

const client = new Client({
    // user: 'dbuser',
    host: 'localhost',
    database: 'caturl',
    // password: 'secretpassword',
    port: 5432
});

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

    // const secondQuery = 
    //     `INSERT INTO urls (
    //         originalurl, 
    //         catpath
    //         ) 
    //     VALUES (
    //         'https://www.cnn.com', 
    //         'tuxedo.jump-pounce-,,,^..^,,,.lick'
    //     );`;

    // client.query(secondQuery)
    //     .then((res) => {
    //         console.log(res);
    //         client.end();
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         client.end();
    //     });
        
};

module.exports = {
    createTables,
    client,
    clientConnect
};
