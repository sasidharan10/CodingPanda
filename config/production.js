require('dotenv').config();

let tempSC = true;
if (process.env.SECURE_COOKIE_DEV === 'true')
    tempSC = true;
else
    tempSC = false;

module.exports = {
    dbUrl : process.env.MONGO_DB_PROD,
    secret: process.env.SECRET_PROD,
    port: process.env.PORT || 5000,
    secureCookie: tempSC
}