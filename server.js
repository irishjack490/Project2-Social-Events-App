
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
const userRouter = ('./controllers/userController');
const eventsRouter = ('./controllers/eventsRouter');

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

app.get('/error', (req, res) => {
    const error = req.query.error || 'Ope! Something went wrong...try again'

    const { username, loggedIn, userId } = req.session

    // res.send(error)
    res.render('error.ejs', { error, userId, username, loggedIn })
})

app.listen(3000, function (){
    console.log('Listening on port 3000')
})