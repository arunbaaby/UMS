const User = require('../models/userModel');
//to decrypt the password
const bcrypt = require('bcrypt');

//load login page
const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

//verify admin login
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {

                if(userData.is_admin === 0){
                    res.render('login',{message:'Invalid email and password'});
                }else{
                    req.session.user_id = userData._id;
                    res.redirect('/admin/home');
                }

            } else {
                res.render('login', { message: 'Invalid email and password' });
            }
        } else {
            res.render('login', { message: 'Invalid email and password' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

//load admin home Dashboard
const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{admin:userData});
    } catch (error) {
        console.log(error.message);
    }
}

//logout
const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

//admin dashboard
const adminDashboard = async(req,res)=>{
    try {
        const userData = await User.find({is_admin:0});
        res.render('dashboard',{users:userData});
    } catch (error) {
        console.log(error.message);
    }
}

//edit user
const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit-user',{user:userData});
        }else{
            res.redirect('/admin/dashboard');
        }

    } catch (error) {
        console.log(error.message);
    }
}

//update user data
const updateUsers = async(req,res)=>{
    try {
        const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

//delete user
const deleteUser = async(req,res)=>{
    try {
        const id = req.query.id;//passed by query parameters
        await User.deleteOne({_id:id});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    editUserLoad,
    updateUsers,
    deleteUser
}