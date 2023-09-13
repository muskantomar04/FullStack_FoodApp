//boiler plate code starts
const express = require('express');
const app = express();
app.use(express.json());   //middleware fn => used in post req, data from frontend gets converted from json to js object, then send to backend 
app.listen(3000);
//boiler plate code ends


//Importing resources from external file
const authRouter = require('./Routers/authRouter');
const userRouter = require('./Routers/userRouter');


//for base route= '/user', use to router= 'userRouter'
app.use('/user', userRouter);
//for base route= '/auth/signup', use to router= 'authRouter'
app.use('/auth', authRouter);  