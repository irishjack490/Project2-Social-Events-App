///Import Dependencies///
const express = require('express');
const User = require('../models/user');
const bcrypt =('bcryptjs');

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

    const newUser = req.body

    //encrypt with bcrypt, gentSalt gives password 10 rounds of encrypting 
    newUser.password = await bcrypt.hash(
        newUser.password, 
        await bcrypt.genSalt(10)
    )
    
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
    })




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