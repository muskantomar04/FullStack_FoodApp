const express = require('express');
const app = express();
const userModel = require('../models/userModel');
const cookieParser = require('cookie-parser');


//for the route /user , use the mini app userRouter
const userRouter = express.Router();

//we use cookie-parser using a middle ware fn
app.use(cookieParser());

userRouter
.route('/')    //for default route '/user'
.get(protectRoute, getUser)
.post(postUser)
.patch(updateUser)
.delete(deleteUser)

userRouter
.route('/setCookies')
.get(setCookies)

userRouter
.route('/getCookies')
.get(getCookies)

userRouter
.route('/:id')    //for route '/user:id'
.get(getUserById)



// let flag=true;   //TRUE->user is not logged in, FALSE->user is logged in  //STATIC WAY
// using cookie variable  //DYNAMIC WAY
async function protectRoute(req, res, next){
    if(req.cookies.isLoggedIn === true)
    {
        next();
    }
    else
    {
        res.json(
            {
                message: 'Please login/ operation not allowed'
            }
        );
    }
}

async function getUser(req, res){

    //READ operation (reading entries from db)
    let specificUser = await userModel.findOne({name: 'Abhishek'});
    let allUsers = await userModel.find();
    res.json(
        {
            message: 'list of all users',
            data: allUsers   
        }
    );
}

function postUser(req, res){
    console.log(req.body);
    users = req.body;
    res.json(
        {
            message: "data received succesfully",
            user: req.body
        }
    );
}

async function updateUser(req, res){

    //UPDATE OPERATION (updating entries in db)
    console.log("req.body ->", req.body);

    let dataToBeUpdated = req.body;
    let user = await userModel.findOneAndUpdate({email: 'abc@gmail.com'}, dataToBeUpdated)

    res.json(
        {
            message : "data updated succesfully",
            user: req.body
        }
    )
}

async function deleteUser(req, res){
    let dataToBeDeleted = req.body;
    let user = await userModel.findOneAndDelete(dataToBeDeleted);
    res.json(
        {
            message : "data deleted succesfully",
            data: user
        }
    );
}

async function setCookies(req, res){
    // res.setHeader('Set-Cookie', 'isLoggedIn=true');

    res.cookie('isLoggedIn', true);
    res.send('Cookies have been set');
}

async function getCookies(req, res){
    let cookies = req.cookies;
    console.log(cookies);
    res.send('Cookies received');
}


//this fn uses user array, not mongodb
function getUserById(req, res){
    console.log(req.params.id);
    
    let paramId = req.params.id;
    let obj = {};
    for(let i=0; i<users.length; i++)
    {
        if(users[i]['id'] == paramId)
        {
            obj = users[i];
        }
    }
    res.json(
        {
            message: "request received",
            data: obj
        }
    )
}

module.exports = userRouter;