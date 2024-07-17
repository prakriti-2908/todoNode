const isSessionID = (req,res,next) =>{
    if(req.session.isAuth){
        next();
    }else{
        return res.send({
            message: "Session is expired",
            request: "Please Login/Register first",
            status: 400,
        })
    }
}
module.exports = isSessionID;