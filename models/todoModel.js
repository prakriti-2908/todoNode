const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todo = new Schema({
    task:{
        type:String,
        required : true,
        unique : true,
    },
    username : {
        type : String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    userID:{
        type:String,
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Todo',todo);