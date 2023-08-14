class Errorhandler extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports.Errorhandler = Errorhandler;

module.exports.asyncError = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((err)=>{
            return next(err);
        });
    }
}