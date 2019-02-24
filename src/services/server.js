const express = require('express');
const bodyParser = require('body-parser');
const fs = require ('fs');

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

// to maintain state of encoded URLs
const urlMap = {};

// https://stackoverflow.com/a/3975573/6815074
const validateURL = (textval) => {

    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);

}

// POST request to add a new url to db
app.post('/encode', function(req, res) { 

    const originalUrl = req.body.originalUrl.toLowerCase();

    // in postman
    // raw body, json >> form data
    // response "text" >> json object


    // check if valid URL 
    if (!validateURL(originalUrl)) {

        res.json("Try again");

    } else {
        
        // generate a new URL
        const catFile = fs.readFileSync("./src/seed.txt");
        const catWords = catFile.toString().split("\n")
    
        let need_new_url = true;
        let catpath = '';
    
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
    
        }

        // save the association between the original url and new url path
        if (catpath) {

            urlMap[catpath] = originalUrl;
            res.json({
                error: null,
                catpath: catpath
            });

        }  

    }

});

// For a user who enters encoded cat url in a browser, redirect to the original url.
app.get('/:catpath', function(req, res) { 

    if (urlMap[req.params.catpath]) {

        return res.redirect(urlMap[req.params.catpath]);

    } else {

        return "No URL found."

    }
})

  
app.listen(process.env.PORT || 5500);
console.log('app running on port ', process.env.PORT || 5500);
