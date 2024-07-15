//index.js
const mongoose = require('mongoose');
//connect mongodb server and also give the name of the database
mongoose.connect('mongodb://127.0.0.1:27017/user_management_system')

const express = require('express');
const app = express();


//mount the userRoutes
const user_route = require('./routes/userRoute');
app.use('/',user_route);
//mount the adminRoutes
const admin_route = require('./routes/adminRoute');
app.use('/admin',admin_route);

app.listen(3000,()=>{
    console.log("server listening on 3000");
})