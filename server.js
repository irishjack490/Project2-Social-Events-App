
////////////////////////
////Import Dependencies////
///////////////////////
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = ('morgan');
const path = require('path');
const createError = require ('http-errors');
const middleware = require('./utils/middleware');
const MongoStore = require('connect-mongo');

////////////////////////
////Import Routers/////
///////////////////////
const UserRouter = require('./controllers/userController');
//const eventsRouter = require('./controllers/eventsRouter');

///////////////////////////////////////////////
//Create Express app + set up view enginge////
//////////////////////////////////////////////
const app = express();

//view engine - ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



/////////////////////////
///////Middleware///////
///////////////////////
middleware(app);

///////////////////////
///////routers////////
/////////////////////


app.get('/', (req, res) => {
    const  {username, loggedIn, userId} = req.session
    res.render('home.ejs', {username, loggedIn, userId})
    
    //res.send('<h1>Hello World</h1>')
});

app.use('/users', UserRouter);
//app.use('/events', eventsRouter);


app.get('/error', (req, res) => {
    const error = req.query.error || 'Something went wrong...try again'

    const { username, loggedIn, userId } = req.session //saving loggin stuff on the session, mongo store is allwing this

    // res.send(error)
    res.render('error.ejs', { error, userId, username, loggedIn }) //send data as part of an object to our view 
})

app.listen(3000, function () {
    console.log('Listening on port 3000')
})