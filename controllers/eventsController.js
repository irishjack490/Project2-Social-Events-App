///Import Dependencies///
const express = require('express');
const axios = require('axios');
///Create Router/////
const router = express.Router();
const allEventsUrl = process.env.EVENT_API_URL;


/////Routes+Controllers/////
// GET -> /events/all
// gives us all events in the api for an index
router.get('/all', (req, res) => {
    const { username, loggedIn, userId } = req.session
    //make our api call
    axios(allEventsUrl)
        // if we get data, render an index page
        .then(apiRes => {
            console.log('this came back from the api: \n', apiRes.data.events)
            // apiRes.data is an array of events objects 
        //res.send(apiRes.data)
        
        res.render('events/index', { events: apiRes.data.events, username, userId, loggedIn})

        })
        // if something goes wrong, display an error page
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})


//GET events/:name 


module.exports = router; 