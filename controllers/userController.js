///Import Dependencies///
const express = require('express');
const User = require('../models/user');
const bcrypt =require('bcryptjs');

///Create Router/////
const router = express.Router();

/////Routes+Controllers/////
//GET -> SignUp
router.get('/signup', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/signup', { username, loggedIn, userId})
});
//POST -> SignUp 
//make this function async because of bcrypt
router.post('/signup', async (req, res) => {
    const { username, loggedIn, userId } = req.session
    console.log('The session: \n', req.session )
    const newUser = req.body
    console.log('the user: \n', newUser)
   
    //encrypt with bcrypt, genSalt gives password 10 rounds of encrypting and it will be saved to our Database

    
    newUser.password = await bcrypt.hash(
        newUser.password, 
        await bcrypt.genSalt(10)
    )
    console.log('the user after bcrypt', newUser)

    //create our user
    User.create(newUser)
        .then(user => {
            // the new user will be created and redirected to the login page
            res.redirect('/users/login')
        })
        .catch(err => {
            console.log('error')

            // res.send('something went wrong')
            // using our new error page
            res.redirect(`/error?error=${err}`)
        })
    });




//GET -> login -> /users/login
router.get('/login', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/login', { username, loggedIn, userId})
});
//POST -> Login

//GET -> Logout
router.get('/logout', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/logout', { username, loggedIn, userId})
});
//DELETE -> Logout

////Export Router///////
module.exports = router