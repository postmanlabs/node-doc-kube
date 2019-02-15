const fs = require ('fs');
const model = require('../db/model');
const client = model.client;

// https://stackoverflow.com/a/3975573/6815074
const validateURL = (textval) => {

    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);

}

const encode = (originalurl) => {

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

    if (catpath) {

        const text = `INSERT INTO urls (originalurl, catpath) VALUES ('${originalurl}', '${catpath}') RETURNING catpath, id;`

        client.query(text)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        return catpath;

    } 
}

module.exports = {
    validateURL,
    encode
}
