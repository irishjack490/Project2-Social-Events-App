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
            //console.log('this came back from the api: \n', apiRes.data[0])
            // apiRes.data is an array of events objects 
      //res.send(apiRes.data)
        
       res.render('events/index', { events: apiRes.data, username, userId, loggedIn})
        
        })
        // if something goes wrong, display an error page
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})


//POST  -> events/add
router.post('/add', (req, res) => {
    const { username, loggedIn, userId } = req.session
    //gets info from index all events
    const theEvent = req.body 
    //console.log('This must be the event:', theEvent)
    theEvent.owner = userId
    //res.send(theEvent)
    theEvent.interested = !!theEvent.interested
    theEvent.attending = !!theEvent.attending
    
    Event.create(theEvent)
    .then(newEvent => {
      //res.send(newEvent)
     res.redirect(`/events/${newEvent._id}`)
    })
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })

})
//displays saved places 
router.get('/mine', (req, res) => {
//query database 
//display in list format 
const { username, loggedIn, userId } = req.session
  Event.find({owner: userId})
  .then(userEvents => {

    //res.send(userEvents)
    res.render('events/mine', {events: userEvents, username, loggedIn, userId})
  })

  .catch(err => {
    console.log('error')
    res.redirect(`/error?error=${err}`)
})

})
//Remove event from interested list
//events/delete/:id
router.delete('/delete/:id', (req, res) => {
  const { username, loggedIn, userId } = req.session
  // target the specific event
  const eventId = req.params._id
  // find it in the database
  Event.findById(eventId)
      // delete it 
      .then(event => {
          // determine if loggedIn user is authorized to delete this(aka, the owner)
          if (event.owner == userId) {
              // here is where we delete
              return event.deleteOne()
          } else {
              // if the loggedIn user is NOT the owner
              res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Place`)
          }
      })
      // redirect to another page
      .then(deletedEvent => {
           console.log('this was returned from deleteOne', deletedEvent)

          res.redirect('/events/mine')
      })
      // if err -> send to err page
      .catch(err => {
          console.log('error')
          res.redirect(`/error?error=${err}`)
      })

})

  
 
  module.exports = router;
 
