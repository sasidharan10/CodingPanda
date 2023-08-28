require('dotenv').config();

module.exports = {
    dbUrl : process.env.MONGO_PROD_DB,
    secret: process.env.DEV_SECRET,
    port: process.env.PORT || 5000
}