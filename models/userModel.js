//userModel.js
const mongoose = require('mongoose');

//schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },//is user admin or not if admin value 1 else 0
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0//user is only varified for admin 1
    }
});

module.exports = mongoose.model('User',userSchema);