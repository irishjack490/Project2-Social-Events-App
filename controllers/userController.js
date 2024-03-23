///Import Dependencies///
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

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

router.post('/login', async (req, res) => {
    // const { username, loggedIn, userId } = req.session

    // pull our credentials from the req.body
    const { username, password } = req.body

    // search the db for our user
    User.findOne({ username })
        .then(async (user) => {
            // if the user exists
            if (user) {
                // we compare password 
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    // if the pws match -> log them in and create the session
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    // once we're logged in, redirect to the home page
                    res.redirect('/')
                } else {
                    res.redirect(`/error?error=something%20wrong%20with%20credentials`)
                }

            } else {
                res.redirect(`/error`)
            }
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})


//GET -> Logout
router.get('/logout', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/logout', { username, loggedIn, userId})
});
//DELETE -> Logout

router.delete('/logout', (req, res) => {
    req.session.destroy(() =>
    res.redirect('/'))
})

//gET route for favorites
router.get('/favorites/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId).populate('savedEvents');
  
      if (user) {
        res.render('favorites', { user });
      } else {
        res.status(404).send('User not found.');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Internal Server Error');
    }
  });

////Export Router///////
module.exports = router