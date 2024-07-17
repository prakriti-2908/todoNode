const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type : String,
        required: true,
    },
    country:{
        type: String,
    },
    isEmailVerified:{
        type:Boolean,
        default: false,
    }
});

module.exports = mongoose.model("User",user);