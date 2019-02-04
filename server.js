const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const fs = require ('fs');

// import db model table and connection
const model = require('./src/db/model');
model.clientConnect();
model.createTables();
const client = model.client;

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

// https://stackoverflow.com/a/3975573/6815074
function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

function encode(originalurl) {

    const catFile = fs.readFileSync("./src/seed.txt");
    const catWords = catFile.toString().split("\n")

    let need_new_url = true;

    let catpath = ''

    while (need_new_url) {

        

        for (i=0; i<5; i++) { 
            let word = catWords[Math.floor(Math.random() * catWords.length)];  // random cat word
            let shouldUpper = Math.floor(Math.random() * 2);  // initiate randomizer for upper / lower case
            shouldUpper ? word.toLowerCase() : word.toUpperCase();  // upper or lower case
            let punctuation = Math.floor(Math.random() * 2);  // initiate randomizer for punctuation
            punctuation ? word += '.' : word += '-';  // separate by . or -
            catpath += word;
        }
 
        catpath = catpath.slice(0, -1);

        need_new_url = false;
        // if (!url in db) {
        //     need_new_url = false;
        //     return url or insert in db
        // }   
    }

    if (catpath) {
        const text = `INSERT INTO urls (originalurl, catpath) VALUES ('${originalurl}', '${catpath}');`
        console.log(text);

        client.query(text)
            .then((res) => {
                console.log(res);
                // client.end();
            })
            .catch((err) => {
                console.log(err);
                // client.end();
            });
    }
    
}

function decode(userpath) {
    // search database for userpath
    // if present, return https://<hostname>/catpath
}

// POST request to add a new url to db
app.post('/encode', function(req, res) { 

    const original_url = req.body.originalUrl.toLowerCase();

    if (!validateURL(original_url)) {
        res.json("Try again");
    } else {
        encode(original_url);
        res.json(original_url + " entered into the database");
    }

    //     const base = 'http://localhost:5432/';

    //     // add original and new urls to db
    //     request.post({
    //         url: base,
    //         // body: JSON.stringify(data),
    //         // TODO: send sqlized query to url table
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }, function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             res.send(body);
    //         }
    //         else {
    //             res.status(400).send(body);
    //         }
    //     });
    // }
});
  
app.listen(process.env.PORT || 5500);
console.log('app running on port ', process.env.PORT || 5500);
