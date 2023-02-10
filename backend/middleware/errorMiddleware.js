const notFind = (req, res, next) => { 
    const error = new Error(`can't find-${req.originalURL}`)
    res.status(404);
    next(error);
}

//deal with differnt error
//default statusCode == 200
const errorHandle = (err, req, res, next) => { 
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        //stack to use trace error
        stack: process.env.NODE_ENV == 'production' ? null : err.stack 
    })
}

export { notFind, errorHandle };