const express = require('express');
const admin_route = express();

const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));


const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

//view
admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

//import middleware for admin authentication
const auth = require('../middleware/adminAuth');

const adminController = require('../controllers/adminController');
//routes
admin_route.get('/',auth.isLogout,adminController.loadLogin);

//post form data
admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser);

//get req with '*' always at the end
admin_route.get('*',function(req,res){
    res.redirect('/admin');
});


module.exports = admin_route;

