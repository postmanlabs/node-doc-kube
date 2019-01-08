const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

// import db model table and connection
const createTables = require('./src/db/model');
createTables.createTables();

const app = express();

// allow CORS access
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Content-Type", "application/json");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

// POST request to ADD a new url to db
app.post('/add', function(req, res) { 

    var data = {
        url: req.body.url.toLowerCase()
    };

    const baseUrl = 'http://localhost:5432/';

    request.post({
        url: baseUrl,
        // body: JSON.stringify(data),
        // send sqlized query to url table
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else {
            res.status(400).send(body);
        }
    });
});
  
app.listen(process.env.PORT || 5500);
console.log('app running on port ', process.env.PORT || 5500);
