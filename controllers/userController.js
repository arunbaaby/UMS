//userController.js
const session = require('express-session');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

//first we have to show the register page..async method
const loadRegister = async(req,res)=>{
    try {
        res.render('registration');// Ensure 'registration.ejs' exists in the views folder
    } catch (error) {
        console.log(error.message);
    }
}
//to post data
const insertUser = async(req,res)=>{
    try {
        //call the secured password method
        const spassword = await securePassword(req.body.password);
        //user object
        //will recieve the data etered by the user here
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0,
        });
        //will  return promise
        //save the data in a variable  
        const userData = await user.save();

        if(userData){
            res.render('registration',{message:'Your registration is successful'});
        }else{
            res.render('registration',{message:'Your registration failed'});
        }
    } catch (error) {
        console.log(error.message);
    }
}

//method for user login
const loginLoad = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

//user verification after Login
const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                console.log('1');
                req.session.user_id = userData._id;
                res.redirect('/home');
            }else{
                console.log('2')
                res.render('login',{message:"Invalid email and password"});
            }
        }else{
            console.log('3')
            res.render('login',{message:"Invalid email and password"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

//load home page
const loadHome = async(req,res)=>{
    try {
        //TO SHOW USER DATA ON /home
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{user:userData});
    } catch (error) {
        console.log(error.message);
    }
}

//to logout
const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

//edit user profile
const editLoad = async(req,res)=>{
    try {
        const id = req.query.id;

        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit',{user:userData});
        }else{
            res.redirect('/home');
        }

    } catch (error) {
        console.log(error.message);
    }
}

//update user data
const updateProfile = async(req,res)=>{
    try {
        if(req.file){
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,image:req.file.filename}});
        }else{
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
        }
        res.redirect('/home');
    } catch (error) {
        console.log(error.message);
    }
}


//to load the view export the  controller function
module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}