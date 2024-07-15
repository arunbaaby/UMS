//auth.js
//to remember is user logged in or not
const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) { }
        else {
            res.redirect('/');
            console.log('islogin');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}
const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/home');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}
//export 
module.exports = {
    isLogin,
    isLogout
}