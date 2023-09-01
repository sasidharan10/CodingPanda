require('dotenv').config();

const secureCookieVal = true;

module.exports = {
    dbUrl: process.env.MONGO_DB_PROD,
    secret: process.env.SECRET_PROD,
    port: process.env.PORT || 5000,
    secureCookie: secureCookieVal
}