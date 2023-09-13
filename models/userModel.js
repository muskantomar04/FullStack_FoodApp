
const mongoose = require('mongoose');

const emailValidator = require('email-validator');

const bcrypt = require('bcrypt');

// Connect MongoDB to Node.js Using Mongoose
const db_link = 'mongodb+srv://admin:yy0dKqhOFkaPl6jj@cluster0.4lfu5zh.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

//Creating schema for user signup
const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 8
    },
    confirmPassword:{
        type: String,
        required: true,
        minLength: 8, 
        validate: function(){
            return this.confirmPassword==this.password;
        }
    }
});

//Mongoose Hooks
//before save events occurs in db
userSchema.pre('save', function(){
    // console.log('before saving in db', this);

    //to prevent confirmPassword from saving in db 
    // bcause we already are validating the password with confirmPassword and saving password, so no need to save confimPassword 
    this.confirmPassword=undefined;
});

userSchema.pre('save', async function(){
    let salt = await bcrypt.genSalt();
    let hashedString = await bcrypt.hash(this.password,salt);
    //console.log(hashedString);
    this.password = hashedString;
});

//after save events occurs in db
userSchema.post('save', function(doc){
    console.log('after saving in db', doc);
});


//model
const userModel = mongoose.model('userModel', userSchema);

// since userModel is being used in app.js, so we export userModel
module.exports = userModel;












// (async function createUser(){
//     let user={
//         name: 'Chetan',
//         email: 'def@gmail.com',
//         password: '12345678',
//         confirmPassword: '12345678'
//     };

//     //CREATE operation (creating entry in db)
//     let data = await userModel.create(user);
//     console.log(data);
// })();