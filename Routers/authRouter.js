const express = require('express');
const app = express();
const userModel = require('../models/userModel');
const cookieParser = require('cookie-parser');

//we use cookie-parser using a middle ware fn
app.use(cookieParser());

//for the route /auth/user , use the mini app authRouter
const authRouter = express.Router();

authRouter
.route('/signup')
.get(getSignUp)
.post(postSignUp)

authRouter
.route('/login')
.post(loginUser)

function getSignUp(req, res){
    // res.sendFile('D:/User Data/OneDrive/Documents/Node.js Pepcoding/FoodApp/public/index.html');
    res.sendFile('../public/index.html', {root: __dirname});
}

async function postSignUp(req, res){
    let dataObj = req.body;
    let user = await userModel.create(dataObj);

    console.log('backend - ', user);
    // console.log(res.data);

    res.json(
        {
            message: 'User signed up',
            data: user
        }
    );
};

async function loginUser(req, res){
    try{        
        let data = req.body;

        //to check that email and password are not empty
        if(data.email && data.password)
        {
            let user = await userModel.findOne({email: data.email});
            if(user)
            {
                //bcrypt -->compare()
                if(user.password == data.password)
                {
                    res.cookie('isLoggedIn', true);
                    res.json(
                        {
                            message: 'User has loggd in',
                            userDetails: data
                        }
                    )
                }
                else
                {
                    res.json(
                        {
                            message: 'Wrong credentials'
                        }
                    )
                }
            }
            else
            {
                res.json(
                    {
                        message: 'User not found'
                    }
                );
            } 
        }
        else
        {
            res.json(
                {
                    message: 'Enter both your email and password'
                }
            );
        }     
    }
    catch(err){
        res.status(500).json(
            {
                message: 'Internal Server Error: ' + err.message
            }
        );
    }
};

module.exports = authRouter;