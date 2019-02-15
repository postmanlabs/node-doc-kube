// import db model table and connection
const model = require('../db/model');
const client = model.client;

const redirect = (userpath) => {

    let originalurl = '';

    const text = `SELECT originalurl FROM urls WHERE catpath='${userpath} LIMIT 1;` 

    client.query(text)
        .then((res) => {
            originalurl = res;
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });

    if (originalurl) {
        return originalurl
    }

}

module.exports = {
    redirect
}
