///Schema and dependencies////
const mongoose = require('../utils/connection');

///destructuring the Schema and model from mongoose
const {Schema, model} = mongoose;

///Schema definition 
const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true, 
    }
    //heart feature 
    //likedEvents: [{ type: Number, unique: true }],
})
///User Model////
const User = model('User', userSchema);


////Export user model/////
module.exports = User; 