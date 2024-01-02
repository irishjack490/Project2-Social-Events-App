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