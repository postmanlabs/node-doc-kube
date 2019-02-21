// import db model table and connection
const model = require('../db/model');
const client = model.client;

const redirect = (userpath) => {

    const text = `SELECT originalurl FROM urls WHERE catpath = '${userpath}' LIMIT 1;` 

    client.query(text)
        .then((res) => {

            if (res.originalurl) {
                const original = res.originalurl;
                const destination = '';
                if (original.slice(0,7) == "http://" || original.slice(0,8) == "https://") { 
                    destination = original
                } else {
                    destination =  "//" + original
                }
                return res.redirect(destination);
            } else {
                return "No URL found."
            }
        })
        .catch((err) => {
            console.log(err);
            return res.redirect(errorUrl);
        });

}

module.exports = {
    redirect
}
