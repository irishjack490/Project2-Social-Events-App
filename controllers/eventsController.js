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
      //console.log('Event created:', newEvent);
     res.redirect('/events/mine')
    })
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })

})
//GET -> mine displays saved events
router.get('/mine', (req, res) => {
//query database 
//display in list format 
const { username, loggedIn, userId } = req.session
//query db 
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

router.get('/mine/:id', (req, res) => {
  const { username, loggedIn, userId } = req.session
  //find specific event using the id
  Event.findById(req.params.id)
  //display user-specific page
    .then(theEvent => {
      //res.send(theEvent)
      res.render('events/mineDetail', { events : theEvent, username, loggedIn, userId})
    })
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
    })
})
//UPDATE events/update/:id
router.put('/update/:id', (req, res) =>{
  const { username, loggedIn, userId } = req.session
//target specific event
  const eventId = req.params.id
  const theUpdatedEvent = req.body
//remove ownership from req.body
  delete theUpdatedEvent.owner
  theUpdatedEvent.owner = userId

  theUpdatedEvent.interested = !!theUpdatedEvent.interested
  theUpdatedEvent.attending = !!theUpdatedEvent.attending

  console.log('This is request.body', theUpdatedEvent)
//check ownership
  Event.findById(eventId)
    .then(foundEvent => {
      // console.log('the event we found', foundEvent)
      // res.send(req.body)
       // determine if loggedIn user is authorized to delete this(aka, the owner)
       if (foundEvent.owner == userId) {
          return foundEvent.updateOne(theUpdatedEvent)
    } else {
        // if the loggedIn user is NOT the owner
        res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Update%20this%20Event`)
    }
    })
    .then(returnedEvent => {
      res.redirect(`/events/mine/${eventId}`)
    })
//allow update and refresh page
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })

//if not send error


})

//DELETE -> /events/delete/:id
//Remove events from user's list 
router.delete('/delete/:id', (req, res) => {
  const { username, loggedIn, userId } = req.session
  // target the specific event
  const eventId = req.params.id
  // find it in the database
  Event.findById(eventId)
      // delete it 
      .then(event => {
        console.log('Found event:', event);
          // determine if loggedIn user is authorized to delete this(aka, the owner)
          if (event.owner == userId) {
              // here is where we delete
              return event.deleteOne()
          } else {
              // if the loggedIn user is NOT the owner
              res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Event`)
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
 
