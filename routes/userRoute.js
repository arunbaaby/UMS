//userRoute.js
const express = require('express');
const user_route = express();//app is for the app.js/index.js
//session
const session = require('express-session');
//require session secret from config file
const config = require('../config/config');
user_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

//view engine
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');
//to parse the data in the POST req body
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

//to show user image in home page from public folder
user_route.use(express.static('public'));

const multer = require('multer');
const path = require('path');

//auth.js
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    //pass destination and file name as object in which
    //will store the file inthi destination
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'))//concatenate the current directory with the public folder 
    },
    //include the file name also to give
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
//tell multer that this is the storage
const upload = multer({ storage: storage });

//use controller
const userController = require('../controllers/userController');
//route...USE THE FUNCTION DEFINED IN THE CONTROLER
user_route.get('/register', auth.isLogout, userController.loadRegister);
//post request 
user_route.post('/register', upload.single('image'), userController.insertUser);

//login route
user_route.get('/', auth.isLogout, userController.loginLoad);
user_route.get('/login', auth.isLogout, userController.loginLoad);

user_route.post('/login', userController.verifyLogin);

user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/logout', auth.isLogin, userController.userLogout);

user_route.get('/edit',auth.isLogin,userController.editLoad);

user_route.post('/edit',upload.single('image'),userController.updateProfile);

//to mount the route in the index.js export the express object
module.exports = user_route;