require('dotenv').config();

const secureCookieVal = false;

module.exports = {
    dbUrl: process.env.MONGO_DB_DEV,
    secret: process.env.SECRET_DEV,
    port: process.env.PORT || 5000,
    secureCookie: secureCookieVal
}