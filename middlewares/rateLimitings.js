const accessModel = require("../models/accessModel");


const ratelimit = async (req,res,next) => {

    const sid = req.session.id;
    try{
        const accessDb = await accessModel.findOne({sessionId:sid});

        if(!accessDb){
            const accessObj = new accessModel({sessionId:sid,time:Date.now()});
            await accessObj.save();
            next();
            return;
        }

        const diff = (Date.now()-accessDb.time)/(1000*60);
        console.log(diff);
        if(diff<0.1){
            return res.status(400).send({
                status: 400,
                message: "Too many request, please wait a little",
            });
        }

        await accessModel.findOneAndUpdate({sessionId:sid},{time:Date.now()});
        next();
    }catch(err){
        throw err;
    }

}

module.exports = ratelimit;