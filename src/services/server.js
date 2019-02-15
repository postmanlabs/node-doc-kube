const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const { validateURL, encode } = require('./urlize.js');
const { redirect } = require('./redirect.js');

const app = express();

// import db model table and connection
const model = require('../db/model');
// model.clientConnect();
model.createTables();

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

// POST request to add a new url to db
app.post('/encode', function(req, res) { 

    const original_url = req.body.originalUrl.toLowerCase();

    if (!validateURL(original_url)) {
        res.json("Try again");
    } else {
        let catpath = encode(original_url);
        res.json(catpath);
    }

});

// For a user who enters encoded cat url in a browser, redirect to the original url.
app.get('/:catpath', function(req, res) { 

    console.log(req);
    redirect(req.params.catpath);

});
  
app.listen(process.env.PORT || 5500);
console.log('app running on port ', process.env.PORT || 5500);
