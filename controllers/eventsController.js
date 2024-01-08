///Import Dependencies///
const express = require('express');
const axios = require('axios');
const Event = require('../models/event');
const User = require('../models/user');
///Create Router/////
const router = express.Router();
const allEventsUrl = process.env.EVENT_API_URL;

/////Routes+Controllers/////
// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    res.redirect('/login');
  };


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

router.post('/like-event/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.session.userId; // Assuming user is already authenticated
  
    try {
      const user = await User.findById(userId);
  
      // Check if the event is not already liked to avoid duplicates
      if (!user.likedEvents.includes(eventId)) {
        user.likedEvents.push(eventId);
        await user.save();
        res.json({ success: true, message: 'Event liked successfully' });
      } else {
        res.json({ success: false, message: 'Event already liked' });
      }
    } catch (error) {
      console.error('Error liking event:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  router.get('/favorites', async (req, res) => {
    const { username, loggedIn, userId } = req.session
    try {
      const userId = req.session.userId;
      const user = await User.findById(userId).populate('likedEvents'); // Populate the likedEvents array with actual event documents
      
      const likedEvents = user.likedEvents;
  
      res.render('events/favorites', { likedEvents, username, userId, loggedIn });
    } catch (error) {
      console.error('Error fetching liked events:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  module.exports = router;
 
