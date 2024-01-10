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

//POST  -> events/add
router.post('/add', async (req, res) => {
  const { username, loggedIn, userId } = req.session
  //gets info from index all events
  const theEvent = req.body 
  theEvent.owner = userId
  theEvent.interested = !!theEvent.interested
 // console.log('This must be the event: \n', theEvent)

  //res.send(theEvent)
  Event.create(theEvent)
    .then(newEvent => {
      //res.send(newEvent)
      res.redirect(`/events/mine`)
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
router.get('/delete/:id', (req, res) => {
  const { username, loggedIn, userId } = req.session
  const eventId = req.params.id

  Event.findbyId(eventId)

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
.then(deletedPlace => {
    // console.log('this was returned from deleteOne', deletedPlace)

    res.redirect('/events/mine')
})
// if err -> send to err page
.catch(err => {
    console.log('error')
    res.redirect(`/error?error=${err}`)
})
})

// GET -> /places/:name
// API data show page -> least specific - goes under all more specific routes
// give us a specific country's details after searching with the name


//GET -> /events/venue
//getting axios 403 error, API will not allow the use of a 2nd end point
// router.get('/:venue', (req, res) => {
//   const { username, loggedIn, userId } = req.session
//   const venueName = req.params.venue
  
  // make our api call
//   axios(`${allVenuesUrl}${venueName}`)
//       // render the results on a 'show' page: aka 'detail' page
//       .then(apiRes => {
//           const foundVenue = apiRes.data[0]
//           // res.send(foundEvent)
//           res.render('events/show', { venue: foundVenue, username, loggedIn, userId })
//       })
//       // if we get an error, display the error
//       .catch(err => {
//           console.log('error')
//           res.redirect(`/error?error=${err}`)
//       })
// })

//Code for heart: liked events
// router.post('/like-event/:eventId', async (req, res) => {
//     const eventId = req.params.eventId;
//     const userId = req.session.userId; // Assuming user is already authenticated
  
//     try {
//       const user = await User.findById(userId);
  
//       // Check if the event is not already liked to avoid duplicates
//       if (!user.likedEvents.includes(eventId)) {
//         user.likedEvents.push(eventId);
//         await user.save();
//         res.json({ success: true, message: 'Event liked successfully' });
//       } else {
//         res.json({ success: false, message: 'Event already liked' });
//       }
//     } catch (error) {
//       console.error('Error liking event:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   });

  // router.get('/favorites', async (req, res) => {
  //   const { username, loggedIn, userId } = req.session
  //   try {
  //     const userId = req.session.userId;
  //     const user = await User.findById(userId).populate('likedEvents'); // Populate the likedEvents array with actual event documents
      
  //     const likedEvents = user.likedEvents;
  
  //     res.render('events/favorites', { likedEvents, username, userId, loggedIn });
  //   } catch (error) {
  //     console.error('Error fetching liked events:', error);
  //     res.status(500).json({ success: false, message: 'Internal Server Error' });
  //   }
  // });

  //Delete event from favorites when clicking on the button

  // router.post('/toggle-like-event/:eventId', async (req, res) => {
  //   const { username, loggedIn, userId } = req.session
  //   const eventId = req.params.eventId;
    
  
  //   try {
  //     const user = await User.findById(userId);
  
  //     // Check if the event is liked
  //     const eventIndex = user.likedEvents.indexOf(eventId);
  //     if (eventIndex !== -1) {
  //       // If liked, remove it
  //       user.likedEvents.splice(eventIndex, 1);
  //       await user.save();
  //       res.json({ success: true, message: 'Event removed from favorites' });
  //     } else {
  //       // If not liked, add it
  //       user.likedEvents.push(eventId);
  //       await user.save();
  //       res.json({ success: true, message: 'Event added to favorites' });
  //     }
  //   } catch (error) {
  //     console.error('Error toggling event like:', error);
  //     res.status(500).json({ success: false, message: 'Internal Server Error' });
  //   }
  // });


  
 
  module.exports = router;
 
