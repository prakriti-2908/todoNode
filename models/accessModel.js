const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const access = new Schema({

    sessionId: {
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('Access',access);