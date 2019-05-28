let ErrorHandler = {
    get404Error: (req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    },
    getDevelopError:(err, req,res,next)=>{
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
    },
    getProductionError:(err, req,res,next)=>{
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
    }
}

module.exports = ErrorHandler;